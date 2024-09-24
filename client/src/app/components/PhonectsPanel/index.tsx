import React from "react";
import Image from "next/image";
import carregando from "../../../../public/images/carregando.gif";
import { PhoneticsData } from "../../../../types";

interface PhoneticsPanelProps {
  phoneticsData: PhoneticsData | null;
  audioRef: React.RefObject<HTMLAudioElement>;
  isLoading: boolean;
}

const PhoneticsPanel: React.FC<PhoneticsPanelProps> = ({
  phoneticsData,
  audioRef,
  isLoading,
}) => {
  if (isLoading) {
    return (
      <div className="bg-black p-4 rounded-lg shadow-lg hidden md:flex flex-col h-[calc(70vh-3rem)] w-full md:w-1/4 mt-16">
        <div className="flex items-center justify-center h-full">
          <Image src={carregando} alt="Loading" width={100} height={100} />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#111111] text-white p-4 rounded-lg shadow-lg hidden md:flex flex-col h-[calc(80vh-3rem)] w-full md:w-1/4 mt-16 mr-2 ">
      <div className="bg-[#FF6B00] text-white p-4 rounded-lg flex flex-col justify-center items-center mb-4 h-[60%]">
        <h2 className="text-2xl font-bold mb-4 text-center">
          {phoneticsData ? phoneticsData.word : "Selected Word"}
        </h2>
        {phoneticsData && phoneticsData.phonetics.length > 0 ? (
          <div className="w-full">
            <h3 className="text-lg font-semibold mb-2 text-center">
              Phonetics
            </h3>
            {phoneticsData.phonetics.map((phonetic, index) => (
              <div key={index} className="mb-4 text-center">
                <p className="text-lg">{phonetic.text}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center">No phonetics available</p>
        )}
      </div>

      <div className=" p-1 rounded-lg flex-shrink-0 h-[10%]">
        {phoneticsData && phoneticsData.phonetics.length > 0 ? (
          phoneticsData.phonetics.find((phonetic) => phonetic.audio) ? (
            <div className="mb-4">
              <audio ref={audioRef} controls className="w-full rounded-md">
                <source
                  src={
                    phoneticsData.phonetics.find((phonetic) => phonetic.audio)
                      ?.audio
                  }
                  type="audio/mpeg"
                />
                Your browser does not support the audio element.
              </audio>
            </div>
          ) : (
            <p className="text-center">No audio available</p>
          )
        ) : (
          <p className="text-center">No phonetic data available</p>
        )}
      </div>

      <div className="h-[40%] overflow-y-auto">
        <h3 className="text-lg font-semibold mt-4">Definition</h3>
        {phoneticsData && phoneticsData.definitions.length > 0 ? (
          <p>{phoneticsData.definitions[0]}</p>
        ) : (
          <p>No definitions available</p>
        )}
      </div>
    </div>
  );
};

export default PhoneticsPanel;
