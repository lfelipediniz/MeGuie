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
    // Verifica o localStorage ao montar o componente
    const loggedInStatus = localStorage.getItem('isLoggedIn');
    if (loggedInStatus === 'true') {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }

    // Opcional: Sincroniza o estado de login entre múltiplas abas
    const handleStorageChange = () => {
      const updatedStatus = localStorage.getItem('isLoggedIn');
      setIsLoggedIn(updatedStatus === 'true');
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const handleMouseEnter = () => {
    setExpanded(true);
  };

  const handleMouseLeave = () => {
    setExpanded(false);
  };

  const handleFocus = () => {
    setExpanded(true); // Expande a sidebar quando qualquer elemento recebe foco
  };

  const handleBlur = (e: React.FocusEvent<HTMLDivElement>) => {
    // Recolhe a sidebar apenas se o foco sair completamente dela
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setExpanded(false);
    }
  };

  const handleLogout = () => {
    // Atualiza o estado
    setIsLoggedIn(false);
    // Atualiza o localStorage
    localStorage.setItem('isLoggedIn', 'false');

    // Extrai o locale atual da URL
    const pathSegments = window.location.pathname.split('/');


    // Redireciona para a página principal com o locale e recarrega a página
    window.location.href = `/`; // Ajuste o caminho conforme a estrutura da sua aplicação
  };

  const openAccessibilityModal = () => {
    setIsAccessibilityModalOpen(true);
  };

  const closeAccessibilityModal = () => {
    setIsAccessibilityModalOpen(false);
  };

  const navItems: { icon: JSX.Element; label: string; path: string }[] = [
    {
      icon: <FaHome aria-hidden="true" />,
      label: "Tela Principal",
      path: "/",
    },
    {
      icon: <FaStar aria-hidden="true" />,
      label: "Roadmaps Favoritos",
      path: "/pages/savedroads",
    },
  ];

  return (
    <div className="h-md:block hidden">
      <div
        className="z-50 md:block hidden"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onFocus={handleFocus} // Expande ao receber foco
        onBlur={handleBlur} // Recolhe ao perder foco
        tabIndex={0} // Permite que a sidebar também receba foco diretamente
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

          {/* Seção de Perfil (renderizada condicionalmente) */}
          {isLoggedIn && (
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

      {/* Modal de Acessibilidade */}
      <AccessibilityModal
        isOpen={isAccessibilityModalOpen}
        onClose={closeAccessibilityModal}
      />
    </div>
  );
};

export default Sidebar;
