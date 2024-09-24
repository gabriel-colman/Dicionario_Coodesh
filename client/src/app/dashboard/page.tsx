"use client";
import Image from "next/image";
import React, { useState, useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  fetchWords,
  fetchPhonetics,
  fetchFavorites,
  fetchViewed,
} from "../services/api";
import { PhoneticsData, WordsData } from "../../../types";
import ToggleFavorite from "../components/ToglleFavorite";
import MarkAsViewed from "../components/MarkAsViwed";
import AlphabetMenu from "../components/AlphabetMenu";
import SearchBar from "../components/SearchBar";
import LeftIcon from "../components/Icons/LeftIcon";
import RightIcon from "../components/Icons/RightIcon";
import PhoneticsPanel from "../components/PhonectsPanel";
import WordModal from "../components/WordModal";
import carregando from "../../../public/images/carregando.gif";
import Footer from "../components/Footer";

export default function DashBoard() {
  const [page, setPage] = useState(1);
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [startLetter, setStartLetter] = useState("");
  const [previousPage, setPreviousPage] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [viewed, setViewed] = useState<string[]>([]);
  const [showBackButton, setShowBackButton] = useState(false);
  const [favoritesPage, setFavoritesPage] = useState(1);
  const [viewedPage, setViewedPage] = useState(1);
  const [viewMode, setViewMode] = useState<"all" | "favorites" | "viewed">(
    "all"
  );

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const {
    data: wordsData,
    isLoading: wordsLoading,
    error,
    refetch,
  } = useQuery<WordsData>({
    queryKey: ["words", page, searchQuery, startLetter],
    queryFn: () => fetchWords(page, searchQuery, startLetter),
    enabled: viewMode === "all",
  });

  const {
    data: phoneticsData,
    isLoading: phoneticsLoading,
    error: phoneticsError,
  } = useQuery<PhoneticsData>({
    queryKey: ["phonetics", selectedWord],
    queryFn: () =>
      selectedWord
        ? fetchPhonetics(selectedWord)
        : Promise.resolve({ word: "", phonetics: [], definitions: [] }),
    enabled: !!selectedWord,
  });

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, [selectedWord]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const [favoritesData, viewedData] = await Promise.all([
          fetchFavorites(),
          fetchViewed(),
        ]);
        setFavorites(favoritesData);
        setViewed(viewedData);
      } catch (error) {
        console.error("Error fetching user data", error);
      }
    };
    fetchUserData();
  }, []);

  const handleToggleFavorite = (word: string) => {
    setFavorites((prevFavorites) =>
      prevFavorites.includes(word)
        ? prevFavorites.filter((w) => w !== word)
        : [...prevFavorites, word]
    );
  };

  const handleMarkAsViewed = (word: string) => {
    setViewed((prevViewed) =>
      prevViewed.includes(word) ? prevViewed : [...prevViewed, word]
    );
  };

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleBack = () => {
    if (previousPage !== null) {
      setPage(previousPage);
      setSearchTerm("");
      setSearchQuery("");
      setStartLetter("");
      setPreviousPage(null);
      setShowBackButton(false);
    }
  };

  const handleFilterByLetter = (letter: string) => {
    setStartLetter(letter);
    setSearchTerm("");
    setSearchQuery("");
    setPage(1);
  };

  const handleSearch = () => {
    setSearchQuery(searchTerm);
    setStartLetter("");
    setPage(1);
    setPreviousPage(page);
    setShowBackButton(true);
  };

  useEffect(() => {
    if (viewMode === "all") {
      refetch();
    }
  }, [searchQuery, page, startLetter, viewMode, refetch]);

  useEffect(() => {
    if (viewMode === "favorites" || viewMode === "viewed") {
      setPage(1);
    }
  }, [viewMode]);

  const currentPage =
    viewMode === "all"
      ? page
      : viewMode === "favorites"
      ? favoritesPage
      : viewedPage;

  const totalPages =
    viewMode === "all"
      ? wordsData?.totalPages ?? 1
      : viewMode === "favorites"
      ? Math.ceil(favorites.length / 20)
      : Math.ceil(viewed.length / 20);

  const hasNext =
    viewMode === "all"
      ? wordsData?.hasNext ?? false
      : viewMode === "favorites"
      ? favoritesPage * 20 < favorites.length
      : viewedPage * 20 < viewed.length;

  const setCurrentPage = (newPage: number) => {
    if (viewMode === "all") {
      setPage(newPage);
    } else if (viewMode === "favorites") {
      setFavoritesPage(newPage);
    } else if (viewMode === "viewed") {
      setViewedPage(newPage);
    }
  };

  const openModal = (word: string) => {
    setSelectedWord(word);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedWord(null);
  };

  const renderWords = (words: string[]) => (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-4">
      {words.map((word, index) => (
        <div
          key={index}
          className="p-4 bg-[#1e1e1e] text-white rounded-lg shadow cursor-pointer transition-all duration-300 ease-in-out hover:bg-[#333] hover:brightness-105 hover:scale-105"
          onClick={() => openModal(word)}
        >
          <div className="flex justify-between items-center">
            <span className="truncate">{word}</span>
            <div className="flex items-center gap-2">
              <ToggleFavorite
                word={word}
                isFavorite={favorites.includes(word)}
                onToggle={handleToggleFavorite}
              />

              {selectedWord === word && (
                <MarkAsViewed word={word} onMarkAsViewed={handleMarkAsViewed} />
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const handleViewModeChange = (mode: "all" | "favorites" | "viewed") => {
    setViewMode(mode);
    if (mode === "all") {
      setPage(1);
    } else if (mode === "favorites") {
      setFavoritesPage(1);
    } else if (mode === "viewed") {
      setViewedPage(1);
    }
  };

  if (wordsLoading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-800 to-black">
        <Image src={carregando} alt="Loading" width={258} height={310} />
      </div>
    );
  if (error) return <div className="text-red-500">Error: {error.message}</div>;

  const displayWords =
    viewMode === "all"
      ? wordsData?.results || []
      : viewMode === "favorites"
      ? favorites.slice((favoritesPage - 1) * 20, favoritesPage * 20)
      : viewMode === "viewed"
      ? viewed.slice((viewedPage - 1) * 20, viewedPage * 20)
      : [];

  return (
    <>
      <div className="p-2 md:p-16 flex flex-col md:flex-row bg-gray-900 bg-opacity-90 min-h-screen">
        <PhoneticsPanel
          phoneticsData={phoneticsData || null}
          audioRef={audioRef}
          isLoading={phoneticsLoading}
        />
        <div className="md:w-3/4 p-4 mt-4 md:mt-12 ">
          <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:mb-4">
            <div className="flex flex-wrap gap-2 mb-4 sm:mb-0 sm:mr-4 w-full">
              <button
                className={`px-4 py-2 rounded flex-1 ${
                  viewMode === "all"
                    ? "bg-[#FF6B00] font-bold text-white transition-all duration-300 ease-in-out hover:brightness-110 hover:scale-105"
                    : "bg-gray-300 font-bold transition-all duration-300 ease-in-out hover:brightness-110 hover:scale-105"
                }`}
                onClick={() => handleViewModeChange("all")}
              >
                World list
              </button>
              <button
                className={`px-4 py-2 rounded flex-1 ${
                  viewMode === "favorites"
                    ? "bg-yellow-500 text-white font-bold transition-all duration-300 ease-in-out hover:brightness-110 hover:scale-105"
                    : "bg-gray-300 font-bold transition-all duration-300 ease-in-out hover:brightness-110 hover:scale-105"
                }`}
                onClick={() => handleViewModeChange("favorites")}
              >
                Favorites
              </button>
              <button
                className={`px-4 py-2 rounded flex-1 ${
                  viewMode === "viewed"
                    ? "bg-green-500 text-white font-bold transition-all duration-300 ease-in-out hover:brightness-110 hover:scale-105"
                    : "bg-gray-300 font-bold transition-all duration-300 ease-in-out hover:brightness-110 hover:scale-105"
                }`}
                onClick={() => handleViewModeChange("viewed")}
              >
                History
              </button>
            </div>

            <SearchBar
              searchTerm={searchTerm}
              onSearchTermChange={(term) => setSearchTerm(term)}
              onSearch={handleSearch}
              showBackButton={showBackButton}
              onBack={handleBack}
            />
          </div>

          <div className="mb-4">
            <AlphabetMenu
              startLetter={startLetter}
              onFilterByLetter={handleFilterByLetter}
              isMobile={isMobile}
            />
          </div>

          {displayWords.length > 0 ? (
            <>
              {renderWords(displayWords)}
              <div className="flex justify-between mt-4">
                <button
                  disabled={currentPage <= 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                  className={`p-2 rounded ${
                    currentPage > 1
                      ? "bg-[#FF6B00] text-white transition-all duration-300 ease-in-out hover:brightness-110 hover:scale-105"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed transition-all duration-300 ease-in-out hover:brightness-110 hover:scale-105"
                  }`}
                >
                  <LeftIcon />
                </button>

                <div className="text-gray-400">
                  Page {currentPage} / {totalPages}
                </div>

                <button
                  disabled={!hasNext && currentPage === totalPages}
                  onClick={() => setCurrentPage(currentPage + 1)}
                  className={`p-2 rounded ${
                    hasNext || currentPage < totalPages
                      ? "bg-[#FF6B00] text-white transition-all duration-300 ease-in-out hover:brightness-110 hover:scale-105"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed transition-all duration-300 ease-in-out hover:brightness-110 hover:scale-105"
                  }`}
                >
                  <RightIcon />
                </button>
              </div>
            </>
          ) : (
            <div className="text-white text-center mt-8">No words found.</div>
          )}
        </div>

        {isMobile && (
          <WordModal
            isOpen={isModalOpen}
            onRequestClose={closeModal}
            selectedWord={selectedWord}
            phoneticsData={phoneticsData || null}
            isMobile={isMobile}
            isLoading={phoneticsLoading}
          />
        )}
      </div>
      <footer className="flex-auto bg-gray-800 text-gray-400">
        <Footer />
      </footer>
    </>
  );
}
