import { join, dirname, extname, basename } from 'path';
import glob from 'glob';
import fs from 'fs-extra';

// The directory where the repositories have been downloaded and the output directory
const REPO_DIR = './pre-git-data';
const OUTPUT_DIR = './data/text';

fs.ensureDirSync(OUTPUT_DIR);
// The extensions you want to process
const EXTENSIONS = [
  'txt', 'md', 'markdown', 'rst', 'py', 'js', 'java', 'c', 'cpp', 'cs', 'go',
  'rb', 'php', 'scala', 'html', 'htm', 'xml', 'json', 'yaml', 'yml', 'ini',
  'toml', 'cfg', 'conf', 'sh', 'bash', 'css', 'scss', 'sql', 'gitignore',
  'dockerignore', 'editorconfig', 'ipynb'
];

// Process each repository
glob(`${REPO_DIR}/*`, { nodir: false }, (err, repoDirs) => {
  if (err) {
    console.error('Error reading repository directories:', err);
    return;
  }

  repoDirs.forEach((repoDir) => {
    console.log(`Processing repository: ${repoDir}`);

    // Build the glob pattern for the extensions
    const patterns = EXTENSIONS.map((ext) => `${repoDir}/*.${ext}`);
    // Find and process files based on the extensions
    glob(`{${patterns.join(',')}}`, (err, files) => {
      if (err) {
        console.error(`Error reading files in ${repoDir}:`, err);
        return;
      }

      files.forEach(async (file) => {
        const relativePath = file.replace(`${repoDir}/`, '');
        console.log(`Processing file with matching extension: ${relativePath}`);

        try {
            const fileContent = await fs.readFile(file, 'utf8');
          
            const outputFilePath = join(
              OUTPUT_DIR,
              `${basename(file, extname(file))}.txt`
            );
            
            try {
              await fs.writeFile(outputFilePath, fileContent, 'utf8');
              console.log(`File content saved to: ${outputFilePath}`);
            } catch (writeErr) {
              console.error(`Error writing file ${outputFilePath}:`, writeErr);
            }
          } catch (readErr) {
            console.error(`Error reading file ${relativePath}:`, readErr);
          }
      });
    });
  });
});
