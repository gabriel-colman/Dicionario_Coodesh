import React from "react";

interface AlphabetMenuProps {
  startLetter: string;
  onFilterByLetter: (letter: string) => void;
  isMobile: boolean;
}

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

const AlphabetMenu: React.FC<AlphabetMenuProps> = ({
  startLetter,
  onFilterByLetter,
  isMobile,
}) => {
  return isMobile ? (
    <select
      value={startLetter}
      onChange={(e) => onFilterByLetter(e.target.value)}
      className="p-2 border border-gray-300 rounded w-full bg-gray-100 text-gray-700 hover:border-[#FF6B00] focus:outline-none focus:ring-1 focus:ring-[#FF6B00] transition duration-200 ease-in-out"
    >
      <option value="">A-Z</option>
      {alphabet.map((letter) => (
        <option key={letter} value={letter}>
          {letter}
        </option>
      ))}
    </select>
  ) : (
    <div className="flex flex-wrap gap-2 justify-center items-center p-4 bg-gray-900 rounded-lg shadow-lg">
      {alphabet.map((letter) => (
        <button
          key={letter}
          className={`px-4 py-2 rounded-full transition-transform duration-300 ease-in-out hover:scale-105 ${
            startLetter === letter
              ? "bg-[#FF6B00] text-white shadow-lg"
              : "bg-gray-300 text-gray-800 hover:bg-[#FF6B00] hover:text-white hover:shadow-lg"
          }`}
          onClick={() => onFilterByLetter(letter)}
        >
          {letter}
        </button>
      ))}
    </div>
  );
};

export default AlphabetMenu;
