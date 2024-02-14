/*
 * @Author: Kyusho 
 * @Date: 2024-02-14 17:40:22 
 * @Last Modified by: Kyusho
 * @Last Modified time: 2024-02-14 17:48:42
 */

export type AllReadonly<T extends Record<keyof any, any>> = {
  readonly [K in keyof T]: T[K] extends Record<keyof any, any> ? AllReadonly<T[K]> : T[K];
};

export type AllWritable<T extends Record<keyof any, any>> = {
  -readonly [K in keyof T]: T[K] extends Record<keyof any, any> ? AllWritable<T[K]> : T[K];
};

export type AllPartial<T extends Record<keyof any, any>> = {
  [K in keyof T]?: T[K] extends Record<keyof any, any> ? AllPartial<T[K]> : T[K];
};

export const partialOverwrite = <T extends Record<keyof any, any>>(origin: AllReadonly<T>, overwrite: AllPartial<T>): AllWritable<T> => {
  // overwrite at every level
  const result = Object.assign({}, origin, overwrite) as AllWritable<T>;
  for (const key in overwrite) {
    if (overwrite[key] !== null && overwrite[key] !== undefined) {
      if (typeof overwrite[key] === "object") {
        // @ts-ignore
        result[key] = partialOverwrite(origin[key], overwrite[key]);
      } else {
        // @ts-ignore
        result[key] = overwrite[key];
      }
    }
  }
  return result;
};
