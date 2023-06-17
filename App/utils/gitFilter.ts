import { join } from 'path';
import glob from 'glob';

// The directory where the repositories have been downloaded
const REPO_DIR = './data';

// The extensions you want to filter
const EXTENSIONS = ['.txt', '.md', '.js'];

// Process each repository
glob(`${REPO_DIR}/*`, { nodir: false }, (err, repoDirs) => {
  if (err) {
    console.error('Error reading repository directories:', err);
    return;
  }

  repoDirs.forEach((repoDir) => {
    // Build the glob pattern for the extensions
    const patterns = EXTENSIONS.map((ext) => `${repoDir}/**/*${ext}`);

    // Find and filter files based on the extensions
    glob(`{${patterns.join(',')}}`, (err, files) => {
      if (err) {
        console.error(`Error reading files in ${repoDir}:`, err);
        return;
      }

      files.forEach((file) => {
        const relativePath = file.replace(`${repoDir}/`, '');
        console.log(`Found file with matching extension: ${relativePath}`);
      });
    });
  });
});
