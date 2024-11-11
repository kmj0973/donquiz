"use client";

import { useState } from "react";
import { RxCross2 } from "react-icons/rx";

const About = () => {
  const [rotate, setRotate] = useState([true, true, true]);

  const handleRotate = (index: number) => {
    setRotate((prev) => prev.map((item, i) => (i === index ? !item : item)));
  };

  return (
    <div className="flex flex-col justify-start items-center h-auto min-h-[calc(100vh-120px)] z-30 pt-10">
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
                className={`text-[#666666] transition-all duration-300 ease-in-out overflow-hidden ${
                  rotate[0] ? "max-h-0" : "mt-4 max-h-80"
                }`}
              >
                1. 가입 방법: 카카오톡 또는 이메일로 회원가입이 가능합니다.
                <br />
                <br /> 2. 이메일 회원가입: 닉네임, 이메일, 비밀번호를 입력하여
                가입을 완료합니다.
                <br />
                <br />
                3. 카카오톡 회원가입: 이메일과 닉네임 정보 수집에 동의하면
                간편하게 회원가입을 진행할 수 있습니다.
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
                className={`text-[#666666] transition-all duration-300 ease-in-out overflow-hidden ${
                  rotate[1] ? "max-h-0" : "mt-4 max-h-80"
                }`}
              >
                1. 퀴즈 시작: 퀴즈 리스트에서 시작하기 버튼을 클릭하면 퀴즈
                페이지로 이동합니다.
                <br />
                <br />
                2. 퀴즈 정보 확인: 퀴즈 페이지 상단에서 출처와 총 퀴즈 개수를
                확인할 수 있습니다.
                <br />
                <br />
                3. 답변 입력: 각 문제의 답을 입력하여 퀴즈를 풀어보세요.
                <br />
                <br />
                4. 결과 확인: 퀴즈 완료 후 2초 후에 결과 확인 페이지로 자동
                이동됩니다.
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
                className={`text-[#666666] transition-all duration-300 ease-in-out overflow-hidden ${
                  rotate[2] ? "max-h-0" : "mt-4 max-h-80"
                }`}
              >
                1. 퀴즈 생성: 퀴즈 제목과 썸네일을 등록하고, 생성하기 버튼을
                클릭합니다.
                <br />
                <br />
                2. 문제 추가: 퀴즈 이미지를 추가하고, 각 문제의 정답과 출처를
                입력하여 저장합니다. (최소 3개의 문제 필요)
                <br />
                <br />
                3. 퀴즈 업로드: 모든 문제가 추가되면 업로드 버튼을 눌러 퀴즈를
                최종 업로드합니다.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
