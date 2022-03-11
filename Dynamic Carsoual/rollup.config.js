// rollup.config.js
import resolve from "@rollup/plugin-node-resolve";
import babel from "@rollup/plugin-babel";
import replace from "@rollup/plugin-replace";
import { terser } from "rollup-plugin-terser";
import postcss from "rollup-plugin-postcss";
import packageJson from "./package.json";

const year = new Date().getFullYear();

const TERSER_PLUGIN = terser({
    output: {
        comments: /^!/
    }
});

const PLUGINS = [
    resolve({
        browser: true
    }),
    postcss(),
    babel({
        babelHelpers: "bundled",
        presets: [["@babel/env", { modules: false }]]
    }),
    replace({
        preventAssignment: true,
        "process.env.NODE_ENV": "\"prod\""
    })
];

const BANNER = `/*!
* Copyright (c) ${year} Bonzai Digital Pte. Ltd., All rights reserved.
*/
`;

export default [
    {
        output: {
            file: `dist/${packageJson.version}/dynamic-carousel.min.js`,
            format: "iife",
            name: "DynamicCarousel",
            banner: BANNER
        },
        plugins: PLUGINS.concat(TERSER_PLUGIN)
    },
    {
        output: {
            file: `dist/${packageJson.version}/dynamic-carousel.js`,
            format: "iife",
            name: "DynamicCarousel",
            banner: BANNER
        },
        plugins: PLUGINS
    }
];
