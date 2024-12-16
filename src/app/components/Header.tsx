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
import { MdAdminPanelSettings } from "react-icons/md"; // Importar o ícone de admin
import axios from "axios";
import { IUser } from "@/models/User"; // Importar a interface IUser

const Header: FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Estado para rastrear o login
  const [user, setUser] = useState<IUser | null>(null); // Estado para armazenar o usuário
  const [isModalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    // Verifica se o authToken existe no localStorage ao montar o componente
    const authToken = localStorage.getItem('authToken');
    setIsLoggedIn(!!authToken);

    if (authToken) {
      axios
        .get("/api/user", {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        })
        .then((response) => {
          setUser(response.data);
        })
        .catch((error) => {
          console.error("Erro ao buscar dados do usuário:", error);
          setUser(null); // Em caso de erro, zere o estado do usuário
        });
    }

    // Sincroniza o estado de login entre múltiplas abas
    const handleStorageChange = () => {
      const updatedToken = localStorage.getItem('authToken');
      setIsLoggedIn(!!updatedToken);
      if (!updatedToken) {
        setUser(null);
      } else {
        // Opcional: Recarregar os dados do usuário se o token for atualizado
        axios
          .get("/api/user", {
            headers: {
              Authorization: `Bearer ${updatedToken}`,
            },
          })
          .then((response) => {
            setUser(response.data);
          })
          .catch((error) => {
            console.error("Erro ao buscar dados do usuário:", error);
            setUser(null);
          });
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const [expanded, setExpanded] = useState(false);
  const [accessibilityMenuAnchor, setAccessibilityMenuAnchor] = useState<null | HTMLElement>(null);

  const menuRef = useRef<HTMLDivElement>(null);

  const openAccessibilityMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAccessibilityMenuAnchor(event.currentTarget);
  };

  const closeAccessibilityMenu = () => {
    setAccessibilityMenuAnchor(null);
  };

  const atualPageName =
    pathname && pathname.includes('/roadmap/')
      ? 'Roadmap'
      : pageNamesData[pathname as keyof typeof pageNamesData] || "Página Não Encontrada";

  const navItems = [
    {
      icon: <FaHome aria-label="Ir para a tela principal" />,
      label: "Tela Principal",
      path: "/",
    },
    ...(isLoggedIn
      ? [
          {
            icon: <FaStar aria-label="Ir para os roadmaps favoritos" />,
            label: "Favoritos",
            path: "/pages/savedroads",
          },
        ]
      : []),
    ...(user?.admin
      ? [
          {
            icon: <MdAdminPanelSettings aria-label="Ir para o Admin" />,
            label: "Administrador",
            path: "/pages/admin",
          },
        ]
      : []),
  ];

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);

  const handleLogout = () => {
    // Remove o authToken do localStorage
    localStorage.removeItem('authToken');
    setIsLoggedIn(false);
    setUser(null);
    setMenuOpen(false);

    // Redireciona para a página principal
    router.push('/');
    window.location.href = "/";
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
                <div className="flex items-center space-x-4 p-4 text-lg font-bold w-full justify-center cursor-pointer">
                  <button
                    onClick={openModal}
                    className="flex items-center"
                    aria-label="Abrir opções de acessibilidade"
                  >
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
                    <FaSignOutAlt style={{ color: "var(--red)" }} />
                    <span style={{ color: "var(--red)" }}>Sair</span>
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
