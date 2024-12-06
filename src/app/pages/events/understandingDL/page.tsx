"use client";
import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import Hero from "../../../components/Hero";
import "./style.css";
import UDLLogo from "@/public/images/udl2024/UDLLogo.png";
import UDLLogoWhite from "@/public/images/UDLLogo-white.png";
import FAQ from "../../../components/FAQ";
import Schedule, { EventData } from "../../../components/Schedule";
import Sponsors from "../../../components/Sponsors";

// Importa os arquivos JSON para ambos os idiomas
import eventDataBr from "@/data/br/udl2024.json";
import eventDataEn from "@/data/en/udl2024.json";
import faqDataBr from "@/data/br/udlFaq.json";
import faqDataEn from "@/data/en/udlFaq.json";

export default function UnderstandingDL() {
  const { resolvedTheme } = useTheme();
  const [logoSrc, setLogoSrc] = useState(UDLLogo.src);



  useEffect(() => {
    const updatedLogoSrc =
      resolvedTheme === "light" ? UDLLogoWhite.src : UDLLogo.src;
    setLogoSrc(updatedLogoSrc);
  }, [resolvedTheme]);

  const sponsorsData = [
    { logoUrl: "/images/icmc-logo.png" },
    { logoUrl: "/images/brains.png" },
    { logoUrl: "/images/centerIA.png" },
    // adicione mais patrocinadores conforme necessário
  ];

  return (
    <div className="mt-32">
     
    </div>
  );
}
