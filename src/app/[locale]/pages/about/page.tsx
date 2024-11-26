"use client";
import { useTranslations } from "next-intl";
import OrganizingCommittee from "../../components/OrganizingCommittee";
import Photo from "../../components/Photo";

// Import dos arquivos JSON
import peopleBR from "../../../../../data/br/people.json";
import peopleEN from "../../../../../data/en/people.json";

export default function About() {
  const t = useTranslations("");
  const locale = t("DONT_DELETE"); // determina o idioma atual da página

  // seleciona o arquivo JSON correto com base no idioma
  const people = locale === "br" ? peopleBR : peopleEN;

  return (
    <div className="text-xl md:text-2xl mt-16 p-8">
      <div className="w-full max-w-screen-md mx-auto">
        <h1 className="text-primary dark:text-primary font-montserrat font-bold leading-tight text-3xl sm:text-5xl mb-2">
          MeGuie
        </h1>

        <section className="mb-8 md:mb-16">
          <p className="leading-relaxed px-4 md:px-0">
            {"Sobre o MeGuie"}
            <a
              href="https://www.icmc.usp.br/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-link"
            >
              {t("AboutSection.ICMC")}
            </a>
            {t("AboutSection.About_Description_1_2")}
            <a
              href="https://www.usp.br/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-link"
            >
              {t("AboutSection.USP")}
            </a>
            {t("AboutSection.About_Description_1_3")}
          </p>

          <h2 className="text-center md:text-left mt-8 md:mt-16">
            {"Sobre o desenvolvimento da plataforma"}
          </h2>
          <p className="leading-relaxed px-4 md:px-0 mt-2 md:mt-4">
            {t("AboutSection.Project_Organization_Description")}
          </p>
        </section>
      </div>
 
    </div>
  );
} 
