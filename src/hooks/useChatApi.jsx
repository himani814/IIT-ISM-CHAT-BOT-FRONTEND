import { useState } from "react";
import axios from "axios";

// const server = "http://127.0.0.1:8000/chat";
const server='https://bckd.onrender.com/chat'

const useChatApi = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const sendMessage = async (query) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post(server, { question: query });
      return response.data; // ✅ stringify here
    } catch (err) {
      let customError = err.message;

      if (customError.includes("Network Error")) {
        customError =
          "CORS error or network issue. Please contact the server team to allow your endpoint.";
      }

      setError(customError);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { sendMessage, isLoading, error };
};

export default useChatApi;
