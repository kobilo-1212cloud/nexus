import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: any) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("nexusUser");
    if (savedUser) setUser(JSON.parse(savedUser));
  }, []);

  const login = (email: string, password: string) => {
    const savedUser = JSON.parse(localStorage.getItem("nexusUser") || "{}");

    if (savedUser.email === email && savedUser.password === password) {
      setUser(savedUser);
      localStorage.setItem("isLoggedIn", "true");
    } else {
      alert("Invalid credentials");
    }
  };

  const signup = (email: string, password: string) => {
    const newUser = { email, password };
    localStorage.setItem("nexusUser", JSON.stringify(newUser));
    setUser(newUser);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("isLoggedIn");
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};