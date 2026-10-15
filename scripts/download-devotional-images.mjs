import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");

const assets = [
  ["public/assets/hero/temple-pillar.jpg", "https://upload.wikimedia.org/wikipedia/commons/4/4e/Sculptures_at_the_Corridor_of_1000_pillars%2C_Madurai%2C_Tamil_Nadu%2C_India.jpg"],
  ["public/assets/deities/shiva-nataraja.jpg", "https://upload.wikimedia.org/wikipedia/commons/9/97/Shiva_as_the_Lord_of_Dance_Nataraja.jpg"],
  ["public/assets/deities/murugan.jpg", "https://upload.wikimedia.org/wikipedia/commons/8/8a/Palani_Murugan_Temple%2C_Tamil_Nadu.jpg"],
  ["public/assets/deities/ganesha.jpg", "https://upload.wikimedia.org/wikipedia/commons/5/57/Bronze_Ganesha_statue_from_Cambodia%2C_12th-13th_century%2C_National_Museum_of_Cambodia%2C_Phnom_Penh%2C_Cambodia.jpg"],
  ["public/assets/deities/vishnu.jpg", "https://upload.wikimedia.org/wikipedia/commons/1/1e/Vishnu%2C_11th_century%2C_Brooklyn_Museum.jpg"],
  ["public/assets/deities/krishna.jpg", "https://upload.wikimedia.org/wikipedia/commons/7/7a/Krishna_statue%2C_Belur%2C_India.jpg"],
  ["public/assets/deities/amman.jpg", "https://upload.wikimedia.org/wikipedia/commons/3/3a/Meenakshi_Amman_Temple%2C_Madurai%2C_Tamil_Nadu%2C_India.jpg"],
  ["public/assets/deities/durga.jpg", "https://upload.wikimedia.org/wikipedia/commons/6/6d/Durga_Mahishasuramardini.JPG"],
  ["public/assets/deities/lakshmi.jpg", "https://upload.wikimedia.org/wikipedia/commons/9/9a/Lakshmi_statue%2C_Belur%2C_India.jpg"],
  ["public/assets/deities/saraswati.jpg", "https://upload.wikimedia.org/wikipedia/commons/4/4c/Saraswati_statue%2C_Belur%2C_India.jpg"],
  ["public/assets/deities/rama.jpg", "https://upload.wikimedia.org/wikipedia/commons/8/8d/Rama_statue%2C_Belur%2C_India.jpg"],
  ["public/assets/deities/hanuman.jpg", "https://upload.wikimedia.org/wikipedia/commons/2/2a/Hanuman_statue%2C_Hampi%2C_India.jpg"],
  ["public/assets/deities/ayyappan.jpg", "https://upload.wikimedia.org/wikipedia/commons/f/f4/Sabarimala_Ayyappan_Temple.jpg"],
  ["public/assets/temples/gopuram-madurai.jpg", "https://upload.wikimedia.org/wikipedia/commons/1/1e/Meenakshi_Temple_Gopurams.jpg"],
  ["public/assets/temples/brihadisvara.jpg", "https://upload.wikimedia.org/wikipedia/commons/a/a7/Brihadisvara_Temple%2C_Thanjavur%2C_Tamil_Nadu%2C_India.jpg"],
  ["public/assets/temples/yali-pillar.jpg", "https://upload.wikimedia.org/wikipedia/commons/9/9c/Yali_pillars%2C_Srirangam_temple%2C_Tiruchirappalli%2C_Tamil_Nadu%2C_India.jpg"],
  ["public/assets/temples/corridor-pillars.jpg", "https://upload.wikimedia.org/wikipedia/commons/4/4e/Sculptures_at_the_Corridor_of_1000_pillars%2C_Madurai%2C_Tamil_Nadu%2C_India.jpg"],
  ["public/assets/sculptures/bronze-nataraja.jpg", "https://upload.wikimedia.org/wikipedia/commons/c/c8/Nataraja%2C_Chola_period%2C_12th_century%2C_Bronze%2C_National_Museum%2C_New_Delhi.jpg"],
  ["public/assets/sculptures/stone-carving.jpg", "https://upload.wikimedia.org/wikipedia/commons/d/d4/Sculptures_in_a_Hindu_temple%2C_India.jpg"],
];

async function download(relativePath, url) {
  const dest = path.join(root, relativePath);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  const res = await fetch(url, {
    headers: { "User-Agent": "FramesOfDivine/1.0 (educational; asset download)" },
  });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  const buf = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(dest, buf);
  console.log(`OK ${relativePath} (${buf.length} bytes)`);
}

const failed = [];
for (const [rel, url] of assets) {
  try {
    await download(rel, url);
  } catch (e) {
    console.error(`FAIL ${rel}:`, e.message);
    failed.push({ rel, url, error: e.message });
  }
}

if (failed.length) {
  console.error("\nFailed downloads:", failed.length);
  process.exit(1);
}
