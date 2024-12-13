"use client";
import React, { useState, useEffect } from "react";
import { Drawer, IconButton, Tooltip, Divider } from "@mui/material";
import {
  FaAngleLeft,
  FaAngleRight,
  FaHome,
  FaCalendarAlt,
  FaStar,
  FaSignOutAlt,
  FaUniversalAccess,
} from "react-icons/fa";
import LogoIcon from "@/src/app/icons/logo";
import { usePathname, useRouter } from "@/src/navigation";
import AccessibilityModal from "./AccessibilityModal";
import { RiRoadMapFill } from "react-icons/ri";

const Sidebar: React.FC = () => {
  const [expanded, setExpanded] = useState(false);
  const [isAccessibilityModalOpen, setIsAccessibilityModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Estado para rastrear o login
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    // Verifica se o token existe no localStorage ao montar o componente
    const authToken = localStorage.getItem("authToken");
    setIsLoggedIn(!!authToken);

    // Opcional: Sincroniza o estado de login entre múltiplas abas
    const handleStorageChange = () => {
      const updatedToken = localStorage.getItem("authToken");
      setIsLoggedIn(!!updatedToken);
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const handleMouseEnter = () => {
    setExpanded(true);
  };

  const handleMouseLeave = () => {
    setExpanded(false);
  };

  const handleFocus = () => {
    setExpanded(true);
  };

  const handleBlur = (e: React.FocusEvent<HTMLDivElement>) => {
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setExpanded(false);
    }
  };

  const handleLogout = () => {
    // Remove o token do localStorage
    localStorage.removeItem("authToken");
    setIsLoggedIn(false);

    // Redireciona para a página principal e recarrega a página
    window.location.href = "/";
  };

  const openAccessibilityModal = () => {
    setIsAccessibilityModalOpen(true);
  };

  const closeAccessibilityModal = () => {
    setIsAccessibilityModalOpen(false);
  };

  // Definição condicional de navItems com base no estado isLoggedIn
  const navItems: { icon: JSX.Element; label: string; path: string }[] = [
    {
      icon: <FaHome aria-hidden="true" />,
      label: "Tela Principal",
      path: "/",
    },
    // Inclui "Roadmaps Favoritos" apenas se o usuário estiver logado
    ...(isLoggedIn
      ? [
          {
            icon: <FaStar aria-hidden="true" />,
            label: "Roadmaps Favoritos",
            path: "/pages/savedroads",
          },
        ]
      : []),
  ];

  return (
    <div className="h-md:block hidden">
      <div
        className="z-50 md:block hidden"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onFocus={handleFocus}
        onBlur={handleBlur}
        tabIndex={0}
      >
        <Drawer
          variant="permanent"
          open={expanded}
          sx={{
            width: expanded ? 240 : 60,
            flexShrink: 0,
            transition: "width 0.3s",
            "& .MuiDrawer-paper": {
              width: expanded ? 240 : 60,
              overflowX: "hidden",
              position: "fixed",
              zIndex: 1200,
              transition: "width 0.3s",
            },
          }}
        >
          {/* Logo do App */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: expanded ? "flex-start" : "center",
              padding: "4px 16px",
              marginBottom: "1px",
              transition: "all 0.3s",
            }}
            onClick={() => router.push("/")}
            className="cursor-pointer"
            role="link"
            tabIndex={0}
            aria-label="Ir para a página principal"
          >
            <div
              style={{
                color: "var(--contrast-bt-nav)",
                fontSize: "1.8rem",
                marginTop: "10px",
              }}
            >
              <LogoIcon />
            </div>
            <span
              style={{
                marginLeft: expanded ? "15px" : "0",
                opacity: expanded ? 1 : 0,
                whiteSpace: "nowrap",
                overflow: "hidden",
                transition: "opacity 0.3s, margin-left 0.3s",
                fontSize: "1.2rem",
                color: "var(--contrast-bt-nav)",
                fontWeight: "bold",
                marginTop: "14px",
              }}
            >
              MeGuie
            </span>
          </div>

          <Divider style={{ margin: "10px 0" }} />

          {/* Navegação */}
          <div style={{ display: "flex", flexDirection: "column", marginTop: "10px" }}>
            {navItems.map(({ icon, label, path }, index) => (
              <Tooltip title={!expanded ? label : ""} key={index}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-start",
                    padding: "10px 16px",
                    transition: "all 0.3s",
                    cursor: "pointer",
                  }}
                  onClick={() => router.push(path)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      router.push(path);
                    }
                  }}
                  role="link"
                  tabIndex={0}
                  aria-label={label}
                >
                  <div
                    style={{
                      color: pathname === path ? "var(--action-sidebar)" : "var(--contrast-bt-nav)",
                      fontSize: "1.5rem",
                    }}
                  >
                    {icon}
                  </div>
                  <span
                    style={{
                      marginLeft: "15px",
                      opacity: expanded ? 1 : 0,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      transition: "opacity 0.3s",
                      fontSize: "1.1rem",
                      color: pathname === path ? "var(--action-sidebar)" : "var(--contrast-bt-nav)",
                    }}
                  >
                    {label}
                  </span>
                </div>
              </Tooltip>
            ))}
          </div>

          <Divider style={{ margin: "10px 0" }} />

          {/* Botão de Logout */}
          {isLoggedIn && (
            <div
              style={{
                position: "absolute",
                bottom: "20px",
                width: "100%",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <IconButton onClick={handleLogout} aria-label="Sair">
                <FaSignOutAlt color="var(--red-sidebar)" size={24} />
              </IconButton>
            </div>
          )}
        </Drawer>
      </div>

      {/* Modal de Acessibilidade */}
      <AccessibilityModal isOpen={isAccessibilityModalOpen} onClose={closeAccessibilityModal} />
    </div>
  );
};

export default Sidebar;
