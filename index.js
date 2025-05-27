/**
 * Norge Data - Norwegian geographic data package
 * 
 * This module provides access to data about Norwegian counties (fylker) and 
 * municipalities (kommuner) along with utility functions for searching and filtering.
 * 
 * @module norge-data
 */

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Get the directory path for the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Import the JSON data from the data directory
const fylkerData = JSON.parse(
  readFileSync(join(__dirname, 'data', 'fylker-2025.json'), 'utf-8')
);
const kommunerData = JSON.parse(
  readFileSync(join(__dirname, 'data', 'kommuner-2025.json'), 'utf-8')
);

/**
 * @typedef {Object} Fylke
 * @property {string} f_id - The county ID
 * @property {string} f_name - The county name
 * @property {string} f_url - The county website URL
 */

/**
 * @typedef {Object} Kommune
 * @property {string} k_id - The municipality ID
 * @property {string} k_name - The municipality name
 * @property {string} k_name_no - The Norwegian name for the municipality
 * @property {string} k_adm_center - The administrative center
 * @property {number} k_population - The population count
 * @property {number} k_area - The area in square kilometers
 * @property {string} k_language - The official language form (Bokmål, Nynorsk, or Nøytral)
 * @property {string} k_url - The municipality website URL
 */

/**
 * Get all counties (fylker)
 * @returns {Fylke[]} An array of all counties
 */
export function getAllFylker() {
  return [...fylkerData];
}

/**
 * Get all municipalities (kommuner)
 * @returns {Kommune[]} An array of all municipalities
 */
export function getAllKommuner() {
  return [...kommunerData];
}

/**
 * Get a specific county by ID
 * @param {string} id - The county ID
 * @returns {Fylke|undefined} The county object or undefined if not found
 */
export function getFylkeById(id) {
  return fylkerData.find(fylke => fylke.f_id === id);
}

/**
 * Get a specific county by name
 * @param {string} name - The county name
 * @returns {Fylke|undefined} The county object or undefined if not found
 */
export function getFylkeByName(name) {
  return fylkerData.find(fylke => 
    fylke.f_name.toLowerCase() === name.toLowerCase()
  );
}

/**
 * Get a specific municipality by ID
 * @param {string} id - The municipality ID
 * @returns {Kommune|undefined} The municipality object or undefined if not found
 */
export function getKommuneById(id) {
  return kommunerData.find(kommune => kommune.k_id === id);
}

/**
 * Get a specific municipality by name
 * @param {string} name - The municipality name
 * @returns {Kommune|undefined} The municipality object or undefined if not found
 */
export function getKommuneByName(name) {
  return kommunerData.find(kommune => 
    kommune.k_name.toLowerCase() === name.toLowerCase() ||
    kommune.k_name_no.toLowerCase() === name.toLowerCase()
  );
}

/**
 * Get a municipality by its short ID (1-4 digits)
 * @param {(string|number)} shortId - The municipality ID, can be 1-4 digits
 * @returns {Kommune|undefined} The municipality object or undefined if not found
 */
export function getKommuneByShortId(shortId) {
  // Convert input to string and remove any leading zeros
  const searchId = String(shortId).replace(/^0+/, '');
  
  // First try exact match with padding
  const paddedId = searchId.padStart(4, '0');
  const exactMatch = kommunerData.find(kommune => kommune.k_id === paddedId);
  if (exactMatch) return exactMatch;

  // If no exact match, look for kommune where ID without leading zeros matches
  const noZerosMatch = kommunerData.find(kommune => {
    const kommuneIdWithoutLeadingZeros = kommune.k_id.replace(/^0+/, '');
    return kommuneIdWithoutLeadingZeros === searchId;
  });
  if (noZerosMatch) return noZerosMatch;

  // If still no match, check if searchId is a subsequence of any kommune ID
  return kommunerData.find(kommune => {
    const kommuneId = kommune.k_id;
    let searchIndex = 0;
    let kommuneIndex = 0;

    // Check if searchId digits appear in order in kommuneId
    while (searchIndex < searchId.length && kommuneIndex < kommuneId.length) {
      if (searchId[searchIndex] === kommuneId[kommuneIndex]) {
        searchIndex++;
      }
      kommuneIndex++;
    }

    // Return true if we found all digits in sequence
    return searchIndex === searchId.length;
  });
}

/**
 * Filter municipalities by language form
 * @param {string} language - The language form (Bokmål, Nynorsk, or Nøytral)
 * @returns {Kommune[]} An array of municipalities with the specified language form
 */
export function getKommunerByLanguage(language) {
  return kommunerData.filter(kommune => 
    kommune.k_language.toLowerCase() === language.toLowerCase()
  );
}

/**
 * Get municipalities for a specific county by county ID
 * @param {string} fylkeId - The county ID
 * @returns {Kommune[]} An array of municipalities in the specified county
 */
export function getKommunerInFylke(fylkeId) {
  // Municipality IDs start with the county ID
  return kommunerData.filter(kommune => 
    kommune.k_id.startsWith(fylkeId)
  );
}

/**
 * Find municipalities by population range
 * @param {number} min - Minimum population
 * @param {number} max - Maximum population
 * @returns {Kommune[]} An array of municipalities within the specified population range
 */
export function getKommunerByPopulation(min, max) {
  return kommunerData.filter(kommune => 
    kommune.k_population >= min && kommune.k_population <= max
  );
}

/**
 * Find municipalities by area range (in square kilometers)
 * @param {number} min - Minimum area
 * @param {number} max - Maximum area
 * @returns {Kommune[]} An array of municipalities within the specified area range
 */
export function getKommunerByArea(min, max) {
  return kommunerData.filter(kommune => 
    kommune.k_area >= min && kommune.k_area <= max
  );
}

/**
 * Search municipalities by partial name match
 * @param {string} nameFragment - Part of a municipality name
 * @returns {Kommune[]} An array of municipalities with matching name fragments
 */
export function searchKommunerByName(nameFragment) {
  const searchTerm = nameFragment.toLowerCase();
  return kommunerData.filter(kommune => 
    kommune.k_name.toLowerCase().includes(searchTerm) ||
    kommune.k_name_no.toLowerCase().includes(searchTerm)
  );
}

/**
 * Search counties by partial name match
 * @param {string} nameFragment - Part of a county name
 * @returns {Fylke[]} An array of counties with matching name fragments
 */
export function searchFylkerByName(nameFragment) {
  const searchTerm = nameFragment.toLowerCase();
  return fylkerData.filter(fylke => 
    fylke.f_name.toLowerCase().includes(searchTerm)
  );
}

// Export the raw data as well
export const fylker = fylkerData;
export const kommuner = kommunerData;

// Default export for easier imports
export default {
  fylker: fylkerData,
  kommuner: kommunerData,
  getAllFylker,
  getAllKommuner,
  getFylkeById,
  getFylkeByName,
  getKommuneById,
  getKommuneByName,
  getKommunerByLanguage,
  getKommunerInFylke,
  getKommunerByPopulation,
  getKommunerByArea,
  searchKommunerByName,
  searchFylkerByName,
  getKommuneByShortId
};

