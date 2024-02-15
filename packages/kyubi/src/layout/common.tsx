"use client";
/*
 * @Author: Kyusho 
 * @Date: 2024-02-15 13:54:58 
 * @Last Modified by: Kyusho
 * @Last Modified time: 2024-02-16 00:25:00
 */

import {
  useState,
  useEffect,
  type FC,
  type PropsWithChildren,
} from "react";
import Head from "next/head";
import Link from "next/link";

import { cn } from "../utils/classnames";
import type { TOCItem } from "../utils/md-helper";
import Modal from "../elements/modal";
import Button from "../elements/button";
import TOC from "../components/toc";
import ImageViewer from "../components/image-viewer";


export interface IPageProps {
  title: string;
  description: string;
  keywords: string;
  tags: string[];
  author: string;
  extra: Record<string, unknown>;
  matter: Record<string, unknown>;
  toc: TOCItem[];
}

export const Page: FC<PropsWithChildren<IPageProps>> = ({ title, description, keywords, tags, author, matter, toc: tocItems, children }) => {
  const allTags = tags.join(",");

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  useEffect(() => {
    setIsDrawerOpen(false);
  }, []);

  const menu = (
    <>
      {/* links */}
      <div className="w-full ky-flex-1 ky-flex ky-flex-col ky-justify-start ky-items-start">
        <Link href="/blog" className="ky-m-2">Blog</Link>
        <Link href="/docs" className="ky-m-2">Docs</Link>
        <Link href="/wiki" className="ky-m-2">Wiki</Link>
        <Link href="/extra" className="ky-m-2">Extra</Link>
      </div>
      {/* tools */}
      <div className="w-full ky-flex-none ky-flex ky-flex-col ky-justify-start ky-items-start">
        <Link href="/search" className="ky-m-2">Search</Link>
        <Link href="/settings" className="ky-m-2">Settings</Link>
      </div>
    </>
  );

  const toc = <TOC data={tocItems} />;

  useEffect(() => {
    // catch hash change event
    const handler = () => {
      const hash = location.hash;
      if (hash) {
        const headers = document.querySelectorAll(["h1", "h2", "h3", "h4", "h5", "h6"].map(tag => `main > ${tag}`).join(", "));
        for (const header of [...headers as unknown as HTMLElement[]]) {
          const title = header.textContent;
          if (title && title.replaceAll(/((^\s+)|(\s+$))/g, "").replaceAll(/\s+/g, "-") === decodeURIComponent(hash).slice(1)) {
            header.scrollIntoView({
              behavior: "smooth",
            });
            break;
          }
        }
      }
    }
    handler();
    window.addEventListener("hashchange", handler);
    return () => window.removeEventListener("hashchange", handler);
  }, []);

  useEffect(() => {
    // read preference from localStorage / system
    const darkMode = localStorage.getItem("kyubi-dark-mode");
    const html = document.querySelector("html");
    if (!html) {
      return;
    }
    if (darkMode === "dark") {
      html.classList.add("ky-dark");
    } else if (darkMode === "light") {
      html.classList.remove("ky-dark");
    } else {
      if (darkMode !== null) {
        localStorage.removeItem("kyubi-dark-mode");
      }
      const media = window.matchMedia("(prefers-color-scheme: dark)");
      if (media.matches) {
        html.classList.add("ky-dark");
      } else {
        html.classList.remove("ky-dark");
      }
    }
  }, []);

  return (
    <div className="__kyubi_page ky-relative ky-m-0 ky-p-0 ky-w-screen ky-h-screen ky-flex ky-flex-col ky-overflow-hidden ky-bg-gray-300 dark:ky-bg-gray-600 ky-text-gray-800 dark:ky-text-gray-100">

      <Head>
        <title>{title || "Kyubi: Build your website with ease."}</title>
        {description && <meta name="description" content={description} />}
        {keywords && <meta name="keywords" content={keywords} />}
        {allTags && <meta name="tags" content={allTags} />}
        {author && <meta name="author" content={author} />}
        {Object.entries(matter).map(([key, value]) => String(value) ? (
          <meta key={key} name={key} content={String(value)} />
        ) : null)}
      </Head>

      {/* menu as drawer for mobile device, use transition */}

      <Modal isOpen={isDrawerOpen} onDismiss={() => setIsDrawerOpen(false)}>
        <aside
          className={cn(
            "__kyubi_drawer_mobile ky-flex ky-flex-col md:ky-hidden",
            "ky-min-w-[25%] ky-max-w-[60%] ky-h-full ky-bg-gray-50 ky-shadow-lg",
            "ky-transform ky-transition-transform ky-duration-300",
            isDrawerOpen ? "ky-translate-x-0" : "-ky-translate-x-full",
          )}
        >
          {menu}
        </aside>
      </Modal>

      <div className="__kyubi_container ky-flex-none ky-flex ky-flex-col ky-w-full ky-h-full ky-overflow-hidden">

        {/* header */}
        <nav className="__kyubi_nav ky-flex-none ky-flex ky-justify-between ky-items-center ky-p-4 ky-bg-white dark:ky-bg-gray-900 ky-shadow-lg">
          <Button
            className="ky-block md:ky-hidden"
            onClick={() => setIsDrawerOpen(!isDrawerOpen)}
          >
            {"Menu"}
          </Button>
          {/* nav */}
          <div className="ky-flex ky-justify-center ky-items-center">
            <Link href="/" className="ky-m-2">Home</Link>
            <Link href="/about" className="ky-m-2">About</Link>
          </div>
          <div className="ky-flex ky-justify-center ky-items-center">
            <Link href="/login" className="ky-m-2">Login</Link>
            <Link href="/register" className="ky-m-2">Register</Link>
            {/* dark mode toggle */}
            <button
              className="ky-m-2"
              onClick={() => {
                const html = document.querySelector("html");
                if (html) {
                  html.classList.toggle("ky-dark");
                  const darkMode = html.classList.contains("ky-dark") ? "dark" : "light";
                  localStorage.setItem("kyubi-dark-mode", darkMode);
                }
              }}
            >
              {"Dark Mode"}
            </button>
          </div>
        </nav>

        <div className="ky-flex-1 ky-overflow-auto ky-flex ky-flex-col ky-relative">
          <div className="__kyubi_body ky-grow ky-shrink-0 ky-flex ky-relative">

            {/* menu as aside for desktop device */}
            <aside className="ky-z-[1] ky-w-1/4 ky-flex-none ky-hidden md:ky-flex ky-min-h-full ky-flex-col ky-p-4 ky-bg-gray-50 dark:ky-bg-gray-800">
              <div className="ky-sticky ky-top-0">
                {menu}
              </div>
            </aside>

            <div className="ky-relative ky-z-[3] __kyubi_content ky-col-span-4 md:ky-col-span-2 ky-h-full ky-bg-gray-100 dark:ky-bg-gray-800 ky-shadow-lg ky-flex ky-flex-col ky-space-y-4">
              <div className="ky-p-4">
                {/* toc for mobile device */}
                <div className="__kyubi_toc ky-flex-none ky-flex md:ky-hidden ky-flex-col ky-justify-start ky-items-start ky-w-full">
                  {toc}
                </div>

                {/* main content */}
                <main className="__kyubi_main ky-grow ky-shrink-0 ky-w-full">
                  {children}
                </main>
              </div>
            </div>
            
            {/* toc for desktop device */}
            <aside className="ky-z-[1] ky-w-1/4 ky-flex-none ky-hidden md:ky-flex ky-min-h-full ky-flex-col ky-p-4 ky-bg-gray-50 dark:ky-bg-gray-800">
              <div className="ky-sticky ky-top-0">
                {toc}
              </div>
            </aside>

          </div>

          {/* footer */}
          <footer className="__kyubi_footer ky-relative ky-z-[5] ky-col-span-full ky-flex ky-justify-center ky-items-center ky-p-4 ky-bg-gray-50 dark:ky-bg-gray-800 ky-shadow-lg">
            <p>© 2024 Kyubi</p>
          </footer>
        </div>

        {/* image viewer */}
        <ImageViewer />

      </div>
    </div>
  );
};