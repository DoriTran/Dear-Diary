import { v4 as uuidv4 } from 'uuid';

import type { UploadResult } from './types';

import { delay } from '../client';

const getExtension = (file: File): string => {
  const parts = file.name.split('.');

  return parts.length > 1 ? parts[parts.length - 1] : 'bin';
};

export const uploadAttachment = async (file: File): Promise<UploadResult> => {
  await delay();

  const ext = getExtension(file);

  return {
    url: `/dummy/${uuidv4()}.${ext}`,
    name: file.name,
    size: file.size,
    mimeType: file.type || 'application/octet-stream',
  };
};
