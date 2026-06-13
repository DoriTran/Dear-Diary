import type {
  GenerateAiResponseInput,
  GenerateAiResponseResult,
} from './types';

import { delay } from '../client';

const MOCK_RESPONSES = [
  {
    text: "Great question! Here's a quick breakdown to help you get started.",
    list: [
      'Break the task into smaller steps',
      'Set a 25-minute focus block',
      'Review progress at the end of the session',
    ],
  },
  {
    text: 'I can help with that. Based on what you shared, here are some suggestions.',
    list: ['Start with the highest-priority item', 'Keep notes as you go'],
  },
  {
    text: 'That sounds like a solid plan. Let me add a few ideas you might find useful.',
  },
];

export const generateAiResponse = async (
  input: GenerateAiResponseInput,
): Promise<GenerateAiResponseResult> => {
  await delay(600);

  const index =
    Math.abs(input.prompt.length + input.chatboxId.length) %
    MOCK_RESPONSES.length;

  const template = MOCK_RESPONSES[index];

  return {
    text: `${template.text}\n\nRe: "${input.prompt.slice(0, 80)}${input.prompt.length > 80 ? '…' : ''}"`,
    list: template.list,
  };
};
