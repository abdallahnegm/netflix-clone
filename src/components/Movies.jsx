import { useEffect, useState } from "react";
import MovieCard from "./MovieCard";
import MovieCardSkeleton from "./MovieCardSkeleton";
import useTranslation from "../hooks/useTranslation";

const Movies = () => {
  const { t } = useTranslation();

  const [popular, setPopular] = useState([]);
  const [nowPlaying, setNowPlaying] = useState([]);
  const [upcoming, setUpcoming] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const apiKey = import.meta.env.VITE_TMDB_API_KEY;

        const [popularRes, nowPlayingRes, upcomingRes, topRatedRes, genresRes] =
          await Promise.all([
            fetch(
              `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}`,
            ),
            fetch(
              `https://api.themoviedb.org/3/movie/now_playing?api_key=${apiKey}`,
            ),
            fetch(
              `https://api.themoviedb.org/3/movie/upcoming?api_key=${apiKey}`,
            ),
            fetch(
              `https://api.themoviedb.org/3/movie/top_rated?api_key=${apiKey}`,
            ),
            fetch(
              `https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}`,
            ),
          ]);

        if (
          !popularRes.ok ||
          !nowPlayingRes.ok ||
          !upcomingRes.ok ||
          !topRatedRes.ok ||
          !genresRes.ok
        ) {
          throw new Error("fetchMoviesError");
        }

        const popularData = await popularRes.json();
        const nowPlayingData = await nowPlayingRes.json();
        const upcomingData = await upcomingRes.json();
        const topRatedData = await topRatedRes.json();
        const genresData = await genresRes.json();

        const genreMap = Object.fromEntries(
          genresData.genres.map((genre) => [genre.id, genre.name]),
        );

        const formatMovies = (movies = []) =>
          movies.map((movie) => ({
            ...movie,
            media_type: "movie",
            genres:
              movie.genre_ids?.map((genreId) => ({
                id: genreId,
                name: genreMap[genreId],
              })) || [],
          }));

        setPopular(formatMovies(popularData.results));
        setNowPlaying(formatMovies(nowPlayingData.results));
        setUpcoming(formatMovies(upcomingData.results));
        setTopRated(formatMovies(topRatedData.results));
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  const renderSection = (title, movies, label) => (
    <section className="mb-14">
      <div className="flex items-end justify-between mb-5">
        <div>
          <p className="text-[#e50914] text-xs font-semibold uppercase tracking-[3px] mb-2">
            {label}
          </p>

          <h2 className="text-white text-2xl md:text-3xl font-bold">{title}</h2>
        </div>

        <span className="hidden md:block text-[#737373] text-sm">
          {t("viewCollection")}
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
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(229,9,20,0.16),_transparent_38%)]"></div>

        <div className="relative max-w-8xl mx-auto px-6 pt-10 pb-16">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
            <div>
              <span className="text-[#e50914] text-sm font-semibold uppercase tracking-[4px]">
                {t("movies")}
              </span>

              <h1 className="text-white text-4xl md:text-6xl font-bold mt-4 leading-tight">
                {t("yourNext")}
                <span className="text-[#e50914]"> {t("favoriteMovie")}</span>
              </h1>

              <p className="text-[#8c8c8c] text-base md:text-lg max-w-2xl mt-5 leading-relaxed">
                {t("moviesDescription")}
              </p>
            </div>

            <div className="hidden md:flex items-center gap-3">
              <div className="w-12 h-12 rounded-full border border-[#333] flex items-center justify-center text-white text-xl">
                🎬
              </div>

              <div>
                <p className="text-white font-semibold">
                  {t("movieCollection")}
                </p>

                <p className="text-[#737373] text-sm">{t("updatedFromTMDB")}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-8xl mx-auto px-6 pb-20">
        {renderSection(t("popularMovies"), popular, t("popular"))}

        {renderSection(t("nowPlaying"), nowPlaying, t("inTheaters"))}

        {renderSection(t("upcomingMovies"), upcoming, t("comingSoon"))}

        {renderSection(t("topRatedMovies"), topRated, t("highestRated"))}
      </div>
    </main>
  );
};

export default Movies;
