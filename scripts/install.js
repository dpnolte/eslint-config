const fs = require('fs-extra');
const path = require('path');
const stripIndent = require('strip-indent');

const TEMPLATE_EXT = '.tmpl.js';
const TEMPLATE_DIR = path.resolve(__dirname, '../templates');
const PROJECT_DIR = process.cwd();

const ensureThatFileDoesNotExist = p => {
  if (fs.existsSync(p)) {
    console.log(
      `-\tCannot install config file. File already exists: ${path.relative(PROJECT_DIR, p)}`
    );
    return false;
  }
  return true;
};

const writeTemplateFile = (templateFilePath, fileName) => {
  if (!fs.existsSync(templateFilePath)) {
    console.log(`-\tTemplate file of '${fileName}' not found @ ${templateFilePath}`);
    throw new Error('File not found');
  }

  const targetFilePath = path.resolve(PROJECT_DIR, fileName);
  if (ensureThatFileDoesNotExist(targetFilePath)) {
    // get contents by using module's default exported function
    const templateCreator = require(templateFilePath);
    const contents = `${stripIndent(templateCreator()).trim()}\n`;

    fs.writeFileSync(targetFilePath, contents);
    console.log(`-\tAdded file ${path.relative(PROJECT_DIR, fileName)}`);
  }
};

const projectRealPath = fs.realpathSync(process.cwd());
const resolveCurrentDirectory = relativePath => path.resolve(projectRealPath, relativePath);

const packageJsonPath = resolveCurrentDirectory('package.json');
if (!fs.existsSync(packageJsonPath)) {
  console.log('❌Error: no package.json found at current dir');
  throw new Error('File not found: package.json');
}
// const packageConfig = require(packageJsonPath);

// packageConfig.eslintConfig = {
//   extends: 'derk-eslint-config',
// };

// packageConfig.prettier = {
//   trailingComma: 'es5',
//   singleQuote: true,
//   printWidth: 100,
//   arrowParens: 'avoid',
// };

// fs.writeFileSync(packageJsonPath, JSON.stringify(packageConfig, null, 2));

// console.log(
//   `-\tAdded eslint and prettier config to ${path.relative(PROJECT_DIR, packageJsonPath)}`
// );

const files = fs.readdirSync(TEMPLATE_DIR);
files.forEach(f => {
  if (f.endsWith(TEMPLATE_EXT)) {
    const fileName = f.slice(0, f.length - TEMPLATE_EXT.length);
    const templatePath = path.resolve(TEMPLATE_DIR, f);
    writeTemplateFile(templatePath, fileName);
  }
});
