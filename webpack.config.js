const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    entry: {
        background: "./src/background.ts",
        content: "./src/content.ts",
        popup: "./src/popup/popup.ts",
    },
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "[name].js",
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: "ts-loader",
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: [".ts", ".js"],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./src/popup/popup.html",
            filename: "popup.html",
            chunks: ["popup"], // 僅包含 popup.js
        }),
    ],
    mode: "development",
    devtool: "cheap-module-source-map", // 使用安全的 source map 模式
};