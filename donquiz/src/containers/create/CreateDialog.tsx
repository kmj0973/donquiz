"use client";

import { useDialog } from "@/hooks/useDialog";

const CreateDialog = () => {
  const { CloseDialog } = useDialog();

  return (
    <>
      <div
        onClick={CloseDialog}
        className="absolute w-screen h-screen left-0 top-0 bg-black opacity-70 flex justify-center items-center"
      >
        hi
      </div>
      <div
        className="absolute w-[550px] h-[550px]
      left-[26%] bottom-[25%] bg-white rounded-3xl flex flex-col justify-center items-center"
      >
        hi
      </div>
    </>
  );
};

export default CreateDialog;
