import React, { useState, useEffect, useRef } from 'react';
import { PlayCircle, PauseCircle } from 'lucide-react';

interface TextReaderProps {
  selector?: string;  // Seletor CSS para encontrar o conteúdo
  fallbackText?: string;  // Texto de fallback se nada for encontrado
  lang?: string;
  voiceRate?: number;
  voicePitch?: number;
}

const TextReader: React.FC<TextReaderProps> = ({ 
  selector,
  fallbackText = 'Nenhum conteúdo encontrado',
  lang = 'pt-BR',
  voiceRate = 1.0,
  voicePitch = 1.0
}) => {
  const [content, setContent] = useState(fallbackText);
  const [isReading, setIsReading] = useState(false);
  const [isSpeechSupported, setIsSpeechSupported] = useState(true);
  const [currentVoice, setCurrentVoice] = useState<SpeechSynthesisVoice | null>(null);

  useEffect(() => {
    // Verificar suporte à síntese de fala
    if (!('speechSynthesis' in window)) {
      setIsSpeechSupported(false);
      return;
    }

    // Carregar vozes disponíveis
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      const portugueseVoices = voices.filter(
        voice => voice.lang.startsWith('pt-') && voice.localService
      );
      
      // Priorizar vozes brasileiras
      const ptBrVoice = portugueseVoices.find(
        voice => voice.lang === 'pt-BR'
      ) || portugueseVoices[0];

      setCurrentVoice(ptBrVoice || null);
    };

    // Encontrar conteúdo pelo seletor, se fornecido
    const findContent = () => {
      if (selector) {
        const element = document.querySelector(selector);
        if (element) {
          setContent(element.textContent || fallbackText);
        }
      }
    };

    // Carregar vozes e conteúdo
    loadVoices();
    findContent();

    // Eventos de vozes
    window.speechSynthesis.onvoiceschanged = loadVoices;

    // Limpar ao desmontar
    return () => {
      window.speechSynthesis.cancel();
    };
  }, [selector, fallbackText]);

  const toggleReading = () => {
    if (!content) return;

    if (isReading) {
      // Pausar leitura
      window.speechSynthesis.cancel();
      setIsReading(false);
    } else {
      // Iniciar leitura
      const utterance = new SpeechSynthesisUtterance(content);
      
      // Configurações de voz
      utterance.lang = lang;
      utterance.rate = voiceRate;
      utterance.pitch = voicePitch;

      // Configurar voz específica, se disponível
      if (currentVoice) {
        utterance.voice = currentVoice;
      }

      // Callbacks de estado
      utterance.onstart = () => setIsReading(true);
      utterance.onend = () => setIsReading(false);
      utterance.onerror = () => {
        console.error('Erro na síntese de voz');
        setIsReading(false);
      };

      // Iniciar leitura
      window.speechSynthesis.speak(utterance);
    }
  };

  // Sem suporte à síntese de voz
  if (!isSpeechSupported) {
    return null;
  }

  return (
    <div 
      role="region" 
      aria-live="polite"
      className="text-reader-container"
    >
      <button
        onClick={toggleReading}
        aria-label={
          isReading 
            ? "Pausar leitura do conteúdo atual. Clique para interromper narração" 
            : "Iniciar leitura do conteúdo atual. Clique para ativar narração em voz alta"
        }
        aria-pressed={isReading}
        className="text-reader-button"
        
        // Suporte total para teclado
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleReading();
          }
        }}
      >
        {isReading ? (
          <>
            <PauseCircle 
              aria-hidden="true" 
              className="reader-icon"
            />
            <span className="sr-only">Pausar Leitura</span>
          </>
        ) : (
          <>
            <PlayCircle 
              aria-hidden="true" 
              className="reader-icon"
            />
            <span className="sr-only">Iniciar Leitura</span>
          </>
        )}
      </button>
      
      {/* Feedback adicional para leitores de tela */}
      <div 
        aria-live="assertive" 
        className="sr-only"
      >
        {isReading 
          ? "Leitura do conteúdo em andamento" 
          : "Leitura pausada"}
      </div>
    </div>
  );
};

export default TextReader;