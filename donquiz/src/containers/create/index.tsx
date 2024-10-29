"use client";

import { FaArrowLeft } from "react-icons/fa6";
import { BsPlusSquare } from "react-icons/bs";
import { CiImageOff } from "react-icons/ci";
import { MdOutlineCancel } from "react-icons/md";
import { useState } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/hooks/useAuthStore";
import { useUpload } from "@/hooks/useUpload";
import { useUploadQuizList } from "@/containers/create/hooks/useQuizMutations";

interface QuizList {
  image: string;
  answer: string;
  source: string;
}

//문제점: 사진만 등록하고 정답 및 이미지 출처 작성하지않고 업로드할 경우가 있음
// 정답과 이미지 출처 중 빈칸이 있는 걸 확인해야함
const Create = () => {
  const docId = usePathname().slice(8); //documnet id
  const uid = useAuthStore((state) => state.uid); //user id
  const trueUpload = useUpload((state) => state.TrueUpload);

  const router = useRouter();

  const [uploadFileList, setUploadFileList] = useState<File[]>([]); //현재 추가한 이미지
  const [newQuizList, setNewQuizList] = useState<QuizList[]>([]);
  const [showImage, setShowImage] = useState<string>("");
  const [quizList, setQuizList] = useState<QuizList[]>([]);
  const [answer, setAnswer] = useState<string>("");
  const [source, setSource] = useState<string>("");
  const [showImageIndex, setShowImageIndex] = useState<number | null>();

  const { uploadMutation, updateMutation } = useUploadQuizList(uid, docId);

  const handleSubmitDB = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (quizList.length < 3) {
      toast.error("문제를 3개 이상 등록해주세요", {
        duration: 3000,
      });
      return;
    }

    trueUpload(); // 페이지 이동 감지 피하기
    const toastId = toast.loading("저장 중입니다...");

    try {
      // 이미지 업로드 및 QuizList에 이미지 ID 추가
      const updatedQuizList = await Promise.all(
        uploadFileList.map(async (uploadFile, index) => {
          const uploadFileName = await uploadMutation.mutateAsync(uploadFile);
          return { ...newQuizList[index], image: uploadFileName };
        })
      );

      // Firestore에 퀴즈 리스트 업데이트
      await updateMutation.mutateAsync(updatedQuizList);
      toast.success("저장되었습니다!", {
        id: toastId,
      });
      router.replace("/");
    } catch {
      toast.error("저장에 실패했습니다!");
    }
  };

  const handleAnswerAndSource = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (quizList.length == 0) {
      toast.error("사진을 등록해주세요", {
        duration: 3000,
      });
      return;
    }
    if (answer == "" || source == "") {
      toast.error("정답과 출처를 작성해주세요", {
        duration: 3000,
      });
      return;
    }

    if (showImageIndex != null) {
      quizList[showImageIndex].answer = answer;
      quizList[showImageIndex].source = source;
      setQuizList([...quizList]);
    }
    if (showImageIndex != null) {
      newQuizList[showImageIndex].answer = answer;
      newQuizList[showImageIndex].source = source;
      setNewQuizList([...newQuizList]);
    }
    toast.success("저장되었습니다");
  };

  const handleShowImage = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    //리스트에 있는 이미지 클릭시 대표이미지 변경 및 정답, 이미지 출처 보여주기
    const quizIndex = e.currentTarget.parentElement?.id;
    if (quizIndex) {
      setShowImageIndex(Number(quizIndex));
      setShowImage(quizList[Number(quizIndex)].image);
      setAnswer(quizList[Number(quizIndex)].answer);
      setSource(quizList[Number(quizIndex)].source);
    }
  };

  const handleCancel = (e: React.MouseEvent<SVGAElement, MouseEvent>) => {
    const quizIndex = e.currentTarget.parentElement?.id;
    if (quizIndex) {
      setQuizList(quizList.filter((quiz, index) => index != Number(quizIndex)));
      setNewQuizList(
        newQuizList.filter((quiz, index) => index != Number(quizIndex))
      );
      setUploadFileList(
        uploadFileList.filter((uploadFile, index) => index != Number(quizIndex))
      );

      if (quizIndex !== "0" && quizList.length > 1) {
        setShowImage(quizList[Number(quizIndex) - 1].image);
        setShowImageIndex(Number(quizIndex) - 1);
        setAnswer(quizList[Number(quizIndex) - 1].answer);
        setSource(quizList[Number(quizIndex) - 1].source);
      } else if (quizIndex == "0" && quizList.length > 1) {
        setShowImage(quizList[1].image);
        setShowImageIndex(0);
        setAnswer(quizList[1].answer);
        setSource(quizList[1].source);
      } else {
        setShowImageIndex(null);
      }
    }
  };

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files == null) {
      console.log("file error");
      return;
    }
    setUploadFileList([...uploadFileList, e.target.files[0]]); //storage에 추가하기위한 file 변수
    const reader = new FileReader();

    reader.readAsDataURL(e.target.files[0]);

    reader.onload = () => {
      if (reader.readyState === 2) {
        setQuizList([
          ...quizList,
          { image: String(reader.result), answer: "", source: "" },
        ]);
        setNewQuizList([
          ...newQuizList,
          { image: String(reader.result), answer: "", source: "" },
        ]);
        setShowImage(String(reader.result));
        setShowImageIndex(quizList.length);
        setAnswer("");
        setSource("");
      }
    };
    e.target.value = "";
  };

  return (
    <div className="w-full min-h-[calc(100vh-120px)] font-bold flex flex-col items-center justify-around">
      <form
        onSubmit={handleSubmitDB}
        className="w-full max-w-[1000px] flex sm:flex-row justify-between items-center mb-6 sm:m-8 px-4 md:px-0"
      >
        <div className="w-[80px] sm:w-[120px]">
          <FaArrowLeft size="30px" />
        </div>
        <div className="text-[24px] sm:text-[32px] lg:text-[40px]">
          퀴즈 만들기
        </div>
        <button
          type="submit"
          className="w-[80px] sm:w-[120px] h-[40px] sm:h-[50px] text-[16px] sm:text-[20px]  bg-[#222222] hover:bg-black rounded-xl text-white"
        >
          업로드
        </button>
      </form>
      <div className="w-full max-w-[1000px] flex flex-col lg:flex-row justify-center items-center mb-4">
        <div className="w-full max-w-[600px] lg:mr-10 mb-6 lg:mb-0 flex flex-col justify-center items-center lg:items-start">
          <div className="relative w-[300px] sm:w-[400px] lg:w-[500px] h-[300px] sm:h-[400px] lg:h-[500px] border-4 flex justify-center items-center z-0">
            {quizList.length != 0 ? (
              <Image src={showImage} fill alt="이미지" />
            ) : (
              <CiImageOff size="24px" />
            )}
          </div>
          <div className="w-[300px] sm:w-[400px] lg:w-[500px] sm h-[100px] flex justify-start items-center mt-4">
            <label
              htmlFor="file"
              className="w-[60px] sm:w-[80px] h-[60px] sm:h-[80px] mr-1 flex items-center justify-center"
            >
              <BsPlusSquare size="75px" color="#e5e7eb" />
            </label>
            <input
              id="file"
              type="file"
              className="hidden"
              onChange={handleImage}
              accept="image/*"
            />
            <div className="w-full overflow-x-auto h-[80px] sm:h-[100px] flex items-center">
              {quizList.length != 0
                ? quizList.map((quiz, idx) => {
                    return (
                      <div
                        id={String(idx)}
                        key={idx}
                        className="relative w-[60px] sm:w-[80px] h-[60px] sm:h-[80px] flex-[0_0_auto] border-2 mx-1"
                      >
                        <Image
                          key={idx}
                          onClick={handleShowImage}
                          src={quiz.image}
                          fill
                          alt="이미지"
                        />
                        <MdOutlineCancel
                          onClick={handleCancel}
                          className="absolute hover:text-red-600 right-0"
                        />
                      </div>
                    );
                  })
                : null}
            </div>
          </div>
        </div>
        <form
          onSubmit={handleAnswerAndSource}
          className="w-[100%] max-w-[500px] lg:ml-10 flex flex-col justify-center items-center"
        >
          <div className="mb-10">
            <label
              htmlFor="answer"
              className="inline-block w-[100px] sm:w-[120px] text-[16px] sm:text-[20px] mr-4 text-center"
            >
              정답
            </label>
            <input
              onChange={(e) => {
                setAnswer(e.target.value);
              }}
              className="w-[200px] sm:w-[250px] text-[16px] p-1 border-0 bg-[#f2f2f2] rounded-lg mb-3"
              id="answer"
              type="text"
              value={quizList.length != 0 ? answer : ""}
            />
          </div>
          <div className="mb-8 sm:mb-14">
            <label
              htmlFor="answer"
              className="inline-block w-[100px] sm:w-[120px] text-[16px] sm:text-[20px] mr-4 text-center"
            >
              이미지 출처
            </label>
            <input
              onChange={(e) => {
                setSource(e.target.value);
              }}
              className="w-[200px] sm:w-[250px] text-[16px] p-1 border-0 bg-[#f2f2f2] rounded-lg mb-3"
              id="answer"
              type="text"
              value={quizList.length != 0 ? source : ""}
            />
          </div>
          <button
            type="submit"
            className="w-[100px] sm:w-[120px] bg-[#222222] hover:bg-black rounded-xl py-2 px-3 text-white"
          >
            저장하기
          </button>
        </form>
      </div>
    </div>
  );
};

export default Create;
