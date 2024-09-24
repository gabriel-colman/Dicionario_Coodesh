import React, { useCallback, useEffect } from "react";
import axios from "axios";

interface MarkAsViewedProps {
  word: string;
  onMarkAsViewed: (word: string) => void;
}
const apiBaseUrl = process.env.REACT_APP_API_URL || "http://localhost:5000";
const MarkAsViewed: React.FC<MarkAsViewedProps> = ({
  word,
  onMarkAsViewed,
}) => {
  const handleMarkAsViewed = useCallback(async () => {
    try {
      await axios.post(
        `${apiBaseUrl}/entries/en/${word}/viewed`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      onMarkAsViewed(word);
    } catch (error) {
      console.error("Error updating viewed words", error);
    }
  }, [word, onMarkAsViewed]);

  useEffect(() => {
    handleMarkAsViewed();
  }, [handleMarkAsViewed]);

  return null;
};

export default MarkAsViewed;
