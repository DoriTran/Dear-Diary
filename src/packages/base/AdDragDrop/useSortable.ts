import { motion } from 'framer-motion';
import { isEqual } from 'lodash';
import {
  createElement,
  useEffect,
  useMemo,
  useRef,
  useState,
  type Dispatch,
  type ReactElement,
  type RefObject,
  type SetStateAction,
  type ComponentType,
} from 'react';

import useMonitor from './useMonitor';

declare global {
  interface Window {
    sortable?: {
      offsetX?: number;
      offsetY?: number;
      width?: number;
      height?: number;
      group?: HTMLElement;
    } | null;
  }
}

export interface UseSortableOptions<T extends { id: string | number } = any> {
  ref: RefObject<HTMLElement | null>;
  sortInGroup?: string;
  sortableGroup?: string;
  setSortableData?: Dispatch<SetStateAction<T[]>>;
  onSortIndexChange?: (arg: {
    previous: number;
    current: number;
    item: HTMLElement | null;
    data: any;
  }) => void;
  onSortable?: (arg: { original: T[] | null; final: T[] | null }) => void;
  extraScrollOffset?: {
    scrollLeft: number;
    scrollTop: number;
  };
  children: ReactElement;
  motions?: Record<string, unknown>;
}

export interface UseSortableResult {
  motioned: ReactElement | null;
  hidden: boolean;
}

