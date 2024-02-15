/*
 * @Author: Kyusho 
 * @Date: 2024-02-15 20:19:14 
 * @Last Modified by: Kyusho
 * @Last Modified time: 2024-02-16 00:13:46
 */

import { memo, type FC } from "react";
import Link from "next/link";

import type { TOCItem } from "../utils/md-helper";


const TOCNode = memo<Omit<TOCItem, 'children'> & { descendants: TOCItem['children'] }>(function TOCNode ({ id, descendants }) {
  return (
    <li className="ky-my-1">
      <Link
        className="ky-inline-block ky-w-full ky-rounded-md ky-py-1 ky-px-2 ky-text-opacity-85 hover:ky-text-opacity-100 hover:ky-bg-gray-300/30 dark:hover:ky-bg-gray-600/30"
        href={`#${encodeURIComponent(id.replaceAll(/((^\s+)|(\s+$))/g, "").replaceAll(/\s+/g, "-"))}`}
      >
        {id}
      </Link>
      {descendants && (
        <div className="ky-grid ky-grid-cols-[max-content_1fr]">
          <div
            className="ky-flex-none ky-h-full ky-w-4 md:ky-w-8 vertical-line ky-opacity-10"
            role="presentation"
            aria-hidden="true"
          />
          <ul>
            {descendants.map(child => (
              <TOCNode key={child.id} id={child.id} level={child.level} descendants={child.children} />
            ))}
          </ul>
        </div>
      )}
    </li>
  );
});

const TOC: FC<{ data: TOCItem[] }> = ({ data }) => {
  if (data.length === 0) {
    return null;
  }
  return (
    <ul className="ky-w-full ky-relative ky-text-sm">
      {data.map(item => (
        <TOCNode key={item.id} id={item.id} level={item.level} descendants={item.children} />
      ))}
    </ul>
  );
};


export default TOC;
