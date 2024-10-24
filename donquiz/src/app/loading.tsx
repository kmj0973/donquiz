import React from "react";

const Loading = () => {
  return (
    <div className="flex flex-col justify-center items-center h-[calc(100vh-120px)] z-30">
      <div className="border-4 border-r-white border-black rounded-full w-[50px] h-[50px] animate-spin mb-1" />
      <p>Loading...</p>
    </div>
  );
};

export default Loading;
