/*
 * @Author: Kyusho 
 * @Date: 2024-02-15 17:57:48 
 * @Last Modified by: Kyusho
 * @Last Modified time: 2024-02-15 19:44:00
 */

import {
  type PropsWithChildren,
  type FC,
  type KeyboardEvent as ReactKeyboardEvent,
  useEffect,
  useRef,
} from "react";

import { cn } from "../utils/classnames";


export interface IModalProps {
  isOpen: boolean;
  onDismiss?: () => void;
  /** @default true */
  enableEscKey?: boolean;
}

const Modal: FC<PropsWithChildren<IModalProps>> = ({ isOpen, onDismiss, enableEscKey = true, children }) => {
  const overlayRef = useRef<HTMLDivElement>(null);
  
  const handleDismiss = () => {
    if (isOpen) {
      onDismiss?.();
    }
  };

  const handleKeyDown = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    if (enableEscKey && e.key === "Escape") {
      handleDismiss();
    }
  };

  useEffect(() => {
    if (isOpen) {
      const curFocus = document.activeElement;
      
      if (curFocus && curFocus instanceof HTMLElement) {
        curFocus.blur();
      }

      const { current: overlay } = overlayRef;

      if (overlay) {
        overlay.focus();
        const handleFocusChange = (e: FocusEvent) => {
          if (!overlay.contains(e.relatedTarget as Node)) {
            overlay.focus();
          }
        };
        document.addEventListener("focusin", handleFocusChange);
        
        const handleTabKey = (e: KeyboardEvent) => {
          if (e.key === "Tab") {
            const focusableDescendants = overlay.querySelectorAll(
              'a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select, *[tabindex]'
            );
            const firstFocusableDescendant = focusableDescendants[0] as HTMLElement;
            const lastFocusableDescendant = focusableDescendants[focusableDescendants.length - 1] as HTMLElement;

            if (focusableDescendants.length === 0) {
              return;
            }

            if (e.shiftKey) {
              if (document.activeElement === firstFocusableDescendant) {
                lastFocusableDescendant.focus();
                e.preventDefault();
              }
            } else {
              if (document.activeElement === lastFocusableDescendant) {
                firstFocusableDescendant.focus();
                e.preventDefault();
              }
            }
          }
        };
        document.addEventListener("keydown", handleTabKey);

        return () => {
          document.removeEventListener("focusin", handleFocusChange);
          document.removeEventListener("keydown", handleTabKey);
        };
      }
    }
  }, [isOpen]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-hidden={!isOpen}
      className={cn(
        "ky-fixed ky-inset-0 ky-bg-white dark:ky-bg-black ky-bg-opacity-50 ky-backdrop-blur-sm ky-transition ky-duration-300 ky-z-50",
        isOpen ? "ky-opacity-100 ky-pointer-events-auto" : "ky-opacity-0 ky-pointer-events-none ky-backdrop-blur-0"
      )}
      onClick={handleDismiss}
      onKeyDown={handleKeyDown}
      tabIndex={isOpen ? -1 : undefined}
      ref={overlayRef}
    >
      <div
        className="ky-contents"
        onPointerDown={e => {
          // fixes a firefox issue that starts text selection https://bugzilla.mozilla.org/show_bug.cgi?id=1675846
          if (e.target === e.currentTarget) {
            e.preventDefault();
          }
        }}
        tabIndex={-1}
        onClick={e => e.stopPropagation()}
        onKeyDown={e => e.stopPropagation()}
        onMouseDown={e => e.stopPropagation()}
        onMouseUp={e => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};


export default Modal;
