import { createHash } from "node:crypto";
import { writeFileSync } from "node:fs";

const payloadSize = 120 * 1024;
const payload = Buffer.allocUnsafe(payloadSize);
const seed = Buffer.from("giffgaff-keeper-payload-v1", "utf8");

let offset = 0;
let counter = 0;

while (offset < payload.length) {
  const counterBytes = Buffer.allocUnsafe(4);
  counterBytes.writeUInt32BE(counter);
  const block = createHash("sha256").update(seed).update(counterBytes).digest();
  const bytesToCopy = Math.min(block.length, payload.length - offset);
  block.copy(payload, offset, 0, bytesToCopy);
  offset += bytesToCopy;
  counter += 1;
}

writeFileSync(new URL("../payload.bin", import.meta.url), payload);
console.log(`Generated payload.bin (${payload.length} bytes)`);
