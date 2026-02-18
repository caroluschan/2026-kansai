#!/usr/bin/env node
/**
 * Fetch images from Wikimedia Commons for all locations in the dataset.
 * Uses the Wikimedia Commons API (no API key needed).
 *
 * Usage: node scripts/fetch-images.mjs
 *
 * Strategy:
 * 1. For each location, try multiple search queries (name + region, Japanese name, etc.)
 * 2. Use the Wikimedia Commons search API to find images
 * 3. Get direct image URLs with thumbnail support
 * 4. Write updated JSON back to the dataset file
 */

import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_PATH = resolve(__dirname, '../resource/kansai_trip_dataset_2026-11_KIX.json');

const CATEGORIES = ['restaurants', 'theme_parks', 'zoos', 'malls', 'cafes', 'tourist_spots'];
const COMMONS_API = 'https://commons.wikimedia.org/w/api.php';
const MAX_IMAGES = 3;
const DELAY_MS = 200; // Be respectful to Wikimedia

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

/**
 * Extract clean search terms from a location name.
 * E.g. "Ide Shoten (井出商店)" -> ["Ide Shoten", "井出商店"]
 */
function extractSearchTerms(name, region) {
  const terms = [];

  // Extract Japanese text in parentheses
  const japMatch = name.match(/[（(]([^)）]+)[)）]/);
  const japName = japMatch ? japMatch[1] : null;

  // Clean English name (remove parenthetical, extra descriptions)
  let engName = name.replace(/\s*[（(][^)）]*[)）]\s*/g, '').trim();
  // Remove trailing qualifiers like "(choose by same-day mood)"
  engName = engName.replace(/\s*\(.*\)\s*$/, '').trim();

  // Primary: English name + region
  if (engName) {
    terms.push(`${engName} ${region}`);
    terms.push(engName);
  }

  // Secondary: Japanese name + region
  if (japName) {
    terms.push(`${japName} ${region}`);
    terms.push(japName);
  }

  // Tertiary: just region name for generic entries
  return terms;
}

/**
 * Search Wikimedia Commons for images matching a query.
 * Returns array of { url, thumbUrl } objects.
 */
async function searchCommonsImages(query, limit = MAX_IMAGES) {
  const params = new URLSearchParams({
    action: 'query',
    format: 'json',
    generator: 'search',
    gsrsearch: `${query}`,
    gsrnamespace: '6', // File namespace
    gsrlimit: String(Math.min(limit * 2, 20)), // fetch extra to filter
    prop: 'imageinfo',
    iiprop: 'url|mime|size',
    iiurlwidth: '800', // thumbnail width
    origin: '*',
  });

  const url = `${COMMONS_API}?${params}`;

  try {
    const resp = await fetch(url, {
      headers: {
        'User-Agent': 'KansaiTouristGuide/1.0 (https://github.com/kansai-guide; tourist-guide@example.com)',
      },
    });

    if (!resp.ok) {
      console.warn(`  HTTP ${resp.status} for query: ${query}`);
      return [];
    }

    const data = await resp.json();
    const pages = data.query?.pages;
    if (!pages) return [];

    const results = [];
    for (const page of Object.values(pages)) {
      const info = page.imageinfo?.[0];
      if (!info) continue;
      // Only include actual images (not SVG, PDF, etc.)
      if (!info.mime?.startsWith('image/') || info.mime === 'image/svg+xml') continue;
      // Skip tiny images
      if (info.width < 200 || info.height < 150) continue;

      results.push({
        url: info.url,
        thumbUrl: info.thumburl || info.url,
        width: info.width,
        height: info.height,
      });
    }

    // Sort by size (prefer larger, more likely high-quality images)
    results.sort((a, b) => (b.width * b.height) - (a.width * a.height));

    return results.slice(0, limit);
  } catch (err) {
    console.warn(`  Error searching for "${query}":`, err.message);
    return [];
  }
}

/**
 * Try geo-based search on Wikimedia Commons using coordinates.
 */
