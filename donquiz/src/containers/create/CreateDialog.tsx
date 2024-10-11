"use client";

import { useDialog } from "@/hooks/useDialog";
import { ref, uploadBytes } from "firebase/storage";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { db, storage } from "../../../firebase/firebasedb";
import { arrayUnion, doc, setDoc } from "firebase/firestore";
import { useAuthStore } from "@/hooks/useAuthStore";

const CreateDialog = () => {
  const { CloseDialog } = useDialog();
  const uid = useAuthStore((state) => state.uid);

  const [title, setTitle] = useState("");
  const [titleImage, setTitleImage] = useState();

  const [isCheckTitleImage, setIsCheckTitleImage] = useState(false);

  const handleQuizFrame = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const uploadFileName = uuidv4();
    console.log(uploadFileName);

    if (!titleImage) {
      setIsCheckTitleImage(false);
      return;
    }
    const imageRef = ref(storage, `images/${uploadFileName}`);
    uploadBytes(imageRef, titleImage);

    if (uid) {
      await setDoc(doc(db, "quizList", uid), {
        quizList: arrayUnion({
          title,
          uploadFileName: arrayUnion(uploadFileName),
        }),
      });
    }

    console.log(title, titleImage);
  };

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files !== null) {
      setTitleImage(e.target.files[0]);
      console.log(e.target.files[0]);
      setIsCheckTitleImage(true);
    }
  };

  return (
    <>
      <div className="absolute w-screen h-screen left-0 top-0 bg-black opacity-70 flex justify-center items-center"></div>
      <div
        onClick={CloseDialog}
        className="absolute w-screen h-screen left-0 top-0 flex justify-center items-center"
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute w-[550px] h-[550px]
       bottom-[35%] text-black bg-white rounded-3xl flex flex-col justify-center items-center"
        >
          <div className="text-4xl font-bold mb-8">퀴즈 만들기</div>
          <form onSubmit={handleQuizFrame}>
            <input
              className="w-[450px] border-0 bg-[#f2f2f2] rounded-lg p-3 mb-5"
              placeholder="제목을 입력해주세요"
              id="title"
              onChange={(e) => {
                setTitle(e.target.value);
              }}
            />
            <div className="w-[450px] h-[270px] text-[#999999] border-4 border-dashed rounded-xl flex flex-col justify-center items-center mb-6">
              <label
                htmlFor="file"
                className="flex flex-col justify-center items-center"
              >
                <div className="mb-2">썸네일을 선택해주세요</div>
                <div className="p-1 px-4 border-2 rounded-xl hover:bg-[#f2f2f2]">
                  파일 업로드
                </div>
              </label>
              <input
                id="file"
                type="file"
                className="hidden"
                onChange={handleImage}
              />
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
