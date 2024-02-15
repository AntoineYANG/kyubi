/*
 * @Author: Kyusho 
 * @Date: 2024-02-14 22:26:33 
 * @Last Modified by: Kyusho
 * @Last Modified time: 2024-02-16 01:03:19
 */

import path from "node:path";

import grayMatter from "gray-matter";
import type { LoaderContext } from "webpack";

import type { IKyubiConfig } from "./utils/get-kyubi-config";
import { emitFileSync } from "./utils/file-helper";
import { intermediatesDir, kyubiDir } from "./constance";
import { parseTOC } from "./utils/md-helper";


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
    const data = `// Path: ${resourcePath}

// --------------------------------

${`${parts.join("\n//////////////\n")}`}

// --------------------------------
`;
    if (config.debugIntermediates) {
      emitFileSync(path.join(rootDir, kyubiDir, intermediatesDir, path.relative(path.join(rootDir, "pages"), resourcePath)), data);
    }
    callback(null, data);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  }).catch((err: any) => {
    callback(err);
  });
};


export default loader;
