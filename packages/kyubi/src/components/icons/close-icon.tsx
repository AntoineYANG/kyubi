/*
 * @Author: Kyusho 
 * @Date: 2024-02-16 13:10:27 
 * @Last Modified by: Kyusho
 * @Last Modified time: 2024-02-16 13:10:58
 */

import { memo } from "react";


const CloseIcon = memo(function CloseIcon () {
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
      className="ky-w-[1.5em] ky-h-[1.5em] ky-stroke-current"
    >
      <line x1={6} y1={6} x2={18} y2={18} />
      <line x1={6} y1={18} x2={18} y2={6} />
    </svg>
  );
});


export default CloseIcon;