async function searchByGeo(lat, lng, limit = MAX_IMAGES) {
  if (lat === null || lng === null) return [];

  const params = new URLSearchParams({
    action: 'query',
    format: 'json',
    generator: 'geosearch',
    ggscoord: `${lat}|${lng}`,
    ggsradius: '500', // 500m radius
    ggslimit: '10',
    ggsnamespace: '6', // File namespace
    prop: 'imageinfo',
    iiprop: 'url|mime|size',
    iiurlwidth: '800',
    origin: '*',
  });

  const url = `${COMMONS_API}?${params}`;

  try {
    const resp = await fetch(url, {
      headers: {
        'User-Agent': 'KansaiTouristGuide/1.0 (https://github.com/kansai-guide; tourist-guide@example.com)',
      },
    });

    if (!resp.ok) return [];

    const data = await resp.json();
    const pages = data.query?.pages;
    if (!pages) return [];

    const results = [];
    for (const page of Object.values(pages)) {
      const info = page.imageinfo?.[0];
      if (!info) continue;
      if (!info.mime?.startsWith('image/') || info.mime === 'image/svg+xml') continue;
      if (info.width < 200 || info.height < 150) continue;

      results.push({
        url: info.url,
        thumbUrl: info.thumburl || info.url,
        width: info.width,
        height: info.height,
      });
    }

    results.sort((a, b) => (b.width * b.height) - (a.width * a.height));
    return results.slice(0, limit);
  } catch {
    return [];
  }
}

async function fetchImagesForLocation(loc, region) {
  const searchTerms = extractSearchTerms(loc.name, region);
  let allResults = [];

  // Try text search with each query term
  for (const term of searchTerms) {
    if (allResults.length >= MAX_IMAGES) break;
    const results = await searchCommonsImages(term, MAX_IMAGES - allResults.length);
    // Deduplicate by URL
    for (const r of results) {
      if (!allResults.find(e => e.url === r.url)) {
        allResults.push(r);
      }
    }
    await sleep(DELAY_MS);
  }

  // If still not enough, try geo search
  if (allResults.length < MAX_IMAGES && loc.lat !== null && loc.lng !== null) {
    const geoResults = await searchByGeo(loc.lat, loc.lng, MAX_IMAGES - allResults.length);
    for (const r of geoResults) {
      if (!allResults.find(e => e.url === r.url)) {
        allResults.push(r);
      }
    }
    await sleep(DELAY_MS);
  }

  return allResults.slice(0, MAX_IMAGES).map(r => r.thumbUrl);
}

async function main() {
  console.log('Reading dataset...');
  const dataset = JSON.parse(readFileSync(DATA_PATH, 'utf8'));

  let totalProcessed = 0;
  let totalWithImages = 0;
  let totalImages = 0;

  for (const regionData of dataset.regions) {
    const region = regionData.region;
    console.log(`\n=== ${region} ===`);

    for (const category of CATEGORIES) {
      const locations = regionData[category] || [];
      for (const loc of locations) {
        totalProcessed++;
        process.stdout.write(`  [${totalProcessed}/160] ${loc.name.substring(0, 50).padEnd(50)} `);

        // Skip if already has images
        if (loc.images && loc.images.length > 0) {
          console.log(`✓ (already has ${loc.images.length} images)`);
          totalWithImages++;
          totalImages += loc.images.length;
          continue;
        }

        const images = await fetchImagesForLocation(loc, region);
        loc.images = images;

        if (images.length > 0) {
          totalWithImages++;
          totalImages += images.length;
          console.log(`✓ ${images.length} images`);
        } else {
          console.log(`✗ no images found`);
        }
      }
    }
  }

  console.log(`\n=== Summary ===`);
  console.log(`Processed: ${totalProcessed}`);
  console.log(`With images: ${totalWithImages} (${((totalWithImages / totalProcessed) * 100).toFixed(1)}%)`);
  console.log(`Total images: ${totalImages}`);

  console.log('\nWriting updated dataset...');
  writeFileSync(DATA_PATH, JSON.stringify(dataset, null, 2) + '\n', 'utf8');
  console.log('Done!');
}

main().catch(console.error);
