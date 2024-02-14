/*
 * @Author: Kyusho 
 * @Date: 2024-02-14 22:26:33 
 * @Last Modified by: Kyusho
 * @Last Modified time: 2024-02-15 00:21:33
 */

import type { LoaderContext } from "webpack";

import type { IKyubiConfig } from "./utils/get-kyubi-config";


interface ILoaderContext {
  config: IKyubiConfig;
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
  const { config } = this.getOptions();
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
    console.log([res]);
    const data = `// Path: ${resourcePath}
${`${res}`.replaceAll(/^/gm, '  ')}
`;
    callback(null, data);
  }).catch((err: any) => {
    callback(err);
  });
};


export default loader;
