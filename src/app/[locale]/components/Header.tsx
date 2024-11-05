"use client";
import { useState, useRef, useEffect } from "react";
import { Link, usePathname } from "@/src/navigation";
import { useTranslations } from "next-intl";
import { FC } from "react";
import LogoIcon from "../../icons/logo";
import LangSwitcher from "./LangSwitcher";
import ThemeSwitch from "./ThemeSwitch";
import PageList from "./PageList";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline"; // imports updated icons

interface Props {
  locale: string;
}

export const Header: FC<Props> = ({ locale }) => {
  const t = useTranslations("");
  const pathname = usePathname(); // Captura a URL atual
  const [menuOpen, setMenuOpen] = useState(false); // state to control the menu
  const menuRef = useRef<HTMLDivElement>(null);

  const eventPages = [
    { name: "Understanding DL", path: "/pages/events/understandingDL" },
    // { name: "DataDay", path: "/pages/events/dataDay" },
  ];

  const isEventPage = eventPages.some((page) => pathname === page.path);

  const getLinkClass = (path: string) => {
    return pathname === path || (path === "/pages/events" && isEventPage)
      ? "text-data-purple"
      : "";
  };

  // Close the menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  return (
    <div
      className="fixed top-0 left-0 right-0 z-50 bg-background shadow-md transition-all duration-300"
    >
      <div className="mx-auto flex max-w-screen-2xl items-center justify-between p-5">
        <Link
          lang={locale}
          href={`/`}
          className={getLinkClass("/")}
          onClick={() => setMenuOpen(false)}
        >
          <div className="flex flex-row items-center">
            <div className="mb-2 h-14 w-14">
              <LogoIcon />
            </div>
          </div>
        </Link>

        {/* hamburger menu button for mobile */}
        <div className="flex md:hidden">
          <button onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? (
              <XMarkIcon className="h-8 w-8 text-primary" />
            ) : (
              <Bars3Icon className="h-8 w-8 text-primary" />
            )}
          </button>
        </div>

        {/* menu for mobile devices */}
        <div
          ref={menuRef}
          className={`mobile-menu md:hidden absolute left-0 right-0 top-full mt-2 bg-white shadow-md rounded-md ${
            menuOpen ? "open" : ""
          } z-50`}
        >
          <div className="flex flex-col items-center justify-center">
            <Link
              lang={locale}
              href={`/pages/fronts`}
              className={`${getLinkClass("/pages/fronts")} block`}
              onClick={() => setMenuOpen(false)}
            >
              {t("Header.Fronts")}
            </Link>

            {/* about page link */}
            <Link
              lang={locale}
              href={`/pages/about`}
              className={`${getLinkClass("/pages/about")} block`}
              onClick={() => setMenuOpen(false)}
            >
              {t("Header.About")}
            </Link>
            {
              <PageList
                locale={locale}
                pages={eventPages}
                pageListName={t("Header.Events")}
                active={isEventPage} // Pass the active state
              />
            }
            <Link
              lang={locale}
              href={`/pages/contact`}
              className={`${getLinkClass("/pages/contact")} block`}
              onClick={() => setMenuOpen(false)}
            >
              {t("Header.Contact")}
            </Link>
            <div className="flex flex-row items-center space-x-4">
              <ThemeSwitch />
              <LangSwitcher locale={locale} />
            </div>
          </div>
        </div>

        {/* default menu for larger screens */}
        <div className="hidden md:flex flex-1 flex-col items-center gap-10 text-center font-bold">
          <div className="flex gap-10 items-center">
            <Link
              lang={locale}
              href={`/pages/fronts`}
              className={getLinkClass("/pages/fronts")}
              onClick={() => setMenuOpen(false)}
            >
              {t("Header.Fronts")}
            </Link>
            <Link
              lang={locale}
              href={`/pages/about`}
              className={`${getLinkClass("/pages/about")} block`}
              onClick={() => setMenuOpen(false)}
            >
              {t("Header.About")}
            </Link>
            {
              <PageList
                locale={locale}
                pages={eventPages}
                pageListName={t("Header.Events")}
                active={isEventPage} // Pass the active state
              />
            }
            <Link
              lang={locale}
              href={`/pages/contact`}
              className={getLinkClass("/pages/contact")}
              onClick={() => setMenuOpen(false)}
            >
              {t("Header.Contact")}
            </Link>
          </div>
        </div>

        {/* theme and language switcher for desktop */}
        <div className="hidden md:flex flex-row items-center gap-3">
          <ThemeSwitch />
          <LangSwitcher locale={locale} />
        </div>
      </div>
    </div>
  );
};

export default Header;
