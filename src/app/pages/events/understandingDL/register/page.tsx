"use client";
import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import speakerData from "@/data/br/udl2024.json";
import speakerDataEn from "@/data/en/udl2024.json";
import { FaChevronDown } from "react-icons/fa";

interface Speaker {
  name: string;
  photo: string;
  description: string;
}

const MAX_DESCRIPTION_LENGTH = 100;

const Register: React.FC = () => {


  const [expandedSpeaker, setExpandedSpeaker] = useState<number | null>(null);
  const [hoveredSpeaker, setHoveredSpeaker] = useState<number | null>(null);
  const [height, setHeight] = useState<number>(0);
  const descriptionRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (descriptionRef.current) {
      setHeight(descriptionRef.current.scrollHeight);
    }
  }, [expandedSpeaker, hoveredSpeaker]);

  const handleExpandToggle = (index: number) => {
    if (expandedSpeaker === index) {
      setExpandedSpeaker(null);
    } else {
      setExpandedSpeaker(index);
      setHoveredSpeaker(null);
    }
  };

  const handleMouseEnter = (index: number) => {
    if (expandedSpeaker === null) {
      setHoveredSpeaker(index);
    }
  };

  const handleMouseLeave = () => {
    if (expandedSpeaker === null) {
      setHoveredSpeaker(null);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 mt-32">

    </div>
  );
};

export default Register;
