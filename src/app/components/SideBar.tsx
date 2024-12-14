// Sidebar.tsx

"use client";
import React, { useState, useEffect } from "react";
import { Drawer, IconButton, Tooltip, Divider } from "@mui/material";
import {
  FaHome,
  FaStar,
  FaSignOutAlt,
  FaUniversalAccess,
} from "react-icons/fa";
import LogoIcon from "@/src/app/icons/logo";
import { usePathname, useRouter } from "@/src/navigation";
import AccessibilityModal from "./AccessibilityModal";
import { RiRoadMapFill } from "react-icons/ri";
import { MdAdminPanelSettings } from "react-icons/md";
import axios from "axios";
import { Types } from "mongoose";
import { IUser } from "@/models/User";


const Sidebar: React.FC = () => {
  const [expanded, setExpanded] = useState(false);
  const [isAccessibilityModalOpen, setIsAccessibilityModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<IUser | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
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
        });
    }

    const handleStorageChange = () => {
      const updatedToken = localStorage.getItem("authToken");
      setIsLoggedIn(!!updatedToken);
      if (!updatedToken) {
        setUser(null);
      }
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
    localStorage.removeItem("authToken");
    setIsLoggedIn(false);
    setUser(null);
    window.location.href = "/";
  };

  const openAccessibilityModal = () => {
    setIsAccessibilityModalOpen(true);
  };

  const closeAccessibilityModal = () => {
    setIsAccessibilityModalOpen(false);
  };

  const navItems = [
    {
      icon: <FaHome aria-hidden="true" />,
      label: "Tela Principal",
      path: "/",
    },
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
          {/* Logo */}
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
                      color:
                        pathname === path
                          ? "var(--action-sidebar)"
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
                          ? "var(--action-sidebar)"
                          : "var(--contrast-bt-nav)",
                    }}
                  >
                    {label}
                  </span>
                </div>
              </Tooltip>
            ))}

            {/* Botão de Admin */}
            {isLoggedIn && user?.admin && (
              <Tooltip title={!expanded ? "Administrador" : ""}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-start",
                    padding: "10px 16px",
                    transition: "all 0.3s",
                    cursor: "pointer",
                  }}
                  onClick={() => router.push('/pages/admin')}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      router.push('/pages/admin');
                    }
                  }}
                  role="link"
                  tabIndex={0}
                  aria-label="Administrador"
                >
                  <MdAdminPanelSettings
                    style={{
                      color:
                        pathname === '/pages/admin'
                          ? "var(--action-sidebar)"
                          : "var(--contrast-bt-nav)",
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
                        color:
                          pathname === '/pages/admin'
                            ? "var(--action-sidebar)"
                            : "var(--contrast-bt-nav)",
                      }}
                    >
                      Administrador
                    </span>
                  )}
                </div>
              </Tooltip>
            )}
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
              onClick={openAccessibilityModal}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  openAccessibilityModal();
                }
              }}
              role="button"
              tabIndex={0}
              aria-label="Abrir menu de acessibilidade"
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

          {/* Seção de Perfil */}
          {isLoggedIn && user && (
            <div
              style={{
                position: "absolute",
                bottom: "80px",
                width: "100%",
                display: "flex",
                alignItems: "center",
              }}
              role="button"
              tabIndex={0}
              aria-label="Seção de Perfil"
            >
              <img
                src="https://thispersondoesnotexist.com/"
                alt={`Foto de ${user.name}`}
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
                {user.name}
              </span>
              <IconButton
                onClick={handleLogout}
                size="small"
                tabIndex={0}
                aria-label="Sair"
                style={{
                  color: "var(--contrast-bt-nav)",
                  marginLeft: "8px",
                  marginRight: "8px",
                }}
              >
                <FaSignOutAlt color="var(--red-sidebar)" size={20} />
              </IconButton>
            </div>
          )}
        </Drawer>
      </div>

      <AccessibilityModal
        isOpen={isAccessibilityModalOpen}
        onClose={closeAccessibilityModal}
      />
    </div>
  );
};

export default Sidebar;
