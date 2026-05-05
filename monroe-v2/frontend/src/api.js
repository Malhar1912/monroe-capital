import axios from "axios";

export const api = axios.create({
  baseURL: "https://monroe-capital.onrender.com/api"
});
