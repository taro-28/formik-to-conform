#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { convert } from "./index";

const TSX_JSX_REGEX = /\.(tsx|jsx)$/;

async function processFile(filePath: string): Promise<void> {
  try {
    // Only process .tsx and .jsx files
    if (!filePath.match(TSX_JSX_REGEX)) {
      return;
    }

    console.log(`Processing ${filePath}...`);
    const content = fs.readFileSync(filePath, "utf8");
    const transformed = await convert(content);

    fs.writeFileSync(filePath, transformed, "utf8");
    console.log(`✅ Successfully converted ${filePath}`);
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error);
  }
}

async function processDirectory(directoryPath: string): Promise<void> {
  try {
    const entries = fs.readdirSync(directoryPath, { withFileTypes: true });

    for (const entry of entries) {
      const entryPath = path.join(directoryPath, entry.name);

      if (entry.isDirectory()) {
        await processDirectory(entryPath);
      } else if (entry.isFile()) {
        await processFile(entryPath);
      }
    }
  } catch (error) {
    console.error(`Error processing directory ${directoryPath}:`, error);
  }
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.error("Please provide a directory path");
    process.exit(1);
  }

  const targetDir = args[0] as string;

  if (!fs.existsSync(targetDir)) {
    console.error(`Directory "${targetDir}" does not exist`);
    process.exit(1);
  }

  console.log(`Starting conversion in ${targetDir}`);
  await processDirectory(targetDir);
  console.log("Conversion complete!");
}

main().catch(console.error);
