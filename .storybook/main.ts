import { resolve as _resolve } from "path";
import {
  createJoinFunction,
  createJoinImplementation,
  asGenerator,
  defaultJoinGenerator,
} from "resolve-url-loader";

const imageDirectory = _resolve("dist/img");
const fontsDirectory = _resolve("dist/fonts");

// call default generator then append any additional paths
const pathGenerator = asGenerator((item, ...rest) => [
  ...defaultJoinGenerator(item, ...rest),
  item.isAbsolute
    ? null
    : /\.(png|svg|jpg|jpeg|gif)$/.test(item.uri)
    ? imageDirectory
    : /\.(woff|woff2|eot|ttf|otf)$/.test(item.uri)
    ? fontsDirectory
    : null,
]);

const joinSassAssets = createJoinFunction(
  "joinSassAssets",
  createJoinImplementation(pathGenerator)
);

export const core = {
  builder: "webpack5",
};
export const stories = ["../packages/**/*.mdx"];
export const addons = [
  "@storybook/addon-links",
  "@storybook/addon-essentials",
  "@storybook/addon-a11y",
];
export const staticDirs = ["../dist"];
export async function webpackFinal(config, { configType }) {
  // `configType` has a value of 'DEVELOPMENT' or 'PRODUCTION'
  // You can change the configuration based on that.
  // 'PRODUCTION' is used when building the static version of storybook.
  config.module.rules.push(
    {
      test: /\.twig$/,
      use: "twigjs-loader",
      resolve: {
        alias: {
          "@components": _resolve(__dirname, "../packages"),
          "@templates": _resolve(__dirname, "../packages/templates"),
        },
      },
    },
    {
      test: /\.s(c|a)ss$/i,
      use: [
        {
          loader: "style-loader",
        },
        {
          loader: "css-loader",
          options: {
            sourceMap: true,
            esModule: false,
          },
        },
        {
          loader: "postcss-loader",
          options: {
            sourceMap: true,
            postcssOptions: (loaderContext) => {
              return {
                plugins: [
                  ["postcss-import", { root: loaderContext.resourcePath }],
                  ["postcss-discard-comments", { removeAll: true }],
                  "postcss-preset-env",
                  ["postcss-csso", { forceMediaMerge: false, comments: false }],
                ],
              };
            },
          },
        },
        {
          loader: "resolve-url-loader",
          options: {
            join: joinSassAssets,
          },
        },
        {
          loader: "sass-loader",
          options: {
            sourceMap: true,
            sassOptions: {
              includePaths: ["./packages", "./node_modules/@uswds"],
              implementation: require("sass-embedded"),
            },
          },
        },
      ],
      include: _resolve(__dirname, "../packages"),
    },
    {
      test: /\.(png|svg|jpg|jpeg|gif)$/i,
      type: "javascript/auto",
      use: {
        loader: "file-loader",
        options: {
          name: "[name].[ext]",
        },
      },
      include: _resolve(__dirname, "../packages"),
    },
    {
      test: /\.(woff|woff2|eot|ttf|otf)$/i,
      type: "javascript/auto",
      use: {
        loader: "file-loader",
        options: {
          name: "[path][name].[ext]",
        },
      },
      include: _resolve(__dirname, "../packages/uswds-core/src/assets/fonts"),
    }
  );

  return config;
}

export const docs = {
  autodocs: true,
};
