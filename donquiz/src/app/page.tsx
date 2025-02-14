import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../../firebase/firebasedb";
import QuizList from "@/containers/home";

interface Quiz {
  userId: string;
  quizId: string;
  createdAt: Date;
  title: string;
  imageUrl: string;
  participant: number;
  quizList: string[];
}

const fetchUserQuizLists = async (): Promise<Quiz[]> => {
  const usersSnapshot = await getDocs(collection(db, "users"));
  const quizzes: Quiz[] = [];

  await Promise.all(
    usersSnapshot.docs.map(async (userDoc) => {
      const userId = userDoc.id;
      const quizListSnapshot = await getDocs(
        query(
          collection(db, `users/${userId}/quizList`),
          orderBy("createdAt", "desc")
        )
      );

      quizListSnapshot.docs.forEach((quizDoc) => {
        const quizData = quizDoc.data();
        quizzes.push({
          userId: userId,
          quizId: quizDoc.id,
          createdAt: quizData.createdAt.toDate(), // toDate()로 변환하여 Date 타입으로 변환
          title: quizData.title,
          imageUrl: quizData.thumbnail || "",
          participant: quizData.participant,
          quizList: quizData.quizList,
        });
      });
    })
  );

  return quizzes;
};

// ✅ SSR에서 초기 데이터를 가져옴
const HomePage = async () => {
  const initialQuizzes = await fetchUserQuizLists();

  return (
    <div className="w-full h-full font-bold flex flex-col items-center justify-center pt-12">
      <QuizList initialQuizzes={initialQuizzes} /> {/* 초기 데이터 전달 */}
    </div>
  );
};

export const dynamic = "force-dynamic";

export default HomePage;
