/*
 * @Author: Kyusho 
 * @Date: 2024-02-14 17:14:50 
 * @Last Modified by: Kyusho
 * @Last Modified time: 2024-02-15 00:24:40
 */

import type { NextConfig } from "next";

import getKyubiConfig, { type KyubiConfig } from "./utils/get-kyubi-config";
import { partialOverwrite } from "./utils/type-helper";


const kyubi = (origin: NextConfig = {}, config: KyubiConfig = {}): NextConfig => {
  const kyubiConfig = partialOverwrite(getKyubiConfig(process.cwd()), config);
  
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
              },
            },
          ],
        },
      );
      
      return config;
    },
  };
};


export type { KyubiConfig };
export { defineConfig } from "./utils/get-kyubi-config";

export default kyubi;
module.exports = kyubi;
