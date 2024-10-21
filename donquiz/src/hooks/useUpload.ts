import { create } from "zustand";

interface PopUpProps {
  isUpload: boolean;
  TrueUpload: () => void;
  FalseUpload: () => void;
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
