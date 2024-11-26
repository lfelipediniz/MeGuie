// components/IframeComponent.tsx
import React from 'react';

const IframeComponent: React.FC<{ src: string }> = ({ src }) => {
  return (
    <iframe
      width="560"
      height="315"
      src={src}
      title="YouTube video player"
      frameBorder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      referrerPolicy="strict-origin-when-cross-origin"
      allowFullScreen
    ></iframe>
  );
};

export default IframeComponent;
