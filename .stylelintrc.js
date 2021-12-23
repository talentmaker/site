module.exports = {
    extends: ["stylelint-config-standard", "stylelint-prettier/recommended"],
    ignoreFiles: ["public/**", "build/**", "*.{tsx,ts,js,jsx}"],
    defaultSeverity: "warning",
    rules: {
        indentation: null, // Work with prettier
        "declaration-colon-newline-after": null,
    },
    overrides: [
        {
            files: ["**/*.module.*"],
            rules: {
                "selector-pseudo-class-no-unknown": [
                    true,
                    {
                        ignorePseudoClasses: ["global"],
                    },
                ],
                "selector-class-pattern":
                    /(^([a-z][a-z0-9]*)(-[a-z0-9]+)*$)|(^[a-z][a-zA-Z0-9]+$)/,
            },
        },
        {
            files: ["**/*.scss"],
            extends: ["stylelint-config-standard-scss", "stylelint-prettier/recommended"],
            rules: {
                "scss/dollar-variable-empty-line-before": null,
                "scss/function-quote-no-quoted-strings-inside": null,
                "scss/at-mixin-argumentless-call-parentheses": null,
            },
        },
    ],
}
