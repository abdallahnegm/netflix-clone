import { Link, useLocation } from "react-router-dom";
import logo from "../assets/logo.png";
import { FaBars, FaSearch, FaTimes, FaUser } from "react-icons/fa";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import useTranslation from "../hooks/useTranslation";

const Navbar = () => {
  const location = useLocation();

  const { user, isAuthenticated, logout } = useAuth();
  const { lang, changeLanguage } = useLanguage();
  const { t } = useTranslation();

  const navItems = [
    { name: t("home"), path: "/" },
    { name: t("tvShows"), path: "/tv-shows" },
    { name: t("movies"), path: "/movies" },
    { name: t("newPopular"), path: "/new-popular" },
    { name: t("myList"), path: "/my-list" },
  ];

  const [langDropdown, setLangDropdown] = useState(false);
  const [userDropdown, setUserDropdown] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);

  const langRef = useRef(null);
  const userRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (langRef.current && !langRef.current.contains(event.target)) {
        setLangDropdown(false);
      }

      if (userRef.current && !userRef.current.contains(event.target)) {
        setUserDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const closeMobileMenu = () => {
    setMobileMenu(false);
    setUserDropdown(false);
    setLangDropdown(false);
  };

  return (
    <header className="bg-[linear-gradient(180deg,_rgba(0,_0,_0,_0.8)_0%,_rgba(0,_0,_0,_0)_100%)] bg-transparent text-white fixed top-0 left-0 right-0 z-[102]">
      <div className="container flex justify-between items-center p-4 max-w-8xl w-full m-auto">
        <div className="flex items-center gap-1.5">
          <Link to="/" className="logo" onClick={closeMobileMenu}>
            <img src={logo} alt="Netflix Logo" className="w-[76px] h-[20px]" />
          </Link>

          <nav className="navigation xl:flex hidden items-center">
            <ul className="flex gap-2.5">
              {navItems.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`text-[16px] text-[#e5e5e5] py-2 px-4 rounded-full hover:bg-[#fff3] hover:text-white transition duration-300 ease-in-out ${
                      location.pathname === item.path
                        ? "bg-[#fff3] text-white"
                        : ""
                    }`}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="btns flex items-center md:gap-8 gap-2">
          <Link
            to="/search"
            className="btn py-2 px-4 rounded-full hover:bg-[#fff3] hover:text-white transition duration-300 ease-in-out"
          >
            <FaSearch />
          </Link>

          <div ref={userRef} className="xl:block hidden">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => {
                    setUserDropdown(!userDropdown);
                    setLangDropdown(false);
                  }}
                  className="flex items-center gap-2 py-2 px-4 rounded-full hover:bg-[#fff3] transition duration-300"
                >
                  <FaUser className="text-sm" />
                  <span>{user.name}</span>
                </button>

                {userDropdown && (
                  <div className="absolute top-12 right-0 bg-[#141414] border border-[#333] rounded-lg py-2 min-w-[150px] shadow-xl">
                    <div className="px-4 py-2 border-b border-[#333]">
                      <p className="text-white text-sm font-medium">
                        {user.name}
                      </p>

                      <p className="text-[#737373] text-xs mt-1 truncate">
                        {user.email}
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        logout();
                        setUserDropdown(false);
                      }}
                      className="w-full text-left px-4 py-3 text-sm text-[#aaa] hover:text-white hover:bg-[#ffffff10] transition"
                    >
                      {t("signOut")}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="btn py-2 px-4 rounded-full hover:bg-[#fff3] hover:text-white transition duration-300 ease-in-out"
              >
                {t("signIn")}
              </Link>
            )}
          </div>

          <div ref={langRef} className="relative xl:block hidden">
            <button
              onClick={() => {
                setLangDropdown(!langDropdown);
                setUserDropdown(false);
              }}
              className="btn flex items-center gap-2.5 py-2 px-4 rounded-full hover:bg-[#fff3] hover:text-white transition duration-300 ease-in-out"
            >
              <span>{lang}</span>

              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className={`w-5 h-5 transition-transform duration-300 ${
                  langDropdown ? "rotate-180" : ""
                }`}
              >
                <path
                  fillRule="evenodd"
                  d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                  clipRule="evenodd"
                />
              </svg>
            </button>

            {langDropdown && (
              <div className="absolute top-12 right-0 bg-black py-2 px-4 rounded-lg z-50 text-white">
                <ul>
                  <li
                    className="cursor-pointer pb-2 mb-2.5 border-b border-[#ccc]"
                    onClick={() => {
                      changeLanguage("English");
                      setLangDropdown(false);
                    }}
                  >
                    English
                  </li>

                  <li
                    className="cursor-pointer"
                    onClick={() => {
                      changeLanguage("Arabic");
                      setLangDropdown(false);
                    }}
                  >
                    Arabic
                  </li>
                </ul>
              </div>
            )}
          </div>

          <button
            onClick={() => setMobileMenu(!mobileMenu)}
            className="xl:hidden flex items-center justify-center w-10 h-10 rounded-full hover:bg-[#fff3] transition"
            aria-label="Toggle menu"
          >
            {mobileMenu ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>

      {mobileMenu && (
        <div className="xl:hidden absolute top-full left-0 right-0 bg-[#141414] border-t border-[#333] border-b border-[#333] shadow-2xl">
          <div className="p-5">
            <nav>
              <ul className="flex flex-col gap-2">
                {navItems.map((item) => (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      onClick={closeMobileMenu}
                      className={`block px-4 py-3 rounded-lg text-[#e5e5e5] hover:bg-[#ffffff10] hover:text-white transition ${
                        location.pathname === item.path
                          ? "bg-[#e50914] text-white"
                          : ""
                      }`}
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="border-t border-[#333] my-4"></div>

            {isAuthenticated ? (
              <div>
                <div className="flex items-center gap-3 px-4 py-3">
                  <div className="w-9 h-9 rounded-full bg-[#e50914] flex items-center justify-center">
                    <FaUser className="text-sm" />
                  </div>

                  <div className="min-w-0">
                    <p className="text-white font-medium truncate">
                      {user.name}
                    </p>

                    <p className="text-[#737373] text-xs truncate">
                      {user.email}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    logout();
                    closeMobileMenu();
                  }}
                  className="w-full text-left px-4 py-3 rounded-lg text-[#aaa] hover:bg-[#ffffff10] hover:text-white transition"
                >
                  {t("signOut")}
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                onClick={closeMobileMenu}
                className="block px-4 py-3 rounded-lg bg-[#e50914] text-white text-center font-medium hover:bg-[#b20710] transition"
              >
                {t("signIn")}
              </Link>
            )}

            <div className="border-t border-[#333] my-4"></div>

            <div>
              <p className="text-[#737373] text-sm px-4 mb-2">
                {t("language")}
              </p>

              <div className="flex gap-2 px-4">
                <button
                  onClick={() => {
                    changeLanguage("English");
                    closeMobileMenu();
                  }}
                  className={`flex-1 py-2 rounded-lg border transition ${
                    lang === "English"
                      ? "border-[#e50914] text-white"
                      : "border-[#333] text-[#737373]"
                  }`}
                >
                  English
                </button>

                <button
                  onClick={() => {
                    changeLanguage("Arabic");
                    closeMobileMenu();
                  }}
                  className={`flex-1 py-2 rounded-lg border transition ${
                    lang === "Arabic"
                      ? "border-[#e50914] text-white"
                      : "border-[#333] text-[#737373]"
                  }`}
                >
                  Arabic
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
