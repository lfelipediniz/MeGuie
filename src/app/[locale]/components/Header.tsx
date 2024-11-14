"use client";
import { useState, useRef, useEffect } from "react";
import { Link, usePathname } from "@/src/navigation";
import { useTranslations } from "next-intl";
import { FC } from "react";
import LogoIcon from "../../icons/logo";
import LangSwitcher from "./LangSwitcher";
import ThemeSwitch from "./ThemeSwitch";
import { RxAccessibility } from "react-icons/rx";
import { MdOutlineSettingsAccessibility } from "react-icons/md";
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
    <div className="fixed top-0 left-0 right-0 z-40 bg-background shadow-md transition-all duration-300">
      <div className="mx-auto flex max-w-screen-2xl items-center justify-between p-5">
        {/* Logo */}
        {/* <Link
          lang={locale}
          href={"/"}
          className={getLinkClass("/")}
          onClick={() => setMenuOpen(false)}
        >
          <div className="flex flex-row items-center">
            <div className="mb-2 h-14 w-14">
              <LogoIcon />
            </div>
          </div>
        </Link> */}

        {/* Apenas aplica margin-left em dispositivos desktop */}
        <div className="flex-1 flex justify-center text-center font-bold ml-0 md:ml-16">
          {atualPageName}
        </div>

        {/* Botão do menu hambúrguer para mobile */}
        <div className="flex md:hidden">
          <button onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? (
              <MdOutlineSettingsAccessibility className="h-8 w-8 text-primary" />
            ) : (
              <RxAccessibility className="h-8 w-8 text-primary" />
            )}
          </button>
        </div>

        {/* Menu para dispositivos móveis */}
        <div
          ref={menuRef}
          className={`md:hidden absolute right-0 top-full mt-2 rounded-md shadow-md ${
            menuOpen ? "block" : "hidden"
          } z-50`}
          style={{ backgroundColor: "var(--background-secondary)" }} // Acompanha o tema
        >
          <div className="flex flex-col items-center justify-center p-4">
            <ThemeSwitch />
          </div>
        </div>

        <div className="hidden md:flex flex-row items-center gap-3">
          <ThemeSwitch />
        </div>
      </div>
    </div>
  );
};

export default Header;
