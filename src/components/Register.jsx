import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaPlay } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import useTranslation from "../hooks/useTranslation";

const Register = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { register } = useAuth();
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError(t("passwordMismatch"));
      return;
    }

    if (formData.password.length < 6) {
      setError(t("passwordMin"));
      return;
    }

    const result = register(formData.name, formData.email, formData.password);

    if (!result.success) {
      setError(
        result.message === "Email already exists"
          ? t("emailExists")
          : result.message,
      );
      return;
    }

    const from = location.state?.from?.pathname || "/";

    navigate(from, { replace: true });
  };

  return (
    <main className="min-h-screen bg-black flex items-center justify-center px-6 py-20">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(229,9,20,0.16),_transparent_35%)]"></div>

      <div className="relative w-full max-w-md">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-[#737373] hover:text-white transition mb-8"
        >
          <FaArrowLeft />
          {t("backHome")}
        </Link>

        <div className="bg-[#141414] border border-[#2a2a2a] rounded-2xl p-7 md:p-9">
          <div className="flex items-center gap-2 text-[#e50914] mb-6">
            <FaPlay className="text-sm" />

            <span className="text-xs font-bold uppercase tracking-[3px]">
              {t("joinUs")}
            </span>
          </div>

          <h1 className="text-white text-3xl md:text-4xl font-bold">
            {t("createAccount")}
          </h1>

          <p className="text-[#737373] mt-3">{t("createAccountDescription")}</p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label className="block text-white text-sm font-medium mb-2">
                {t("name")}
              </label>

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder={t("enterName")}
                required
                className="w-full bg-[#222] border border-[#333] rounded-lg px-4 py-3 text-white outline-none focus:border-[#e50914] transition"
              />
            </div>

            <div>
              <label className="block text-white text-sm font-medium mb-2">
                {t("email")}
              </label>

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder={t("enterEmail")}
                required
                className="w-full bg-[#222] border border-[#333] rounded-lg px-4 py-3 text-white outline-none focus:border-[#e50914] transition"
              />
            </div>

            <div>
              <label className="block text-white text-sm font-medium mb-2">
                {t("password")}
              </label>

              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder={t("passwordMinPlaceholder")}
                required
                className="w-full bg-[#222] border border-[#333] rounded-lg px-4 py-3 text-white outline-none focus:border-[#e50914] transition"
              />
            </div>

            <div>
              <label className="block text-white text-sm font-medium mb-2">
                {t("confirmPassword")}
              </label>

              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder={t("repeatPassword")}
                required
                className="w-full bg-[#222] border border-[#333] rounded-lg px-4 py-3 text-white outline-none focus:border-[#e50914] transition"
              />
            </div>

            {error && (
              <p className="text-red-500 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3">
                {error}
              </p>
            )}

            <button
              type="submit"
              className="w-full bg-[#e50914] hover:bg-[#b20710] text-white font-semibold py-3 rounded-lg transition duration-300"
            >
              {t("createAccount")}
            </button>
          </form>

          <p className="text-[#737373] text-sm text-center mt-7">
            {t("haveAccount")}{" "}
            <Link
              to="/login"
              className="text-white hover:text-[#e50914] transition"
            >
              {t("loginNow")}
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
};

export default Register;
