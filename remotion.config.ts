/**
 * Note: When using the Node.JS APIs, the config file
 * doesn't apply. Instead, pass options directly to the APIs.
 *
 * All configuration options: https://remotion.dev/docs/config
 */

import * as path from "node:path";
import { Config } from "@remotion/cli/config";
import { enableTailwind } from "@remotion/tailwind-v4";

// Remotion が remotion.config を CJS として読み込むため import.meta は使わない
// eslint-disable-next-line @typescript-eslint/no-require-imports
const nodeRequire: NodeRequire = require;

const remotionCliRoot = path.dirname(
  nodeRequire.resolve("@remotion/cli/package.json"),
);
const webpack = nodeRequire(
  nodeRequire.resolve("webpack", { paths: [remotionCliRoot] }),
) as typeof import("webpack");

// Transparent background video export settings
Config.setVideoImageFormat("png");
Config.setPixelFormat("yuva444p10le");
Config.setCodec("prores");
Config.setProResProfile("4444");

Config.setOverwriteOutput(true);

/**
 * composition-text は `loaders/inject-composition-text.cjs` が各コンパイルで再読込する。
 * （旧: remotion.config トップレベル + DefinePlugin だと Studio 起動後の local.json が反映されない）
 */
Config.overrideWebpackConfig((currentConfig) => {
  const withTailwind = enableTailwind(currentConfig);
  const compositionInjectRule = {
    test: /inlined-composition-text\.ts$/,
    use: [
      {
        loader: path.join(
          process.cwd(),
          "loaders/inject-composition-text.cjs",
        ),
      },
    ],
    enforce: "pre" as const,
  };
  return {
    ...withTailwind,
    module: {
      ...withTailwind.module,
      rules: [
        compositionInjectRule,
        ...(withTailwind.module?.rules ?? []),
      ],
    },
  };
});
