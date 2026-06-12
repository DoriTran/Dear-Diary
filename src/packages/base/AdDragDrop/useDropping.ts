import { dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { useEffect, useMemo, useState, type RefObject } from 'react';

import type { LogDebugEvent } from './logEvents';
import type {
  CanDrop as CanDropFn,
  DropArgs,
  DragEnterArgs,
  DragLeaveArgs,
  DropTargetOptions,
  GetDataArgs,
} from './type';

import { logEvents } from './logEvents';
import { useLatestRef } from './useLatestRef';

const dropKeys = [
  'ref',
  'droppable',
  'data',
  'getData',
  'canDrop',
  'onCatch',
  'onDragEnter',
  'onDragLeave',
  'cursorEffect',
  'stopDropPropagation',
  'sticky',
  'logEvents',
] as const;

type DropKey = (typeof dropKeys)[number];

type CanDropArgs = Parameters<NonNullable<CanDropFn>>[0];
type DropEffectArgs = Parameters<
  NonNullable<DropTargetOptions['getDropEffect']>
>[0];
type StickyArgs = Parameters<NonNullable<DropTargetOptions['getIsSticky']>>[0];

export interface UseDroppingOptions extends Record<string, unknown> {
  ref: RefObject<HTMLElement | null>;

  /** When false, drop target behavior is not registered. */
  droppable?: boolean;

  data?:
    | Record<string, unknown>
    | ((arg: GetDataArgs) => Record<string, unknown>);

  canDrop?: boolean | ((arg: CanDropArgs & { data: any }) => boolean);

  onCatch?: (arg: DropArgs & { data: any }) => void;

  onDragEnter?: (arg: DragEnterArgs & { data: any }) => void;

  onDragLeave?: (arg: DragLeaveArgs & { data: any }) => void;

  cursorEffect?: string | ((arg: DropEffectArgs & { data: any }) => string);

  /**
   * When enabled, only the top-most dropTarget will handle a drop.
   * This is useful for nested drop targets where you want "inner wins".
   */
  stopDropPropagation?: boolean;

  sticky?: boolean | ((arg: StickyArgs & { data: any }) => boolean);

  /**
   * Which events to log (debugging only).
   * Drop-target events are different from drag-source monitor events:
   * - `dragEnter` logs when a draggable enters this target
   * - `dragLeave` logs when a draggable leaves this target
   * - `catch` logs when this target receives a drop (`onDrop`)
   */
  logEvents?: readonly LogDebugEvent[];
}

export interface UseDroppingResult {
  droppable: boolean;
  hovering: boolean;
}

export default function useDropping(
  drops: UseDroppingOptions = {} as UseDroppingOptions,
  dependencies: unknown[] = [],
): UseDroppingResult {
  const [hovering, setHovering] = useState(false);
  const dropsRef = useLatestRef(drops);

  const log = useMemo(
    () => new Set<LogDebugEvent>(drops.logEvents ?? []),
    [drops.logEvents],
  );
  const logEvent: (
    enabled: ReadonlySet<LogDebugEvent>,
    event: LogDebugEvent,
    payload: unknown,
  ) => void = logEvents;

  useEffect(() => {
    const el = drops.ref?.current ?? null;

    if (!el || !drops.droppable) return;

    const otherDrops: Record<string, unknown> = Object.fromEntries(
      Object.entries(dropsRef.current).filter(
        ([key]) => !dropKeys.includes(key as DropKey),
      ),
    );

    return dropTargetForElements({
      element: el,
      ...otherDrops,

      /* ------------------------------ GET DATA ----------------------------- */

      getData: (args: any) => {
        const current = dropsRef.current;
        return typeof current.data === 'function'
          ? current.data(args)
          : (current.data ?? {});
      },

      /* ------------------------------ CAN DROP ----------------------------- */

      canDrop: (args: CanDropArgs) => {
        const { canDrop } = dropsRef.current;
        if (canDrop === undefined) return true;

        return typeof canDrop === 'function'
          ? canDrop({
              data: args.source.data,
              ...args,
            })
          : Boolean(canDrop);
      },

      /* -------------------------------- DROP ------------------------------- */

      onDrop: ({ source, location, self }: DropArgs) => {
        const current = dropsRef.current;

        if (el.querySelector('[data-stop-drop-propagation]') !== null) {
          const topMostElement = location.current?.dropTargets?.[0]?.element;

          if (topMostElement !== el) {
            setHovering(false);
            return;
          }
        }

        current.onCatch?.({
          data: source.data,
          source,
          location,
          self,
        });

        logEvent(log, 'catch', {
          data: source.data,
          source,
          location,
          self,
        });

        setHovering(false);
      },

      /* ----------------------------- DRAG ENTER ---------------------------- */

      onDragEnter: ({ source, location, self }: DragEnterArgs) => {
        const current = dropsRef.current;

        current.onDragEnter?.({
          data: source.data,
          source,
          location,
          self,
        });

        logEvent(log, 'dragEnter', {
          data: source.data,
          source,
          location,
          self,
        });

        setHovering(true);
      },

      /* ----------------------------- DRAG LEAVE ---------------------------- */

      onDragLeave: ({ source, location, self }: DragLeaveArgs) => {
        const current = dropsRef.current;

        current.onDragLeave?.({
          data: source.data,
          source,
          location,
          self,
        });

        logEvent(log, 'dragLeave', {
          data: source.data,
          source,
          location,
          self,
        });

        setHovering(false);
      },

      /* ---------------------------- DROP EFFECT ---------------------------- */

      getDropEffect: (_args: DropEffectArgs): 'copy' => 'copy',

      /* ------------------------------- STICKY ------------------------------ */

      getIsSticky: ({ input, source, element }: StickyArgs) => {
        const { sticky } = dropsRef.current;

        return typeof sticky === 'function'
          ? sticky({
              data: source.data,
              input,
              source,
              element,
            })
          : (sticky ?? false);
      },
    });
  }, [drops.ref, drops.droppable, log, ...dependencies]);

  return {
    droppable: Boolean(drops.droppable),
    hovering,
  };
}
