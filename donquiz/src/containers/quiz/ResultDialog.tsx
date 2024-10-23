"use client";

import { useUpload } from "@/hooks/useUpload";
import Link from "next/link";

const ResultDialog = () => {
  const trueUpload = useUpload((state) => state.TrueUpload);

  return (
    <>
      <div className="absolute w-screen h-screen left-0 top-0 bg-black opacity-70 flex justify-center items-center z-10"></div>
      <div className="absolute w-screen h-screen left-0 top-0 flex justify-center items-center z-10">
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute w-[550px] h-[550px]
        text-black bg-white rounded-3xl flex flex-col justify-center items-center"
        >
          <div className="text-[50px]  my-2">퀴즈 결과</div>
          <div className="flex flex-col justify-center items-center w-[450px] h-[430px] border-4 border-black mb-2 rounded-2xl">
            <div>맞춘 거 틀린 거</div>
          </div>
          <Link
            onClick={() => {
              trueUpload();
            }}
            className="p-2 px-6 mb-2 bg-[#222222] hover:bg-black text-white text-[20px] rounded-xl"
            href="/"
          >
            홈으로
          </Link>
        </div>
      </div>
    </>
  );
};

export default ResultDialog;
