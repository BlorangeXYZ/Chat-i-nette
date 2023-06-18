import { join, dirname } from 'path';
import fs from 'fs-extra';

let slackData;

const slackJsonDir = join('pre-slack', 'slack_data.json');
// Read the slack.json file and parse its contents
const jsonData = fs.readFileSync(slackJsonDir, 'utf8');
slackData = JSON.parse(jsonData);

console.log('Slack data read successfully!');

// Filter the objects in the array
const filteredData = slackData.filter((message: any) => {
  return message.type === 'message' && !message.text.includes('has joined the channel') && !message.text.includes('has left the channel');
}).map((message: any) => {
  return {
    type: message.type,
    text: message.text
  };
});

// Convert the filtered data to a plain text string
const filteredTextData = filteredData.map((message: any) => {
  return `${message.type}: ${message.text}`;
}).join('\n');

// Specify the output directory and file path
const outputDir = join(dirname(new URL(import.meta.url).pathname), '..', 'data/text');
const outputFile = join(outputDir, 'filtered_slack.txt');

// Create the output directory if it doesn't exist
fs.ensureDirSync(outputDir);

// Write the filtered text data to the output file
fs.writeFileSync(outputFile, filteredTextData);

console.log('Filtered text file created successfully!');