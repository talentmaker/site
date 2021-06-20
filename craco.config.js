const craco = require("@craco/craco")
const path = require("path")
const paths = require("react-scripts/config/paths")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const StyleLintPlugin = require("stylelint-webpack-plugin")

const appPackageJson = require(paths.appPackageJson)

module.exports = {
    style: {
        modules: {
            localIdentName: "[local]_[sha256:hash:base64:6]", // Maybe add [folter] for folder name
        },
    },
    webpack: {
        alias: {
            // Alias ~ to src, e.g ~/components/whatever
            "~": path.join(__dirname, "src"),
        },
        plugins: {
            remove: ["HtmlWebpackPlugin"],
            add: [
                // Use non-blocking script load
                new HtmlWebpackPlugin({
                    inject: true,
                    template: paths.appHtml,
                    scriptLoading: "defer",
                    ...craco.whenProd(() => ({
                        minify: {
                            removeComments: true,
                            collapseWhitespace: true,
                            removeRedundantAttributes: true,
                            useShortDoctype: true,
                            removeEmptyAttributes: true,
                            removeStyleLinkTypeAttributes: true,
                            keepClosingSlash: true,
                            minifyJS: true,
                            minifyCSS: true,
                            minifyURLs: true,
                        },
                    })),
                }),

                // Add stylelint plugin
                new StyleLintPlugin({
                    configBasedir: __dirname,
                    context: path.resolve(__dirname, "src"),
                    files: ["**/*.scss", "**/*.sass", "**/*.css"],
                }),
            ],
        },
        resolve: {
            mainFields: ["module", "main", "browser"],
        },
        configure: (webpackConfig) => {
            const webpackJsonpName = appPackageJson.name.replace(/-[A-z]/u, (str) =>
                str[1].toUpperCase(),
            )

            return {
                ...webpackConfig,
                output: {
                    ...webpackConfig.output,
                    jsonpFunction: `wpJsonp${webpackJsonpName[0].toUpperCase()}${webpackJsonpName.slice(
                        1,
                    )}`,
                },
            }
        },
    },
}
