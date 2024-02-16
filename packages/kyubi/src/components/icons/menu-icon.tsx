/*
 * @Author: Kyusho 
 * @Date: 2024-02-16 12:52:17 
 * @Last Modified by: Kyusho
 * @Last Modified time: 2024-02-16 13:10:22
 */

import { memo } from "react";

import { cn } from "../../utils/classnames";


const MenuIcon = memo<{ open?: boolean }>(function MenuIcon ({ open = false }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      role="img"
      className={cn(
        "ky-transition-transform ky-origin-center ky-group/menu-icon ky-w-[1.5em] ky-h-[1.5em] ky-stroke-current ky-opacity-85 hover:ky-opacity-100",
        open ? "ky-rotate-90" : "ky-rotate-0"
      )}
    >
      <line
        x1={6} y1={7} x2={18} y2={7}
        className={cn(
          "ky-transition-transform ky-pointer-events-none ky-origin-center",
          open ? "ky-rotate-[40deg]" : "ky-rotate-0 group-hover/menu-icon:ky-rotate-[40deg]",
        )}
      />
      <line
        x1={6} y1={12} x2={18} y2={12}
        className={cn(
          "ky-transition-opacity ky-pointer-events-none",
          open ? "ky-opacity-0" : "ky-opacity-100 group-hover/menu-icon:ky-opacity-0",
        )}
      />
      <line
        x1={6} y1={17} x2={18} y2={17}
        className={cn(
          "ky-transition-transform ky-pointer-events-none ky-origin-center",
          open ? "-ky-rotate-[40deg]" : "ky-rotate-0 group-hover/menu-icon:-ky-rotate-[40deg]",
        )}
      />
    </svg>
  );
});


export default MenuIcon;
