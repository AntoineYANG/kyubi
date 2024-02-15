"use client";
/*
 * @Author: Kyusho 
 * @Date: 2024-02-15 23:38:23 
 * @Last Modified by: Kyusho
 * @Last Modified time: 2024-02-16 00:44:14
 */

import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";

import Modal from "../elements/modal";
import Button from "../elements/button";


interface IImageViewerEventDetail {
  src: string;
}

export const useImageViewer = () => {
  const open = useCallback((src: string) => {
    window.dispatchEvent(new CustomEvent<IImageViewerEventDetail>("imageViewerOpen", { detail: { src } }));
  }, []);

  const handleCloseRef = useRef<() => void>(() => {});
  const onClose = useCallback((cb: () => void) => {
    handleCloseRef.current = cb;
  }, []);

  const handler = useMemo(() => ({ open, onClose }), [open, onClose]);

  useEffect(() => {
    // handle close event
    const handleClose = () => {
      handleCloseRef.current();
    };
    window.addEventListener("imageViewerClose", handleClose);
    return () => {
      window.removeEventListener("imageViewerClose", handleClose);
    };
  }, []);
  
  return handler;
};

const ImageViewer = memo(function ImageViewer () {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const [src, setSrc] = useState<string | null>(null);

  useEffect(() => {
    const handleOpen = (e: Event) => {
      setSrc((e as CustomEvent<IImageViewerEventDetail>).detail.src);
    };
    window.addEventListener("imageViewerOpen", handleOpen);
    return () => {
      window.removeEventListener("imageViewerOpen", handleOpen);
    };
  }, []);

  const handleClose = () => {
    setSrc(null);
  };

  useEffect(() => {
    if (src === null) {
      window.dispatchEvent(new CustomEvent("imageViewerClose"));
    }
  }, [src]);

  if (!mounted || !src) {
    // Prevent rendering on the server
    return null;
  }

  const handleDownload = async () => {
    const response = await fetch(src);

    const blobImage = await response.blob();

    const href = URL.createObjectURL(blobImage);

    const anchorElement = document.createElement('a');
    anchorElement.href = href;
    anchorElement.download = src.split('/').pop() || 'image';

    document.body.appendChild(anchorElement);
    anchorElement.click();

    document.body.removeChild(anchorElement);
    window.URL.revokeObjectURL(href);
  };

  return (
    <Modal isOpen={src !== null} onDismiss={handleClose}>
      <div className="ky-inset-0 ky-w-full ky-h-full ky-flex ky-flex-col">
        <div className="ky-flex-0 ky-bg-gray-100 dark:ky-bg-gray-800 ky-text-gray-500 dark:ky-text-gray-400 ky-py-2 ky-text-right ky-relative ky-z-10 ky-shadow-lg ky-px-2 ky-space-x-2">
          <Button
            onClick={handleDownload}
            aria-label="Download image"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="ky-w-8 ky-h-8 ky-pointer-events-none"
            >
              <path
                d="M14 4v6h3L12 15l-5-5h3V4h4z"
                stroke="none"
                fill="currentColor"
              />
              <line x1="5" y1="19" x2="19" y2="19" stroke="currentColor" strokeWidth="2" />
            </svg>
          </Button>
          <Button
            className="ky-text-2xl"
            onClick={handleClose}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="ky-w-8 ky-h-8 ky-pointer-events-none"
            >
              <path d="M18 6L6 18 M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Button>
        </div>
        <div className="ky-flex-1 ky-overflow-hidden ky-cursor-zoom-out ky-flex" onClick={handleClose}>
          <div className="ky-p-[2vmax] ky-w-full ky-h-full ky-flex-1 ky-flex ky-items-center ky-justify-center">
            <img
              src={src}
              alt=""
              loading="lazy"
              draggable="false"
              onDragStart={e => e.preventDefault()}
              className="ky-w-auto ky-h-auto ky-max-w-full ky-max-h-full ky-object-cover ky-object-center ky-select-none"
            />
          </div>
        </div>
        <div className="ky-flex-0 ky-h-10 ky-bg-gray-100 dark:ky-bg-gray-800 ky-p-2 ky-text-right ky-relative ky-z-10 ky-shadow-lg ky-px-2 ky-space-x-2">
        </div>
      </div>
    </Modal>
  );
});


export default ImageViewer;
