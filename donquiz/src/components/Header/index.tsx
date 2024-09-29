import Link from "next/link";
import MyPage from "./MyPage";

const Header = () => {
  return (
    <header className="bg-black">
      <nav className="w-full h-16 px-10 py-7 text-white text-xl font-bold flex justify-between items-center">
        <Link className="text-5xl" href="/">
          <span className="text-[#FF0000]">D</span>ON
          <span className="text-[#FFF700]">Q</span>UIZ
        </Link>
        <div className="flex">
          <Link className="mx-9" href="/about">
            about
          </Link>
          <Link className="mx-9" href="/create">
            퀴즈 만들기
          </Link>
          <Link className="mx-9" href="/lanking">
            랭킹
          </Link>
          <Link className="mx-9" href="/change">
            교환소
          </Link>
        </div>
        <MyPage />
      </nav>
    </header>
  );
};

export default Header;
