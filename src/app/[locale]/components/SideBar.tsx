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

  const toggleSidebar = () => {
    setExpanded(!expanded);
  };

  return (
    <div className="z-50">
      <div className="hidden md:block">
        {/* Botão para abrir/fechar a sidebar */}
        <IconButton
          onClick={toggleSidebar}
          sx={{
            position: "fixed",
            top: 16,
            left: 16,
            zIndex: 1300,
          }}
        >
          <MenuIcon />
        </IconButton>

        <Drawer
          variant="permanent"
          open={expanded}
          sx={{
            position: "fixed",
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
          <List>
            <ListItem component="li" onClick={toggleSidebar}>
              <ListItemIcon>
                <MenuIcon />
              </ListItemIcon>
              {expanded && <ListItemText primary="Menu" />}
            </ListItem>

            <ListItem component="li">
              <ListItemIcon>
                <InboxIcon />
              </ListItemIcon>
              {expanded && <ListItemText primary="Inbox" />}
            </ListItem>

            <ListItem component="li">
              <ListItemIcon>
                <MailIcon />
              </ListItemIcon>
              {expanded && <ListItemText primary="Mail" />}
            </ListItem>
          </List>
        </Drawer>
      </div>
    </div>
  );
};

export default Sidebar;
