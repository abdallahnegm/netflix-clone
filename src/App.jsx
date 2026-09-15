import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import Hero from "./components/Hero";
import MovieRow from "./components/MovieRow";
import Navbar from "./components/Navbar";
import HeroSkeleton from "./components/HeroSkeleton";
import TopTenRow from "./components/TopTenRow";
import JoinSection from "./components/JoinSection";
import Footer from "./components/Footer";
import MyList from "./components/MyList";
import TVShows from "./components/TVShows";
import Movies from "./components/Movies";
import NewPopular from "./components/NewPopular";
import Login from "./components/Login";
import Register from "./components/Register";
import Search from "./components/Search";
import MovieDetails from "./components/MovieDetails";
import ProtectedRoute from "./components/ProtectedRoute";
import NotFound from "./components/NotFound";
import useTranslation from "./hooks/useTranslation";

function App() {
  const { t } = useTranslation();

  const [trendingMovies, setTrendingMovies] = useState([]);
  const [popularMovies, setPopularMovies] = useState([]);
  const [topTenMovies, setTopTenMovies] = useState([]);
  const [nowPlayingMovies, setNowPlayingMovies] = useState([]);
  const [heroMovie, setHeroMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const apiKey = import.meta.env.VITE_TMDB_API_KEY;

        const [
          trendingResponse,
          popularResponse,
          topTenResponse,
          genresResponse,
          nowPlayingResponse,
        ] = await Promise.all([
          fetch(
            `https://api.themoviedb.org/3/trending/movie/week?api_key=${apiKey}`,
          ),
          fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}`),
          fetch(
            `https://api.themoviedb.org/3/movie/top_rated?api_key=${apiKey}`,
          ),
          fetch(
            `https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}`,
          ),
          fetch(
            `https://api.themoviedb.org/3/movie/now_playing?api_key=${apiKey}`,
          ),
        ]);

        if (
          !trendingResponse.ok ||
          !popularResponse.ok ||
          !topTenResponse.ok ||
          !genresResponse.ok ||
          !nowPlayingResponse.ok
        ) {
          throw new Error("fetchMoviesError");
        }

        const trendingData = await trendingResponse.json();
        const popularData = await popularResponse.json();
        const topTenData = await topTenResponse.json();
        const genresData = await genresResponse.json();
        const nowPlayingData = await nowPlayingResponse.json();

        const genreMap = Object.fromEntries(
          genresData.genres.map((genre) => [genre.id, genre.name]),
        );

        const formatMovies = (movies) =>
          movies.map((movie) => ({
            ...movie,
            media_type: "movie",
            genres:
              movie.genre_ids?.map((genreId) => ({
                id: genreId,
                name: genreMap[genreId],
              })) || [],
          }));

        const formattedTrendingMovies = formatMovies(trendingData.results);
        const formattedPopularMovies = formatMovies(popularData.results);
        const formattedTopTenMovies = formatMovies(
          topTenData.results.slice(0, 10),
        );
        const formattedNowPlayingMovies = formatMovies(nowPlayingData.results);

        setTrendingMovies(formattedTrendingMovies);
        setPopularMovies(formattedPopularMovies);
        setTopTenMovies(formattedTopTenMovies);
        setNowPlayingMovies(formattedNowPlayingMovies);

        if (formattedTrendingMovies.length > 0) {
          const randomMovie =
            formattedTrendingMovies[
              Math.floor(Math.random() * formattedTrendingMovies.length)
            ];

          setHeroMovie(randomMovie);
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  if (error) {
    return (
      <div className="min-h-screen bg-black text-red-500 p-6">
        {error === "fetchMoviesError" ? t("fetchMoviesError") : error}
      </div>
    );
  }

  return (
    <div>
      <Navbar />

      <Routes>
        <Route
          path="/"
          element={
            <>
              {loading ? <HeroSkeleton /> : <Hero movie={heroMovie} />}

              <div className="relative z-30">
                <MovieRow
                  title={t("trending")}
                  movies={trendingMovies}
                  loading={loading}
                />
              </div>

              <div className="relative z-20">
                <MovieRow
                  title={t("topPicks")}
                  movies={popularMovies}
                  loading={loading}
                />
              </div>

              <div className="relative z-10 overflow-hidden">
                <TopTenRow movies={topTenMovies} />
              </div>

              <div className="relative z-20">
                <MovieRow
                  title={t("nowPlaying")}
                  movies={nowPlayingMovies}
                  loading={loading}
                />
              </div>

              <JoinSection />
              <Footer />
            </>
          }
        />

        <Route path="/tv-shows" element={<TVShows />} />
        <Route path="/movies" element={<Movies />} />
        <Route path="/new-popular" element={<NewPopular />} />

        <Route
          path="/my-list"
          element={
            <ProtectedRoute>
              <MyList />
            </ProtectedRoute>
          }
        />

        <Route path="/search" element={<Search />} />

        <Route path="/movie/:id" element={<MovieDetails />} />
        <Route path="/tv/:id" element={<MovieDetails />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
