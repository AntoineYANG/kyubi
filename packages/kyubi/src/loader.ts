/*
 * @Author: Kyusho 
 * @Date: 2024-02-14 22:26:33 
 * @Last Modified by: Kyusho
 * @Last Modified time: 2024-02-16 11:53:43
 */

import path from "node:path";

import grayMatter from "gray-matter";
import type { LoaderContext } from "webpack";

import type { IKyubiConfig } from "./utils/get-kyubi-config";
import { emitFileSync } from "./utils/file-helper";
import { intermediatesDir, kyubiDir } from "./constance";
import { parseTOC } from "./utils/md-helper";
import type { APP_KEY } from "./types";


interface ILoaderContext {
  config: IKyubiConfig;
  rootDir: string;
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
  const { config, rootDir } = this.getOptions();
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
  const { content, data } = grayMatter(source);
  const toc = parseTOC(content);
  const {
    title = resourcePath.split(/[\\/]/).pop()?.replace(/\.[^.]+$/, "") || "",
    description = "",
    keywords = "",
    tags = "",
    author = "",
    ...matter
  } = data;
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
      value: content,
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
    appKey: "${appKey}",
    basePaths: ${JSON.stringify({
      blog: config.blog.basePath,
      docs: config.docs.basePath,
      wiki: config.wiki.basePath,
      extra: config.extra.basePath,
    })},
    title: "${title}",
    description: "${description}",
    keywords: "${keywords}",
    tags: [${tags}],
    author: "${author}",
    matter: ${JSON.stringify(matter)},
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
};


export default loader;
