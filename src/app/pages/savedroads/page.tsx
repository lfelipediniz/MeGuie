"use client";
import { useEffect, useState } from "react";
import { useRouter } from "@/src/navigation";
import LoadingOverlay from "../../components/LoadingOverlay";
import SearchBar from "../../components/SearchBar";

export default function SavedRoads() {
  const router = useRouter();
  const [showLoading, setShowLoading] = useState(false);

  function handleBack() {
    router.back();
  }

  return (
    <div className="mt-16 p-4 md:p-8 bg-[var(--background-secondary)]">
      {showLoading ? (
        <div className="transition-opacity duration-500 opacity-100 mx-auto max-w-screen-2xl">
          <LoadingOverlay />
        </div>
      ) : (
        <div className="transition-opacity duration-500 opacity-100 mx-auto max-w-screen-2xl">
          <div className="w-full h-12 flex justify-between items-center gap-4 mb-4">

          <SearchBar onSearch={(query) => console.log(query)} onBack={handleBack} />
         
          </div>
          <br />
          <div className="w-full flex flex-col gap-4">
            <h2 className="text-[var(--dark-blue)] text-xl md:text-2xl font-bold">Roadmaps</h2>
            <div style={{ height: '150px' }}>
              <span>Em produção...</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
