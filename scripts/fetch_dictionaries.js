import https from 'https';
import fs from 'fs';
import path from 'path';

const fetchUrl = (url) => {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode !== 200) {
        reject(new Error(`Failed to fetch ${url}, status: ${res.statusCode}`));
        return;
      }
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });
};

async function main() {
  console.log('Fetching open source dictionary word lists...');
  const urls = [
    // Standard ENABLE1 dictionary (Open source English word list)
    'https://raw.githubusercontent.com/dolph/dictionary/master/enable1.txt',
    // Wordle official list
    'https://raw.githubusercontent.com/tabatkins/wordle-list/main/words',
    // UNIX words dictionary
    'https://raw.githubusercontent.com/dwyl/english-words/master/words_alpha.txt'
  ];

  const allWords4 = new Set();
  const allWords5 = new Set();
  const allWords6 = new Set();

  for (const url of urls) {
    try {
      console.log(`Fetching from ${url}...`);
      const text = await fetchUrl(url);
      const lines = text.split(/\r?\n/);
      for (let raw of lines) {
        const word = raw.trim().toUpperCase();
        if (/^[A-Z]+$/.test(word)) {
          if (word.length === 4) allWords4.add(word);
          else if (word.length === 5) allWords5.add(word);
          else if (word.length === 6) allWords6.add(word);
        }
      }
    } catch (err) {
      console.error(`Error fetching ${url}:`, err.message);
    }
  }

  console.log(`Extracted 4-letter words: ${allWords4.size}`);
  console.log(`Extracted 5-letter words: ${allWords5.size}`);
  console.log(`Extracted 6-letter words: ${allWords6.size}`);

  const arr4 = Array.from(allWords4).sort();
  const arr5 = Array.from(allWords5).sort();
  const arr6 = Array.from(allWords6).sort();

  // Save parsed dictionary JSON for high-performance loading
  const dictPath = path.join(process.cwd(), 'src', 'utils', 'dictionaryData.json');
  fs.writeFileSync(dictPath, JSON.stringify({
    4: arr4,
    5: arr5,
    6: arr6
  }));

  console.log(`Successfully wrote full dictionary dataset to ${dictPath}`);
}

main();
