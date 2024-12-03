"use client";
import React from 'react';
import LottieLoading from './LottieLoading';

interface LoadingOverlayProps {
  height?: number;
  width?: number;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ height = 500, width = 550 }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background bg-opacity-75 z-50" aria-label="Tela de carregamento">
      <LottieLoading height={height} width={width} />
    </div>
  );
};

export default LoadingOverlay;
