"use client";
import { useState, useRef, useEffect } from "react";
import { Link, usePathname } from "@/src/navigation";
import { useTranslations } from "next-intl";
import { FC } from "react";
import LogoIcon from "../../icons/binaryLogo";
import ThemeSwitch from "./ThemeSwitch";
import { FaBars } from "react-icons/fa"; // Novo ícone de menu hambúrguer
import pageNamesData from "@/data/br/pagesTitle.json";

interface Props {
  locale: string;
}

export const Header: FC<Props> = ({ locale }) => {
  const t = useTranslations("");
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const atualPageName = pageNamesData[pathname as keyof typeof pageNamesData] || "Página Não Encontrada";

  const getLinkClass = (path: string) => {
    return pathname === path ? "text-data-purple font-bold" : "";
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  return (
    <div
      className="fixed top-0 left-0 right-0 z-40 transition-all duration-300"
      style={{
        backgroundColor: "var(--marine)", // Cor de fundo
        boxShadow: "none", // Remove a sombra
      }}
    >
      <div className="mx-auto flex max-w-screen-2xl items-center justify-between p-5">
        {/* Logo */}
        <Link
          lang={locale}
          href={"/"}
          className={getLinkClass("/")}
          onClick={() => setMenuOpen(false)}
        >
          <div className="flex flex-row items-center md:hidden">
            <div className="w-14">
              <LogoIcon />
            </div>
          </div>
        </Link>

        {/* Nome da página atual */}
        <div
          className="flex-1 flex justify-center text-center font-bold ml-0 md:ml-16"
          style={{ color: "var(--background)" }} // Cor do texto
        >
          {atualPageName}
        </div>
        
          {/* Menu de navegação */}
        {/* Botão do menu hambúrguer para mobile */}
        <div>

        <div className="h-md:hidden flex">
          <button onClick={() => setMenuOpen(!menuOpen)}>
            <FaBars className="h-8 w-8" style={{ color: "var(--background)" }} /> {/* Ícone do menu hambúrguer */}
          </button>
        </div>
        <div className="flex md:hidden h-sm:hidden">
          <button onClick={() => setMenuOpen(!menuOpen)}>
            <FaBars className="h-8 w-8" style={{ color: "var(--background)" }} /> {/* Ícone do menu hambúrguer */}
          </button>
        </div>
        </div>

        {/* Menu para dispositivos móveis */}
        <div
          ref={menuRef}
          className={`md:hidden absolute right-0 top-full mt-2 rounded-md shadow-md ${
            menuOpen ? "block" : "hidden"
          } z-50`}
          style={{ backgroundColor: "var(--background-secondary)" }}
        >
          <div className="flex flex-col items-center justify-center p-4">
            <ThemeSwitch />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
