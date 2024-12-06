import React, { useState, useEffect } from "react";
import { Timeline } from "primereact/timeline";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import Image from "next/image";
import { FaRegClock, FaCalendarPlus } from "react-icons/fa";
import { FiYoutube } from "react-icons/fi";
import { Fade } from "react-awesome-reveal";

interface Speaker {
  name: string;
  photo?: string;
}

interface Lecture {
  title: string;
  description: string;
  start_time: string;
  end_time?: string | null;
  eventReminder: string;
  speaker: Speaker;
  time?: string;
}

interface Day {
  date: string;
  lectures: Lecture[];
}

export interface EventData {  // Exportação adicionada
  days: Day[];
}

interface ScheduleProps {
  eventData: EventData;
}

const Schedule: React.FC<ScheduleProps> = ({ eventData }) => {
  const weekDays = [
    "Weekdays.Monday",
    "Weekdays.Tuesday",
  "Weekdays.Wednesday",
    "Weekdays.Thursday",
    "Weekdays.Friday",
    "Weekdays.Saturday",
    "Weekdays.Sunday",
  ];
  const [selectedDay, setSelectedDay] = useState<string>(
    eventData.days[0]?.date || ""
  );
  const [filteredEvents, setFilteredEvents] = useState<Lecture[]>([]);
  const [isMobileView, setIsMobileView] = useState<boolean>(
    typeof window !== "undefined" && window.innerWidth < 810
  );
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);



  const customMarker = () => {
    return <span className="pi pi-calendar text-3xl text-data-purple"></span>;
  };

  const customContent = (item: Lecture) => {
    return (
      <div className="bg-[var(--background-secondary)] border rounded-lg shadow-lg p-6">

      </div>
    );
  };

  return (
    <>

    </>
  );
};

export default Schedule;
