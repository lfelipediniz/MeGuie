"use client";

import React, { useState } from "react";
import { useTheme } from "next-themes";
import { TextField, InputAdornment, IconButton } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

import { FaArrowLeft } from "react-icons/fa6";

interface SearchBarProps {
  onSearch: (query: string) => void;
  onBack: () => void;  
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, onBack }) => {
  const { resolvedTheme } = useTheme();

  const [query, setQuery] = useState<string>("");

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  const handleSearch = () => {
    onSearch(query);
  };

  return (
    <div style={{ display: "flex", alignItems: "center", width: "100%", marginTop: "15px"}}>


      {onBack && (
        <button
          onClick={onBack}  
          className="h-12 w-12 flex justify-center items-center hover:bg-black/5 rounded-full transition duration-500"
        >
          <FaArrowLeft size={24} color="var(--action)" />
        </button>
      )}

      &nbsp;
      &nbsp;

      <TextField
        value={query}
        onChange={handleSearchChange}
        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        variant="outlined"
        placeholder={"Pesquisar Roadmap"}
        fullWidth
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={handleSearch} aria-label="Pesquisar">
                <SearchIcon />
              </IconButton>
            </InputAdornment>
          ),
          style: {
            backgroundColor: "white", 
            borderRadius: "15px", 
            border: "none", 
          },
        }}
        sx={{
          "& .MuiOutlinedInput-root": {
            padding: "0px", 
            borderRadius: "15px", 
          },
          "& .MuiOutlinedInput-notchedOutline": {
            border: "none", // Remover o contorno padrão
          },
        }}
      />
    </div>
  );
};

export default SearchBar;
