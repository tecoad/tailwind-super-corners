import { readFileSync, writeFileSync } from "node:fs"

// Copy index.css with @plugin references updated from .ts → .js
const css = readFileSync("src/index.css", "utf-8")
const updated = css.replace(/@plugin "\.\/(\w+)\.ts"/g, '@plugin "./$1.js"')
writeFileSync("dist/index.css", updated)

console.log("CSS files copied to dist/")
