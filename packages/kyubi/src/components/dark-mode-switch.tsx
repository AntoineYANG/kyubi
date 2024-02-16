/*
 * @Author: Kyusho 
 * @Date: 2024-02-16 13:12:36 
 * @Last Modified by: Kyusho
 * @Last Modified time: 2024-02-16 13:49:40
 */

import { memo, useCallback, useEffect, useRef, useState } from "react";
import { useToggleButton } from "react-aria";
import { useToggleState } from "react-stately";


const DarkModeSwitch = memo(function DarkModeSwitch () {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // read preference from localStorage / system
    const darkMode = localStorage.getItem("kyubi-dark-mode");
    const html = document.querySelector("html");
    if (!html) {
      return;
    }
    if (darkMode === "dark") {
      setIsDark(true);
    } else if (darkMode === "light") {
      setIsDark(false);
    } else {
      if (darkMode !== null) {
        localStorage.removeItem("kyubi-dark-mode");
      }
      const media = window.matchMedia("(prefers-color-scheme: dark)");
      setIsDark(media.matches);
    }
  }, []);

  useEffect(() => {
    // apply dark mode
    const html = document.querySelector("html");
    if (!html) {
      return;
    }
    if (isDark) {
      html.classList.add("ky-dark");
    } else {
      html.classList.remove("ky-dark");
    }
  }, [isDark]);

  const handleChange = useCallback((val: boolean) => {
    setIsDark(val);
    localStorage.setItem("kyubi-dark-mode", val ? "dark" : "light");
  }, []);

  const toggleRef = useRef<HTMLButtonElement>(null);
  const toggleState = useToggleState({ isSelected: isDark, onChange: handleChange });
  const { buttonProps } = useToggleButton(
    {
      elementType: "button",
      onChange: handleChange,
    },
    toggleState,
    toggleRef,
  );

  return (
    <button
      {...buttonProps}
      aria-label="Toggle dark mode"
      value={isDark ? "dark" : "light"}
      ref={toggleRef}
      className="ky-opacity-90 hover:ky-opacity-100 ky-transition-opacity ky-duration-200"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width="24"
        height="24"
        fill="currentcolor"
        stroke="none"
        role="img"
        className="ky-w-[1.5em] ky-h-[1.5em] ky-pointer-events-none"
      >
        {isDark && (
          // moon shape
          <path
            d="M12 4a8 8 0 1 0 8 8 a4 4 1 0 1 -8 -8"
            fill="currentColor"
            stroke="none"
          />
        )}
        {!isDark && (
          // sun shape
          <path
            d="M12 8a4 4 0 1 0 0 8a4 4 0 1 0 0 -8 M12 5v-2M19 12h2M12 19v2M5 12h-2
             M18.5 5.5l-1.42 1.42 M18.5 18.5l-1.42-1.42 M5.5 5.5l1.42 1.42 M5.5 18.5l1.42-1.42"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}
      </svg>
    </button>
  );
});


export default DarkModeSwitch;
