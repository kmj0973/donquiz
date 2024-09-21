import Image from "next/image";
import kakao_image from "../../../public/image/kakao.png";
import google_image from "../../../public/image/google.png";
import Link from "next/link";

const Login = () => {
  return (
    <div className="w-full h-screen flex flex-col items-center justify-center">
      <div className="h-36 text-[108px] text-white bg-black px-6 flex items-center mb-24">
        <span className="text-[#FF0000]">D</span>ON
        <span className="text-[#FFF700]">Q</span>UIZ
      </div>
      <div className="mb-10">
        <form className="flex flex-col w-[400px]">
          <label htmlFor="email" className="text-[#999999] mb-2">
            Email
          </label>
          <input
            className="border-0 bg-[#f2f2f2] rounded-lg p-3 mb-3"
            id="email"
            type="email"
          />
          <label htmlFor="password" className="text-[#999999] mb-2">
            Password
          </label>
          <input
            className="border-0 bg-[#f2f2f2] rounded-lg p-3 mb-5"
            id="password"
            type="password"
          />
          <button
            type="submit"
            className="bg-[#222222] rounded-lg p-3 text-white"
          >
            SIGN IN
          </button>
        </form>
      </div>
      <div className="flex flex-col items-center justify-center">
        <Link
          className="w-[400px] text-center text-white bg-[#222222] rounded-lg p-3 mb-2"
          href="/auth"
        >
          SIGN UP
        </Link>
        <Image alt="kakao_login" src={kakao_image} width={400} height={50} />
        <Image alt="google_login" src={google_image} width={400} height={50} />
      </div>
    </div>
  );
};

export default Login;
