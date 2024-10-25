import Link from "next/link";
import MyPage from "./MyPage";
import Navbar from "./Navbar";
import MobileNav from "./MobileNav";

const Header = () => {
  return (
    <header className="bg-black">
      <nav className="w-full h-16 px-4 sm:px-10 py-4 sm:py-7 text-white text-xl font-bold flex justify-between items-center">
        <Link className="text-5xl" href="/" replace={true}>
          <span className="text-[#FF0000]">D</span>ON
          <span className="text-[#FFF700]">Q</span>UIZ
        </Link>

        <Navbar />
        <MyPage />

        {/* 모바일 메뉴 버튼 */}
        <MobileNav />
      </nav>
    </header>
  );
};

export default Header;
