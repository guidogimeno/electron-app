import { fileURLToPath } from "url"
import path from "path"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default {
    mode: "development",
    entry: "./src/index.js",
    devtool: "inline-source-map",
    target: "electron-renderer",
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: [[
                            "@babel/preset-env", {
                                targets: {
                                    esmodules: true
                                }
                            }],
                            "@babel/preset-react"]
                    }
                }
            },
            {
                test: [/\.css$/i],
                use: [
                    "style-loader",
                    "css-loader",
                ],
            }
        ]
    },
    resolve: {
        extensions: [".js"],
    },
    output: {
        filename: "app.js",
        path: path.resolve(__dirname, "build", "js"),
    },
}
