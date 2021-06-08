const path = require("path")

module.exports = {
    style: {
        modules: {
            localIdentName: "tm-[local]_[sha256:hash:base64:9]", // Maybe add [folter] for folder name
        },
    },
    webpack: {
        alias: {
            "~": path.join(__dirname, "src"),
        },
    },
}
