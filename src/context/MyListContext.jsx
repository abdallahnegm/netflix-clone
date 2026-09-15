import { createContext, useContext, useEffect, useRef, useState } from "react";
import { useAuth } from "./AuthContext";

const MyListContext = createContext(null);

const getStoredList = (key) => {
  try {
    const savedList = localStorage.getItem(key);

    if (!savedList) {
      return [];
    }

    const parsedList = JSON.parse(savedList);

    return Array.isArray(parsedList) ? parsedList : [];
  } catch {
    return [];
  }
};

export const MyListProvider = ({ children }) => {
  const { user } = useAuth();

  const [myList, setMyList] = useState([]);
  const loadedUserId = useRef(null);

  useEffect(() => {
    if (!user) {
      setMyList([]);
      loadedUserId.current = null;
      return;
    }

    const storageKey = `myList_${user.id}`;
    const savedList = getStoredList(storageKey);

    setMyList(savedList);
    loadedUserId.current = user.id;
  }, [user]);

  useEffect(() => {
    if (!user || loadedUserId.current !== user.id) {
      return;
    }

    const storageKey = `myList_${user.id}`;

    localStorage.setItem(storageKey, JSON.stringify(myList));
  }, [myList, user]);

  const isInMyList = (movieId) => {
    return myList.some((movie) => movie.id === movieId);
  };

  const toggleMyList = (movie) => {
    if (!user) {
      return;
    }

    setMyList((currentList) => {
      const exists = currentList.some((item) => item.id === movie.id);

      if (exists) {
        return currentList.filter((item) => item.id !== movie.id);
      }

      return [...currentList, movie];
    });
  };

  return (
    <MyListContext.Provider
      value={{
        myList,
        toggleMyList,
        isInMyList,
      }}
    >
      {children}
    </MyListContext.Provider>
  );
};

export const useMyList = () => {
  const context = useContext(MyListContext);

  if (!context) {
    throw new Error("useMyList must be used inside MyListProvider");
  }

  return context;
};
