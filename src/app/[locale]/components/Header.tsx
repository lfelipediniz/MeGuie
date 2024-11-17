"use client";
import { useState, useRef, useEffect } from "react";
import { Link, usePathname, useRouter } from "@/src/navigation";
import { useTranslations } from "next-intl";
import { FC } from "react";
import LogoIcon from "../../icons/binaryLogo";
import ThemeSwitch from "./ThemeSwitch";
import {
  FaBars,
  FaTimes,
  FaHome,
  FaCalendarAlt,
  FaStar,
  FaSignOutAlt,
} from "react-icons/fa";
import pageNamesData from "@/data/br/pagesTitle.json";

interface Props {
  locale: string;
}

export const Header: FC<Props> = ({ locale }) => {
  const t = useTranslations("");
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const atualPageName =
    pageNamesData[pathname as keyof typeof pageNamesData] ||
    "Página Não Encontrada";

  const navItems: {
    icon: JSX.Element;
    label: string;
    path: "pages/home" | "pages/calendar" | "pages/savedroads";
  }[] = [
    { icon: <FaHome />, label: "Tela Principal", path: "pages/home" },
    { icon: <FaCalendarAlt />, label: "Calendário", path: "pages/calendar" },
    { icon: <FaStar />, label: "Favoritos", path: "pages/savedroads" },
  ];

  const handleLogout = () => {
    router.push("/");
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
        backgroundColor: "var(--marine)",
        boxShadow: "none",
      }}
    >
      <div className="mx-auto flex max-w-screen-2xl items-center justify-between p-5">
        <Link lang={locale} href={"/"} onClick={() => setMenuOpen(false)}>
          <div className="flex flex-row items-center md:hidden">
            <div className="w-14">
              <LogoIcon />
            </div>
          </div>
        </Link>

        <div
          className="flex-1 flex justify-center text-center font-bold ml-0 md:ml-16"
          style={{ color: "var(--background)" }}
        >
          {atualPageName}
        </div>

        <div>
          <div className="h-md:hidden flex">
            <button onClick={() => setMenuOpen(!menuOpen)}>
              <FaBars
                className="h-8 w-8"
                style={{ color: "var(--background)" }}
              />
            </button>
          </div>
          <div className="flex md:hidden h-sm:hidden">
            <button onClick={() => setMenuOpen(!menuOpen)}>
              <FaBars
                className="h-8 w-8"
                style={{ color: "var(--background)" }}
              />
            </button>
          </div>
        </div>
      </div>

      {menuOpen && (
        <>
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setMenuOpen(false)}
          ></div>

          <div
            ref={menuRef}
            className="fixed inset-0 z-50 flex items-center justify-center relative"
            style={{
              backgroundColor: "var(--background-secondary)",
            }}
          >
            <button
              className="absolute top-5 right-5 text-3xl"
              style={{ color: "var(--action)" }}
              onClick={() => setMenuOpen(false)}
            >
              <FaTimes />
            </button>

            <div
              className="flex flex-col items-center text-center p-4 w-full max-w-lg overflow-y-auto"
              style={{
                height: "100vh",
                maxHeight: "100vh",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <div className="space-y-8 w-full">
                {navItems.map(({ icon, label, path }, index) => (
                  <button
                    key={index}
                    className="flex items-center space-x-4 p-4 text-lg font-bold hover:text-gray-500 w-full justify-center"
                    style={{ color: "var(--primary)" }}
                    onClick={() => {
                      router.push(path);
                      setMenuOpen(false);
                    }}
                  >
                    <div>{icon}</div>
                    <span>{label}</span>
                  </button>
                ))}
                <button
                  className="flex items-center space-x-4 p-4 text-lg font-bold hover:text-red-300 w-full justify-center"
                  style={{ color: "var(--primary)" }}
                  onClick={handleLogout}
                >
                  <FaSignOutAlt style={{ color: "var(--red)" }} />
                  <span style={{ color: "var(--red)" }}>Logout</span>
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Header;
