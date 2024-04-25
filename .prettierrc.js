/** @type {import("prettier").Config} */
const config = {
  singleQuote: true,
  semi: false,
  tabWidth: 2,
  trailingComma: 'none',
  plugins: ['prettier-plugin-organize-imports'],
  removeUnused: true
}

export default config
