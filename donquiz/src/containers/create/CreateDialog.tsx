"use client";

import { useDialog } from "@/hooks/useDialog";

const CreateDialog = () => {
  const { CloseDialog } = useDialog();

  return (
    <>
      <div className="absolute w-screen h-screen left-0 top-0 bg-black opacity-70 flex justify-center items-center"></div>
      <div
        onClick={CloseDialog}
        className="absolute w-screen h-screen left-0 top-0 flex justify-center items-center"
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute w-[600px] h-[500px]
       bottom-[35%] text-black bg-white rounded-3xl flex flex-col justify-center items-center"
        >
          <div className="text-4xl font-bold mb-10">퀴즈 만들기</div>
          <form>
            <input
              className="w-[450px] border-0 bg-[#f2f2f2] rounded-lg p-3 mb-5"
              placeholder="제목을 입력해주세요"
            />
            <div className="w-[450px] h-[200px] text-[#999999] border-4 border-dashed rounded-xl flex flex-col justify-center items-center mb-8">
              <label htmlFor="file">썸네일을 선택해주세요</label>
              <input id="file" type="file" className="overflow-hidden" />
            </div>
            <div className="flex justify-around items-center">
              <button
                type="submit"
                className="w-[120px] bg-[#222222] hover:bg-black rounded-xl py-2 px-3 text-white"
              >
                생성하기
              </button>
              <button
                type="button"
                onClick={CloseDialog}
                className="w-[120px] bg-[#222222] hover:bg-black rounded-xl py-2 px-3 text-white"
              >
                취소
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default CreateDialog;
