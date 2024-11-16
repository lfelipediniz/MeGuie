"use client";

import React, { useState } from "react";
import { Drawer, IconButton, Tooltip, Menu, MenuItem } from "@mui/material";
import {
  FaAngleLeft,
  FaAngleRight,
  FaHome,
  FaCalendarAlt,
  FaStar,
  FaSignLanguage,
  FaTextHeight,
} from "react-icons/fa";
import { IoAccessibility, IoContrastSharp } from "react-icons/io5";
import Image from "next/image";
import LogoIcon from "@/src/app/icons/logo";

const Sidebar: React.FC = () => {
  const [expanded, setExpanded] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const toggleSidebar = () => {
    setExpanded(!expanded);
  };

  const handleAccessibilityClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleAccessibilityClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className="z-50">
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

        {/* Logo do App */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: expanded ? "flex-start" : "center",
            padding: "10px 16px",
            transition: "all 0.3s",
          }}
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
              marginTop: "10px",
            }}
          >
            MeGuie
          </span>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            marginTop: "10px",
          }}
        >
          {[
            {
              icon: <IoAccessibility />,
              label: "Acessibilidade",
              onClick: handleAccessibilityClick,
            },
            {
              icon: <FaHome />,
              label: "Tela Principal",
              onClick: () => alert("Navegar para Tela Principal"),
            },
            {
              icon: <FaCalendarAlt />,
              label: "Calendário",
              onClick: () => alert("Navegar para Calendário"),
            },
            {
              icon: <FaStar />,
              label: "Favoritos",
              onClick: () => alert("Navegar para Favoritos"),
            },
          ].map(({ icon, label, onClick }, index) => (
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
                onClick={onClick}
              >
                <div
                  style={{
                    color: "var(--contrast-bt-nav)",
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
                  }}
                >
                  {label}
                </span>
              </div>
            </Tooltip>
          ))}
        </div>

        {/* Dropdown menu para Acessibilidade */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleAccessibilityClose}
          style={{ zIndex: 1300 }}
        >
          <MenuItem onClick={() => alert("Ativar Libras")}>
            <FaSignLanguage style={{ marginRight: "10px" }} />
            Ativar Libras
          </MenuItem>
          <MenuItem onClick={() => alert("Aumentar Texto")}>
            <FaTextHeight style={{ marginRight: "10px" }} />
            Aumentar Texto
          </MenuItem>
          <MenuItem onClick={() => alert("Ativar Alto Contraste")}>
            <IoContrastSharp style={{ marginRight: "10px" }} />
            Alto Contraste
          </MenuItem>
        </Menu>

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
      </Drawer>
    </div>
  );
};

export default Sidebar;
