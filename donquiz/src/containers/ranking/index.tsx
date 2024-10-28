"use client";

import { FaUser } from "react-icons/fa";
import crown from "../../../public/image/crown.png";
import Image from "next/image";
import Loading from "@/app/loading";
import { useUserRank } from "./hooks/useUserRank";

const Ranking = () => {
  const { data: userRanking = { users: [] }, isLoading } = useUserRank();

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="w-full min-h-screen overflow-auto font-bold flex flex-col items-center justify-center my-4 px-4">
      <div className="relative flex justify-around items-end gap-4 mb-8">
        <div className="absolute top-0 right-0 text-[#F9D132] text-[18px] sm:text-[24px] px-4 sm:px2">
          <div>1~100위</div>
        </div>
        <div className="flex flex-col justify-center items-center">
          <div className="w-[80px] sm:w-[100px] h-[80px] sm:h-[100px] rounded-full border-2 flex justify-center items-center">
            <FaUser size={55} />
          </div>
          <div className="text-[16px] sm:text-[20px] my-2">
            {userRanking?.users[1].displayName}
          </div>
          <div className="min-w-[100px] sm:min-w-[200px] h-[130px] sm:h-[180px] bg-[#F1F1F1] rounded-lg flex flex-col justify-between items-center p-2 pt-1">
            <div className="text-[50px] sm:text-[70px]">2</div>
            <div className="text-[16px] sm:text-[20px]">
              {userRanking?.users[1].point}점
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-center items-center">
          <Image src={crown} alt="크라운" width={65} height={65} />
          <div className="w-[80px] sm:w-[100px] h-[80px] sm:h-[100px] rounded-full border-2 flex justify-center items-center mt-1">
            <FaUser size={55} />
          </div>
          <div className="text-[16px] sm:text-[20px] my-2">
            {userRanking?.users[0].displayName}
          </div>
          <div className="min-w-[100px] sm:min-w-[200px] h-[160px] sm:h-[240px] bg-[#F9D132] rounded-lg flex flex-col justify-between items-center p-2 pt-1">
            <div className="text-[50px] sm:text-[70px]">1</div>
            <div className="text-[16px] sm:text-[20px]">
              {userRanking?.users[0].point}점
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-center items-center">
          <div className="w-[80px] sm:w-[100px] h-[80px] sm:h-[100px] rounded-full border-2 flex justify-center items-center">
            <FaUser size={55} />
          </div>
          <div className="text-[16px] sm:text-[20px] my-2">
            {userRanking?.users[2].displayName}
          </div>
          <div className="min-w-[100px] sm:min-w-[200px] h-[110px] sm:h-[150px] bg-[#DE9800] rounded-lg flex flex-col justify-between items-center p-2 pt-1">
            <div className="text-[50px] sm:text-[70px]">3</div>
            <div className="text-[16px] sm:text-[20px]">
              {userRanking?.users[2].point}점
            </div>
          </div>
        </div>
      </div>

      <div className="w-full max-w-[600px] h-[300px] sm:h-[400px] py-4 overflow-y-auto border-2 rounded-2xl flex flex-col justify-start items-center">
        {userRanking?.users.map((user, index) => {
          if (index > 2) {
            return (
              <div
                key={index}
                className="w-full flex justify-between items-center mb-4 px-2 sm:px-4"
              >
                <div className="flex justify-center items-center">
                  <div className="text-[20px] sm:text-[32px] mx-4 sm:mr-8 ">
                    {index + 1}
                  </div>
                  <div className="w-[60px] sm:w-[80px] h-[60px] sm:h-[80px] rounded-full border-2 flex justify-center items-center">
                    <FaUser size={40} />
                  </div>
                  <div className="text-[18px] sm:text-[28px] mx-2 sm:mx-4">
                    {user.displayName}
                  </div>
                </div>
                <div className="text-[16px] sm:text-[24px] mx-2 sm:mx-4">
                  {user.point}점
                </div>
              </div>
            );
          }
        })}
      </div>
    </div>
  );
};

export default Ranking;
