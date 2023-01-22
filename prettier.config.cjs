/** @type {import("prettier").Config} */
module.exports = {
	plugins: [require.resolve("prettier-plugin-tailwindcss")],
	useTabs: true,
	tabWidth: 4,
	semi: true,
	singleQuote: false,
	trailingComma: "all",
	printWidth: 120,
	arrowParens: "avoid",
};
