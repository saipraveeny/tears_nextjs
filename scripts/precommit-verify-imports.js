const { readFileSync } = require("fs");
const { resolve } = require("path");

const root = process.cwd();
const glob = require("glob");

const patterns = ["**/*.{js,jsx,ts,tsx}"];
const banned = [
  "@/public/",
  "@/assets/",
  "from '/assets",
  'from "/assets',
  "from '@/public",
  'from "@/public',
];

let errors = [];

patterns.forEach((pattern) => {
  glob
    .sync(pattern, {
      cwd: root,
      ignore: ["**/node_modules/**", "**/.next/**", "**/scripts/**"],
    })
    .forEach((file) => {
      const content = readFileSync(resolve(root, file), "utf8");

      if (/@\/public\//.test(content) || /@\/assets\//.test(content)) {
        errors.push(
          `${file}: uses @/public or @/assets imports. Use /<asset> path or next/image public prefix.`,
        );
      }
      if (
        /from\s+"\/assets/.test(content) ||
        /from\s+'\/assets/.test(content)
      ) {
        errors.push(
          `${file}: direct '/assets/...' import from source; your public assets should run from /assets path in JSX src, or use next/image.`,
        );
      }
    });
});

if (errors.length > 0) {
  console.error("Pre-commit import safety check failed:");
  errors.forEach((e) => console.error("  -", e));
  process.exit(1);
}

console.log("Pre-commit import safety check passed.");
