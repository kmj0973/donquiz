import QuizList from "./QuizList";

const Home = async () => {
  return (
    <div className="w-full h-full font-bold flex flex-col items-center justify-center">
      <div className="text-[32px] sm:text-[40px] lg:text-[52px] my-4 sm:my-8">
        Quiz List
      </div>
      <QuizList />
    </div>
  );
};

export default Home;
