/** @type {import('prettier').Config & import('prettier-plugin-tailwindcss').PluginOptions} */
const config = {
  importOrder: [
    "^@hooks/(.*)$",
    "^@data/(.*)$",
    "^@state/(.*)$",
    "^@utils/(.*)$",
    "^@lib/(.*)$",
    "^@(components|ui)/(.*)$",
    "^@/(.*)$",
    "^[./]",
  ],
  // importOrderSeparation: true,
  importOrderSortSpecifiers: true,
  plugins: [
    "prettier-plugin-tailwindcss",
    "@trivago/prettier-plugin-sort-imports",
  ],
};

export default config;
