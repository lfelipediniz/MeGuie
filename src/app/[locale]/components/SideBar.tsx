"use client";

import React, { useState } from "react";
import { Drawer, IconButton, Tooltip } from "@mui/material";
import { FaAngleLeft, FaAngleRight, FaHome, FaCalendarAlt, FaStar } from "react-icons/fa";
import { IoAccessibility } from "react-icons/io5";
import { MdContrast, MdTextFields } from "react-icons/md";
import { GiHand } from "react-icons/gi";

const Sidebar: React.FC = () => {
  const [expanded, setExpanded] = useState(false);

  const toggleSidebar = () => {
    setExpanded(!expanded);
  };

  return (
    <div className="z-50">
      <div className="hidden md:block">
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
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: "10px" }}>
            <Tooltip title="Acessibilidade">
              <IconButton onClick={toggleSidebar} size="medium">
                {expanded ? (
                  <span style={{ display: "flex", alignItems: "center" }}>
                    <IoAccessibility /> &nbsp; Acessibilidade
                  </span>
                ) : (
                  <IoAccessibility />
                )}
              </IconButton>
            </Tooltip>

            <Tooltip title="Alto Contraste">
              <IconButton size="medium">
                {expanded ? (
                  <span style={{ display: "flex", alignItems: "center" }}>
                    <MdContrast /> &nbsp; Alto Contraste
                  </span>
                ) : (
                  <MdContrast />
                )}
              </IconButton>
            </Tooltip>

            <Tooltip title="Libras">
              <IconButton size="medium">
                {expanded ? (
                  <span style={{ display: "flex", alignItems: "center" }}>
                    <GiHand /> &nbsp; Libras
                  </span>
                ) : (
                  <GiHand />
                )}
              </IconButton>
            </Tooltip>

            <Tooltip title="Texto">
              <IconButton size="medium">
                {expanded ? (
                  <span style={{ display: "flex", alignItems: "center" }}>
                    <MdTextFields /> &nbsp; Texto
                  </span>
                ) : (
                  <MdTextFields />
                )}
              </IconButton>
            </Tooltip>

            <Tooltip title="Tela Principal">
              <IconButton size="medium">
                {expanded ? (
                  <span style={{ display: "flex", alignItems: "center" }}>
                    <FaHome /> &nbsp; Tela Principal
                  </span>
                ) : (
                  <FaHome />
                )}
              </IconButton>
            </Tooltip>

            <Tooltip title="Calendário">
              <IconButton size="medium">
                {expanded ? (
                  <span style={{ display: "flex", alignItems: "center" }}>
                    <FaCalendarAlt /> &nbsp; Calendário
                  </span>
                ) : (
                  <FaCalendarAlt />
                )}
              </IconButton>
            </Tooltip>

            <Tooltip title="Roadmaps Favoritos">
              <IconButton size="medium">
                {expanded ? (
                  <span style={{ display: "flex", alignItems: "center" }}>
                    <FaStar /> &nbsp; Favoritos
                  </span>
                ) : (
                  <FaStar />
                )}
              </IconButton>
            </Tooltip>
          </div>

          {/* Botão para abrir/fechar a sidebar */}
          <div style={{ position: "absolute", bottom: "30px", width: "100%", display: "flex", justifyContent: "center" }}>
            <IconButton onClick={toggleSidebar} size="medium">
              {expanded ? <FaAngleLeft /> : <FaAngleRight />}
            </IconButton>
          </div>
        </Drawer>
      </div>
    </div>
  );
};

export default Sidebar;
