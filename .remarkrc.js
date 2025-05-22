module.exports = {
  "plugins": [
    "remark-frontmatter",
    [
      "remark-lint-code",
      {
        "ts": {
          "module": "./documentation/remark_lint_code_plugin.js",
          "options": {
            "fix": false,
            "configFile": "documentation/samples/.eslintrc.js"
          }
        }
      }
    ],
    [
      "remark-lint-no-undefined-references",
      {
        "allow": [
          "x",
          "^1",
          "^2",
          "^3",
          "^4",
          "^5"
        ]
      }
    ],
    [
      "@julian_cataldo/remark-lint-frontmatter-schema",
      {
        "schemas": {
          "./documentation/schemas/frontmatter.yaml": [
            "**/*.md"
          ]
        }
      }
    ]
  ]
};
