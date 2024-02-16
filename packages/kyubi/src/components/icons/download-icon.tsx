/*
 * @Author: Kyusho 
 * @Date: 2024-02-16 13:53:46 
 * @Last Modified by: Kyusho
 * @Last Modified time: 2024-02-16 13:54:43
 */

import { memo } from "react";


const DownloadIcon = memo(function DownloadIcon () {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      className="ky-w-8 ky-h-8 ky-pointer-events-none"
    >
      <path
        d="M14 5v6h3L12 16l-5-5h3V5h4z"
        stroke="none"
        fill="currentColor"
      />
      <line x1="5" y1="19" x2="19" y2="19" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
});


export default DownloadIcon;
