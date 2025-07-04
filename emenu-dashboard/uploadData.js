const { exec } = require('child_process');
const path = require('path');

// Run the TypeScript file using ts-node
exec('npx ts-node src/uploadInitialData.ts', (error, stdout, stderr) => {
  if (error) {
    console.error(`Error: ${error.message}`);
    return;
  }
  if (stderr) {
    console.error(`stderr: ${stderr}`);
    return;
  }
  console.log(`stdout: ${stdout}`);
}); 