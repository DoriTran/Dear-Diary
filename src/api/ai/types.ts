export type GenerateAiResponseInput = {
  chatboxId: string;
  prompt: string;
};

export type GenerateAiResponseResult = {
  text: string;
  list?: string[];
};
