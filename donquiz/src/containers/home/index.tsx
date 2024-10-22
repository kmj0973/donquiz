import QuizList from "./QuizList";

const Home = () => {
  return (
    <div className="w-full h-[calc(100vh-120px)] font-bold flex flex-col items-center justify-center mb-4">
      <div className="text-[52px] my-8">Quiz List</div>
      <div className="w-[90%] flex items-center justify-between mb-8">
        <div>최신순/인기순</div>
        <div>
          <label htmlFor="search">검색창</label>
          <input
            id="search"
            className="border-2 ml-2"
            type="text"
            placeholder=""
          />
        </div>
      </div>
      <div className="w-[90%] flex items-center justify-center flex-wrap gap-4 overflow-auto">
        <QuizList />
      </div>
    </div>
  );
};

export default Home;
