// src/app/components/Header.tsx
'use client';

import React, { useState, useRef, useEffect, FC } from "react";
import Link from 'next/link'; // Importação nativa do Next.js
import { useRouter, usePathname } from 'next/navigation'; // Importação correta para App Router
import LogoIcon from "../icons/binaryLogo";
import {
  FaBars,
  FaTimes,
  FaHome,
  FaStar,
  FaSignOutAlt,
} from "react-icons/fa";
import { BsPersonArmsUp } from "react-icons/bs";
import AccessibilityModal from "./AccessibilityModal"; // Import do modal
import pageNamesData from "@/data/br/pagesTitle.json"; // Ajuste o caminho conforme necessário
import { RiRoadMapFill } from "react-icons/ri";

const Header: FC = () => {
  const router = useRouter();
  const pathname = usePathname(); // Obtém o caminho atual
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Estado para rastrear o login
  const [isModalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    // Verifica o localStorage ao montar o componente
    const loggedInStatus = localStorage.getItem('isLoggedIn');
    setIsLoggedIn(loggedInStatus === 'true');

    // Sincroniza o estado de login entre múltiplas abas
    const handleStorageChange = () => {
      const updatedStatus = localStorage.getItem('isLoggedIn');
      setIsLoggedIn(updatedStatus === 'true');
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const [expanded, setExpanded] = useState(false);
  const [accessibilityMenuAnchor, setAccessibilityMenuAnchor] =
    useState<null | HTMLElement>(null);

  const menuRef = useRef<HTMLDivElement>(null);

  const openAccessibilityMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAccessibilityMenuAnchor(event.currentTarget);
  };

  const closeAccessibilityMenu = () => {
    setAccessibilityMenuAnchor(null);
  };

  const atualPageName =
    pathname && pathname.includes('/roadmap/') ? 
    'Roadmap' :
    pageNamesData[pathname as keyof typeof pageNamesData] ||
    "Página Não Encontrada";

  const navItems = [
    {
      icon: <FaHome 
        className="cursor-pointer"
        role="link"
        aria-label="Ir para a tela principal"
        tabIndex={0}
      />,
      label: "Tela Principal",
      path: "/",
    },
    {
      icon: <FaStar 
        className="cursor-pointer"
        role="link"
        aria-label="Ir para os roadmaps favoritos"
        tabIndex={0}
      />,
      label: "Roadmaps Favoritos",
      path: "/pages/savedroads",
    },
  ];

  const handleLogout = () => {
    // Atualiza o estado
    setIsLoggedIn(false);
    // Atualiza o localStorage
    localStorage.setItem('isLoggedIn', 'false');

    // Redireciona para a página principal
    router.push('/'); // Ajuste o caminho conforme a estrutura da sua aplicação
  };

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

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
        backgroundColor: "var(--marine-header)",
        boxShadow: "none",
      }}
    >
      <div className="mx-auto flex max-w-screen-2xl items-center justify-between p-5">
        <Link href="/" onClick={() => setMenuOpen(false)}>
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
            <button onClick={() => setMenuOpen(!menuOpen)} aria-label="Abrir menu">
              <FaBars
                className="h-8 w-8"
                style={{ color: "var(--background)" }}
              />
            </button>
          </div>
          <div className="flex md:hidden h-sm:hidden">
            <button onClick={() => setMenuOpen(!menuOpen)} aria-label="Abrir menu">
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
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{
              backgroundColor: "var(--background-secondary)",
            }}
          >
            <button
              className="absolute top-5 right-5 text-3xl"
              style={{ color: "var(--action)" }}
              onClick={() => setMenuOpen(false)}
              aria-label="Fechar menu"
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
                  <Link
                    key={index}
                    href={path}
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center space-x-4 p-4 text-lg font-bold hover:text-gray-500 w-full justify-center"
                    style={{ color: "var(--primary)" }}
                  >
                    <div>{icon}</div>
                    <span>{label}</span>
                  </Link>
                ))}

                <div className="border-t border-gray-300 my-4"></div>

                {/* Accessibility Button */}
                <div className="flex items-center space-x-4 p-4 text-lg font-bold w-full justify-center cursor-pointer" >
                  <button onClick={openModal} className="flex items-center" aria-label="Abrir opções de acessibilidade">
                    <BsPersonArmsUp style={{ color: "var(--primary)" }} />
                    <span style={{ color: "var(--primary)" }}>
                      Acessibilidade
                    </span>
                  </button>
                </div>

                <div className="border-t border-gray-300 my-4"></div>
                {isLoggedIn && (
                  <button
                    className="flex items-center space-x-4 p-4 text-lg font-bold hover:text-red-300 w-full justify-center"
                    style={{ color: "var(--primary)" }}
                    onClick={handleLogout}
                    aria-label="Sair"
                  >
                    <FaSignOutAlt style={{ color: "var(--red2)" }} />
                    <span style={{ color: "var(--red2)" }}>Sair</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Accessibility Modal */}
      <AccessibilityModal isOpen={isModalOpen} onClose={closeModal} />
    </div>
  );
};

export default Header;
