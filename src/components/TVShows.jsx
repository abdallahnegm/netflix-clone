import { useEffect, useState } from "react";
import MovieCard from "./MovieCard";
import MovieCardSkeleton from "./MovieCardSkeleton";
import useTranslation from "../hooks/useTranslation";

const TVShows = () => {
  const { t } = useTranslation();

  const [trending, setTrending] = useState([]);
  const [popular, setPopular] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchShows = async () => {
      try {
        const apiKey = import.meta.env.VITE_TMDB_API_KEY;

        const [trendingRes, popularRes, topRatedRes, genresRes] =
          await Promise.all([
            fetch(
              `https://api.themoviedb.org/3/trending/tv/week?api_key=${apiKey}`,
            ),
            fetch(`https://api.themoviedb.org/3/tv/popular?api_key=${apiKey}`),
            fetch(
              `https://api.themoviedb.org/3/tv/top_rated?api_key=${apiKey}`,
            ),
            fetch(
              `https://api.themoviedb.org/3/genre/tv/list?api_key=${apiKey}`,
            ),
          ]);

        if (
          !trendingRes.ok ||
          !popularRes.ok ||
          !topRatedRes.ok ||
          !genresRes.ok
        ) {
          throw new Error("fetchMoviesError");
        }

        const trendingData = await trendingRes.json();
        const popularData = await popularRes.json();
        const topRatedData = await topRatedRes.json();
        const genresData = await genresRes.json();

        const genreMap = Object.fromEntries(
          genresData.genres.map((genre) => [genre.id, genre.name]),
        );

        const formatShows = (shows = []) =>
          shows.map((show) => ({
            ...show,
            media_type: "tv",
            genres:
              show.genre_ids?.map((genreId) => ({
                id: genreId,
                name: genreMap[genreId],
              })) || [],
          }));

        setTrending(formatShows(trendingData.results));
        setPopular(formatShows(popularData.results));
        setTopRated(formatShows(topRatedData.results));
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchShows();
  }, []);

  const renderSection = (title, movies) => (
    <section className="mb-14">
      <div className="flex items-end justify-between mb-5">
        <div>
          <p className="text-[#e50914] text-xs font-semibold uppercase tracking-[3px] mb-2">
            {t("discover")}
          </p>

          <h2 className="text-white text-2xl md:text-3xl font-bold">{title}</h2>
        </div>

        <span className="hidden md:block text-[#737373] text-sm">
          {t("exploreMore")}
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-5">
        {loading
          ? Array.from({ length: 10 }).map((_, index) => (
              <MovieCardSkeleton key={index} />
            ))
          : movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} origin="center" />
            ))}
      </div>
    </section>
  );

  if (error) {
    return (
      <main className="min-h-screen bg-black pt-24 flex items-center justify-center px-6">
        <p className="text-red-500 text-center">
          {error === "fetchMoviesError" ? t("fetchMoviesError") : error}
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black pt-24">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(229,9,20,0.18),_transparent_35%)]"></div>

        <div className="relative max-w-8xl mx-auto px-6 pt-10 pb-16">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 text-[#e50914] text-sm font-semibold uppercase tracking-[4px]">
              {t("tvShows")}
            </span>

            <h1 className="text-white text-4xl md:text-6xl font-bold mt-4 leading-tight">
              {t("storiesWorth")}
              <span className="text-[#e50914]"> {t("stayingFor")}</span>
            </h1>

            <p className="text-[#8c8c8c] text-base md:text-lg max-w-2xl mt-5 leading-relaxed">
              {t("tvShowsDescription")}
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-8xl mx-auto px-6 pb-20">
        {renderSection(t("trendingTVShows"), trending)}
        {renderSection(t("popularTVShows"), popular)}
        {renderSection(t("topRatedTVShows"), topRated)}
      </div>
    </main>
  );
};

export default TVShows;
