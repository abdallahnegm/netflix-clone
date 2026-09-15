import { FaArrowRight, FaPlay } from "react-icons/fa";
import useTranslation from "../hooks/useTranslation";

const JoinSection = () => {
  const { t } = useTranslation();

  return (
    <section className="bg-black px-6 py-20">
      <div className="max-w-7xl mx-auto relative overflow-hidden rounded-2xl bg-[#141414] border border-[#2a2a2a]">
        <div className="absolute -top-32 -right-32 w-80 h-80 bg-[#e50914]/20 rounded-full blur-[100px]"></div>

        <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-[#e50914]/10 rounded-full blur-[100px]"></div>

        <div className="relative z-10 flex flex-col items-center text-center px-6 py-16 md:py-20">
          <div className="flex items-center gap-2 text-[#e50914] mb-5">
            <FaPlay className="text-sm" />

            <span className="text-sm font-semibold uppercase tracking-[3px]">
              {t("unlimitedEntertainment")}
            </span>
          </div>

          <h2 className="text-white text-3xl md:text-5xl font-bold max-w-3xl leading-tight">
            {t("watchWhatYouWant")}
            <span className="text-[#e50914]"> {t("wheneverYouWant")}</span>
          </h2>

          <p className="text-[#a3a3a3] text-base md:text-lg max-w-2xl mt-5 leading-relaxed">
            {t("joinDescription")}
          </p>

          <button className="mt-8 flex items-center gap-3 bg-[#e50914] hover:bg-[#b20710] text-white font-semibold px-7 py-3 rounded-full transition duration-300 hover:scale-105">
            {t("getStarted")}

            <FaArrowRight className="text-sm" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default JoinSection;
