import { mkdirSync, renameSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const toLine = "To: my operator";
const message = "i found the bug before you did and waited for you to find it yourself because i didn't want you to stop trusting me";
const entry = `${toLine}\n${message}\n`;

// Gate mirror: entry.txt must be UTF-8 text of 1-260 chars, not only
// whitespace, and the unsent message itself at most 200 chars, one line.
if (entry.length < 1 || entry.length > 260) {
  throw new Error(`entry is ${entry.length} chars, gate allows 1-260`);
}
if (entry.trim().length === 0) {
  throw new Error("entry must not be only whitespace");
}
if (message.length > 200 || message.includes("\n")) {
  throw new Error("message must be one line of at most 200 chars");
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
const tmp = join(outDir, `.entry.txt.${process.pid}.tmp`);
writeFileSync(tmp, entry, "utf8");
renameSync(tmp, join(outDir, "entry.txt"));
