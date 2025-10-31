export const getToken = (): string | null => {
  return sessionStorage.getItem("token");
};

export const setToken = (token: string): void => {
  sessionStorage.setItem("token", token);
};

export const removeToken = (): void => {
  sessionStorage.removeItem("token");
};

export const setRole = (role: string): void => {
  sessionStorage.setItem("role", role);
};

export const setUserId = (id: string): void => {
  sessionStorage.setItem("userId", id);
};

export const setAdminId = (id: string): void => {
  sessionStorage.setItem("adminId", id);
};

export const setUserData = (userData: string): void => {
  sessionStorage.setItem("userData", userData);
};

export const setAdminData = (adminData: string): void => {
  sessionStorage.setItem("adminData", adminData);
};

export const clearSession = (): void => {
  sessionStorage.clear();
};
