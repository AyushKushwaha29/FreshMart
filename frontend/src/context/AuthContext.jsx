import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import api, { getErrorMessage } from "../services/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem("freshmart_user");
    return raw ? JSON.parse(raw) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem("freshmart_token"));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token) {
      localStorage.setItem("freshmart_token", token);
    } else {
      localStorage.removeItem("freshmart_token");
    }
  }, [token]);

  useEffect(() => {
    if (user) {
      localStorage.setItem("freshmart_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("freshmart_user");
    }
  }, [user]);

  const requestOtp = async (payload) => {
    setLoading(true);
    try {
      const { data } = await api.post("/auth/request-otp", payload);
      toast.success(data.message);
      return data.devOtp;
    } catch (error) {
      toast.error(getErrorMessage(error));
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async (payload) => {
    setLoading(true);
    try {
      const { data } = await api.post("/auth/verify-otp", payload);
      setToken(data.data.token);
      setUser(data.data.user);
      toast.success("Welcome to FreshMart");
      return data.data.user;
    } catch (error) {
      toast.error(getErrorMessage(error));
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const adminLogin = async (payload) => {
    setLoading(true);
    try {
      const { data } = await api.post("/auth/admin/login", payload);
      setToken(data.data.token);
      setUser(data.data.user);
      toast.success("Admin signed in");
      return data.data.user;
    } catch (error) {
      toast.error(getErrorMessage(error));
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const loadProfile = async () => {
    if (!token) {
      return null;
    }

    try {
      const { data } = await api.get("/auth/me");
      setUser(data.data);
      return data.data;
    } catch (error) {
      logout(true);
      return null;
    }
  };

  const updateProfile = async (payload) => {
    setLoading(true);
    try {
      const { data } = await api.put("/auth/profile", payload);
      setUser(data.data);
      toast.success(data.message);
      return data.data;
    } catch (error) {
      toast.error(getErrorMessage(error));
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = (silent = false) => {
    setToken(null);
    setUser(null);
    if (!silent) {
      toast.success("Signed out successfully");
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: Boolean(token),
        isAdmin: user?.role === "admin",
        requestOtp,
        verifyOtp,
        adminLogin,
        updateProfile,
        loadProfile,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
};
