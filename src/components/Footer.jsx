import { FaFacebookF, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";
import useTranslation from "../hooks/useTranslation";

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-black text-[#737373] px-6 py-12">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h2 className="text-white text-2xl font-bold">NETFLIX</h2>
        </div>

        <p className="text-[16px] mb-8">
          {t("questionsCall")}{" "}
          <a href="tel:08001234567" className="hover:underline">
            0800-123-4567
          </a>
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-y-5 gap-x-8 mb-10">
          <div className="flex flex-col gap-4 text-sm">
            <a href="#" className="hover:underline">
              FAQ
            </a>

            <a href="#" className="hover:underline">
              {t("investorRelations")}
            </a>

            <a href="#" className="hover:underline">
              {t("privacy")}
            </a>

            <a href="#" className="hover:underline">
              {t("speedTest")}
            </a>
          </div>

          <div className="flex flex-col gap-4 text-sm">
            <a href="#" className="hover:underline">
              {t("helpCenter")}
            </a>

            <a href="#" className="hover:underline">
              {t("jobs")}
            </a>

            <a href="#" className="hover:underline">
              {t("cookiePreferences")}
            </a>

            <a href="#" className="hover:underline">
              {t("legalNotices")}
            </a>
          </div>

          <div className="flex flex-col gap-4 text-sm">
            <a href="#" className="hover:underline">
              {t("account")}
            </a>

            <a href="#" className="hover:underline">
              {t("waysToWatch")}
            </a>

            <a href="#" className="hover:underline">
              {t("corporateInformation")}
            </a>

            <a href="#" className="hover:underline">
              {t("onlyOnNetflix")}
            </a>
          </div>

          <div className="flex flex-col gap-4 text-sm">
            <a href="#" className="hover:underline">
              {t("mediaCenter")}
            </a>

            <a href="#" className="hover:underline">
              {t("termsOfUse")}
            </a>

            <a href="#" className="hover:underline">
              {t("contactUs")}
            </a>

            <a href="#" className="hover:underline">
              {t("accessibility")}
            </a>
          </div>
        </div>

        <div className="flex items-center gap-4 mb-8">
          <a
            href="#"
            className="w-9 h-9 rounded-full border border-[#737373] flex items-center justify-center hover:text-white hover:border-white transition"
          >
            <FaFacebookF />
          </a>

          <a
            href="#"
            className="w-9 h-9 rounded-full border border-[#737373] flex items-center justify-center hover:text-white hover:border-white transition"
          >
            <FaInstagram />
          </a>

          <a
            href="#"
            className="w-9 h-9 rounded-full border border-[#737373] flex items-center justify-center hover:text-white hover:border-white transition"
          >
            <FaTwitter />
          </a>

          <a
            href="#"
            className="w-9 h-9 rounded-full border border-[#737373] flex items-center justify-center hover:text-white hover:border-white transition"
          >
            <FaYoutube />
          </a>
        </div>

        <div className="border-t border-[#333] pt-6 flex flex-col md:flex-row items-center justify-between gap-3 text-sm">
          <p>{t("copyright")}</p>

          <p>
            {t("builtWith")} <span className="text-[#e50914]">React</span> &{" "}
            <span className="text-[#e50914]">Tailwind CSS</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
