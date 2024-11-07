import Link from "next/link";
import MyPage from "./MyPage";
import Navbar from "./Navbar";
import MobileNav from "./MobileNav";

const Header = () => {
  return (
    <header>
      <nav className="flex justify-between items-center w-full h-16 px-4 sm:px-10 py-4 sm:py-7 border-b-[1px] text-xl">
        <Link className="text-[26px]" href="/">
          <span className="hover:border-b-[2px] border-black">DONQUIZ</span>
          {/* <span className="text-[#FF0000]">D</span>ON
          <span className="text-[#FFF700]">Q</span>UIZ */}
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
