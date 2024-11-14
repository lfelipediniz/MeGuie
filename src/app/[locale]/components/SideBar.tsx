"use client";

import React, { useState } from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
} from "@mui/material";
import InboxIcon from "@mui/icons-material/Inbox";
import MailIcon from "@mui/icons-material/Mail";
import MenuIcon from "@mui/icons-material/Menu";

const Sidebar: React.FC = () => {
  const [expanded, setExpanded] = useState(false);
  const [compressed, setCompressed] = useState(true); // Controle para o estado comprimido

  const toggleSidebar = () => {
    if (compressed) {
      setExpanded(true); // expande o Drawer como temporário
      setCompressed(false); // alterna para o estado expandido temporariamente
    } else {
      setExpanded(false);
      setCompressed(true);
    }
  };

  return (
    <div style={{ marginRight: "-270px" }} className="z-50"> 
      <div className="hidden md:block">
        {/* Botão para abrir/fechar a sidebar */}
        <IconButton onClick={toggleSidebar}>
          <MenuIcon />
        </IconButton>

        <Drawer
          variant={expanded ? "temporary" : "permanent"}
          open={expanded || compressed}
          onClose={() => setExpanded(false)}
          sx={{
            width: compressed ? 60 : 240,
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: compressed ? 60 : 240,
              transition: "width 0.3s",
              overflowX: "hidden",
              zIndex: expanded ? 1300 : "auto", // permite que o Drawer fique acima dos outros itens ao expandir
            },
          }}
        >
          <List>
            <ListItem component="li" onClick={toggleSidebar}>
              <ListItemIcon>
                <MenuIcon />
              </ListItemIcon>
              {!compressed && <ListItemText primary="Menu" />}
            </ListItem>

            <ListItem component="li" onClick={toggleSidebar}>
              <ListItemIcon>
                <InboxIcon />
              </ListItemIcon>
              {!compressed && <ListItemText primary="Inbox" />}
            </ListItem>

            <ListItem component="li" onClick={toggleSidebar}>
              <ListItemIcon>
                <MailIcon />
              </ListItemIcon>
              {!compressed && <ListItemText primary="Mail" />}
            </ListItem>
          </List>
        </Drawer>
      </div>
    </div>
  );
};

export default Sidebar;
