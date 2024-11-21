import { useEffect } from 'react';

const VLibrasWidget: React.FC = () => {
  useEffect(() => {
    const initializeVLibras = () => {
      const VLibras = (window as any).VLibras;
      if (VLibras) {
        new VLibras.Widget('https://vlibras.gov.br/app');
      }
    };

    // Verifique se o script já existe para evitar duplicações
    const scriptId = 'vlibras-plugin-script';
    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.src = 'https://vlibras.gov.br/app/vlibras-plugin.js';
      script.async = true;
      script.onload = initializeVLibras;
      document.body.appendChild(script);
    } else {
      initializeVLibras();
    }
  }, []);

  return null; // O VLibras gerencia sua própria interface.
};

export default VLibrasWidget;
