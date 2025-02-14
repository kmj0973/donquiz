"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { BiSolidRightArrowSquare } from "react-icons/bi";
import { FaArrowRight } from "react-icons/fa";
import { useSearchParams } from "next/navigation";
import X from "../../../public/image/X.png";
import O from "../../../public/image/O.png";
import ResultDialog from "./ResultDialog";
import toast from "react-hot-toast";
import { useUpdateParticipantCount } from "./hooks/useFetchQuizData";

interface QuizList {
  quizList: QuizData;
}

interface QuizData {
  answer: string;
  image: string;
  source: string;
}

const QuizComponents = ({ quizList }: { quizList: QuizList[] }) => {
  const [answer, setAnswer] = useState<string>("");
  const [rightCount, setRightCount] = useState<number>(0);
  const [isAnswer, setIsAnswer] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false); // Last result page loading
  const [targetIndex, setTargetIndex] = useState<number>(0); // Target quiz index
  const [nextImageUrl, setNextImageUrl] = useState<string | null>(null); // Preloaded next image

  const params = useSearchParams();
  const userId = params.get("userId") ?? "";
  const quizId = params.get("quizId") ?? "";
  const title = params.get("title") ?? "";

  const updateParticipantMutation = useUpdateParticipantCount(userId, quizId);

  const nextButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    // 다음 문제로 넘어갈 때 버튼에 포커스를 자동으로 설정
    if (isAnswer !== null && nextButtonRef.current) {
      nextButtonRef.current.focus();
    }
  }, [targetIndex, isAnswer]);

  // ✅ 다음 문제의 이미지를 미리 로드하는 최적화된 `useEffect`
  useEffect(() => {
    if (targetIndex + 1 < quizList.length) {
      const nextImage = new window.Image();
      nextImage.src = quizList[targetIndex + 1].quizList.image;
      nextImage.onload = () => setNextImageUrl(nextImage.src);
    }
  }, [targetIndex, quizList]);

  const handleIsAnswer = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (answer == "") {
      toast.error("정답을 입력해주세요", { duration: 2000 });
      return;
    }

    const quiz = quizList[targetIndex];

    if (
      quiz.quizList.answer.replace(/(\s*)/g, "").toUpperCase() ===
      answer.replace(/(\s*)/g, "").toUpperCase()
    ) {
      setIsAnswer(true);
      setRightCount(rightCount + 1);
    } else {
      setIsAnswer(false);
    }

    if (quizList.length === targetIndex + 1) {
      // 마지막 문제 시
      updateParticipantMutation.mutate();
      setTimeout(() => {
        setIsLoading(true);
      }, 1500); // 1.5초 후 결과 페이지 로드
    }
  };

  const handleNextQuiz = () => {
    setTargetIndex(targetIndex + 1);
    setAnswer("");
    setIsAnswer(null);
  };

  return (
    <>
      {quizList.length === targetIndex + 1 && isLoading ? (
        <ResultDialog
          rightCount={rightCount}
          wrongCount={quizList.length - rightCount}
        />
      ) : null}
      <div className="text-[32px] sm:text-[40px] lg:text-[48px] my-4 sm:my-8">
        {title}
      </div>
      <div className="flex items-center justify-between w-full max-w-[500px] mb-4 text-center sm:text-left">
        <div className="text-[#999999] text-[14px] sm:text-base mb-2 sm:mb-0">
          {quizList[targetIndex].quizList.source.length > 40
            ? `${quizList[targetIndex].quizList.source.slice(0, 40)}...`
            : quizList[targetIndex].quizList.source}
        </div>
        <div className="text-[14px] sm:text-base">
          {targetIndex + 1}/{quizList.length}
        </div>
      </div>
      <div className="relative w-full max-w-[400px] sm:max-w-[500px] h-[300px] sm:h-[400px] md:h-[500px] mb-6">
        <Image
          src={quizList[targetIndex].quizList.image}
          alt={quizList[targetIndex].quizList.source}
          fill
          sizes="(max-width: 768px) 400, (max-width: 1200px) 500"
          priority
          className="rounded-lg"
        />
        {nextImageUrl && (
          <Image
            src={nextImageUrl}
            style={{ display: "none" }}
            fill
            sizes="(max-width: 768px) 400, (max-width: 1200px) 500"
            alt="preloaded"
          />
        )}
        {isAnswer === true && (
          <div className="animate-pulse absolute inset-0 flex justify-center items-center">
            <Image src={O} alt="맞음" width={250} height={250} />
          </div>
        )}
        {isAnswer === false && (
          <div className="animate-pulse absolute inset-0 flex justify-center items-center">
            <Image src={X} alt="틀림" width={250} height={250} />
          </div>
        )}
      </div>
      {isAnswer == null ? (
        <form
          onSubmit={handleIsAnswer}
          className="border-2 mb-4 flex w-full max-w-[400px] sm:max-w-[500px] hover:border-black"
        >
          <input
            onChange={(e) => {
              setAnswer(e.target.value);
            }}
            className="px-2 py-1 w-full outline-none text-sm sm:text-base"
            type="text"
            placeholder="정답을 입력해주세요"
            value={answer}
            autoFocus
          />
          <button
            type="submit"
            className="px-2 flex justify-center items-center bg-black text-white"
          >
            <FaArrowRight size="20" />
          </button>
        </form>
      ) : (
        <div className="flex flex-col justify-center items-center h-[55px]">
          <div className="text-red-500 mb-1 text-sm sm:text-base">
            답 : {quizList[targetIndex].quizList.answer}
          </div>
          {targetIndex + 1 !== quizList.length && (
            <button
              ref={nextButtonRef}
              onClick={handleNextQuiz}
              className="mb-4"
            >
              <BiSolidRightArrowSquare size="26" />
            </button>
          )}
        </div>
      )}
    </>
  );
};

export default QuizComponents;
