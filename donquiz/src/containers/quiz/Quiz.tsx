"use client";

import { doc, getDoc } from "firebase/firestore";
import Image from "next/image";
import { useEffect, useState } from "react";
import { BiSolidRightArrowSquare } from "react-icons/bi";
import { FaArrowRight } from "react-icons/fa";
import { db, storage } from "../../../firebase/firebasedb";
import { usePathname, useSearchParams } from "next/navigation";
import { getDownloadURL, ref } from "firebase/storage";
import Link from "next/link";
import Loading from "@/app/loading";
import X from "../../../public/image/X.png";
import O from "../../../public/image/O.png";
import ResultDialog from "./ResultDialog";

interface Quiz {
  imageUrl: string;
  quizList: QuizObject;
}

interface QuizObject {
  answer: string;
  image: string;
  source: string;
}

const QuizComponents = () => {
  const [quizArray, setQuizArray] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true); //fetch loading
  const [answer, setAnswer] = useState<string>("");
  const [isAnswer, setIsAnswer] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(false); //last result page loading

  const params = useSearchParams();
  const pathIndex = Number(usePathname().slice(6, 7));

  const userId = params.get("userId");
  const quizId = params.get("quizId");
  const title = params.get("title");

  useEffect(() => {
    // 첫 렌더링 시에 fetch하여 배열에 퀴즈 정보 저장
    const fetchQuizData = async () => {
      const fetchedQuizData: Quiz[] = [];
      try {
        const docRef = doc(db, `users/${userId}/quizList/${quizId}`);
        const docData = await getDoc(docRef); // quizList 컬렉션에서 quizId에 맞는 데이터 가져옴

        if (docData.exists()) {
          const quizData = docData.data();

          // 이미지가 있다면 Firebase Storage에서 다운로드 URL을 가져옴
          for (const quiz of quizData.quizList) {
            let imageUrl = "";
            if (quiz.image) {
              const imageRef = ref(storage, `images/${quiz.image}`);
              imageUrl = await getDownloadURL(imageRef);
            }

            fetchedQuizData.push({
              imageUrl, // 이미지 URL
              quizList: quiz, // 퀴즈 데이터
            });
          }
        }

        setQuizArray(fetchedQuizData);
      } catch (error) {
        console.error("Error fetching quiz data:", error);
      } finally {
        setLoading(false); // 로딩 완료
      }
    };

    fetchQuizData();
  }, [userId, quizId]);

  if (loading) {
    return <Loading />;
  }

  const handleIsAnswer = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const quiz = quizArray.filter((quiz, index) => index + 1 == pathIndex)[0];
    if (
      quiz.quizList.answer.replace(/(\s*)/g, "").toUpperCase() ==
      answer.replace(/(\s*)/g, "").toUpperCase()
    ) {
      setIsAnswer(true);
    } else {
      setIsAnswer(false);
    }

    if (quizArray.length == pathIndex) {
      //미지막문제 시
      setIsLoading(false);
      setTimeout(() => {
        setIsLoading(true);
      }, 1500); // 2000ms = 2초
    }
  };

  const handleNextQuiz = (e: React.MouseEvent<HTMLButtonElement>) => {
    console.log(e);
  };

  return (
    <>
      {quizArray.length == pathIndex && isLoading ? <ResultDialog /> : null}
      <div className="text-[48px] my-8">{title}</div>
      {quizArray.map((quiz, index) => {
        if (Number(pathIndex) == index + 1)
          return (
            <>
              <div className="flex items-center justify-between min-w-[500px]">
                <div className="text-[#999999] ">
                  출처 : {quiz.quizList.source}
                </div>
                <div>
                  {pathIndex}/{quizArray.length}
                </div>
              </div>
              <div className="relative min-w-[500px] min-h-[500px] mb-8">
                <Image src={quiz.imageUrl} alt={quiz.quizList.source} fill />

                {isAnswer == true && (
                  <div className="absolute min-w-[500px] min-h-[500px] flex justify-center items-center">
                    <Image src={O} alt="맞음" width={350} height={350} />
                  </div>
                )}
                {isAnswer == false && (
                  <div className="absolute min-w-[500px] min-h-[500px] flex justify-center items-center">
                    <Image src={X} alt="맞음" width={350} height={350} />
                  </div>
                )}
              </div>
              <form
                onSubmit={handleIsAnswer}
                className="border-2 mb-4 flex hover:border-black "
              >
                <input
                  onChange={(e) => {
                    setAnswer(e.target.value);
                  }}
                  className="px-2 py-1 w-[464px] outline-none"
                  type="text"
                  placeholder="정답을 입력해주세요"
                  value={answer}
                />
                <button
                  type="submit"
                  className="px-2 flex justify-center items-center"
                >
                  <FaArrowRight size="" />
                </button>
              </form>
              <div className="flex flex-col justify-center items-center h-[100px]">
                {isAnswer != null && (
                  <>
                    <div className="text-red-500 mb-1">
                      답 : {quiz.quizList.answer}
                    </div>
                    <Link
                      className="mb-4"
                      href={{
                        pathname: `${Number(pathIndex) + 1}`,
                        query: {
                          userId: userId,
                          quizId: quizId,
                          title: title,
                        },
                      }}
                    >
                      <BiSolidRightArrowSquare size="26" />
                    </Link>
                  </>
                )}
                <button onClick={handleNextQuiz} className="mb-4">
                  <BiSolidRightArrowSquare size="26" />
                </button>
              </div>
            </>
          );
      })}
    </>
  );
};

export default QuizComponents;
