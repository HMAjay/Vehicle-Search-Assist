export const getUser = () => {
  try {
    return JSON.parse(localStorage.getItem("user")) || null;
  } catch {
    return null;
  }
};

export const setUser = (user) => {
  localStorage.setItem("user", JSON.stringify(user));
};

export const getToken = () => localStorage.getItem("token") || null;

export const setToken = (t) => localStorage.setItem("token", t);

export const clearUser = () => {
  localStorage.removeItem("user");
  localStorage.removeItem("token");
};
