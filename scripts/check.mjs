import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { gzipSync } from "node:zlib";

const root = new URL("../", import.meta.url);
const html = readFileSync(new URL("index.html", root), "utf8");
const readme = readFileSync(new URL("README.md", root), "utf8");
const payload = readFileSync(new URL("payload.bin", root));
const compressed = gzipSync(payload, { level: 9 });
const compressionRatio = compressed.length / payload.length;
const publicText = `${html}\n${readme}`;
const reversedBrand = new RegExp(["gaff", "giff"].join(""), "i");
const nonBrandStyle = new RegExp(
  [
    ["Giff", "gaff"].join(""),
    ["Giff", "Gaff"].join(""),
    ["Gaff", "Giff"].join(""),
  ].join("|"),
);

assert.equal(payload.length, 120 * 1024, "payload.bin must be exactly 120 KiB");
assert.ok(
  compressionRatio > 0.99,
  `payload compresses too well (${compressionRatio.toFixed(4)}); network transfer may be smaller than expected`,
);
assert.match(html, /new URL\("\.\/payload\.bin"/, "page must request the local payload");
assert.match(html, /cache: "no-store"/, "page must bypass the browser HTTP cache");
assert.doesNotMatch(html, /保号成功/, "page must not claim carrier-side success");
assert.match(html, /aria-live="polite"/, "status updates must be announced accessibly");
assert.match(html, /addCalendarMonthsClamped/, "reminder range must clamp calendar month dates");
assert.match(html, /6 个月届满前/, "page must show a five-to-six-month reminder range");
assert.match(html, /关闭其他 App 的移动数据权限/, "page must warn about other apps using data");
assert.doesNotMatch(publicText, reversedBrand, "public text must not reverse the brand spelling");
assert.doesNotMatch(publicText, nonBrandStyle, "public text must use the giffgaff brand style");

console.log(
  `Checks passed: ${payload.length} bytes, gzip ratio ${compressionRatio.toFixed(4)}`,
);
