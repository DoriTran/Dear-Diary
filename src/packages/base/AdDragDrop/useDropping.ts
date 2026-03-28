import { dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { useEffect, useMemo, useState, type RefObject } from 'react';

import type {
  CanDrop as CanDropFn,
  DropArgs,
  DragEnterArgs,
  DragLeaveArgs,
  DropTargetOptions,
  GetDataArgs,
} from './type';

const dropKeys = [
  'ref',
  'data',
  'getData',
  'canDrop',
  'onCatch',
  'onDragEnter',
  'onDragLeave',
  'cursorEffect',
  'sticky',
] as const;

type DropKey = (typeof dropKeys)[number];

type CanDropArgs = Parameters<NonNullable<CanDropFn>>[0];
type DropEffectArgs = Parameters<
  NonNullable<DropTargetOptions['getDropEffect']>
>[0];
type StickyArgs = Parameters<NonNullable<DropTargetOptions['getIsSticky']>>[0];

export interface UseDroppingOptions extends Record<string, unknown> {
  ref: RefObject<HTMLElement | null>;

  data?:
    | Record<string, unknown>
    | ((arg: GetDataArgs) => Record<string, unknown>);

  canDrop?: boolean | ((arg: CanDropArgs & { data: any }) => boolean);

  onCatch?: (arg: DropArgs & { data: any }) => void;

  onDragEnter?: (arg: DragEnterArgs & { data: any }) => void;

  onDragLeave?: (arg: DragLeaveArgs & { data: any }) => void;

  cursorEffect?: string | ((arg: DropEffectArgs & { data: any }) => string);

  sticky?: boolean | ((arg: StickyArgs & { data: any }) => boolean);
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

  const isDroppable = useMemo(() => {
    const { ref, ...otherDrops } = drops;
    void ref;
    return Object.keys(otherDrops).length !== 0;
  }, [drops]);

  useEffect(() => {
    const el = drops.ref?.current ?? null;

    if (!el || !isDroppable) return;

    const otherDrops: Record<string, unknown> = Object.fromEntries(
      Object.entries(drops).filter(
        ([key]) => !dropKeys.includes(key as DropKey),
      ),
    );

    return dropTargetForElements({
      element: el,

      /* ------------------------------ GET DATA ----------------------------- */

      getData: (args: any) =>
        typeof drops.data === 'function'
          ? drops.data(args)
          : (drops.data ?? {}),

      /* ------------------------------ CAN DROP ----------------------------- */

      canDrop: (args: CanDropArgs) => {
        if (drops.canDrop === undefined) return true;

        return typeof drops.canDrop === 'function'
          ? drops.canDrop({
              data: args.source.data,
              ...args,
            })
          : Boolean(drops.canDrop);
      },

      /* -------------------------------- DROP ------------------------------- */

      onDrop: ({ source, location, self }: DropArgs) => {
        drops.onCatch?.({
          data: source.data,
          source,
          location,
          self,
        });

        setHovering(false);
      },

      /* ----------------------------- DRAG ENTER ---------------------------- */

      onDragEnter: ({ source, location, self }: DragEnterArgs) => {
        drops.onDragEnter?.({
          data: source.data,
          source,
          location,
          self,
        });

        setHovering(true);
      },

      /* ----------------------------- DRAG LEAVE ---------------------------- */

      onDragLeave: ({ source, location, self }: DragLeaveArgs) => {
        drops.onDragLeave?.({
          data: source.data,
          source,
          location,
          self,
        });

        setHovering(false);
      },

      /* ---------------------------- DROP EFFECT ---------------------------- */

      getDropEffect: (args: DropEffectArgs): 'copy' => 'copy',

      /* ------------------------------- STICKY ------------------------------ */

      getIsSticky: ({ input, source, element }: StickyArgs) =>
        typeof drops.sticky === 'function'
          ? drops.sticky({
              data: source.data,
              input,
              source,
              element,
            })
          : (drops.sticky ?? false),

      ...otherDrops,
    });
  }, [drops, isDroppable, hovering, ...dependencies]);

  return {
    droppable: isDroppable,
    hovering,
  };
}
