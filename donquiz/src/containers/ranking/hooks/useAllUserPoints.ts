import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../../../../firebase/firebasedb";
import { useQuery } from "@tanstack/react-query";

interface User {
  displayName: string;
  point: number;
}

interface UserRankingData {
  users: User[];
}

// Firestore에서 사용자 랭킹을 가져오는 함수
const fetchUserRank = async (): Promise<UserRankingData> => {
  const q = query(collection(db, "users"), orderBy("point", "desc"));
  const querySnapshot = await getDocs(q);

  const users = querySnapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      displayName: data.displayName,
      point: data.point,
    };
  });

  return { users };
};

export const useAllUserPoints = () => {
  return useQuery({
    // queryKey는 캐시에서 이 쿼리를 식별하기 위해 사용합니다.
    queryKey: ["userPoints"],
    // queryFn은 데이터를 가져오기 위해 호출하는 함수입니다.
    queryFn: fetchUserRank,
    staleTime: 0,
  });
};
