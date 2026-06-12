// One-off: render public/icon.svg into the PNG sizes a PWA needs.
// Run with: node scripts/gen-icons.mjs   (requires devDependency `sharp`)
import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const svg = join(root, "public", "icon.svg");
const outDir = join(root, "public", "icons");

const targets = [
  { size: 192, name: "icon-192.png" },
  { size: 512, name: "icon-512.png" },
  { size: 180, name: "apple-touch-icon.png" }, // iOS/iPadOS home screen
  { size: 32, name: "favicon-32.png" },
];

await mkdir(outDir, { recursive: true });
for (const t of targets) {
  await sharp(svg).resize(t.size, t.size).png().toFile(join(outDir, t.name));
  console.log(`✓ ${t.name} (${t.size}px)`);
}

// Maskable icon: same art on a padded safe area (10% padding) for Android.
await sharp(svg)
  .resize(410, 410)
  .extend({ top: 51, bottom: 51, left: 51, right: 51, background: "#4338ca" })
  .png()
  .toFile(join(outDir, "icon-maskable-512.png"));
console.log("✓ icon-maskable-512.png");
