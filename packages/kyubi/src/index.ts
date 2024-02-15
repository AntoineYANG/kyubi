/*
 * @Author: Kyusho 
 * @Date: 2024-02-14 17:14:50 
 * @Last Modified by: Kyusho
 * @Last Modified time: 2024-02-15 13:27:45
 */

import path from "node:path";
import { rmdirSync, existsSync } from "node:fs";

import type { NextConfig } from "next";

import getKyubiConfig, { type KyubiConfig, defineConfig } from "./utils/get-kyubi-config";
import { partialOverwrite } from "./utils/type-helper";
import { intermediatesDir, kyubiDir } from "./constance";


const kyubi = (origin: NextConfig = {}, config: KyubiConfig = {}): NextConfig => {
  const kyubiConfig = partialOverwrite(getKyubiConfig(process.cwd()), config);

  const rootDir = process.cwd();

  if (kyubiConfig.debugIntermediates) {
    const intermediatesPath = path.join(rootDir, kyubiDir, intermediatesDir);
    import("chalk").then(({ default: chalk }) => {
      console.warn(chalk.yellow(`   Kyubi: \`debugIntermediates\` is enabled, intermediates will be emitted to "${intermediatesPath}".`));
    });
    if (existsSync(intermediatesPath)) {
      rmdirSync(intermediatesPath, { recursive: true });
    }
  }
  
  return {
    ...origin,
    pageExtensions: [...new Set(
      [...(origin.pageExtensions || []), "js", "jsx", "ts", "tsx", "md", "mdx"]
    )],
    webpack(config, context) {
      if (config.module === undefined) {
        config.module = { rules: [] };
      } else if (config.module.rules === undefined) {
        config.module.rules = [];
      }

      config.module.rules.push(
        {
          test: /\.mdx?$/,
          use: [
            context.defaultLoaders.babel,
            {
              loader: "kyubi-js/loader",
              options: {
                config: kyubiConfig,
                rootDir,
              },
            },
          ],
        },
      );
      
      return config;
    },
  };
};


module.exports = Object.assign(kyubi, {
  defineConfig,
});

export type { KyubiConfig };
