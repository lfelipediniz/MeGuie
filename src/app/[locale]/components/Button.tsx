"use client";
import React from "react";
import { Link } from "../../../navigation";
import * as Icons from "react-icons/fa"; // Importa todos os ícones do FontAwesome
import { pathnames } from "../../../navigation";

type PageLink = typeof pathnames[keyof typeof pathnames];

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "dataPurple";
  size?: "small" | "medium" | "large";
  pageLink?: PageLink;
  iconName?: keyof typeof Icons; // O nome do ícone opcional
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "medium",
  className,
  pageLink,
  iconName,
  ...props
}) => {
  const sizeStyles = {
    small: "text-sm font-bold",
    medium: "text-base font-semibold font-bold",
    large: "text-lg font-semibold font-bold",
  };

  const baseStyles = `focus:outline-none focus:shadow-outline bg-data-purple border-2 border-data-purple inline-flex items-center justify-center space-x-2 transition-transform duration-200 ease-in-out transform rounded-md`;

  const buttonStyles = `${baseStyles} ${sizeStyles[size]} ${className}`;

  const inlineStyles = {
    paddingLeft: "17px",
    paddingRight: "17px",
    paddingTop: "10px",
    paddingBottom: "10px",
    color: "var(--contrast-bt-text)", // Define a cor do texto com a variável CSS
  };

  const IconComponent = iconName ? Icons[iconName] : null;

  if (pageLink) {
    return (
      <Link href={pageLink}>
        <button className={`${buttonStyles} hover:scale-110`} style={inlineStyles} {...props}>
          {IconComponent && <IconComponent className="mr-2" />}
          {children}
        </button>
      </Link>
    );
  }

  return (
    <button className={`${buttonStyles} hover:scale-110`} style={inlineStyles} {...props}>
      {IconComponent && <IconComponent className="mr-2" />}
      {children}
    </button>
  );
};

export default Button;
