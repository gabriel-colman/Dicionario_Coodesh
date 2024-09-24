import axios from "axios";

const apiBaseUrl = process.env.REACT_APP_API_URL || "http://localhost:5000";

export const addFavorite = async (word: string, token: string) => {
  await axios.post(
    `${apiBaseUrl}/entries/en/${word}/favorite`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const removeFavorite = async (word: string, token: string) => {
  await axios.delete(`${apiBaseUrl}/entries/en/${word}/unfavorite`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const addViewed = async (word: string, token: string) => {
  await axios.post(
    `${apiBaseUrl}/entries/en/${word}/viewed`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};
