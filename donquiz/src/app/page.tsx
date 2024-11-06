import { collection, getDocs } from "firebase/firestore";
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
        collection(db, `users/${userId}/quizList`)
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

  return quizzes.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
};

const HomePage = async () => {
  const quizzes = await fetchUserQuizLists();

  return (
    <div className="w-full h-full font-bold flex flex-col items-center justify-center">
      <div className="text-[32px] sm:text-[40px] lg:text-[52px] my-4 sm:my-8">
        Quiz List
      </div>
      <QuizList initialQuizzes={quizzes} />
    </div>
  );
};

export default HomePage;
