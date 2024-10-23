import QuizList from "./QuizList";

const Home = () => {
  return (
    <div className="w-full h-[calc(100vh-120px)] font-bold flex flex-col items-center justify-center">
      <div className="text-[52px] my-8">Quiz List</div>
      <div className="w-[90%] flex items-center justify-between mb-8">
        <div className="text-[20px]">최신순/인기순</div>
        <div>
          <input
            id="search"
            className="border-2 rounded-lg mr-2 p-1 border-black "
            type="text"
            placeholder=""
          />
          <input
            className="border-2 rounded-lg p-1 bg-black text-white border-black"
            type="button"
            value="검색"
          />
        </div>
      </div>
      <div className="w-[90%] h-[100%] flex items-center justify-center flex-wrap gap-4 overflow-auto py-4 px-2">
        <QuizList />
      </div>
    </div>
  );
};

export default Home;
