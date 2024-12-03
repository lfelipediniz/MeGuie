"use client";

import { useState, useEffect } from "react";
import VLibrasClient from "./VLibrasClient";

const VLibrasToggleWrapper = () => {
  const [isVLibrasEnabled, setIsVLibrasEnabled] = useState(false);

  useEffect(() => {
    const vlibrasState = localStorage.getItem("isVLibrasEnabled") === "true";
    setIsVLibrasEnabled(vlibrasState);
  }, []);

  return isVLibrasEnabled ? <VLibrasClient /> : null;
};

export default VLibrasToggleWrapper;
