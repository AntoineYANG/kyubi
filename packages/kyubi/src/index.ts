/*
 * @Author: Kyusho 
 * @Date: 2024-02-14 17:14:50 
 * @Last Modified by: Kyusho
 * @Last Modified time: 2024-02-16 17:31:37
 */

import path from "node:path";
import { rmdirSync, existsSync, readdirSync, readFileSync } from "node:fs";

import type { NextConfig } from "next";
import grayMatter from "gray-matter";

import getKyubiConfig, { type KyubiConfig, defineConfig } from "./utils/get-kyubi-config";
import { partialOverwrite } from "./utils/type-helper";
import { APP_KEYS, intermediatesDir, kyubiDir } from "./constance";
import type { IPageInfo } from "./loader";


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

  const pages: IPageInfo[] = [];

  for (const appKey of APP_KEYS) {
    const basePath = kyubiConfig[appKey].basePath;
    const pagesDir = path.join(rootDir, "pages", basePath);
    if (existsSync(pagesDir)) {
      const mdxFiles = readdirSync(pagesDir, { recursive: true, encoding: 'utf-8' }).filter(f => f.endsWith(".mdx") || f.endsWith(".md"));
      for (const file of mdxFiles) {
        const source = readFileSync(path.join(pagesDir, file), "utf-8");
        const { content, data } = grayMatter(source);
        const {
          title = file.split(/[\\/]/).pop()?.replace(/\.[^.]+$/, "") || "",
          keywords = "",
          tags = "",
          author = "",
          ...matter
        } = data;
        const mdTitle = content.match(/^#\s+(?<title>.+)/m)?.groups?.title || title;
        pages.push({
          appKey,
          path: `${basePath}/${file.replace(/\.[^.]+$/, "")}`,
          filename: file,
          title: mdTitle,
          author,
          keywords,
          tags,
          textContent: "",
          matter,
        });
      }
    }
  }
  
  return {
    ...origin,
    pageExtensions: [...new Set(
      [...(origin.pageExtensions || []), "js", "jsx", "ts", "tsx", "md", "mdx"]
    )],
    webpack(config, context) {
      config.module ??= { rules: [] };
      config.module.rules ??= [];

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
                pages,
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
