"use client";

import React from "react";
import { addFavorite, removeFavorite } from "@/app/services/favoriteService";
import FavoriteIcon from "../Icons/FavoriteIcon";

interface ToggleFavoriteProps {
  word: string;
  isFavorite: boolean;
  onToggle: (word: string) => void;
}

const ToggleFavorite: React.FC<ToggleFavoriteProps> = ({
  word,
  isFavorite,
  onToggle,
}) => {
  const handleToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const token = localStorage.getItem("token") || "";

    try {
      if (isFavorite) {
        await removeFavorite(word, token);
      } else {
        await addFavorite(word, token);
      }
      onToggle(word);
    } catch (error) {
      console.error("Erro ao atualizar favoritos", error);
    }
  };
  return (
    <button
      onClick={handleToggle}
      className={`ml-2 ${isFavorite ? "text-yellow-500" : "text-gray-500"}`}
    >
      {isFavorite ? (
        <svg
          className="w-6 h-6"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M12 17.27l-6.18 3.73 1.64-7.03L2 10.24l7.19-.61L12 3l2.81 6.63L22 10.24l-5.46 3.73 1.64 7.03L12 17.27z" />
        </svg>
      ) : (
        <FavoriteIcon />
      )}
    </button>
  );
};

export default ToggleFavorite;
