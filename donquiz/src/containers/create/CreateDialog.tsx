"use client";

import { useDialog } from "@/hooks/useDialog";
import { ref, uploadBytes } from "firebase/storage";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { db, storage } from "../../../firebase/firebasedb";
import { collection, doc, setDoc } from "firebase/firestore";
import { useAuthStore } from "@/hooks/useAuthStore";
import Image from "next/image";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const CreateDialog = () => {
  const { CloseDialog } = useDialog();
  const uid = useAuthStore((state) => state.uid);

  const router = useRouter();

  const [title, setTitle] = useState<string>("");
  const [titleImage, setTitleImage] = useState<File | null>(null);
  const [thumbnail, setThumbnail] = useState<string | null>(null);

  const handleQuizFrame = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!titleImage || title.length < 3) {
      toast.error("제목을 3글자 이상 입력해주세요", {
        duration: 3000,
      });
      return;
    }

    const uploadFileName = uuidv4(); //이미지 파일 랜덤 이름 주기

    const imageRef = ref(storage, `images/${uploadFileName}`); //파이어스토리지에 저장
    uploadBytes(imageRef, titleImage);

    if (uid) {
      //파이어스토어에 제목과 썸네일 저장
      const docRef = doc(collection(db, "users", uid, "quizList"));

      await setDoc(docRef, {
        quizId: docRef.id,
        title,
        thumbnail: uploadFileName,
        participant: 0,
      });

      CloseDialog();
      router.push(`/create/${docRef.id}`);
    }
  };

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files == null) {
      return;
    }
    setTitleImage(e.target.files[0]);

    const reader = new FileReader();

    reader.readAsDataURL(e.target.files[0]);

    reader.onload = (e) => {
      if (reader.readyState === 2) {
        setThumbnail(String(e.target!.result));
      }
    };
  };

  return (
    <>
      <div className="absolute w-screen h-screen left-0 top-0 bg-black opacity-70 flex justify-center items-center z-10"></div>
      <div
        onClick={CloseDialog}
        className="absolute w-screen h-screen left-0 top-0 flex justify-center items-center z-10"
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
              {thumbnail ? (
                <div className="relative w-[440px] h-[270px]">
                  <Image
                    src={thumbnail}
                    alt="썸네일"
                    fill
                    style={{ borderRadius: "8px" }}
                  />
                </div>
              ) : (
                <>
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
                    accept="image/*"
                  />
                </>
              )}
            </div>
            <div className="flex justify-around items-center mb-2">
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
