import { readFileSync, writeFileSync } from "fs";
import { execSync } from "child_process";

const dir = "assets/fonts";
let css = readFileSync(`${dir}/_google.css`, "utf8");
const urls = [...new Set(css.match(/https:\/\/[^)]*\.woff2/g))];
console.log("unique woff2:", urls.length);

const map = new Map();
let i = 0;
for (const u of urls) {
  const base = u.split("/").pop();
  map.set(u, base);
  i++;
}

// download in parallel batches via curl
const batch = 12;
for (let b = 0; b < urls.length; b += batch) {
  const slice = urls.slice(b, b + batch);
  const cmd = slice.map((u) => `curl -s -o "${dir}/${map.get(u)}" "${u}"`).join(" & ") + " & wait";
  execSync(cmd, { shell: "/bin/bash" });
  console.log("downloaded", Math.min(b + batch, urls.length), "/", urls.length);
}

// rewrite URLs to local (relative to fonts.css which lives in assets/fonts/)
for (const [u, base] of map) css = css.split(u).join(base);
writeFileSync(`${dir}/fonts.css`, css);
console.log("wrote fonts.css");
