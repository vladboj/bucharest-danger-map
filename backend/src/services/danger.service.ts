import fs from "fs/promises";
import path from "path";
import { DangerInfo } from "@shared/types";

type DangerBucket = {
  label: string;
  max: number; // upper bound in [0..1]
  color: string;
};

type DangerMeta = {
  version: number;
  width: number;
  height: number;
  dtype: "uint8";
  nodata: number;
  affine: { a: number; b: number; c: number; d: number; e: number; f: number };
  crs: string;
  origin: "top-left";
  yAxis: "down";
  scale: { type: "linear"; min: number; max: number };
  buckets: DangerBucket[];
  source: string;
};

const JSON_PATH = path.join(__dirname, "../data/danger.v1.json");
const BIN_PATH = path.join(__dirname, "../data/danger.v1.bin");

const NO_DATA: DangerInfo = { label: "No data", color: "#9ca3af" };

// Cached data
let metaPromise: Promise<DangerMeta> | null = null;
let rasterPromise: Promise<Uint8Array> | null = null;

async function loadMeta(): Promise<DangerMeta> {
  if (!metaPromise) {
    metaPromise = fs.readFile(JSON_PATH, "utf8").then((text) => {
      return JSON.parse(text) as DangerMeta;
    });
  }
  return metaPromise;
}

async function loadRaster(expectedSize: number): Promise<Uint8Array> {
  if (!rasterPromise) {
    rasterPromise = fs.readFile(BIN_PATH).then((buf) => {
      const arr = new Uint8Array(buf.buffer, buf.byteOffset, buf.byteLength);
      if (expectedSize && arr.length !== expectedSize) {
        console.warn(
          `Warning: raster size ${arr.length} != expected ${expectedSize}`
        );
      }
      return arr;
    });
  }
  return rasterPromise;
}

function latLonToPixel(
  lat: number,
  lon: number,
  A: DangerMeta["affine"]
): { x: number; y: number } {
  const x = A.a * lon + A.b * lat + A.c;
  const y = A.d * lon + A.e * lat + A.f;
  return { x: Math.round(x), y: Math.round(y) };
}

function clamp(v: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, v));
}

function pickBucket(norm: number, buckets: DangerBucket[]): DangerBucket {
  for (const b of buckets) {
    if (norm <= b.max) return b;
  }
  return buckets[buckets.length - 1];
}

export async function getDangerLevel(
  lat: number,
  lon: number
): Promise<DangerInfo> {
  try {
    const meta = await loadMeta();
    const raster = await loadRaster(meta.width * meta.height);

    const { x, y } = latLonToPixel(lat, lon, meta.affine);

    if (x < 0 || y < 0 || x >= meta.width || y >= meta.height) {
      return NO_DATA;
    }

    const idx = y * meta.width + x;
    const value = raster[idx];

    if (value === meta.nodata) {
      return NO_DATA;
    }

    const { min, max } = meta.scale;
    const norm = clamp((value - min) / (max - min), 0, 1);

    const bucket = pickBucket(norm, meta.buckets);
    return { label: bucket.label, color: bucket.color };
  } catch (err) {
    console.error(err);
    return NO_DATA;
  }
}
