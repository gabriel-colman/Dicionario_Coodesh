import React from "react";
import SearchIcon from "../Icons/SearchIcon";

interface SearchBarProps {
  searchTerm: string;
  onSearchTermChange: (term: string) => void;
  onSearch: () => void;
  showBackButton: boolean;
  onBack: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  searchTerm,
  onSearchTermChange,
  onSearch,
  showBackButton,
  onBack,
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:ml-auto w-full">
      <div className="flex flex-row items-center w-full space-x-2">
        <input
          type="text"
          placeholder="Search..."
          className="p-2 border border-gray-300 rounded flex-1 w-full sm:max-w-xs"
          value={searchTerm}
          onChange={(e) => onSearchTermChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              onSearch();
            }
          }}
        />

        <button
          className="bg-[#FF6B00]  p-2 rounded flex justify-center text-white items-center transition-all duration-250 ease-in-out hover:brightness-110 hover:scale-103"
          onClick={onSearch}
        >
          <SearchIcon />
        </button>

        {showBackButton && (
          <button
            className="px-4 py-2 bg-gray-500 text-white rounded sm:w-24"
            onClick={onBack}
          >
            Back
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
