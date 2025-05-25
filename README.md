# Norge-Data 🇳🇴

A comprehensive Node.js package providing access to Norwegian geographic data, including counties (fylker) and municipalities (kommuner).

## Description

Norge-Data gives you easy access to structured data about all Norwegian counties and municipalities as of 2025. The package includes detailed information such as population, area, administrative centers, and official websites, all accessible through a simple, intuitive API.

## Features

- Complete dataset of all Norwegian counties (fylker) and municipalities (kommuner)
- Simple, intuitive API for searching and filtering data
- TypeScript-style JSDoc annotations for better IDE support
- ES Module and CommonJS support
- Zero dependencies
- Thoroughly documented API

## Installation

### Using npm

```bash
npm install norge-data
```

### Direct from GitHub

```bash
npm install github:aprestmo/norge-data
```

## Usage

### ES Modules (Recommended)

```javascript
// Import specific functions
import { getFylkeByName, getKommuneById, searchKommunerByName } from 'norge-data';

// Get Oslo county
const oslo = getFylkeByName('Oslo');
console.log(oslo);
// { f_id: '03', f_name: 'Oslo', f_url: 'www.oslo.kommune.no' }

// Get Bergen municipality by ID
const bergen = getKommuneById('4601');
console.log(bergen.k_name); // 'Bergen'
console.log(bergen.k_population); // 291940

// Search municipalities containing "dal"
const dalKommuner = searchKommunerByName('dal');
console.log(dalKommuner.map(k => k.k_name)); 
// ['Suldal', 'Rendalen', 'Årdal', 'Luster', 'Aurland', 'Lærdal', ...]
```

### CommonJS (Legacy)

```javascript
// For CommonJS environments, use dynamic import
async function example() {
  const norgeData = await import('norge-data');
  
  const fylker = norgeData.getAllFylker();
  console.log(`Norway has ${fylker.length} counties`);
  
  const bigKommuner = norgeData.getKommunerByPopulation(50000, Infinity);
  console.log(`Norway has ${bigKommuner.length} municipalities with more than 50,000 inhabitants`);
}
```

### Using Default Export

```javascript
import norgeData from 'norge-data';

// Access raw data
console.log(`Total number of counties: ${norgeData.fylker.length}`);
console.log(`Total number of municipalities: ${norgeData.kommuner.length}`);

// Use utility functions
const smallKommuner = norgeData.getKommunerByPopulation(0, 1000);
console.log(`Municipalities with less than 1000 people: ${smallKommuner.length}`);
```

## API Documentation

### Raw Data

- `fylker` - Array of all Norwegian counties
- `kommuner` - Array of all Norwegian municipalities

### Utility Functions

#### County (Fylke) Functions

- `getAllFylker()` - Returns all counties
- `getFylkeById(id)` - Finds a county by its ID
- `getFylkeByName(name)` - Finds a county by its exact name
- `searchFylkerByName(nameFragment)` - Searches counties by partial name match

#### Municipality (Kommune) Functions

- `getAllKommuner()` - Returns all municipalities
- `getKommuneById(id)` - Finds a municipality by its ID
- `getKommuneByName(name)` - Finds a municipality by its exact name (either Norwegian or standard name)
- `getKommunerByLanguage(language)` - Filters municipalities by language form (Bokmål, Nynorsk, or Nøytral)
- `getKommunerInFylke(fylkeId)` - Gets all municipalities in a specific county
- `getKommunerByPopulation(min, max)` - Finds municipalities within a population range
- `getKommunerByArea(min, max)` - Finds municipalities within an area range (in square kilometers)
- `searchKommunerByName(nameFragment)` - Searches municipalities by partial name match

## Data Structure

### Fylke (County) Object Structure

```typescript
interface Fylke {
  f_id: string;      // County ID (e.g., "03")
  f_name: string;    // County name (e.g., "Oslo")
  f_url: string;     // County website (e.g., "www.oslo.kommune.no")
}
```

### Kommune (Municipality) Object Structure

```typescript
interface Kommune {
  k_id: string;         // Municipality ID (e.g., "0301")
  k_name: string;       // Municipality name (e.g., "Oslo")
  k_name_no: string;    // Norwegian name if different
  k_adm_center: string; // Administrative center (e.g., "Oslo")
  k_population: number; // Population count
  k_area: number;       // Area in square kilometers
  k_language: string;   // Official language form ("Bokmål", "Nynorsk", or "Nøytral")
  k_url: string;        // Municipality website
}
```

## License

MIT

## Contributing

Contributions, issues, and feature requests are welcome. Feel free to check the [issues page](https://github.com/aprestmo/norge-data/issues) if you want to contribute.
