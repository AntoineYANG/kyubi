/*
 * @Author: Kyusho 
 * @Date: 2024-02-14 17:37:09 
 * @Last Modified by: Kyusho
 * @Last Modified time: 2024-02-15 00:25:36
 */

import path from "node:path";
import { existsSync } from "node:fs";

import { partialOverwrite, type AllPartial } from "./type-helper";


export interface IKyubiConfig {
  blog: {
    /**
     * The base path of the blog sub-app.
     * @default "/blog"
     */
    basePath: string;
  };
  docs: {
    /**
     * The base path of the docs sub-app.
     * @default "/docs"
     */
    basePath: string;
  };
  wiki: {
    /**
     * The base path of the wiki sub-app.
     * @default "/wiki"
     */
    basePath: string;
  };
  extra: {
    /**
     * The base path of the extra sub-app.
     * @default "/extra"
     */
    basePath: string;
  };
  /**
   * If true, the intermediate compilation results will be emitted to a temporary directory ".kyubi/intermediates".
   * @default false
   */
  debugIntermediates: boolean;
}

export type KyubiConfig = AllPartial<IKyubiConfig>;

export type KyubiConfigFunction = () => IKyubiConfig;


export const defaultKyubiConfig: IKyubiConfig = {
  blog: {
    basePath: "/blog",
  },
  docs: {
    basePath: "/docs",
  },
  wiki: {
    basePath: "/wiki",
  },
  extra: {
    basePath: "/extra",
  },
  debugIntermediates: false,
};

export const defineConfig = (config: KyubiConfig | ((config: IKyubiConfig) => KyubiConfig)): IKyubiConfig => {
  if (typeof config === "function") {
    return partialOverwrite(defaultKyubiConfig, config(defaultKyubiConfig));
  }
  return partialOverwrite(defaultKyubiConfig, config);
};

export const getKyubiConfigFile = (appRoot: string): string | undefined => {
  return ['kyubi.config.ts', 'kyubi.config.js', 'kyubi.config.json'].map(filename => path.join(appRoot, filename)).find(existsSync);
};

/**
 * Get the kyubi configuration from the kyubi config file located in the root of the project.
 * 
 * Checks the following files in order:
 * - kyubi.config.ts
 * - kyubi.config.js
 * - kyubi.config.json
 */
const getKyubiConfig = (appRoot: string): IKyubiConfig => {
  const configFile = getKyubiConfigFile(appRoot);

  return defineConfig(configFile ? require(configFile) : {});
};


export default getKyubiConfig;
