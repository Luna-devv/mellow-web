import next from "@next/eslint-plugin-next";
import stylistic from "@stylistic/eslint-plugin";
import pathAlias from "eslint-plugin-path-alias";
import react from "eslint-plugin-react";
import reactCompiler from "eslint-plugin-react-compiler";
import reactHooks from "eslint-plugin-react-hooks";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import unusedImports from "eslint-plugin-unused-imports";
import tseslint from "typescript-eslint";

export default tseslint.config(
    ...tseslint.configs.recommended,
    {
        files: ["**/*.ts", "**/*.tsx"],
        ignores: ["node_modules", ".next"],
        languageOptions: {
            parser: tseslint.parser,
            parserOptions: {
                project: "./tsconfig.json",
                tsconfigRootDir: import.meta.dirname,
                warnOnUnsupportedTypeScriptVersion: false
            }
        },
        plugins: {
            react,
            "react-hooks": reactHooks,
            "@next/next": next,
            "react-compiler": reactCompiler,
            "path-alias": pathAlias,
            "simple-import-sort": simpleImportSort,
            "unused-imports": unusedImports,
            "@stylistic": stylistic,
        },
        rules: {
            ...react.configs.recommended.rules,
            ...react.configs['jsx-runtime'].rules,
            ...reactHooks.configs.recommended.rules,
            ...next.configs.recommended.rules,
            ...next.configs["core-web-vitals"].rules,

            // Fixes
            "react/prop-types": "off",
            "react-hooks/exhaustive-deps": "off",

            // stylistic Rules
            "@stylistic/array-bracket-newline": ["error", "consistent"],
            "@stylistic/array-bracket-spacing": "error",
            "@stylistic/array-element-newline": ["error", "consistent"],
            "@stylistic/arrow-parens": ["error", "always"],
            "@stylistic/block-spacing": "error",
            "@stylistic/brace-style": "error",
            "@stylistic/comma-dangle": ["error"],
            "@stylistic/comma-spacing": "error",
            "@stylistic/comma-style": "error",
            "@stylistic/computed-property-spacing": "error",
            "@stylistic/dot-location": ["error", "property"],
            "@stylistic/eol-last": ["error", "never"],
            "@stylistic/function-call-argument-newline": ["error", "consistent"],
            "@stylistic/function-call-spacing": "error",
            "@stylistic/indent": "error",
            "@stylistic/key-spacing": "error",
            "@stylistic/keyword-spacing": "error",
            "@stylistic/member-delimiter-style": ["error", { singleline: { requireLast: true } }],
            "@stylistic/new-parens": "error",
            "@stylistic/no-extra-semi": "error",
            "@stylistic/no-floating-decimal": "error",
            "@stylistic/no-multi-spaces": "error",
            "@stylistic/no-multiple-empty-lines": ["error", { max: 2, maxBOF: 0, maxEOF: 0 }],
            "@stylistic/no-trailing-spaces": "error",
            "@stylistic/no-whitespace-before-property": "error",
            "@stylistic/object-curly-newline": "error",
            "@stylistic/object-curly-spacing": ["error", "always"],
            "@stylistic/rest-spread-spacing": "error",
            "@stylistic/quote-props": ["error", "as-needed"],
            "@stylistic/quotes": "error",
            "@stylistic/semi": "error",
            "@stylistic/semi-spacing": "error",
            "@stylistic/semi-style": "error",
            "@stylistic/space-before-blocks": "error",
            "@stylistic/space-before-function-paren": ["error", { named: "never" }],
            "@stylistic/space-in-parens": "error",
            "@stylistic/space-infix-ops": "error",
            "@stylistic/space-unary-ops": "error",
            "@stylistic/spaced-comment": "error",
            "@stylistic/switch-colon-spacing": "error",
            "@stylistic/template-curly-spacing": "error",
            "@stylistic/template-tag-spacing": "error",
            "@stylistic/type-annotation-spacing": "error",
            "@stylistic/type-generic-spacing": "error",
            "@stylistic/type-named-tuple-spacing": "error",
            "@typescript-eslint/no-explicit-any": "error",
            "@typescript-eslint/adjacent-overload-signatures": "error",
            "@typescript-eslint/array-type": "error",
            "@typescript-eslint/ban-ts-comment": "error",
            "@typescript-eslint/no-wrapper-object-types": "error",
            "@typescript-eslint/no-empty-object-type": "error",
            "@typescript-eslint/no-unsafe-function-type": "error",
            "@typescript-eslint/class-literal-property-style": "error",
            "@typescript-eslint/consistent-type-definitions": "error",
            "@typescript-eslint/consistent-type-exports": ["error", { fixMixedExportsWithInlineTypeSpecifier: true }],
            "@typescript-eslint/consistent-type-imports": ["error", { fixStyle: "inline-type-imports" }],
            // "@typescript-eslint/member-ordering": ["error", {
            //     default: {
            //         memberTypes: [
            //             "call-signature",
            //             "signature",
            //             "constructor",
            //             ["static-accessor", "static-field", "static-get", "static-method", "static-set"],
            //             ["accessor", "get", "method", "set"],
            //             "field"
            //         ],
            //         order: "alphabetically-case-insensitive"
            //     }
            // }],
            "@typescript-eslint/method-signature-style": "error",
            "@typescript-eslint/naming-convention": ["error", { selector: "typeLike", format: ["PascalCase"] }],
            "@typescript-eslint/no-duplicate-enum-values": "error",
            "@typescript-eslint/no-duplicate-type-constituents": "error",
            "@typescript-eslint/no-empty-interface": "error",
            "@typescript-eslint/no-import-type-side-effects": "error",
            "@typescript-eslint/no-invalid-void-type": "error",
            "@typescript-eslint/no-misused-new": "error",
            "@typescript-eslint/no-redundant-type-constituents": "error",
            "@typescript-eslint/no-require-imports": "error",
            "@typescript-eslint/no-unnecessary-qualifier": "error",
            "@typescript-eslint/no-unnecessary-type-arguments": "error",
            "@typescript-eslint/no-unnecessary-type-constraint": "error",
            "@typescript-eslint/no-unsafe-declaration-merging": "error",
            "@typescript-eslint/no-unused-vars": ["error", {
                args: "all",
                argsIgnorePattern: "^_",
                destructuredArrayIgnorePattern: "^_",
                varsIgnorePattern: "^_"
            }],
            "@typescript-eslint/no-useless-empty-export": "error",
            "@typescript-eslint/prefer-enum-initializers": "error",
            "@typescript-eslint/prefer-function-type": "error",
            "@typescript-eslint/triple-slash-reference": "error",
            "@typescript-eslint/unified-signatures": "error",
            "@typescript-eslint/consistent-generic-constructors": "error",
            "@typescript-eslint/consistent-indexed-object-style": "error",
            "@typescript-eslint/no-unused-expressions": "error",
            "@typescript-eslint/require-await": "error",
            "@typescript-eslint/no-non-null-asserted-nullish-coalescing": "error",

            // Import Sorting Rules
            "simple-import-sort/imports": "error",
            "simple-import-sort/exports": "error",

            // Unused Imports Rules
            "unused-imports/no-unused-imports": "error",
            "unused-imports/no-unused-vars": [
                "warn",
                { vars: "all", varsIgnorePattern: "^_", args: "after-used", argsIgnorePattern: "^_" },
            ],
        },
        settings: {
            react: {
                version: "detect", // Automatically detects the React version
            },
        }
    },
    {
        ignores: ["node_modules", ".next", "**/gt4.ts", "next-env.d.ts", "typings.ts"]
    }
)
