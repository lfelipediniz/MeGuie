"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";


interface Sponsor {
  logoUrl: string;
}

interface SponsorsProps {
  sponsors?: Sponsor[];
}

const Sponsors: React.FC<SponsorsProps> = ({ sponsors = [] }) => {
  const { resolvedTheme } = useTheme();

  const [sponsorImages, setSponsorImages] = useState<Sponsor[]>([]);

  useEffect(() => {
    if (sponsors && sponsors.length > 0) {
      const updatedSponsors = sponsors.map((sponsor) => {
        const logoUrl =
          resolvedTheme === "light"
            ? sponsor.logoUrl.replace(".png", "-white.png")
            : sponsor.logoUrl;
        return { ...sponsor, logoUrl };
      });
      setSponsorImages(updatedSponsors);
    }
  }, [resolvedTheme, sponsors]);

  return (
    <div>

      </div>
  );
};

export default Sponsors;
