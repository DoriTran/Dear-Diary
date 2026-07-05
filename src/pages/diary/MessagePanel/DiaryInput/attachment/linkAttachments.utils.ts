import { v4 as uuidv4 } from 'uuid';

import type { Attachment, LinkAttachment } from '@/store/diary/type';

const URL_REGEX = /https?:\/\/[^\s<>"']+/gi;

export const extractUrls = (text: string): string[] => {
  const matches = text.match(URL_REGEX);

  if (!matches) {
    return [];
  }

  return [...new Set(matches.map((url) => url.replace(/[.,;:!?)]+$/, '')))];
};

export const isLinkAttachment = (
  attachment: Attachment,
): attachment is LinkAttachment => attachment.type === 'link';

export const syncLinkAttachments = (
  text: string,
  attachments: Attachment[],
): Attachment[] => {
  const urls = extractUrls(text);
  const nonLinkAttachments = attachments.filter(
    (attachment) => !isLinkAttachment(attachment),
  );
  const existingLinks = attachments.filter(isLinkAttachment);

  const linkAttachments: LinkAttachment[] = urls.map((url) => {
    const existing = existingLinks.find((link) => link.url === url);

    if (existing) {
      return existing;
    }

    return {
      id: `link:${uuidv4()}`,
      type: 'link',
      url,
      name: url,
    };
  });

  return [...nonLinkAttachments, ...linkAttachments];
};
