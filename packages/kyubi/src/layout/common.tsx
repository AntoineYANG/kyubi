"use client";
/*
 * @Author: Kyusho 
 * @Date: 2024-02-15 13:54:58 
 * @Last Modified by: Kyusho
 * @Last Modified time: 2024-02-16 17:45:44
 */

import {
  useState,
  useEffect,
  type FC,
  type PropsWithChildren,
  useMemo,
} from "react";
import Head from "next/head";
import Link from "next/link";

import { cn } from "../utils/classnames";
import type { TOCItem } from "../utils/md-helper";
import Modal from "../elements/modal";
import Button from "../elements/button";
import TOC from "../components/toc";
import ImageViewer from "../components/image-viewer";
import DarkModeSwitch from "../components/dark-mode-switch";
import MenuIcon from "../components/icons/menu-icon";
import CloseIcon from "../components/icons/close-icon";
import { APP_KEYS } from "../constance";
import type { APP_KEY } from "../types";
import type { IPageInfo } from "../loader";


export interface IPageProps {
  path: string;
  pages: Pick<IPageInfo, 'appKey' | 'path' | 'title'>[];
  appKey: APP_KEY;
  basePaths: Record<APP_KEY, string>;
  title: string;
  description: string;
  keywords: string;
  tags: string[];
  author: string;
  extra: Record<string, unknown>;
  matter: Record<string, unknown>;
  toc: TOCItem[];
}

export const Page: FC<PropsWithChildren<IPageProps>> = ({
  path,
  pages,
  appKey,
  basePaths,
  title,
  description,
  keywords,
  tags,
  author,
  matter,
  toc: tocItems,
  children
}) => {
  const allTags = tags.join(",");

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  useEffect(() => {
    setIsDrawerOpen(false);
  }, []);

  const pageItems = useMemo<Record<APP_KEY, undefined | typeof pages>>(() => {
    const result: Record<APP_KEY, typeof pages> = {
      blog: [],
      docs: [],
      wiki: [],
      extra: [],
    };
    for (const page of pages) {
      result[page.appKey].push(page);
    }
    for (const key of APP_KEYS) {
      if (!result[key].length) {
        delete result[key];
      }
    }
    return result;
  }, [pages]);

  const pagesOfThisLevel = useMemo(() => {
    const dir = path.split("/").slice(0, -1).join("/");
    return pages.filter(p => p.path.startsWith(dir));
  }, [pageItems, path]);

  const menu = (
    <>
      {/* links */}
      <div className="w-full ky-flex-1 ky-flex ky-flex-col ky-justify-start ky-items-start">
        {pagesOfThisLevel.map(page => (
          <Link
            key={page.path}
            href={page.path}
            className="ky-m-2"
          >
            {page.title}
          </Link>
        ))}
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
            "ky-min-w-[25%] ky-max-w-[70%] ky-h-full ky-bg-gray-100 dark:ky-bg-gray-800 ky-shadow-lg",
            "ky-transform ky-transition-transform ky-duration-300",
            isDrawerOpen ? "ky-translate-x-0" : "-ky-translate-x-full",
          )}
        >
          {menu}
        </aside>
        <Button
          className="ky-fixed ky-top-4 ky-right-4 md:ky-hidden"
          onClick={() => setIsDrawerOpen(false)}
          aria-label="close"
        >
          <CloseIcon />
        </Button>
      </Modal>

      <div className="__kyubi_container ky-flex-none ky-flex ky-flex-col ky-w-full ky-h-full ky-overflow-hidden">

        {/* header */}
        <nav className="__kyubi_nav ky-flex-none ky-flex ky-justify-between ky-items-center ky-p-4 ky-bg-white dark:ky-bg-gray-900 ky-shadow-lg ky-capitalize">
          <Button
            className="ky-block md:ky-hidden"
            onClick={() => setIsDrawerOpen(!isDrawerOpen)}
            aria-label="menu"
          >
            <MenuIcon open={isDrawerOpen} />
          </Button>
          {/* nav */}
          <div className="ky-flex ky-justify-center ky-items-center">
            <Link href="/" className="ky-m-2">Home</Link>
            <span role="separator" className="ky-m-2 ky-select-none ky-opacity-20 ky-pointer-events-none">|</span>
            {/* app links */}
            {Object.entries(basePaths).map(([key, path]) => {
              const hasPages = Boolean(pageItems[key as APP_KEY]?.length);
              if (!hasPages) {
                // FIXME: remove the <span>
                // return null;
                return (
                  <span
                    key={key}
                    className="ky-m-2 ky-opacity-20 ky-cursor-default"
                  >
                    {key}
                  </span>
                );
              }
              return (
                <Link
                  key={key}
                  href={path}
                  className={cn(
                    "ky-m-2 hover:ky-opacity-100 hover:ky-underline",
                    key === appKey ? "ky-opacity-90 ky-font-semibold" : "ky-opacity-60"
                  )}
                >
                  {key}
                </Link>
              );
            })}
          </div>
          <div className="ky-flex ky-justify-center ky-items-center">
            {/* <Link href="/login" className="ky-m-2">Login</Link>
            <Link href="/register" className="ky-m-2">Register</Link> */}
            {/* dark mode toggle */}
            <DarkModeSwitch />
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
