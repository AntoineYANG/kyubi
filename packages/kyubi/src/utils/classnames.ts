/*
 * @Author: Kyusho 
 * @Date: 2024-02-15 15:32:31 
 * @Last Modified by: Kyusho
 * @Last Modified time: 2024-02-15 15:33:03
 */

export const cn = (...args: any[]): string => {
  const classes = args.map((arg) => {
    if (typeof arg === "string") {
      return arg;
    }
    if (Array.isArray(arg)) {
      return cn(...arg);
    }
    if (typeof arg === "object") {
      return Object.entries(arg).map(([key, value]) => value && key).join(" ");
    }
    return "";
  });
  return classes.filter(Boolean).join(" ");
};

