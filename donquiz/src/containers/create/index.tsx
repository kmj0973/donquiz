"use client";

import { FaArrowLeft } from "react-icons/fa6";
import { BsPlusSquare } from "react-icons/bs";
import { CiImageOff } from "react-icons/ci";
import { MdOutlineCancel } from "react-icons/md";
import { useState } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import { usePathname } from "next/navigation";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../../firebase/firebasedb";
import { useAuthStore } from "@/hooks/useAuthStore";

interface QuizList {
  image: string;
  answer: string;
  source: string;
}

const Create = () => {
  const docId = usePathname().slice(8); //documnet id
  const uid = useAuthStore((state) => state.uid); //user id

  const [uploadFile, setUploadFile] = useState<File | null>(); //현재 추가한 이미지

  const [showImage, setShowImage] = useState<string>("");
  const [quizList, setQuizList] = useState<QuizList[]>([]);

  const [answer, setAnswer] = useState<string>("");
  const [source, setSource] = useState<string>("");

  const [showImageIndex, setShowImageIndex] = useState<number | null>();

  const handleSubmitDB = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(docId);
    if (uid && docId) {
      const docRef = doc(db, "users", uid, "quizList", docId);
      console.log(docRef.id);

      await updateDoc(docRef, {
        quizList: quizList,
      });
    }
  };

  const handleAnswerAndSource = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("퀴즈리스트:", quizList);
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
      console.log("error");
      return;
    }
    setUploadFile(e.target.files[0]); //storage에 추가하기위한 file 변수
    const reader = new FileReader();

    reader.readAsDataURL(e.target.files[0]);

    reader.onload = (e) => {
      if (reader.readyState === 2) {
        setQuizList([
          ...quizList,
          { image: String(e.target!.result), answer: "", source: "" },
        ]);
        setShowImage(String(e.target!.result));
        setShowImageIndex(quizList.length);
        setAnswer("");
        setSource("");
      }
    };
  };

  return (
    <div className="w-full h-[calc(100vh-120px)] font-bold flex flex-col items-center justify-around">
      <form
        onSubmit={handleSubmitDB}
        className="w-[90%] flex justify-between items-center "
      >
        <div>
          <FaArrowLeft size="30px" />
        </div>
        <div className="text-[40px]">퀴즈 만들기</div>
        <button
          type="submit"
          className="w-[90px] h-[50px] text-[20px]  bg-[#222222] hover:bg-black rounded-xl text-white"
        >
          업로드
        </button>
      </form>
      <div className="w-[90%] h-[600px] flex justify-center mb-4">
        <div className="w-[100%] max-w-[600px] mr-10">
          <div className="relative h-[500px] border-4 flex justify-center items-center z-0">
            {quizList.length != 0 ? (
              <Image src={showImage} fill alt="이미지" />
            ) : (
              <CiImageOff size="24px" />
            )}
          </div>
          <div className="h-[100px] flex justify-around items-center">
            <label
              htmlFor="file"
              className="w-[80px] h-[80px] mr-1 flex items-center justify-center"
            >
              <BsPlusSquare size="75px" color="#e5e7eb" />
            </label>
            <input
              id="file"
              type="file"
              className="hidden"
              onChange={handleImage}
            />
            <div className="w-[70%] overflow-x-auto h-[100px] flex items-center">
              {quizList.length != 0
                ? quizList.map((quiz, idx) => {
                    return (
                      <div
                        id={String(idx)}
                        key={idx}
                        className="relative w-[80px] h-[80px] flex-[0_0_auto] border-2 mx-1"
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
          className="w-[100%] max-w-[500px] ml-10 flex flex-col justify-center items-center"
        >
          <div className="mb-10">
            <label
              htmlFor="answer"
              className="inline-block w-[120px] text-[20px] mr-4 text-center"
            >
              정답
            </label>
            <input
              onChange={(e) => {
                setAnswer(e.target.value);
              }}
              className="w-[250px] text-[18px] p-1 border-0 bg-[#f2f2f2] rounded-lg mb-3"
              id="answer"
              type="text"
              value={quizList.length != 0 ? answer : ""}
            />
          </div>
          <div className="mb-14">
            <label
              htmlFor="answer"
              className="inline-block w-[120px] text-[20px] mr-4 text-center"
            >
              이미지 출처
            </label>
            <input
              onChange={(e) => {
                setSource(e.target.value);
              }}
              className="w-[250px] text-[18px] p-1 border-0 bg-[#f2f2f2] rounded-lg mb-3"
              id="answer"
              type="text"
              value={quizList.length != 0 ? source : ""}
            />
          </div>
          <button
            type="submit"
            className="w-[120px] bg-[#222222] hover:bg-black rounded-xl py-2 px-3 text-white"
          >
            저장하기
          </button>
        </form>
      </div>
    </div>
  );
};

export default Create;
