import QuizComponents from "./Quiz";

interface QuizList {
  quizList: QuizData;
}

interface QuizData {
  answer: string;
  image: string;
  source: string;
}

const Quiz = ({ quizList }: { quizList: QuizList[] }) => {
  return (
    <div className="w-full min-h-[calc(100vh-112px)] font-bold flex flex-col items-center justify-center px-4">
      <QuizComponents quizList={quizList} />
    </div>
  );
};

export default Quiz;
