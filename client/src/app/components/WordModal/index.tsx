import React, { useRef, useEffect } from "react";
import Modal from "react-modal";
import CloseIcon from "../Icons/CloseIcon";
import Image from "next/image";
import carregando from "../../../../public/images/carregando.gif";
import { PhoneticsData } from "../../../../types";

interface WordModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  selectedWord: string | null;
  phoneticsData: PhoneticsData | null;
  isMobile: boolean;
  isLoading: boolean;
}

const WordModal: React.FC<WordModalProps> = ({
  isOpen,
  onRequestClose,
  selectedWord,
  phoneticsData,
  isLoading,
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, [selectedWord]);
  if (isOpen) {
    document.body.classList.add("no-scroll");
  } else {
    document.body.classList.remove("no-scroll");
  }

  if (!selectedWord) return null;

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Word Details"
      ariaHideApp={false}
      className="fixed inset-0 flex items-center justify-center p-4 "
      overlayClassName="fixed inset-0 bg-black bg-opacity-50"
    >
      <div className="relative bg-[#111111] rounded-lg shadow-lg p-4 h-full w-full max-w-screen-sm">
        <button
          onClick={onRequestClose}
          className="absolute top-2 left-2 text-gray-500 hover:text-gray-700"
          aria-label="Close"
        >
          <CloseIcon />
        </button>
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <Image
              src={carregando}
              alt="Loading"
              width={100}
              height={100}
              layout="intrinsic"
            />
          </div>
        ) : (
          <div className="flex flex-col items-center text-center h-full w-full mt-8">
            <div className="w-full bg-[#FF6B00]  text-white p-4 mb-4 rounded-lg flex flex-col items-center justify-center h-[40%]">
              <h2 className="text-3xl font-bold mb-2">{selectedWord}</h2>
              {phoneticsData && phoneticsData.phonetics.length > 0 ? (
                <p className="text-xl font-semibold">
                  {phoneticsData.phonetics[0].text}
                </p>
              ) : (
                <p>No phonetics available</p>
              )}
            </div>
            <div className="w-full mb-4 text-white">
              {phoneticsData &&
                phoneticsData.phonetics.length > 0 &&
                phoneticsData.phonetics[0].audio && (
                  <audio ref={audioRef} controls className="w-full">
                    <source
                      src={phoneticsData.phonetics[0].audio}
                      type="audio/mpeg"
                    />
                    Your browser does not support the audio element.
                  </audio>
                )}
            </div>
            <div className="w-full mb-4">
              <h3 className="text-lg font-semibold text-white">Definition</h3>
              {phoneticsData && phoneticsData.definitions.length > 0 ? (
                <p className="text-white">{phoneticsData.definitions[0]}</p>
              ) : (
                <p>No definitions available</p>
              )}
            </div>
            <button
              onClick={onRequestClose}
              className="mt-4 px-4 py-2 bg-[#1e1e1e] text-white rounded"
            >
              Back
            </button>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default WordModal;
