import { Link } from "react-router-dom";
import { FaArrowLeft, FaPlay } from "react-icons/fa";
import useTranslation from "../hooks/useTranslation";

const NotFound = () => {
  const { t } = useTranslation();

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center px-6">
      <div className="text-center max-w-2xl">
        <div className="flex items-center justify-center gap-2 text-[#e50914] mb-6">
          <FaPlay className="text-sm" />

          <span className="text-sm font-bold uppercase tracking-[4px]">
            Netflix Clone
          </span>
        </div>

        <h1 className="text-[120px] md:text-[180px] font-black leading-none text-[#e50914]">
          404
        </h1>

        <h2 className="text-3xl md:text-5xl font-bold mt-4">
          {t("lostYourWay")}
        </h2>

        <p className="text-[#737373] text-base md:text-lg mt-5 max-w-lg mx-auto leading-relaxed">
          {t("pageNotFoundDescription")}
        </p>

        <Link
          to="/"
          className="inline-flex items-center gap-3 bg-white text-black px-7 py-3 rounded-full font-semibold mt-8 hover:bg-[#e50914] hover:text-white transition duration-300"
        >
          <FaArrowLeft />
          {t("backHome")}
        </Link>
      </div>
    </main>
  );
};

export default NotFound;
