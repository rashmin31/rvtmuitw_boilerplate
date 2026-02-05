import { execSync } from "node:child_process";
import fs from "node:fs";

const diffBase = process.env.COVERAGE_BASE ?? "origin/main";
let diffOutput = "";
try {
  diffOutput = execSync(`git diff --name-only ${diffBase}`, { encoding: "utf8" });
} catch {
  diffOutput = execSync("git diff --name-only", { encoding: "utf8" });
}

const changedFiles = diffOutput
  .split("\n")
  .map((file) => file.trim())
  .filter(
    (file) =>
      (file.endsWith(".ts") || file.endsWith(".tsx")) &&
      !file.endsWith("index.ts") &&
      !file.includes(".test.") &&
      !file.includes(".spec.")
  );

if (changedFiles.length === 0) {
  console.log("No changed TS/TSX files requiring coverage gate.");
  process.exit(0);
}

const summaryPath = "coverage/coverage-summary.json";
if (!fs.existsSync(summaryPath)) {
  console.error("Missing coverage summary. Run npm run coverage first.");
  process.exit(1);
}

const summary = JSON.parse(fs.readFileSync(summaryPath, "utf8"));
const failed = [];

for (const file of changedFiles) {
  const entry = summary[file];
  if (!entry) {
    failed.push({ file, pct: 0 });
    continue;
  }
  const pct = entry.statements.pct;
  if (pct < 80) {
    failed.push({ file, pct });
  }
}

if (failed.length > 0) {
  console.error("Changed files below 80% statement coverage:");
  for (const item of failed) {
    console.error(`- ${item.file}: ${item.pct}%`);
  }
  process.exit(1);
}

console.log("Changed files coverage gate passed.");
