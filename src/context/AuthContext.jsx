import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

const getStoredData = (key, fallback) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  } catch {
    return fallback;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    return getStoredData("currentUser", null);
  });

  const register = (name, email, password) => {
    const users = getStoredData("users", []);

    const existingUser = users.find((user) => user.email === email);

    if (existingUser) {
      return {
        success: false,
        message: "Email already exists",
      };
    }

    const newUser = {
      id: Date.now(),
      name,
      email,
      password,
    };

    localStorage.setItem("users", JSON.stringify([...users, newUser]));

    const loggedUser = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
    };

    localStorage.setItem("currentUser", JSON.stringify(loggedUser));

    setUser(loggedUser);

    return {
      success: true,
    };
  };

  const login = (email, password) => {
    const users = getStoredData("users", []);

    const existingUser = users.find(
      (user) => user.email === email && user.password === password,
    );

    if (!existingUser) {
      return {
        success: false,
        message: "Invalid email or password",
      };
    }

    const loggedUser = {
      id: existingUser.id,
      name: existingUser.name,
      email: existingUser.email,
    };

    localStorage.setItem("currentUser", JSON.stringify(loggedUser));

    setUser(loggedUser);

    return {
      success: true,
    };
  };

  const logout = () => {
    localStorage.removeItem("currentUser");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        register,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
};
