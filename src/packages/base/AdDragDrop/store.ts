import { create } from 'zustand';

export type DragDropStore = {
  draggingId: string | null;
};

type Actions = {
  setDraggingId: (id: string | null) => void;
};

export const useDragDropStore = create<DragDropStore & Actions>((set) => ({
  draggingId: null,

  setDraggingId: (id) => set({ draggingId: id }),
}));
