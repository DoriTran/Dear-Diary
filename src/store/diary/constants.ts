import type { DiaryStore } from './type';

export const diaryInitialState: DiaryStore = {
  groups: {},
  chatboxes: {},
  messages: {},
  orders: {
    rootOrders: [],
    groupChatboxOrders: {},
    chatboxMessageOrders: {},
  },
};
