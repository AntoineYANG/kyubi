/*
 * @Author: Kyusho 
 * @Date: 2024-02-15 13:04:34 
 * @Last Modified by: Kyusho
 * @Last Modified time: 2024-02-15 13:08:34
 */

import { dirname } from "node:path";
import { mkdir, writeFile, access } from "node:fs/promises";
import { accessSync, mkdirSync, writeFileSync } from "node:fs";


export const emitFile = async (path: string, content: string) => {
  try {
    await access(dirname(path));
  } catch {
    await mkdir(dirname(path), { recursive: true });
  }
  await writeFile(path, content);
};

export const emitFileSync = (path: string, content: string) => {
  try {
    accessSync(dirname(path));
  } catch {
    mkdirSync(dirname(path), { recursive: true });
  }
  writeFileSync(path, content);
};
