module.exports = {
    extends: ["stylelint-config-standard", "stylelint-prettier/recommended"],
    ignoreFiles: ["public/**", "build/**", "*.{tsx,ts,js,jsx}"],
    defaultSeverity: "warning",
    rules: {
        indentation: null, // Work with prettier
        "declaration-colon-newline-after": null,
        "at-rule-no-unknown": [
            true,
            {
                ignoreAtRules: [
                    "use",
                    "forward",
                    "import",
                    "mixin",
                    "include",
                    "function",
                    "extend",
                    "at-root",
                    "error",
                    "warn",
                    "debug",
                    "if",
                    "each",
                    "for",
                    "while",
                ],
            },
        ],
        "no-eol-whitespace": [
            true,
            {
                ignore: ["empty-lines"],
            },
        ],
        "selector-pseudo-class-no-unknown": [
            true,
            {
                ignorePseudoClasses: ["global"],
            },
        ],
    },
}