export default function useSortable<T extends { id: string | number } = any>({
  ref,
  sortInGroup,
  sortableGroup,
  setSortableData,
  onSortIndexChange,
  onSortable,
  extraScrollOffset = { scrollLeft: 0, scrollTop: 0 },
  children,
  motions = {},
}: UseSortableOptions<T>): UseSortableResult {
  const motionedTag = useMemo<ComponentType<any> | null>(() => {
    if (!sortInGroup) return null;
    // motion.create returns an untyped component
    return motion.create(children.type as any) as ComponentType<any>;
  }, [children.type, sortInGroup]);

  const [hideOriginal, setHideOriginal] = useState(false);

  useEffect(() => {
    if (!ref?.current) return;

    const hasHiddenAttribute = ref.current.hasAttribute('data-sortable-hidden');
    setHideOriginal(hasHiddenAttribute);

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (
          mutation.type === 'attributes' &&
          mutation.attributeName === 'data-sortable-hidden'
        ) {
          const hasHidden =
            ref.current?.hasAttribute('data-sortable-hidden') ?? false;
          setHideOriginal(hasHidden);
        }
      });
    });

    observer.observe(ref.current, {
      attributes: true,
      attributeFilter: ['data-sortable-hidden'],
    });

    return () => {
      observer.disconnect();
    };
  }, [ref]);

  const extraOffset = useRef({
    scrollLeft: 0,
    scrollTop: 0,
  });

  useEffect(() => {
    extraOffset.current = extraScrollOffset;
  }, [extraScrollOffset.scrollLeft, extraScrollOffset.scrollTop]);

  const isSorting = useRef(false);
  const isTransitioning = useRef(false);
  const original = useRef(false);
  const cachedRects = useRef<Array<{
    top: number;
    left: number;
    right: number;
    bottom: number;
    hidden?: boolean;
  }> | null>(null);
  const target = useRef<{
    previous: number;
    current: number;
    item: HTMLElement | null;
    data: any;
  }>({
    previous: -1,
    current: -1,
    item: null,
    data: null,
  });
  const mouse = useRef({
    pageX: 0,
    pageY: 0,
  });

  const getMousePosition = (location: {
    current: { input: { pageX: number; pageY: number } };
  }) => {
    const { pageX, pageY } = location.current.input;
    return { pageX, pageY };
  };

  const getSortableElements = () => {
    return Array.from(
      ref.current?.querySelectorAll(`[data-sortable='${sortableGroup}']`) ?? [],
    );
  };

  const getCachedRects = () => {
    const elements = getSortableElements();

    return elements.map((el) => {
      const rect = el.getBoundingClientRect();
      const container = ref.current!;

      return {
        top: rect.top + container.scrollTop,
        left: rect.left + container.scrollLeft,
        right: rect.right + container.scrollLeft,
        bottom: rect.bottom + container.scrollTop,
      };
    });
  };

  const closestIndex = () => {
    if (!window.sortable || !cachedRects.current || !ref.current) return -1;

    const { pageX, pageY } = mouse.current;
    const { offsetX = 0, offsetY = 0, width = 0, height = 0 } = window.sortable;
    const { scrollTop, scrollLeft } = ref.current;
    const originalCachedRects = cachedRects.current;

    const virtualRect = {
      left: pageX - offsetX,
      top: pageY - offsetY,
      right: pageX - offsetX + width,
      bottom: pageY - offsetY + height,
    };

    const adjustedRects = originalCachedRects.map((rect) => ({
      ...rect,
      top: rect.top - scrollTop - extraOffset.current.scrollTop,
      left: rect.left - scrollLeft - extraOffset.current.scrollLeft,
      right: rect.right - scrollLeft - extraOffset.current.scrollLeft,
      bottom: rect.bottom - scrollTop - extraOffset.current.scrollTop,
    }));

    const getCornersFromRect = (r: {
      top: number;
      left: number;
      right: number;
      bottom: number;
    }) => ({
      topLeft: { x: r.left, y: r.top },
      topRight: { x: r.right, y: r.top },
      bottomLeft: { x: r.left, y: r.bottom },
      bottomRight: { x: r.right, y: r.bottom },
    });

    const distance = (
      p1: { x: number; y: number },
      p2: { x: number; y: number },
    ) => Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);

    const dragCorners = getCornersFromRect(virtualRect);
    let closestIdx = -1;
    let minDist = Infinity;

    adjustedRects.forEach((rect, i) => {
      if (rect.hidden === true) {
        return;
      }

      const c = getCornersFromRect(rect);
      const totalDist =
        distance(dragCorners.topLeft, c.topLeft) +
        distance(dragCorners.topRight, c.topRight) +
        distance(dragCorners.bottomLeft, c.bottomLeft) +
        distance(dragCorners.bottomRight, c.bottomRight);

      if (totalDist < minDist) {
        minDist = totalDist;
        closestIdx = i;
      }
    });

    return closestIdx;
  };

  const value = useRef<{
    original: T[] | null;
    final: T[] | null;
  }>({
    original: null,
    final: null,
  });

  const setStoredValue = (newValue: T[]) => {
    const { original: originalValue } = value.current;

    value.current = {
      original: originalValue ?? newValue,
      final: newValue,
    };
  };

  const [checkFinal, setCheckFinal] = useState(false);

  useEffect(() => {
    if (!checkFinal) {
      return;
    }

    const { original: originalValue, final } = value.current;

    if (originalValue && final && !isEqual(originalValue, final)) {
      onSortable?.({ original: originalValue, final });
    }

    value.current = {
      original: null,
      final: null,
    };
  }, [checkFinal, onSortable]);

  useMonitor(
    {
      canMonitor: ({ source }) =>
        source.element.getAttribute('data-sortable') === sortableGroup,

      onDragStart: ({ source, location }) => {
        if (sortableGroup === undefined) {
          return;
        }

        const elements = getSortableElements();

        cachedRects.current = getCachedRects();

        if (!window.sortable) {
          const rect = source.element.getBoundingClientRect();
          const { pageX, pageY } = getMousePosition(location);

          window.sortable = {
            offsetX: pageX - rect.left + window.scrollX,
            offsetY: pageY - rect.top + window.scrollY,
            width: rect.width,
            height: rect.height,
          };
        }

        const itemSortableGroup = source.element.getAttribute('data-sortable');
        if (
          itemSortableGroup === sortableGroup &&
          elements.includes(source.element)
        ) {
          isSorting.current = true;
          original.current = true;
        }

        const firstTargetIndex = elements.findIndex(
          (el) => el === source.element,
        );

        target.current = {
          previous: -1,
          current: firstTargetIndex,
          item: source.element,
          data: source.data,
        };

        setSortableData?.((prev) => {
          setStoredValue(prev);
          return prev;
        });
      },

      onTargetChange: ({ data, source, location }) => {
        if (location.current.dropTargets.length === 0) return;

        const isEnterThisContainer = location.current.dropTargets.some(
          (t) => t.element === ref?.current,
        );
        if (isEnterThisContainer && isSorting.current) return;
        else isSorting.current = isEnterThisContainer;

        if (isSorting.current) {
          if (!ref.current) return;
          window.sortable = { ...(window.sortable || {}), group: ref.current };

          mouse.current = getMousePosition(location);

          if (!cachedRects.current) return;
          const closestIdx = closestIndex();

          if (closestIdx !== -1) {
            target.current = {
              previous: target.current.current,
              current: closestIdx,
              item: source.element,
              data: source.data,
            };

            onSortIndexChange?.(target.current);
            setSortableData?.((prevData: T[]) => {
              const newData: T[] = [
                ...prevData.slice(0, closestIdx),
                original.current
                  ? ({
                      ...(data as T),
                      id: `${String(source.data.id)}-clone`,
                    } as T)
                  : (data as T),
                ...prevData.slice(closestIdx),
              ];

              isTransitioning.current = true;

              setTimeout(() => {
                cachedRects.current = getCachedRects();
                isTransitioning.current = false;
              }, 500);

              setStoredValue(newData);

              return newData;
            });
          }
        }

        if (!isSorting.current) {
          if (!ref.current) return;
          const hiddenElement = ref.current.querySelector(
            '[data-sortable-hidden]',
          );

          if (original.current && !hiddenElement) {
            source.element.setAttribute('data-sortable-hidden', '');

            const elements = Array.from(
              ref.current.querySelectorAll(
                `[data-sortable='${sortableGroup}']`,
              ),
            );
            const currentIndex = elements.findIndex(
              (el) => el === source.element,
            );

            if (currentIndex !== -1 && cachedRects.current) {
              cachedRects.current[currentIndex].hidden = true;
            }
          } else {
            setSortableData?.((prevData: T[]) => {
              const currentIndex = prevData.findIndex((item) =>
                original.current
                  ? item.id === `${String(source.data.id)}-clone`
                  : item.id === source.data.id,
              );

              const newData: T[] = [...prevData];

              if (currentIndex !== -1) {
                newData.splice(currentIndex, 1);
              }

              setStoredValue(newData);

              return newData;
            });
          }
        }
      },

      onDrop: ({ source, location }) => {
        window.sortable = null;

        if (sortableGroup === undefined) return;

        const isDroppedIntoThisContainer = location.current.dropTargets.some(
          (t) => t.element === ref.current,
        );

        const elements =
          original.current && ref.current
            ? Array.from(
                ref.current.querySelectorAll<HTMLElement>(
                  `[data-sortable='${sortableGroup}']`,
                ),
              )
            : [];

        const removeIndex =
          original.current && elements.length
            ? elements.findIndex((el) =>
                el.hasAttribute('data-sortable-hidden'),
              )
            : -1;

        setSortableData?.((prevData: T[]) => {
          let nextData: T[] = [...prevData];

          if (isDroppedIntoThisContainer) {
            if (nextData.length === 0) {
              nextData = [source.data as T];
            } else if (
              nextData.length === 1 &&
              source.element.hasAttribute('data-sortable-hidden')
            ) {
              source.element.removeAttribute('data-sortable-hidden');
              nextData = [source.data as T];
            }
          }

          if (removeIndex !== -1) {
            nextData.splice(removeIndex, 1);
          }

          const cloneIndex = nextData.findIndex((item) =>
            String(item.id).includes('-clone'),
          );

          if (cloneIndex !== -1) {
            nextData[cloneIndex] = {
              ...nextData[cloneIndex],
              id: String(nextData[cloneIndex].id).replace('-clone', ''),
            } as T;
          }

          setStoredValue(nextData);

          requestAnimationFrame(() => {
            setCheckFinal(true);
          });

          return nextData;
        });

        isSorting.current = false;
        original.current = false;
        cachedRects.current = null;
        target.current = { previous: -1, current: -1, item: null, data: null };
        window.sortable = null;
      },

      onDrag: ({ source, location }) => {
        if (
          !isSorting.current ||
          isTransitioning.current ||
          sortableGroup === undefined
        ) {
          return;
        }

        const { pageX, pageY } = getMousePosition(location);
        if (pageX !== mouse.current.pageX || pageY !== mouse.current.pageY) {
          mouse.current = { pageX, pageY };
        } else return;

        const draggingElement = source.element as HTMLElement | null;
        if (!draggingElement || !ref.current) return;

        if (!cachedRects.current) return;
        const elements = getSortableElements();
        void draggingElement;

        const closestIdx = closestIndex();

        if (closestIdx !== -1 && closestIdx !== target.current.current) {
          target.current = {
            previous: target.current.current,
            current: closestIdx,
            item: elements[closestIdx] as HTMLElement,
            data: source.data,
          };

          onSortIndexChange?.(target.current);
          setSortableData?.((prevData: T[]) => {
            const newData: T[] = [...prevData];
            const prevIndex = target.current.previous;
            const currIndex = target.current.current;
            [newData[prevIndex], newData[currIndex]] = [
              newData[currIndex],
              newData[prevIndex],
            ];

            if (cachedRects.current) {
              const rects = cachedRects.current;
              [rects[prevIndex], rects[currIndex]] = [
                rects[currIndex],
                rects[prevIndex],
              ];
            }

            setStoredValue(newData);

            return newData;
          });
        }
      },
    },
    [
      ref,
      sortInGroup,
      sortableGroup,
      setSortableData,
      onSortIndexChange,
      onSortable,
    ],
  );

  return {
    motioned: sortInGroup
      ? createElement(
          motionedTag as ComponentType<any>,
          {
            layout: true,
            transition: { type: 'spring', stiffness: 400, damping: 30 },
            ...motions,
          },
          (
            children as ReactElement<{
              children?: ReactElement | ReactElement[];
            }>
          ).props.children,
        )
      : null,
    hidden: hideOriginal,
  };
}
