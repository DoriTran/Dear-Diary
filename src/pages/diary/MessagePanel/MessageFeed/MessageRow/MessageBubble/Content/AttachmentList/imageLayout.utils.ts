export type AttachmentImageLayout = {
  largeRows: number;
  smallRows: number;
};

/**
 * Solve the smallest large/small row layout that can hold `count` images
 * without leaving an incomplete row (see `_architecture.md` image layout spec).
 */
export function findAttachmentLayout(
  count: number,
  largeCapacity = 3,
  smallCapacity = 4,
): AttachmentImageLayout {
  let target = Math.max(0, count);

  while (true) {
    let largeRows = Math.floor(target / largeCapacity);

    while (largeRows >= 0) {
      const remain = target - largeRows * largeCapacity;

      if (remain % smallCapacity === 0) {
        return { largeRows, smallRows: remain / smallCapacity };
      }

      largeRows--;
    }

    target++;
  }
}

/**
 * Split `items` into rows following the large/small layout. Only the last
 * row can ever end up under capacity (it absorbs whatever's left over); that
 * under-filled row is moved to the front (shrunk to its actual size) so its
 * bigger cells render first, while every other row keeps its original
 * relative order and items stay in their original sequence throughout.
 */
export function buildAttachmentRows<T>(
  items: T[],
  largeCapacity = 3,
  smallCapacity = 4,
): T[][] {
  const { largeRows, smallRows } = findAttachmentLayout(
    items.length,
    largeCapacity,
    smallCapacity,
  );

  const capacities = [
    ...Array<number>(largeRows).fill(largeCapacity),
    ...Array<number>(smallRows).fill(smallCapacity),
  ];

  const deficit =
    capacities.reduce((sum, capacity) => sum + capacity, 0) - items.length;

  if (deficit > 0 && capacities.length > 0) {
    const shrunk = capacities[capacities.length - 1] - deficit;
    capacities.pop();
    capacities.unshift(shrunk);
  }

  const rows: T[][] = [];
  let cursor = 0;

  for (const capacity of capacities) {
    if (cursor >= items.length) {
      break;
    }

    rows.push(items.slice(cursor, cursor + capacity));
    cursor += capacity;
  }

  return rows;
}
