import { create } from "zustand";

interface PopUpProps {
  isOpen: boolean;
  OpenPopUp: () => void;
  ClosePopUp: () => void;
}

export const usePopUp = create<PopUpProps>((set) => {
  return {
    isOpen: false,
    OpenPopUp: () => {
      set({ isOpen: true });
    },
    ClosePopUp: () => {
      set({ isOpen: false });
    },
  };
});
