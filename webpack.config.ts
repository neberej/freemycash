import path from "path";
import { Configuration as WebpackConfiguration } from "webpack";
import { Configuration as DevServerConfiguration } from "webpack-dev-server";
import CopyWebpackPlugin from "copy-webpack-plugin";
import TerserPlugin from "terser-webpack-plugin";

interface Configuration extends WebpackConfiguration {
  devServer?: DevServerConfiguration;
}

const config: Configuration = {
  mode: (process.env.NODE_ENV as "production" | "development" | undefined) ?? "development",
  entry: "./src/index.tsx",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: [
          {
            loader: "ts-loader",
            options: {
              configFile: "tsconfig.json",
            },
          },
        ],
        exclude: [/node_modules/, /\.(test|spec)\.(ts|tsx)$/],
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader", "postcss-loader"],
      },
      {
        test: /\.scss$/,
        use: [
          "style-loader",
          "css-loader",
          "postcss-loader",
          {
            loader: "sass-loader",
            options: {
              sassOptions: {
                quietDeps: true,
                includePaths: [path.resolve(__dirname, 'src')],
              },
            },
          },
        ],
      },
    ],
  },
  optimization: {
    minimizer: [
      new TerserPlugin({
        extractComments: false,
      }),
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js", ".json"],
    alias: {
      "@src": path.resolve(__dirname, "src"),
      "@components": path.resolve(__dirname, "src/components"),
      "@utils": path.resolve(__dirname, "src/utils"),
      "@static": path.resolve(__dirname, "src/static"),
    },
  },
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
    clean: true,
  },
  devServer: {
    historyApiFallback: true,
    static: {
      directory: path.join(__dirname, "dist"),
    },
    port: 3000,
    hot: true,
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [{ from: "public", to: "." }],
    }),
  ],
};

export default config;
