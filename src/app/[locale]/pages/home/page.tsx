"use client";
import { useEffect, useState } from "react";
import Button from "../../components/Button";
import { useSearchParams } from "next/navigation";
import { useRouter } from "@/src/navigation";
import PostSearch from "../../components/PostSearch";
import LoadingOverlay from "../../components/LoadingOverlay";
import { Footer } from "../../components/Footer";
import RoadmapCard from "../../components/RoadmapCard";

export default function Home() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [showLoading, setShowLoading] = useState(false)

  const mathTopics = [
    "Tópico 1",
    "Tópico 2",
    "Tópico 3",
    "Tópico 4",
  ]

  return (
    <div className="px-4 py-10 md:px-10 md:py-20 mt-24">
      {showLoading ? (
        <div className="transition-opacity duration-500 opacity-100">
          <LoadingOverlay />
        </div>
      ) : (
        <div className="transition-opacity duration-500 opacity-100">
          <RoadmapCard image={"https://via.placeholder.com/250x300"} title="Matemática" progress={50} topics={mathTopics} />
        </div>
      )}
    </div>
  );
}
