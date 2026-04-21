/** Keys for drag-and-drop events you can opt into logging. */
export type LogDebugEvent =
  | 'dragStart'
  | 'drag'
  | 'targetChange'
  | 'drop'
  | 'preview'
  | 'dragEnter'
  | 'dragLeave'
  | 'catch';

/** Default `logEvents`: log every supported event. */
export const ALL_LOG_DEBUG_EVENTS: readonly LogDebugEvent[] = [
  'dragStart',
  'drag',
  'targetChange',
  'drop',
  'preview',
  'dragEnter',
  'dragLeave',
  'catch',
];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function get(obj: unknown, key: string): unknown {
  return isRecord(obj) ? obj[key] : undefined;
}

function extractDragDropId(payload: unknown): unknown {
  const self = get(payload, 'self');
  const source = get(payload, 'source');
  const data = get(payload, 'data');

  const selfData = get(self, 'data');
  const sourceData = get(source, 'data');

  const direct =
    get(selfData, 'id') ??
    get(sourceData, 'id') ??
    get(data, 'id') ??
    get(self, 'id');
  if (direct !== undefined) return direct;

  // Some adapter payloads nest the drop-target under `self.dropTarget.element`
  // but the data is still on `self.data`; however in some cases the only id
  // available is the root drop target's `self.data.id` without `data`/`source`.
  const location = get(payload, 'location');
  const current = get(location, 'current');
  const dropTargets = get(current, 'dropTargets');

  if (Array.isArray(dropTargets)) {
    for (const t of dropTargets) {
      const candidate = get(get(t, 'data'), 'id') ?? get(t, 'id');
      if (candidate !== undefined) return candidate;
    }
  }

  return undefined;
}

export const logEvents = (
  enabled: ReadonlySet<LogDebugEvent>,
  event: LogDebugEvent,
  payload: unknown,
): void => {
  if (!enabled.has(event)) return;
  const id = extractDragDropId(payload);
  console.log(`${String(id)} → [${event}]: `, payload);
};
