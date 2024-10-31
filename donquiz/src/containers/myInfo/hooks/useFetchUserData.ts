import { useQuery } from "@tanstack/react-query";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { getDownloadURL, ref } from "firebase/storage";
import { db, storage } from "../../../../firebase/firebasedb";

interface UserData {
  imageUrl: string;
  title: string;
  participant: number;
  quizList: [];
}

//user doc에서 포인트 가져오기
//그 후 uid를 이용해서 quizlist 가져오기
const fetchUserData = async (uid: string | null) => {
  const userRef = doc(db, `users/${uid}`);
  const userDataDoc = await getDoc(userRef);
  const userPoint = userDataDoc.exists() ? userDataDoc.data().point : null; //유저 점수 데이터

  const quizListRef = collection(userRef, "quizList");
  const quizListSnapshot = await getDocs(quizListRef); // getDocs로 전체 quizList 가져오기

  const fetchedQuizList: UserData[] = await Promise.all(
    quizListSnapshot.docs.map(async (quizDoc) => {
      const quizData = quizDoc.data();
      let imageUrl = "";

      if (quizData.thumbnail) {
        const imageRef = ref(storage, `images/${quizData.thumbnail}`);
        imageUrl = await getDownloadURL(imageRef); // 비동기 처리로 URL 가져오기
      }

      return {
        imageUrl,
        title: quizData.title,
        participant: quizData.participant,
        quizList: quizData.quizList,
      };
    })
  );

  return { userPoint, fetchedQuizList };
};

export const useFetchUserData = (uid: string | null) => {
  return useQuery({
    queryKey: ["userData", uid],
    queryFn: () => fetchUserData(uid),
    enabled: !!uid, // 쿼리가 uid가 유효할 때만 실행되도록 설정
    staleTime: 1000 * 60 * 10,
  });
};
