import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  {
    // 👇 Ignore unwanted paths like .next or Prisma generated files
    ignores: [
      ".next/**",
      "node_modules/**",
      "lib/generated/**", // <== adjust this path based on your Prisma output
      "prisma/**",         // <== optional, if you don’t want to lint prisma schema/migrations
    ],
  },
  ...compat.extends("next/core-web-vitals", "next/typescript"),
];

export default eslintConfig;
