import { useEffect, useState } from "react";
import MovieCard from "./MovieCard";
import MovieCardSkeleton from "./MovieCardSkeleton";
import useTranslation from "../hooks/useTranslation";

const NewPopular = () => {
  const { t } = useTranslation();

  const [trending, setTrending] = useState([]);
  const [popular, setPopular] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const apiKey = import.meta.env.VITE_TMDB_API_KEY;

        const [trendingRes, popularRes, upcomingRes, genresRes] =
          await Promise.all([
            fetch(
              `https://api.themoviedb.org/3/trending/all/week?api_key=${apiKey}`,
            ),
            fetch(
              `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}`,
            ),
            fetch(
              `https://api.themoviedb.org/3/movie/upcoming?api_key=${apiKey}`,
            ),
            fetch(
              `https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}`,
            ),
          ]);

        if (
          !trendingRes.ok ||
          !popularRes.ok ||
          !upcomingRes.ok ||
          !genresRes.ok
        ) {
          throw new Error("fetchMoviesError");
        }

        const trendingData = await trendingRes.json();
        const popularData = await popularRes.json();
        const upcomingData = await upcomingRes.json();
        const genresData = await genresRes.json();

        const genreMap = Object.fromEntries(
          genresData.genres.map((genre) => [genre.id, genre.name]),
        );

        const formatMovies = (movies) =>
          movies
            .filter(
              (movie) =>
                movie.media_type === "movie" || movie.media_type === "tv",
            )
            .map((movie) => ({
              ...movie,
              genres:
                movie.genre_ids?.map((genreId) => ({
                  id: genreId,
                  name: genreMap[genreId],
                })) || [],
            }));

        const formatMovieList = (movies) =>
          movies.map((movie) => ({
            ...movie,
            media_type: "movie",
            genres:
              movie.genre_ids?.map((genreId) => ({
                id: genreId,
                name: genreMap[genreId],
              })) || [],
          }));

        setTrending(formatMovies(trendingData.results));
        setPopular(formatMovieList(popularData.results));
        setUpcoming(formatMovieList(upcomingData.results));
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

  if (error) {
    return (
      <main className="min-h-screen bg-black pt-24 flex items-center justify-center px-6">
        <p className="text-red-500 text-center">
          {error === "fetchMoviesError" ? t("fetchMoviesError") : error}
        </p>
      </main>
    );
  }

  const renderSection = (title, movies, number) => (
    <section className="mb-14">
      <div className="flex items-center gap-4 mb-5">
        <span className="text-[#e50914] text-3xl md:text-4xl font-black">
          {number}
        </span>

        <div>
          <p className="text-[#737373] text-xs uppercase tracking-[3px]">
            {t("collection")}
          </p>

          <h2 className="text-white text-2xl md:text-3xl font-bold">{title}</h2>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-5">
        {loading
          ? Array.from({ length: 10 }).map((_, index) => (
              <MovieCardSkeleton key={index} />
            ))
          : movies.map((movie) => (
              <MovieCard
                key={`${movie.media_type}-${movie.id}`}
                movie={movie}
                origin="center"
              />
            ))}
      </div>
    </section>
  );

  return (
    <main className="min-h-screen bg-black pt-24">
      <section className="relative overflow-hidden border-b border-[#1f1f1f]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(229,9,20,0.13),_transparent_45%)]"></div>

        <div className="relative max-w-8xl mx-auto px-6 pt-12 pb-20">
          <div className="max-w-4xl mx-auto text-center">
            <span className="inline-block text-[#e50914] text-sm font-semibold uppercase tracking-[5px]">
              {t("newPopular")}
            </span>

            <h1 className="text-white text-4xl md:text-7xl font-black mt-5 leading-tight">
              {t("whatsEveryone")}
              <span className="block text-[#e50914]">{t("watching")}</span>
            </h1>

            <p className="text-[#8c8c8c] text-base md:text-lg max-w-2xl mx-auto mt-6 leading-relaxed">
              {t("newPopularDescription")}
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3 mt-8">
              <span className="px-5 py-2 rounded-full bg-[#e50914] text-white text-sm font-medium">
                {t("trendingLabel")}
              </span>

              <span className="px-5 py-2 rounded-full border border-[#333] text-[#aaa] text-sm font-medium">
                {t("popularLabel")}
              </span>

              <span className="px-5 py-2 rounded-full border border-[#333] text-[#aaa] text-sm font-medium">
                {t("comingSoon")}
              </span>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-8xl mx-auto px-6 pt-14 pb-20">
        {renderSection(t("trendingThisWeek"), trending, "01")}

        {renderSection(t("popularRightNow"), popular, "02")}

        {renderSection(t("comingSoon"), upcoming, "03")}
      </div>
    </main>
  );
};

export default NewPopular;
