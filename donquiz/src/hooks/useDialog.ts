import { create } from "zustand";

interface PopUpProps {
  isOpen: boolean;
  OpenDialog: () => void;
  CloseDialog: () => void;
}

export const useDialog = create<PopUpProps>((set) => {
  return {
    isOpen: false,
    OpenDialog: () => {
      set({ isOpen: true });
    },
    CloseDialog: () => {
      set({ isOpen: false });
    },
  };
});
