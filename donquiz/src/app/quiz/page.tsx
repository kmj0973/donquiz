// app/quiz/page.tsx
import { db } from "../../../firebase/firebasedb";
import { doc, getDoc } from "firebase/firestore";
import Quiz from "@/containers/quiz";

interface QuizList {
  quizList: QuizData;
}

interface QuizData {
  answer: string;
  image: string;
  source: string;
}

// 🔥 서버에서 URL 파라미터를 가져오는 함수 (app router 방식)
export default async function QuizPage({
  searchParams,
}: {
  searchParams: { [key: string]: string };
}) {
  const userId = searchParams.userId;
  const quizId = searchParams.quizId;

  if (!userId || !quizId) return <p>잘못된 접근입니다.</p>;

  // ✅ 서버에서 Firestore 데이터 가져오기
  const docRef = doc(db, `users/${userId}/quizList/${quizId}`);
  const docData = await getDoc(docRef);

  if (!docData.exists()) return <p>퀴즈를 찾을 수 없습니다.</p>;

  const quizData: QuizList[] = docData
    .data()
    .quizList.map((quiz: QuizData) => ({
      quizList: quiz,
    }));

  return <Quiz quizList={quizData} />;
}
