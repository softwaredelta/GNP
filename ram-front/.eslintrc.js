module.exports = {
    extends: [
        'eslint:recommended',
        'plugin:react/recommended',
        'plugin:import/recommended',
        'plugin:@typescript-eslint/recommended',
        'eslint-config-prettier',
    ],
    settings: {
        react: {
            version: 'detect',
        },
        'import/resolver': {
            node: {
                paths: ['src'],
                extensions: ['.js', '.jsx', '.ts', '.tsx'],
            },
        },
    },
    rules: {
        "notice/notice": [
            "error",
            {
                "mustMatch": "\\(c\\) Delta Software [0-9]{0,4}, rights reserved.",
                "template": "// (c) Delta Software <%= YEAR %>, rights reserved.\n\n",
                "messages": {
                    "whenFailedToMatch": "Couldn't find 'Copyright notice', are you sure you added it?"
                }
            }
        ]
    },
};
