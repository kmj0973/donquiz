import { useQuery } from "@tanstack/react-query";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { getDownloadURL, ref } from "firebase/storage";
import { db, storage } from "../../../../firebase/firebasedb";

interface QuizList {
  imageUrl: string;
  quizList: Quiz;
}

interface Quiz {
  participant: number;
  quizId: string;
  quizList: [];
  thumbnail: string;
  title: string;
}

const fetchUserData = async (uid: string) => {
  const userRef = doc(db, `users/${uid}`);
  const userDataDoc = await getDoc(userRef);
  const userPoint = userDataDoc.exists() ? userDataDoc.data().point : 0;

  const quizListRef = collection(db, `users/${uid}/quizList`);
  const quizListData = await getDocs(quizListRef);

  const fetchedQuizList: QuizList[] = [];
  for (const quiz of quizListData.docs) {
    const quizData = quiz.data();
    let imageUrl = "";

    if (quizData.thumbnail) {
      const imageRef = ref(storage, `images/${quizData.thumbnail}`);
      imageUrl = await getDownloadURL(imageRef);
    }

    fetchedQuizList.push({
      imageUrl,
      quizList: {
        participant: quizData.participant,
        quizId: quizData.quizId,
        quizList: quizData.quizList,
        thumbnail: quizData.thumbnail,
        title: quizData.title,
      },
    });
  }

  return { userPoint, quizList: fetchedQuizList };
};

export const useFetchUserData = (uid: string) => {
  return useQuery({
    queryKey: ["userData", uid],
    queryFn: () => fetchUserData(uid),
    enabled: !!uid, // 쿼리가 uid가 유효할 때만 실행되도록 설정
  });
};
