/*
 * @Author: Kyusho 
 * @Date: 2024-02-14 22:26:33 
 * @Last Modified by: Kyusho
 * @Last Modified time: 2024-02-15 13:28:25
 */

import path from "node:path";

import type { LoaderContext } from "webpack";

import type { IKyubiConfig } from "./utils/get-kyubi-config";
import { emitFileSync } from "./utils/file-helper";
import { intermediatesDir, kyubiDir } from "./constance";


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
    const data = `// Path: ${resourcePath}

// --------------------------------

${`${res}`}

// --------------------------------
`;
    if (config.debugIntermediates) {
      emitFileSync(path.join(rootDir, kyubiDir, intermediatesDir, path.relative(path.join(rootDir, "pages"), resourcePath)), data);
    }
    callback(null, data);
  }).catch((err: any) => {
    callback(err);
  });
};


export default loader;
