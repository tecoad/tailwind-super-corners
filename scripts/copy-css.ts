import { cpSync, readFileSync, writeFileSync } from "node:fs"

// Copy out.css as-is
cpSync("src/out.css", "dist/out.css")

// Copy index.css with @plugin references updated from .ts → .js
const css = readFileSync("src/index.css", "utf-8")
const updated = css.replace(/@plugin "\.\/(\w+)\.ts"/g, '@plugin "./$1.js"')
writeFileSync("dist/index.css", updated)

console.log("CSS files copied to dist/")
