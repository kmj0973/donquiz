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
      toast.error("제목을 3글자 이상 입력해주세요, 썸네일을 등록해주세요", {
        duration: 3000,
      });
      return;
    }

    const uploadFileName = uuidv4(); //이미지 파일 랜덤 이름 주기

    const imageRef = ref(storage, `images/${uploadFileName}`); //파이어스토리지에 저장
    await uploadBytes(imageRef, titleImage);

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
    const file = e.target.files?.[0];
    if (!file) return;

    setTitleImage(file);

    const reader = new FileReader();
    reader.onload = () => {
      if (reader.result) {
        setThumbnail(reader.result as string); // 파일을 읽어온 후, thumbnail 상태 업데이트
      }
    };
    reader.onerror = () => {
      toast.error("파일을 읽는 데 실패했습니다.");
    };

    reader.readAsDataURL(file); // 파일을 읽기 시작
  };

  return (
    <>
      <div className="fixed inset-0 bg-black opacity-70 flex justify-center items-center z-10"></div>
      <div
        onClick={CloseDialog}
        className="fixed inset-0 flex justify-center items-center z-20"
      >
        <div
          onClick={(e) => e.stopPropagation()}
          className="relative w-[90%] text-black max-w-[550px] h-auto sm:h-[550px] bg-white rounded-3xl flex flex-col justify-center items-center p-6 sm:pb-8"
        >
          <div className="text-2xl sm:text-4xl font-bold mb-4 sm:mb-8">
            퀴즈 만들기
          </div>
          <form onSubmit={handleQuizFrame}>
            <input
              className="w-full sm:w-[450px] border-0 bg-[#f2f2f2] rounded-lg p-2 sm:p-3 mb-4 sm:mb-5"
              placeholder="제목을 입력해주세요"
              id="title"
              onChange={(e) => {
                setTitle(e.target.value);
              }}
            />

            <div className="w-full sm:w-[450px] h-[180px] sm:h-[270px] text-[#999999] border-4 border-dashed rounded-xl flex flex-col justify-center items-center mb-4 sm:mb-6">
              {thumbnail ? (
                <div className="relative w-full sm:w-[440px] h-[180px] sm:h-[270px]">
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
                    <div className="mb-2 text-sm sm:text-base">
                      썸네일을 선택해주세요
                    </div>
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
                className="w-[100px] sm:w-[120px] text-[16px] sm:text-[20px] bg-[#222222] hover:bg-black rounded-xl py-2 px-3 text-white"
              >
                생성하기
              </button>
              <button
                type="button"
                onClick={CloseDialog}
                className="w-[100px] sm:w-[120px] text-[16px] sm:text-[20px] bg-[#222222] hover:bg-black rounded-xl py-2 px-3 text-white"
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
