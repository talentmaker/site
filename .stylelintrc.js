module.exports = {
    extends: "stylelint-config-standard",
    ignoreFiles: ["public/**", "build/**", "*.{tsx,ts,js,jsx}"],
    rules: {
        indentation: null, // Work with prettier
        "declaration-colon-newline-after": null,
        "at-rule-no-unknown": [
            true,
            {
                ignoreAtRules: [
                    "function",
                    "if",
                    "each",
                    "include",
                    "mixin",
                    "use",
                    "for",
                    "debug",
                ],
            },
        ],
        "no-eol-whitespace": [
            true,
            {
                ignore: ["empty-lines"],
            },
        ],
    },
}
