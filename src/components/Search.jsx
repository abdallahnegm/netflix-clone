import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import MovieCard from "./MovieCard";
import MovieCardSkeleton from "./MovieCardSkeleton";
import useTranslation from "../hooks/useTranslation";

const Search = () => {
  const { t } = useTranslation();

  const [searchParams, setSearchParams] = useSearchParams();

  const query = searchParams.get("q") || "";

  const [searchValue, setSearchValue] = useState(query);
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const value = searchValue.trim();

    if (!value) {
      setMovies([]);
      setLoading(false);
      setError("");
      setSearchParams({});
      return;
    }

    const timeout = setTimeout(async () => {
      try {
        setLoading(true);
        setError("");

        setSearchParams({ q: value });

        const apiKey = import.meta.env.VITE_TMDB_API_KEY;

        const response = await fetch(
          `https://api.themoviedb.org/3/search/multi?api_key=${apiKey}&query=${encodeURIComponent(
            value,
          )}&include_adult=false`,
        );

        if (!response.ok) {
          throw new Error("Failed to search");
        }

        const data = await response.json();

        const filteredResults = data.results.filter(
          (item) =>
            (item.media_type === "movie" || item.media_type === "tv") &&
            item.poster_path,
        );

        setMovies(filteredResults);
      } catch (error) {
        setError(error.message);
        setMovies([]);
      } finally {
        setLoading(false);
      }
    }, 400);

    return () => clearTimeout(timeout);
  }, [searchValue, setSearchParams]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const value = searchValue.trim();

    if (!value) {
      setMovies([]);
      setSearchParams({});
      return;
    }

    setSearchParams({ q: value });
  };

  return (
    <main className="min-h-screen bg-black text-white pt-28 pb-16">
      <div className="max-w-7xl mx-auto px-6">
        <div className="max-w-3xl mx-auto">
          <form onSubmit={handleSubmit} className="flex items-center gap-3">
            <div className="relative flex-1">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[#737373]" />

              <input
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder={t("searchPlaceholder")}
                autoFocus
                className="w-full bg-[#222] border border-[#333] rounded-full pl-11 pr-5 py-3.5 text-white outline-none focus:border-[#e50914] transition"
              />
            </div>

            <button
              type="submit"
              className="bg-[#e50914] hover:bg-[#b20710] text-white font-semibold px-6 py-3.5 rounded-full transition"
            >
              {t("search")}
            </button>
          </form>
        </div>

        {searchValue.trim() && !loading && (
          <div className="mt-12">
            <h1 className="text-2xl md:text-3xl font-bold">
              {t("searchResultsFor")}{" "}
              <span className="text-[#e50914]">"{searchValue.trim()}"</span>
            </h1>
          </div>
        )}

        {loading && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-8">
            {Array.from({ length: 10 }).map((_, index) => (
              <MovieCardSkeleton key={index} />
            ))}
          </div>
        )}

        {error && !loading && (
          <div className="min-h-[400px] flex items-center justify-center">
            <p className="text-red-500">{t("searchError")}</p>
          </div>
        )}

        {!loading && !error && searchValue.trim() && movies.length === 0 && (
          <div className="min-h-[400px] flex flex-col items-center justify-center text-center">
            <FaSearch className="text-[#333] text-5xl mb-5" />

            <h2 className="text-white text-2xl font-semibold mb-3">
              {t("noResults")}
            </h2>

            <p className="text-[#737373]">{t("tryAnotherSearch")}</p>
          </div>
        )}

        {!loading && !error && movies.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mt-8">
            {movies.map((movie) => (
              <MovieCard
                key={`${movie.media_type}-${movie.id}`}
                movie={movie}
                origin="center"
              />
            ))}
          </div>
        )}

        {!searchValue.trim() && (
          <div className="min-h-[500px] flex flex-col items-center justify-center text-center">
            <FaSearch className="text-[#333] text-6xl mb-6" />

            <h1 className="text-white text-3xl font-bold">
              {t("searchSomething")}
            </h1>

            <p className="text-[#737373] mt-3">{t("searchDescription")}</p>
          </div>
        )}
      </div>
    </main>
  );
};

export default Search;
