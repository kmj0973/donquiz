"use client";

import { FaArrowLeft } from "react-icons/fa6";
import { BsPlusSquare } from "react-icons/bs";
import { CiImageOff } from "react-icons/ci";
import { MdOutlineCancel } from "react-icons/md";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import Image from "next/image";
import toast from "react-hot-toast";
import { usePathname, useRouter } from "next/navigation";
import { doc, updateDoc } from "firebase/firestore";
import { db, storage } from "../../../firebase/firebasedb";
import { useAuthStore } from "@/hooks/useAuthStore";
import { ref, uploadBytes } from "firebase/storage";

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
  const router = useRouter();

  const [uploadFileList, setUploadFileList] = useState<File[]>([]); //현재 추가한 이미지
  const [newQuizList, setNewQuizList] = useState<QuizList[]>([]);

  const [showImage, setShowImage] = useState<string>("");
  const [quizList, setQuizList] = useState<QuizList[]>([]);

  const [answer, setAnswer] = useState<string>("");
  const [source, setSource] = useState<string>("");

  const [showImageIndex, setShowImageIndex] = useState<number | null>();

  const handleSubmitDB = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (quizList.length < 3) {
      toast.error("문제를 3개 이상 등록해주세요", {
        duration: 3000,
      });
      return;
    }

    if (uid && docId) {
      const docRef = doc(db, "users", uid, "quizList", docId);

      uploadFileList.map((uploadFile, index) => {
        const uploadFileName = uuidv4(); //이미지 파일 랜덤 이름 주기
        console.log(uploadFileName);

        const imageRef = ref(storage, `images/${uploadFileName}`); //파이어스토리지에 저장
        uploadBytes(imageRef, uploadFile);

        newQuizList[index].image = uploadFileName;
        setNewQuizList(newQuizList);
      });

      toast.promise(
        updateDoc(docRef, {
          quizList: newQuizList,
        }),
        {
          loading: "Saving...",
          success: () => {
            router.replace("/");
            return <b>Settings saved!</b>;
          },
          error: <b>Could not save.</b>,
        }
      );
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
      console.log("error");
      return;
    }
    setUploadFileList([...uploadFileList, e.target.files[0]]); //storage에 추가하기위한 file 변수
    const reader = new FileReader();

    reader.readAsDataURL(e.target.files[0]);

    reader.onload = (e) => {
      if (reader.readyState === 2) {
        setQuizList([
          ...quizList,
          { image: String(e.target!.result), answer: "", source: "" },
        ]);
        setNewQuizList([
          ...newQuizList,
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
              accept=".jpg, .jpeg, .png"
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
