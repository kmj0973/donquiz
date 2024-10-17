"use client";

import { FaArrowLeft } from "react-icons/fa6";
import { BsPlusSquare } from "react-icons/bs";
import { CiImageOff } from "react-icons/ci";
import { MdOutlineCancel } from "react-icons/md";
import { useState } from "react";
import Image from "next/image";

const Create = () => {
  const [uploadFile, setUploadFile] = useState<File | null>(); //현재 추가한 이미지

  const [showImage, setShowImage] = useState<string>("");
  const [imageList, setImageList] = useState<string[]>([]);
  const [answerList, setAnswerList] = useState<string[]>([]);
  const [sourceList, setSourceList] = useState<string[]>([]);

  const [answer, setAnswer] = useState<string>("");
  const [source, setSource] = useState<string>("");

  const [showImageIndex, setShowImageIndex] = useState<string | null>();

  const handleAnswerAndSource = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (answer == "" || source == "") {
      console.log("정답과 출처를 작성해주세요");
      return;
    }

    setAnswerList([...answerList, answer]);
    setSourceList([...sourceList, source]);
  };

  const handleShowImage = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    //리스트에 있는 이미지 클릭시 대표이미지 변경 및 정답, 이미지 출처 보여주기
    console.log(e.currentTarget.parentElement?.id);
    const imageIndex = e.currentTarget.parentElement?.id;
    if (imageIndex) {
      setShowImageIndex(imageIndex);
      setShowImage(imageList[Number(imageIndex)]);
    }
  };

  const handleCancel = (e: React.MouseEvent<SVGAElement, MouseEvent>) => {
    console.log(e.currentTarget.parentElement?.id);
    const imageIndex = e.currentTarget.parentElement?.id;
    if (imageIndex) {
      // if (imageIndex !== "0") setShowImage(imageList[0]);
      // else setShowImage("");

      setImageList(imageList.filter((image, idx) => idx != Number(imageIndex)));
    }
  };

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files == null) {
      console.log("error");
      return;
    }
    setUploadFile(e.target.files[0]);
    console.log("upload");
    const reader = new FileReader();

    reader.readAsDataURL(e.target.files[0]);

    reader.onload = (e) => {
      if (reader.readyState === 2) {
        setShowImage(String(e.target!.result));
        setImageList([...imageList, String(e.target!.result)]);
      }
    };
  };

  return (
    <div className="w-full h-[calc(100vh-120px)] font-bold flex flex-col items-center justify-around">
      <form className="w-[90%] flex justify-between items-center ">
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
          <div className="relative h-[500px] border-4 flex justify-center items-center">
            {showImage != "" ? (
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
              {imageList.map((image, idx) => {
                return (
                  <div
                    id={String(idx)}
                    key={idx}
                    className="relative w-[80px] h-[80px] flex-[0_0_auto] border-2 mx-1"
                  >
                    <Image
                      key={idx}
                      onClick={handleShowImage}
                      src={image}
                      fill
                      alt="이미지"
                    />
                    <MdOutlineCancel
                      onClick={handleCancel}
                      className="absolute hover:text-red-600 right-0"
                    />
                  </div>
                );
              })}
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
            />
          </div>
          {/* <div className="mb-10">
            <label
              htmlFor="answer"
              className="inline-block w-[120px] text-[20px] mr-4 text-center"
            >
              제한 시간(초)
            </label>
            <input
              className="w-[250px] text-[18px] p-1 border-0 bg-[#f2f2f2] rounded-lg mb-3"
              id="answer"
              type="text"
            />
          </div> */}
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
