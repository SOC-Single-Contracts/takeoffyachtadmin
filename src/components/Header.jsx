import React, { useEffect, useState } from "react";
import { FiMenu } from "react-icons/fi";
import { ProfileMenu } from "./ui/ProfileMenu";

const Header = ({ toggleSidebar }) => {
  const [userName, setUserName] = useState("");


  useEffect(() => {
    const storedName = localStorage.getItem("userName");
    if (storedName) {
      setUserName(storedName);
    }
  }, []);
  return (
    <header className="bg-white p-5 shadow flex items-center justify-between">
      <div className="flex items-center gap-4">
        <button className="text-2xl lg:hidden" onClick={toggleSidebar}>
          <FiMenu />
        </button>
        <h1 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold font-sora ">
          Hello, {userName} 👋
        </h1>
      </div>
      <div className="flex items-center gap-2 sm:gap-4">
      <div className="flex items-center">
        {/* <input
          data-hs-theme-switch=""
          className="relative w-[3.25rem] h-7 bg-gray-100 checked:bg-none checked:bg-[#BEA355] border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 ring-1 ring-transparent focus:border-gray-700 focus:ring-gray-700 focus:outline-none appearance-none
          before:inline-block before:size-6 before:bg-white checked:before:bg-black before:translate-x-0 checked:before:translate-x-full before:shadow before:rounded-full before:transform before:ring-0 before:transition before:ease-in-out before:duration-200
          after:absolute after:end-1.5 after:top-[calc(50%-0.40625rem)] after:w-[.8125rem] after:h-[.8125rem] after:bg-no-repeat after:bg-[right_center] after:bg-[length:.8125em_.8125em] after:transform after:transition-all after:ease-in-out after:duration-200 after:opacity-70 checked:after:start-1.5 checked:after:end-auto"
          type="checkbox"
          id="darkSwitch"
          checked={isDarkMode}
          onChange={toggleDarkMode}
        /> */}
      </div>
        {/* <NotificationsMenu /> */}
        <ProfileMenu />
      </div>
    </header>
  );
};

export default Header;
