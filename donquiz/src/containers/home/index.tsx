import QuizList from "./QuizList";

const Home = () => {
  return (
    <div className="w-full h-[calc(100vh-120px)] font-bold flex flex-col items-center justify-center">
      <div className="text-[32px] sm:text-[40px] lg:text-[52px] my-4 sm:my-8">
        Quiz List
      </div>
      <div className="w-full max-w-[1400px] flex items-center justify-between mb-8 px-4">
        <div className="text-[18px] sm:text-[20px] mb-2 sm:mb-0">
          최신순/인기순
        </div>
        <div>
          <input
            id="search"
            className="border-2 rounded-lg mr-2 p-1 border-black text-sm sm:text-base "
            type="text"
            placeholder=""
          />
          <input
            className="border-2 rounded-lg p-1 bg-black text-white border-black text-sm sm:text-base cursor-pointer"
            type="button"
            value="검색"
          />
        </div>
      </div>
      <div className="w-full max-w-[1400px] h-[100%] flex items-center justify-center flex-wrap gap-4 overflow-auto py-4 px-2">
        <QuizList />
      </div>
    </div>
  );
};

export default Home;
