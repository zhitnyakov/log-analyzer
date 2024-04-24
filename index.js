const fs = require('fs');
const readline = require('readline');
const nginxLogParser = require('nginx-log-parser');
const crypto = require('crypto');

async function processLineByLine() {
  const dir = '../backend/unpacked'
  // const dir = './aws-logs';
  files = fs.readdirSync(dir).filter(file => file.endsWith('.log'));

  let stats = {};
  try {
    const statsData = fs.readFileSync('./stats.json', 'utf8');
    stats = JSON.parse(statsData);
  } catch (error) {
    // console.error('Error reading or parsing stats.json:', error);
  }
  
  let processedFiles = 0;
  for (const file of files) {
    if (!fs.existsSync('./processed_files.txt')) {
      fs.writeFileSync('./processed_files.txt', '');
    }

    if (fs.readFileSync('./processed_files.txt', 'utf8').includes(file)) {
      processedFiles++;
      console.log(`Processed ${processedFiles} out of ${files.length} files`);
      continue;
    }

    const fileStream = fs.createReadStream(`${dir}/${file}`);
  
    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity
    });
  
    for await (const line of rl) {
      const parsedLine = line.split(' ');
      const params = { 
        method: parsedLine[12],
        url: parsedLine[13],
        status: parsedLine[8],
      };

      try {
        params.url = new URL(params.url).pathname;
      } catch (e) {
        // console.log(e);
      }
      const key = crypto.createHash('md5').update(`${params.url}-${params.status}-${params.method}`).digest('hex');
  
      if (stats[key]) {
        stats[key].count++;
      } else {
        stats[key] = {
          url: params.url,
          status: params.status,
          method: params.method,
          count: 1
        };
      }
      
    }

    processedFiles++;
    console.log(`Processed ${processedFiles} out of ${files.length} files`);
    
    fs.appendFileSync('./processed_files.txt', `${file}\n`);

    const result = Object.values(stats);
    // result.sort((a, b) => b.count - a.count);
    fs.writeFileSync('./stats.json', JSON.stringify(stats));
  }

  const result = Object.values(stats);
  result.sort((a, b) => b.count - a.count);
  fs.writeFileSync('./result.txt', result.map(item => `${item.status} - ${item.count} - ${item.method} - ${item.url}`).join('\n'));
}

processLineByLine();