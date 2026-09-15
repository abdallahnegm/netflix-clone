import MovieCard from "./MovieCard";
import { useMyList } from "../context/MyListContext";
import useTranslation from "../hooks/useTranslation";

const MyList = () => {
  const { myList } = useMyList();
  const { t } = useTranslation();

  return (
    <section className="min-h-screen bg-black pt-28 px-6 pb-16">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-white text-3xl md:text-4xl font-bold mb-8">
          {t("myListTitle")}
        </h1>

        {myList.length === 0 ? (
          <div className="min-h-[400px] flex flex-col items-center justify-center text-center">
            <h2 className="text-white text-2xl font-semibold mb-3">
              {t("emptyListTitle")}
            </h2>

            <p className="text-[#737373] max-w-md">{t("emptyListText")}</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {myList.map((movie) => (
              <MovieCard key={movie.id} movie={movie} origin="center" />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default MyList;
