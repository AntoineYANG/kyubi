/*
 * @Author: Kyusho 
 * @Date: 2024-02-14 22:26:33 
 * @Last Modified by: Kyusho
 * @Last Modified time: 2024-02-16 17:39:07
 */

import path from "node:path";

import type { LoaderContext } from "webpack";

import type { IKyubiConfig } from "./utils/get-kyubi-config";
import { emitFileSync } from "./utils/file-helper";
import { intermediatesDir, kyubiDir } from "./constance";
import { parseTOC } from "./utils/md-helper";
import type { APP_KEY } from "./types";


export interface IPageInfo {
  appKey: APP_KEY;
  path: string;
  filename: string;
  title: string;
  author?: string;
  tags?: string;
  keywords?: string;
  textContent: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  matter: Record<string, any>;
}

interface ILoaderContext {
  config: IKyubiConfig;
  rootDir: string;
  pages: IPageInfo[];
}

interface ILoader {
  (this: LoaderContext<ILoaderContext>, source: string): void;
}

type CreateProcessor = typeof import("@mdx-js/mdx").createProcessor;

let createProcessor: CreateProcessor | null = null;

const makeProcessor = async (): Promise<CreateProcessor> => {
  if (createProcessor) {
    return createProcessor;
  }
  const mdx = await import("@mdx-js/mdx");
  createProcessor = mdx.createProcessor;
  return createProcessor;
};

const loader: ILoader = function (this, source) {
  const { resourcePath } = this;
  const { config, rootDir, pages } = this.getOptions();
  const pagesDir = path.join(rootDir, "pages");
  const relativePath = `/${path.relative(pagesDir, resourcePath).replaceAll(/\\/g, "/").replace(/\.[^.]+$/, "")}`;
  const dirBase = `/${relativePath.split("/")[1]}`;
  const basePathMap: Record<string, APP_KEY> = {
    [config.blog.basePath]: "blog",
    [config.docs.basePath]: "docs",
    [config.wiki.basePath]: "wiki",
    [config.extra.basePath]: "extra",
  };
  const appKey = basePathMap[dirBase];
  if (!appKey) {
    const err = new Error(
      `The path "${dirBase}" of file "${resourcePath}" is not a valid base path, please check the kyubi config.
To include this file, you need to put it under the right base path (one of ${Object.keys(basePathMap).join(", ")}) or update the kyubi config.`
    );
    this.emitWarning(err);
    return this.callback(err);
  }
  const callback = this.async();
  const page = pages.find(page => page.path === relativePath);
  if (!page) {
    const err = new Error(
      `The file "${resourcePath}" is not included in the pages, please check the kyubi config.`
    );
    this.emitWarning(err);
    return this.callback(err);
  }
  const toc = parseTOC(source);
  Promise.all([
    import("remark"),
    import("strip-markdown"),
  ]).then(([{ remark }, { default: strip }]) => {
    return remark().use(strip).process(source).then(res => {
      page.textContent = `${res}`.trim();
    });
  }).then(() => {

    makeProcessor().then(
      processor => processor({
        jsx: false,
        format: "mdx",
        outputFormat: "program",
        // providerImportSource
        // remarkPlugins
        // rehypePlugins
      }).process({
        pathname: resourcePath,
        value: source,
      })
    ).then(res => {
      // split by every line without indent, but exclude the lines begin with "}" or comment
      const parts = `${res}`.split(/\n(?!\s)/).reduce<string[]>((acc, cur) => {
        // skip the empty parts
        if (/^\s*$/.test(cur)) {
          return acc;
        }
        if (acc.length === 0) {
          return [cur];
        }
        if (cur.startsWith("}") || cur.startsWith("//") || cur.startsWith("/*")) {
          acc[acc.length - 1] += `\n${cur}`;
        } else {
          acc.push(cur);
        }
        return acc;
      }, []);
      // add import
      parts.unshift(
        `import { Page } from "kyubi-js/layout";
import Image from "kyubi-js/elements/image";
import Button from "kyubi-js/elements/button";
import "kyubi-js/index.css";`
      );
      // replace original default export
      const defaultExportIndex = parts.findIndex(part => part.startsWith("export default"));
      parts.splice(defaultExportIndex, 1, (
        `export default function KyubiMDXPage(props) {
  return _jsx(Page, {
    path: "${relativePath}",
    appKey: "${appKey}",
    basePaths: ${JSON.stringify({
      blog: config.blog.basePath,
      docs: config.docs.basePath,
      wiki: config.wiki.basePath,
      extra: config.extra.basePath,
    })},
    title: "${page.title}",
    description: "${page.matter["description"] || ""}",
    keywords: "${page.keywords || ""}",
    tags: [${page.tags || ""}],
    author: "${page.author || ""}",
    matter: ${JSON.stringify(page.matter)},
    toc: ${JSON.stringify(toc)},
    extra: props,
    children: _jsx(_createMdxContent, {
      ...props,
      components: {
        img: Image,
        button: Button,
        ...props.components,
      },
    }),
    pages: ${JSON.stringify(pages.map(({ appKey, path, title }) => ({ appKey, path, title })))},
  });
}`
      ));
      const data = `// Path: ${relativePath} (file:${resourcePath})

// --------------------------------

${`${parts.join("\n//////////////\n")}`}

// --------------------------------
`;
      if (config.debugIntermediates) {
        emitFileSync(path.join(rootDir, kyubiDir, intermediatesDir, path.relative(pagesDir, resourcePath)), data);
      }
      callback(null, data);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }).catch((err: any) => {
      callback(err);
    });
  });
};


export default loader;
