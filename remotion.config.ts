/**
 * Note: When using the Node.JS APIs, the config file
 * doesn't apply. Instead, pass options directly to the APIs.
 *
 * All configuration options: https://remotion.dev/docs/config
 */

import * as path from "node:path";
import { Config } from "@remotion/cli/config";
import { enableTailwind } from "@remotion/tailwind-v4";

// Remotion loads remotion.config as CJS, so import.meta cannot be used here
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
 * `loaders/inject-composition-text.cjs` reloads composition-text on every compile.
 * (Previously this lived at the remotion.config top level via DefinePlugin, but that
 * meant local.json edits made after Studio started were never picked up.)
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
  const canvasPreviewDefine = new webpack.DefinePlugin({
    "process.env.REMOTION_CANVAS_BACKGROUND": JSON.stringify(
      process.env.REMOTION_CANVAS_BACKGROUND ?? "0",
    ),
    "process.env.REMOTION_TRANSPARENT_COMPOSITION_BACKDROP": JSON.stringify(
      process.env.REMOTION_TRANSPARENT_COMPOSITION_BACKDROP ?? "0",
    ),
  });
  return {
    ...withTailwind,
    plugins: [...(withTailwind.plugins ?? []), canvasPreviewDefine],
    module: {
      ...withTailwind.module,
      rules: [
        compositionInjectRule,
        ...(withTailwind.module?.rules ?? []),
      ],
    },
  };
});
