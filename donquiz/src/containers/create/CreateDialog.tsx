"use client";

import imageCompression from "browser-image-compression";
import { useDialog } from "@/hooks/useDialog";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import { db, storage } from "../../../firebase/firebasedb";
import { collection, doc, serverTimestamp, setDoc } from "firebase/firestore";
import { useAuthStore } from "@/hooks/useAuthStore";
import Image from "next/image";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useState } from "react";

const CreateDialog = () => {
  const { CloseDialog } = useDialog();
  const uid = useAuthStore((state) => state.uid);

  const router = useRouter();

  const [isLoading, setIsLoading] = useState<boolean>(false);
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
    setIsLoading(true);

    const uploadFileName = uuidv4(); //이미지 파일 랜덤 이름 주기

    const imageRef = ref(storage, `images/${uploadFileName}`); //파이어스토리지에 저장
    await uploadBytes(imageRef, titleImage);
    const imageUrl = await getDownloadURL(imageRef);

    if (uid) {
      //파이어스토어에 제목과 썸네일 저장
      const docRef = doc(collection(db, "users", uid, "quizList"));

      await setDoc(docRef, {
        quizId: docRef.id,
        title,
        thumbnail: imageUrl,
        participant: 0,
        createdAt: serverTimestamp(),
      });

      setIsLoading(false);
      CloseDialog();
      router.push(`/create/${docRef.id}`);
    }
  };

  const handleImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files == null) {
      return;
    }
    const file = e.target.files[0];

    const options = {
      maxSizeMB: 1, // 최대 파일 크기 설정
      maxWidthOrHeight: 800, // 최대 가로 또는 세로 길이 설정
    };

    try {
      const compressedFile = await imageCompression(file, options);
      setTitleImage(compressedFile);

      const reader = new FileReader();
      reader.readAsDataURL(compressedFile);

      reader.onloadend = () => {
        setThumbnail(reader.result as string);
      };
    } catch (error) {
      console.error("이미지 압축 오류:", error);
    }
    e.target.value = "";
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
          <div className="text-2xl sm:text-4xl font-bold text-[#333333] mb-4 sm:mb-8">
            Making Quiz
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
                    priority
                  />
                </div>
              ) : (
                <>
                  <label
                    htmlFor="file"
                    className="flex flex-col justify-center items-center cursor-pointer"
                  >
                    {/* <div className="mb-2 text-sm sm:text-base">
                      썸네일을 선택해주세요
                    </div>
                    <div className="p-1 px-4 border-2 rounded-xl hover:bg-[#f2f2f2]">
                      파일 업로드
                    </div> */}
                  </label>
                  <input
                    id="file"
                    type="file"
                    className="w-[98px]"
                    onChange={handleImage}
                    accept="image/*"
                  />
                </>
              )}
            </div>

            <div className="flex justify-around items-center mb-2">
              {!isLoading ? (
                <>
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
                </>
              ) : (
                <div className="flex flex-col justify-center items-center">
                  <div className="border-4 border-r-white border-black rounded-full w-[50px] h-[50px] animate-spin mb-1" />
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default CreateDialog;
