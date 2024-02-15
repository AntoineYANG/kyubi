/*
 * @Author: Kyusho 
 * @Date: 2024-02-15 19:56:39 
 * @Last Modified by: Kyusho
 * @Last Modified time: 2024-02-15 20:23:50
 */


export type TOCItem = {
  level: number;
  id: string;
  children?: TOCItem[];
};

/**
 * Parse the table of contents from markdown content
 */
export const parseTOC = (content: string): TOCItem[] => {
  const toc: TOCItem[] = [];
  const lines = content.split("\n");
  const stack: TOCItem[] = [];
  const map: Record<string, 1> = {};
  for (const line of lines) {
    const match = line.match(/^(?<prefix>#+)\s+(?<id>.*)/);
    if (match?.groups) {
      const level = match.groups.prefix.length;
      const id = match.groups.id;
      if (map[id]) {
        continue;
      }
      const item: TOCItem = { level, id };

      if (level === 1) {
        if (toc.length > 0) {
          break;
        }
        toc.push(item);
        map[id] = 1;
        stack.splice(0, stack.length, item);
      } else if (level <= 6) {
        let cur = stack[stack.length - 1];
        while (cur && cur.level >= level) {
          stack.pop();
          cur = stack[stack.length - 1];
        }

        if (cur) {
          if (!cur.children) {
            cur.children = [];
          } else {
            stack.pop();
          }
          cur.children.push(item);
          map[id] = 1;
          stack.push(item);
        }
      }
    }
  }
  return toc;
};
