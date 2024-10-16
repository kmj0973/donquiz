"use client";

import { FaArrowLeft } from "react-icons/fa6";
import { BsPlusSquare } from "react-icons/bs";
import { CiImageOff } from "react-icons/ci";
const Create = () => {
  return (
    <div className="w-full h-[calc(100vh-120px)] font-bold flex flex-col items-center justify-around">
      <div className="w-[90%] flex justify-between items-center ">
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
      </div>
      <div className="w-[90%] h-[600px] flex justify-center">
        <div className="w-[100%] max-w-[600px] mr-10">
          <div className="h-[500px] border-4 flex justify-center items-center">
            <CiImageOff size="24px" />
          </div>
          <div className="h-[100px] flex justify-around items-center">
            <div className="w-[80px] h-[80px] mr-1 flex items-center justify-center">
              <BsPlusSquare size="75px" color="#e5e7eb" />
            </div>
            <div className="w-[70%] overflow-x-auto h-[100px] flex items-center">
              <div className="w-[80px] h-[80px] flex-[0_0_auto] border-2 mx-1"></div>
              <div className="w-[80px] h-[80px] flex-[0_0_auto] border-2 mx-1"></div>
              <div className="w-[80px] h-[80px] flex-[0_0_auto] border-2 mx-1"></div>
              <div className="w-[80px] h-[80px] flex-[0_0_auto] border-2 mx-1"></div>
              <div className="w-[80px] h-[80px] flex-[0_0_auto] border-2 mx-1"></div>
            </div>
          </div>
        </div>
        <div className="w-[100%] max-w-[500px] ml-10 flex flex-col justify-center items-center">
          <div className="mb-10">
            <label
              htmlFor="answer"
              className="inline-block w-[120px] text-[20px] mr-4 text-center"
            >
              정답
            </label>
            <input
              className="w-[250px] text-[18px] p-1 border-0 bg-[#f2f2f2] rounded-lg mb-3"
              id="answer"
              type="text"
            />
          </div>
          <div className="mb-10">
            <label
              htmlFor="answer"
              className="inline-block w-[120px] text-[20px] mr-4 text-center"
            >
              이미지 출처
            </label>
            <input
              className="w-[250px] text-[18px] p-1 border-0 bg-[#f2f2f2] rounded-lg mb-3"
              id="answer"
              type="text"
            />
          </div>
          <div className="mb-10">
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
          </div>
          <button
            type="submit"
            className="w-[120px] bg-[#222222] hover:bg-black rounded-xl py-2 px-3 text-white"
          >
            저장하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default Create;
