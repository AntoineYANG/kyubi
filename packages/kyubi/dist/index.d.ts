import { NextConfig } from 'next';

type AllPartial<T extends Record<keyof any, any>> = {
    [K in keyof T]?: T[K] extends Record<keyof any, any> ? AllPartial<T[K]> : T[K];
};

interface IKyubiConfig {
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
}
type KyubiConfig = AllPartial<IKyubiConfig>;

declare const kyubi: (origin?: NextConfig, config?: KyubiConfig) => NextConfig;

export { kyubi as default };
