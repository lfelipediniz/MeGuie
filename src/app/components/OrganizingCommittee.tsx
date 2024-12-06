"use client";

import React, { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import Button from "./Button";
import MemberCard from "./MemberCard";
import {
  FaBullhorn,
  FaCalendarAlt,
  FaUserTie,
  FaUsers,
  FaProjectDiagram,
  FaRegBuilding,
  FaChalkboardTeacher,
} from "react-icons/fa";

interface Member {
  name: string;
  photo: string;
  description: string;
  categories: string[];
  special_role?: string[];
}

interface OrganizingCommitteeProps {
  members: Member[];
}

const categoryIcons: { [key: string]: JSX.Element } = {
  All: <FaUsers />,
  Marketing: <FaBullhorn />,
  Events: <FaCalendarAlt />,
  Coordinators: <FaUserTie />,
  StudyGroup: <FaUsers />,
  Projects: <FaProjectDiagram />,
  Secretariat: <FaRegBuilding />,
  Teaching: <FaChalkboardTeacher />,
};

const OrganizingCommittee: React.FC<OrganizingCommitteeProps> = ({ members }) => {
  const { resolvedTheme } = useTheme();
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const categories = [
    "All",
    "Marketing",
    "Events",
    "Coordinators",
    "StudyGroup",
    "Projects",
    "Secretariat",
    "Teaching",
  ];
  const [isMobileView, setIsMobileView] = useState<boolean>(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 1166);
    };

    handleResize(); // Check on mount
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const filterMembers = (category: string) => {
    return category === "All"
      ? members
      : members.filter((member) => member.categories.includes(category));
  };

  const filteredMembers = filterMembers(selectedCategory);

  return (
    <div className="p-4 md:p-8">

    </div>
  );
};

export default OrganizingCommittee;
