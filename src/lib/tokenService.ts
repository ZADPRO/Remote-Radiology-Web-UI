// utils/tokenService.ts

const TOKEN_KEY = "token";
const TOKEN_UPDATED_KEY = "token_last_updated";

export const tokenService = {
  setToken: (token: string) => {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(TOKEN_UPDATED_KEY, String(Date.now()));
  },

  getToken: (): string | null => {
    return localStorage.getItem(TOKEN_KEY);
  },

  removeToken: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(TOKEN_UPDATED_KEY);
  },

  getLastUpdated: (): number | null => {
    const value = localStorage.getItem(TOKEN_UPDATED_KEY);
    return value ? parseInt(value, 10) : null;
  },
};