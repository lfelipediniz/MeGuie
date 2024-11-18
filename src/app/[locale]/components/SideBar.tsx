"use client";
import React, { useState } from "react";
import {
  Drawer,
  IconButton,
  Tooltip,
  Divider,
} from "@mui/material";
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
import AccessibilityModal from "./AccessibilityModal"; // Importe o modal

const Sidebar: React.FC = () => {
  const [expanded, setExpanded] = useState(false);
  const [isAccessibilityModalOpen, setIsAccessibilityModalOpen] =
    useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const toggleSidebar = () => {
    setExpanded(!expanded);
  };

  const handleLogout = () => {
    router.push("/"); // Redireciona para a página principal
  };

  const openAccessibilityModal = () => {
    setIsAccessibilityModalOpen(true);
  };

  const closeAccessibilityModal = () => {
    setIsAccessibilityModalOpen(false);
  };

  const navItems: { icon: JSX.Element; label: string; path: string }[] = [
    {
      icon: <FaHome />,
      label: "Tela Principal",
      path: "/pages/home",
    },
    {
      icon: <FaCalendarAlt />,
      label: "Calendário",
      path: "/pages/calendar",
    },
    {
      icon: <FaStar />,
      label: "Favoritos",
      path: "/pages/savedroads",
    },
  ];

  return (
    <div className="h-md:block hidden">
      <div className="z-50 md:block hidden">
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
              padding: " 4px 16px",
              marginBottom: "1px",
              transition: "all 0.3s",
            }}
            onClick={() => router.push("/")}
            className="cursor-pointer"
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
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              marginTop: "10px",
            }}
          >
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
                  onClick={() => router.push(path as any)}
                >
                  <div
                    style={{
                      color:
                        pathname === path
                          ? "var(--action)"
                          : "var(--contrast-bt-nav)",
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
                      color:
                        pathname === path
                          ? "var(--action)"
                          : "var(--contrast-bt-nav)",
                    }}
                  >
                    {label}
                  </span>
                </div>
              </Tooltip>
            ))}
          </div>

          <Divider style={{ margin: "10px 0" }} />

          {/* Botão de Acessibilidade */}
          <Tooltip title={!expanded ? "Acessibilidade" : ""}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: expanded ? "flex-start" : "center",
                padding: "10px 16px",
                transition: "all 0.3s",
                cursor: "pointer",
              }}
              onClick={openAccessibilityModal} // Abre o modal
            >
              <FaUniversalAccess
                style={{
                  color: "var(--contrast-bt-nav)",
                  fontSize: "1.5rem",
                }}
              />
              {expanded && (
                <span
                  style={{
                    marginLeft: "15px",
                    opacity: expanded ? 1 : 0,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    transition: "opacity 0.3s",
                    fontSize: "1.1rem",
                    color: "var(--contrast-bt-nav)",
                  }}
                >
                  Acessibilidade
                </span>
              )}
            </div>
          </Tooltip>

          <div
            style={{
              position: "absolute",
              bottom: "30px",
              width: "100%",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <IconButton
              onClick={toggleSidebar}
              size="medium"
              style={{ color: "var(--contrast-bt-nav)" }}
            >
              {expanded ? <FaAngleLeft /> : <FaAngleRight />}
            </IconButton>
          </div>

          {/* Seção de Perfil */}
          <div
            style={{
              position: "absolute",
              bottom: "80px",
              width: "100%",
              display: "flex",
              alignItems: "center",
            }}
          >
            <img
              src="https://thispersondoesnotexist.com/"
              alt="Foto de Fulano de Tal"
              style={{
                width: "45px",
                height: "45px",
                borderRadius: "10px",
                marginLeft: "6px",
                objectFit: "cover",
                marginRight: expanded ? "10px" : "0",
                transition: "margin-right 0.3s",
              }}
            />
            <span
              style={{
                flexGrow: 1,
                opacity: expanded ? 1 : 0,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                transition: "opacity 0.3s",
                fontSize: "1rem",
                color: "var(--contrast-bt-nav)",
                fontWeight: "bold",
              }}
            >
              Fulano de Tal
            </span>
            <IconButton
              onClick={handleLogout}
              size="small"
              style={{
                color: "var(--contrast-bt-nav)",
                marginLeft: "8px",
                marginRight: "8px",
              }}
            >
              <FaSignOutAlt color="var(--red)" size={20} />
            </IconButton>
          </div>
        </Drawer>
      </div>

      {/* Modal de Acessibilidade */}
      <AccessibilityModal
        isOpen={isAccessibilityModalOpen}
        onClose={closeAccessibilityModal}
      />
    </div>
  );
};

export default Sidebar;
