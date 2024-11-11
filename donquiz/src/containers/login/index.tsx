import LoginContent from "./LoginContent";

const Login = () => {
  return (
    <div className="w-full min-h-[calc(100vh-112px)] font-normal flex flex-col items-center justify-center px-4 sm:px-6 pb-10">
      <div className="h-28 sm:h-36 text-[50px] text-black font-medium px-4 sm:px-6 pb-2 sm:pb-3 flex items-center mt-8 sm:mt-12">
        Login
      </div>
      <LoginContent />
    </div>
  );
};

export default Login;
