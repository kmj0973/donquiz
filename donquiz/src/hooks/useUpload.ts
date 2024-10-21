import { create } from "zustand";

interface PopUpProps {
  isUpload: boolean;
  OpenDialog: () => void;
  CloseDialog: () => void;
}

export const useUpload = create<PopUpProps>((set) => {
  return {
    isUpload: false,
    TrueUpload: () => {
      set({ isUpload: true });
    },
    FalseUpload: () => {
      set({ isUpload: false });
    },
  };
});
