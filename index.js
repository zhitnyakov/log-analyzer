const fs = require('fs');
const readline = require('readline');
const nginxLogParser = require('nginx-log-parser');
const crypto = require('crypto');

async function processLineByLine() {
  files = fs.readdirSync('../backend/unpacked/').filter(file => file.endsWith('.log'));
  const stats = {};
  
  let processedFiles = 0;
  for (const file of files) {
    const fileStream = fs.createReadStream(`../backend/unpacked/${file}`);
    // const logFormat = '$http_x_forwarded_for - $remote_user [$time_local] "$request" $status $body_bytes_sent "$http_referer" "$http_user_agent"';
    // const parseLine = nginxLogParser(logFormat);
  
    const rl = readline.createInterface({
      input: fileStream,
      crlfDelay: Infinity
    });
  
    // let lineCount = 0;
  
    for await (const line of rl) {
      // if (lineCount === 100) break;
  
      const parsedLine = line.split(' ');
      // console.log(parsedLine);
      
      console.log(parsedLine[13]);
      const params = { 
        method: parsedLine[12],
        url: new URL(parsedLine[13]).pathname,
        status: parsedLine[8],
      };
      // const url = new URL(params.url);
      // const path = url.pathname;
      // params.url = path;
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
      processedFiles++;
      console.log(`Processed ${processedFiles} out of ${files.length} files`);
    }
  }
  
  

  const result = Object.values(stats);
  result.sort((a, b) => b.count - a.count);
  fs.writeFileSync('/Users/deniszhitnyakov/Downloads/logs/result.txt', result.map(item => `${item.count} - ${item.method} - ${item.status} - ${item.url}`).join('\n'));
  // console.log(result);
}

processLineByLine();