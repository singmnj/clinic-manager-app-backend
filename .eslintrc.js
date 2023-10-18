module.exports = {
	env: {
		node: true,
		browser: true,
		commonjs: true,
		es2021: true,
	},
	parserOptions: {
		ecmaVersion: "latest",
	},
	plugins: ["prettier"],
	extends: ["eslint:recommended", "prettier"],
	rules: {
		"prettier/prettier": [
			"error",
			{
				printWidth: 80,
				tabWidth: 2,
				singleQuote: false,
				trailingComma: "es5",
				bracketSpacing: true,
				semi: true,
				useTabs: true,
			},
		],
	},
};
