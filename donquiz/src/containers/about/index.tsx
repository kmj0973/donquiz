"use client";

import { useState } from "react";
import { RxCross2 } from "react-icons/rx";

const About = () => {
  const [rotate, setRotate] = useState([false, false, false]);

  const handleRotate = (index: number) => {
    setRotate((prev) => prev.map((item, i) => (i === index ? !item : item)));
  };

  return (
    <div className="flex flex-col justify-start items-center h-[calc(100vh-120px)] z-30 pt-10">
      <div className="font-bold text-[50px] text-[#333333] pb-10">About</div>
      <div className="max-w-[1000px] w-full h-full px-4">
        <div className="w-full h-auto bg-[#f2f2f2] rounded-3xl pt-1 pl-2">
          <div
            onClick={() => handleRotate(0)}
            className="flex p-2 text-lg border-b-[1px] font-bold my-2 cursor-pointer"
          >
            <div
              className="flex items-start justify-center
            pr-4 pt-1"
            >
              <div
                className={`transition-transform duration-300 ease-in-out ${
                  rotate[0] ? "rotate-[-45deg]" : ""
                }`}
              >
                <RxCross2 color="#666666" />
              </div>
            </div>
            <div className="mb-2">
              <div className=" text-[#333333]">로그인, 회원가입 가이드</div>
              <div
                className={`text-[#666666] transition-all duration-500 ease-in-out overflow-hidden ${
                  rotate[0] ? "max-h-0" : "mt-4 max-h-52"
                }`}
              >
                1. 카카오톡과 이메일로 회원가입이 가능 <br /> 2. 이메일
                회원가입은 닉네임과 이메일, 비밀번호를 입력
                <br />
                3. 카카오톡 회원가입은 이메일과 닉네임 수집을 동의하면
                회원가입이 가능
              </div>
            </div>
          </div>
          <div
            onClick={() => handleRotate(1)}
            className="flex p-2 text-lg border-b-[1px] font-bold my-2 cursor-pointer"
          >
            <div
              className="flex items-start justify-center
            pr-4 pt-1"
            >
              <div
                className={`transition-transform duration-300 ease-in-out ${
                  rotate[1] ? "rotate-[-45deg]" : ""
                }`}
              >
                <RxCross2 color="#666666" />
              </div>
            </div>
            <div className="mb-2">
              <div className="text-[#333333]">퀴즈 풀기 가이드</div>
              <div
                className={`text-[#666666] transition-all duration-500 ease-in-out overflow-hidden ${
                  rotate[1] ? "max-h-0" : "mt-4 max-h-52"
                }`}
              >
                1. 퀴즈 리스트에서 시작하기 버튼을 누르면 퀴즈 페이지로 이동
                <br />
                2. 상단에는 출처와, 퀴즈 개수 확인 가능
                <br />
                3. 답을 입력하여 퀴즈 풀기
                <br />
                4. 퀴즈를 다 풀면 2초 후 퀴즈 결과 확인 가능
              </div>
            </div>
          </div>
          <div
            onClick={() => handleRotate(2)}
            className="flex p-2 text-lg font-bold my-2 cursor-pointer"
          >
            <div
              className="flex items-start justify-center
            pr-4 pt-1"
            >
              <div
                className={`transition-transform duration-300 ease-in-out ${
                  rotate[2] ? "rotate-[-45deg]" : ""
                }`}
              >
                <RxCross2 color="#666666" />
              </div>
            </div>
            <div className="mb-2">
              <div className=" text-[#333333]">퀴즈 만들기 가이드</div>
              <div
                className={`text-[#666666] transition-all duration-500 ease-in-out overflow-hidden ${
                  rotate[2] ? "max-h-0" : "mt-4 max-h-52"
                }`}
              >
                1. 제목과 썸네일 등록 후 생성하기 버튼 클릭
                <br />
                2. 퀴즈 이미지를 넣고 정답과 출처 입력 후 저장하기 (문제 최소
                3개 이상)
                <br />
                3. 업로드 버튼 누르면 퀴즈 업로드 성공
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
