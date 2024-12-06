import React, { useState, useEffect } from "react";

const YourComponent = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null; // ou retornar um carregamento até que o componente seja renderizado no cliente
  }

  return (
    <div>
     
    </div>
  );
};

export default YourComponent;
