"use client";

import { useUpload } from "@/hooks/useUpload";
import Link from "next/link";
import { useAuthStore } from "@/hooks/useAuthStore";
import { useUserPoints } from "./hooks/useUserPoints";

const ResultDialog = ({
  rightCount,
  wrongCount,
}: {
  rightCount: number;
  wrongCount: number;
}) => {
  const uid = useAuthStore((state) => state.uid);
  const trueUpload = useUpload((state) => state.TrueUpload);

  const { updatePointsMutation } = useUserPoints(uid);

  const handleAddPoint = () => {
    trueUpload();
    updatePointsMutation.mutate(rightCount * 10); // 정답 개수에 따라 포인트 추가
  };

  return (
    <>
      <div className="fixed inset-0 bg-black opacity-70 flex justify-center items-center z-10"></div>
      <div className="fixed inset-0 flex justify-center items-center z-10">
        <div
          onClick={(e) => e.stopPropagation()}
          className="relative w-[90%] max-w-[550px] h-auto sm:h-[550px] text-white rounded-3xl flex flex-col justify-between items-center p-4 sm:p-6 sm:mb-20"
        >
          <div className="text-[32px] sm:text-[50px] font-extrabold my-4 sm:my-2 flex items-center">
            <span className="text-[25px] sm:text-[80px] mx-2 mb-14">
              RESULT
            </span>
          </div>
          <div className="flex flex-col justify-center items-center w-full max-w-[450px] h-auto sm:h-[430px] mb-2 rounded-2xl p-4 sm:p-6">
            <div className="text-[20px] sm:text-[30px] mb-2 sm:mb-4">
              CORRECT ANSWER : {rightCount}
            </div>
            <div className="text-[20px] sm:text-[30px] mb-2 sm:mb-20">
              WRONG ANSWER : {wrongCount}
            </div>
            <div className="text-[20px] sm:text-[30px] mb-8 sm:mb-20">
              <span>+{rightCount * 10} POINT</span>
            </div>
            <Link
              onClick={handleAddPoint}
              className="p-2 sm:px-6 bg-white text-black text-[18px] sm:text-[20px] rounded-xl"
              href="/"
              replace
            >
              Return Home
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default ResultDialog;
