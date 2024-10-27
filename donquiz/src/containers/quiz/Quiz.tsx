"use client";

import Image from "next/image";
import { useState } from "react";
import { BiSolidRightArrowSquare } from "react-icons/bi";
import { FaArrowRight } from "react-icons/fa";
import { useSearchParams } from "next/navigation";
import Loading from "@/app/loading";
import X from "../../../public/image/X.png";
import O from "../../../public/image/O.png";
import ResultDialog from "./ResultDialog";
import toast from "react-hot-toast";
import {
  useFetchQuizData,
  useUpdateParticipantCount,
} from "./hooks/useFetchQuizData";

const QuizComponents = () => {
  const [answer, setAnswer] = useState<string>("");
  const [rightCount, setRightCount] = useState<number>(0);
  const [isAnswer, setIsAnswer] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false); //last result page loading
  const [targetIndex, setTargetIndex] = useState<number>(0); //타겟인 배열 인덱스

  const params = useSearchParams();
  const userId = params.get("userId") ?? "";
  const quizId = params.get("quizId") ?? "";
  const title = params.get("title") ?? "";

  const { data: quizArray = [], isLoading: loading } = useFetchQuizData(
    userId,
    quizId
  );
  const updateParticipantMutation = useUpdateParticipantCount(userId, quizId);

  if (loading) {
    return <Loading />;
  }

  const handleIsAnswer = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (answer == "") {
      toast.error("정답을 입력해주세요", { duration: 2000 });
      return;
    }

    const quiz = quizArray[targetIndex];
    if (
      quiz.quizList.answer.replace(/(\s*)/g, "").toUpperCase() ==
      answer.replace(/(\s*)/g, "").toUpperCase()
    ) {
      setIsAnswer(true);
      setRightCount(rightCount + 1);
      setAnswer("");
    } else {
      setIsAnswer(false);
      setAnswer("");
    }

    if (quizArray.length == targetIndex + 1) {
      //미지막문제 시
      updateParticipantMutation.mutate();
      setIsLoading(false);
      setTimeout(() => {
        setIsLoading(true);
      }, 1500); // 2000ms = 2초
    }
  };

  const handleNextQuiz = () => {
    setTargetIndex(targetIndex + 1);
    setAnswer("");
    setIsAnswer(null);
    setIsLoading(false);
  };

  return (
    <>
      {quizArray.length == targetIndex + 1 && isLoading ? (
        <ResultDialog
          rightCount={rightCount}
          wrongCount={quizArray.length - rightCount}
        />
      ) : null}
      <div className="text-[32px] sm:text-[40px] lg:text-[48px] my-4 sm:my-8">
        {title}
      </div>
      <div className="flex items-center justify-between w-full max-w-[500px] mb-4 text-center sm:text-left ">
        <div className="text-[#999999] text-[14px] sm:text-base mb-2 sm:mb-0 ">
          {quizArray[targetIndex].quizList.source.length > 40
            ? `${quizArray[targetIndex].quizList.source.slice(0, 40)}...`
            : quizArray[targetIndex].quizList.source}
        </div>
        <div className="text-[14px] sm:text-base">
          {targetIndex + 1}/{quizArray.length}
        </div>
      </div>
      <div className="relative w-full max-w-[400px] sm:max-w-[500px] h-[300px] sm:h-[400px] md:h-[500px] mb-6">
        <Image
          src={quizArray[targetIndex].imageUrl}
          alt={quizArray[targetIndex].quizList.source}
          fill
          priority
          loading="eager"
          className="rounded-lg"
        />
        {isAnswer == true && (
          <div className="animate-pulse absolute inset-0 flex justify-center items-center">
            <Image src={O} alt="맞음" width={250} height={250} />
          </div>
        )}
        {isAnswer == false && (
          <div className="animate-pulse absolute inset-0 flex justify-center items-center">
            <Image src={X} alt="맞음" width={250} height={250} />
          </div>
        )}
      </div>
      <form
        onSubmit={handleIsAnswer}
        className="border-2 mb-4 flex w-full max-w-[400px] sm:max-w-[500px] hover:border-black "
      >
        <input
          onChange={(e) => {
            setAnswer(e.target.value);
          }}
          className="px-2 py-1 w-full outline-none text-sm sm:text-base"
          type="text"
          placeholder="정답을 입력해주세요"
          value={answer}
        />
        <button
          type="submit"
          className="px-2 flex justify-center items-center bg-black text-white"
        >
          <FaArrowRight size="20" />
        </button>
      </form>
      <div className="flex flex-col justify-center items-center h-[100px]">
        {isAnswer != null ? (
          <>
            <div className="text-red-500 mb-1 text-sm sm:text-base">
              답 : {quizArray[targetIndex].quizList.answer}
            </div>
            {targetIndex + 1 != quizArray.length && (
              <button onClick={handleNextQuiz} className="mb-4">
                <BiSolidRightArrowSquare size="26" />
              </button>
            )}
          </>
        ) : null}
      </div>
    </>
  );
};

export default QuizComponents;
