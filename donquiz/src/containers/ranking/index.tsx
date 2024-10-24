"use client";

import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../../firebase/firebasedb";
import { useAuthStore } from "@/hooks/useAuthStore";
import { FaUser } from "react-icons/fa";
import crown from "../../../public/image/crown.png";
import Image from "next/image";
import Loading from "@/app/loading";

interface Users {
  id: string;
  displayName: string;
  point: number;
}

interface UserRanking {
  users: Users[];
  totalUsers: number;
}

const Ranking = () => {
  const uid = useAuthStore((state) => state.uid);
  const [userRanking, setUserRanking] = useState<UserRanking | null>(null);
  const [loading, setLoading] = useState(true); //fetch loading

  useEffect(() => {
    const getUserRank = async () => {
      try {
        const usersRef = collection(db, "users");
        const usersQuery = query(usersRef, orderBy("point", "desc"));
        const querySnapshot = await getDocs(usersQuery);

        const users = querySnapshot.docs
          .map((doc) => ({
            id: doc.id,
            displayName: doc.data().displayName,
            point: doc.data().point,
          }))
          .slice(0, 100);
        const totalUsers = users.length;

        setUserRanking({
          users,
          totalUsers,
        });
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    getUserRank();
  });

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="w-full h-auto overflow-auto font-bold flex flex-col items-center justify-center my-4">
      <div className="relative flex justify-around items-end gap-4 mb-8">
        <div className="absolute top-0 right-0 text-[#F9D132] text-[24px]">
          <div>1~100위</div>
        </div>
        <div className="flex flex-col justify-center items-center">
          <div className="w-[100px] h-[100px] rounded-full border-2 flex justify-center items-center">
            <FaUser size={60} />
          </div>
          <div className="text-[20px] my-2">
            {userRanking?.users[1].displayName}
          </div>
          <div className="min-w-[200px] h-[180px] bg-[#F1F1F1] rounded-lg flex flex-col justify-between items-center p-2 pt-1">
            <div className="text-[70px]">2</div>
            <div className="text-[20px]">{userRanking?.users[1].point}점</div>
          </div>
        </div>

        <div className="flex flex-col justify-center items-center">
          <Image src={crown} alt="크라운" width={65} height={65} />
          <div className="w-[100px] h-[100px] rounded-full border-2 flex justify-center items-center mt-1">
            <FaUser size={60} />
          </div>
          <div className="text-[20px] my-2">
            {userRanking?.users[0].displayName}
          </div>
          <div className="min-w-[200px] h-[240px] bg-[#F9D132] rounded-lg flex flex-col justify-between items-center p-2 pt-1">
            <div className="text-[70px]">1</div>
            <div className="text-[20px]">{userRanking?.users[0].point}점</div>
          </div>
        </div>

        <div className="flex flex-col justify-center items-center">
          <div className="w-[100px] h-[100px] rounded-full border-2 flex justify-center items-center">
            <FaUser size={60} />
          </div>
          <div className="text-[20px] my-2">
            {userRanking?.users[2].displayName}
          </div>
          <div className="min-w-[200px] h-[150px] bg-[#DE9800] rounded-lg flex flex-col justify-between items-center p-2 pt-1">
            <div className="text-[70px]">3</div>
            <div className="text-[20px]">{userRanking?.users[2].point}점</div>
          </div>
        </div>
      </div>

      <div className="w-[632px] h-[400px] py-4 overflow-auto border-2 rounded-2xl flex flex-col justify-start items-center">
        {userRanking?.users.map((user, index) => {
          if (index > 2) {
            return (
              <div className="w-[90%] flex justify-between items-center mb-4">
                <div className="flex justify-center items-center">
                  <div className="text-[32px] mr-8 ml-4">{index + 1}</div>
                  <div className="w-[80px] h-[80px] rounded-full border-2 flex justify-center items-center">
                    <FaUser size={60} />
                  </div>
                  <div className="text-[28px] mx-4">{user.displayName}</div>
                </div>
                <div className="text-[24px] mx-4">{user.point}점</div>
              </div>
            );
          }
        })}
      </div>
    </div>
  );
};

export default Ranking;
