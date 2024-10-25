const Footer = () => {
  return (
    <footer className="relative bottom-0 w-full bg-black font-bold">
      <nav className="h-auto sm:h-14 flex flex-col sm:flex-row items-center justify-between p-1 sm:p-6 text-center sm:text-left">
        <div className="text-white text-sm">
          © 2020 Your Company, Inc. All rights reserved.
        </div>
        <div className="text-xl mx-2">
          <span className="text-[#FF0000]">D</span>
          <span className="text-[#FFF700]">Q</span>
        </div>
      </nav>
    </footer>
  );
};

export default Footer;
