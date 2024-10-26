"use client";

import CelebrateLeft from "../../../public/image/CelebrateLeft.png";
import CelebrateRight from "../../../public/image/CelebrateRight.png";
import { useUpload } from "@/hooks/useUpload";
import { doc, getDoc, setDoc } from "firebase/firestore";
import Image from "next/image";
import Link from "next/link";
import { db } from "../../../firebase/firebasedb";
import { useAuthStore } from "@/hooks/useAuthStore";

const ResultDialog = ({
  rightCount,
  wrongCount,
}: {
  rightCount: number;
  wrongCount: number;
}) => {
  const uid = useAuthStore((state) => state.uid);
  const trueUpload = useUpload((state) => state.TrueUpload);

  const handleAddPoint = async () => {
    trueUpload();
    const docRef = doc(db, `users/${uid}`);

    const user = await getDoc(docRef);
    if (user.exists()) {
      const userData = user.data();
      await setDoc(
        docRef,
        {
          point: userData.point + rightCount * 10,
        },
        { merge: true }
      );
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black opacity-70 flex justify-center items-center z-10"></div>
      <div className="fixed inset-0 flex justify-center items-center z-10">
        <div
          onClick={(e) => e.stopPropagation()}
          className="relative w-[90%] max-w-[550px] h-auto sm:h-[550px] text-black bg-white rounded-3xl flex flex-col justify-center items-center p-4 sm:p-6"
        >
          <div className="text-[32px] sm:text-[50px] font-extrabold my-4 sm:my-2 flex items-center">
            <Image src={CelebrateLeft} alt="결과" width="65" height="65" />
            <span className="text-[25px] sm:text-[50px] mx-2">퀴즈 결과</span>
            <Image src={CelebrateRight} alt="결과" width="65" height="65" />
          </div>
          <div className="flex flex-col justify-center items-center w-full max-w-[450px] h-auto sm:h-[430px] border-4 border-black mb-2 rounded-2xl p-4 sm:p-6">
            <div className="text-[20px] sm:text-[30px] mb-2 sm:mb-4">
              정답 개수 : {rightCount}개
            </div>
            <div className="text-[20px] sm:text-[30px] mb-2 sm:mb-4">
              오답 개수 : {wrongCount}개
            </div>
            <div className="text-[20px] sm:text-[30px] mb-8 sm:mb-14">
              포인트 적립 : {rightCount * 10}점
            </div>
            <Link
              onClick={handleAddPoint}
              className="p-2 sm:px-6 bg-[#222222] hover:bg-black text-white text-[18px] sm:text-[20px] rounded-xl"
              href="/"
              replace
            >
              홈으로
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default ResultDialog;
