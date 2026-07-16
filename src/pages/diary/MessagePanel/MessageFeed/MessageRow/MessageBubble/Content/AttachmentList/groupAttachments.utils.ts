import type { Attachment } from '@/store/diary/type';

/**
 * Group attachments by `type`, preserving the original item order within
 * each group. Group order follows the index of that type's first
 * occurrence in the input array (a stable group-by), so:
 *
 *   [video, img, img, img, video, img] -> [video, video], [img, img, img, img]
 *   [img, img, video, img, video, img] -> [img, img, img, img], [video, video]
 */
export function groupAttachmentsByType(
  attachments: Attachment[],
): Attachment[][] {
  const order: string[] = [];
  const groups = new Map<string, Attachment[]>();

  for (const attachment of attachments) {
    if (!groups.has(attachment.type)) {
      order.push(attachment.type);
      groups.set(attachment.type, []);
    }

    groups.get(attachment.type)!.push(attachment);
  }

  return order.map((type) => groups.get(type)!);
}
