const path = require("path")
const StyleLintPlugin = require("stylelint-webpack-plugin")

module.exports = {
    style: {
        modules: {
            localIdentName: "[local]_[sha256:hash:base64:9]", // Maybe add [folter] for folder name
        },
    },
    webpack: {
        alias: {
            // Alias ~ to src, e.g ~/components/whatever
            "~": path.join(__dirname, "src"),
        },
        plugins: {
            // Add stylelint plugin
            add: [
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
    },
}
