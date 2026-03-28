type Primitive = string | number | boolean;

// For object arrays with a key
export function assignIdsData<
  T extends Record<PropertyKey, unknown>,
  K extends keyof T,
>(array: T[], idKey: K): (T & { id: T[K] })[];

// For primitive arrays (no idKey)
export function assignIdsData<T extends Primitive>(
  array: T[],
  idKey?: undefined,
): { id: T; data: T }[];

export function assignIdsData(
  array: (Record<PropertyKey, unknown> | Primitive)[],
  idKey?: PropertyKey,
):
  | (Record<PropertyKey, unknown> & { id: unknown })[]
  | { id: Primitive; data: Primitive }[] {
  if (!Array.isArray(array) || array.length === 0) {
    return [];
  }

  const firstItem = array[0];
  const isObjectItem = typeof firstItem === 'object' && firstItem !== null;

  // Object items
  if (isObjectItem) {
    if (idKey === undefined) {
      return [];
    }

    const objectArray = array as Record<PropertyKey, unknown>[];

    return objectArray.map((item) => {
      const key = idKey;

      return {
        id: item[key],
        ...item,
      };
    });
  }

  // Primitive items
  const primitiveArray = array as Primitive[];

  return primitiveArray.map((item) => ({
    id: item,
    data: item,
  }));
}

export function unwrapIdData<
  T extends { id?: unknown; data?: unknown } | Record<string, unknown>,
>(array: T[]): unknown[] {
  if (!Array.isArray(array) || array.length === 0) {
    return [];
  }

  return array.map((item) => {
    if (
      item &&
      typeof item === 'object' &&
      Object.keys(item).length === 2 &&
      'id' in item &&
      'data' in item
    ) {
      return (item as { data: unknown }).data;
    }

    // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
    const { id, ...rest } = item as Record<string, unknown>;
    return rest;
  });
}

export function exportIdData<T extends { id: unknown }>(array: T[]): unknown[] {
  if (!Array.isArray(array) || array.length === 0) {
    return [];
  }

  return array.map((each) => each.id);
}
