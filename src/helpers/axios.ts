// axiosClient.js
import ogAxios from "axios";

// Create an instance of axios
const axios = ogAxios.create({
  headers: {
    "Content-Type": "application/json", // Default headers (optional)
  },
});

export default axios;
