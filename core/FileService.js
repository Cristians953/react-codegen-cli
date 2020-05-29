const fs = require('fs-extra');
const chalk = require('chalk');
const path = require('path');
const logSymbols = require('log-symbols');

const { EXT, CONFIG } = require('../constants');

class FileService {
  constructor(fileName) {
    this.fileName = fileName;
    this.dirPath = path.join(CONFIG.path, this.fileName);
  }

  getFilePath(ext, type) {
    type = type ? `.${type}` : '';
    return `${this.dirPath}/${this.fileName}${type}.${ext}`;
  }

  createDir() {
    return fs.mkdirp(this.dirPath);
  }

  async genJs(template) {
    const filePath = this.getFilePath(EXT.component);
    if (!(await fs.pathExists(filePath))) {
      await fs.writeFile(filePath, template);
      console.log(
        logSymbols.success,
        chalk.green(`Successfully generated component file ${chalk.white(filePath)}`)
      );
    } else {
      console.log(logSymbols.warning, chalk.yellow(`File already exists ${chalk.white(filePath)}`));
    }
  }

  async genStyle(template) {
    const filePath = this.getFilePath(EXT.style, 'style');
    if (!(await fs.pathExists(filePath))) {
      await fs.writeFile(filePath, template);
      console.log(
        logSymbols.success,
        chalk.green(`Successfully generated style file ${chalk.white(filePath)}`)
      );
    } else {
      console.log(logSymbols.warning, chalk.yellow(`File already exists ${chalk.white(filePath)}`));
    }
  }

  async genTest(template) {
    const filePath = this.getFilePath(EXT.component, 'test');
    if (!(await fs.pathExists(filePath))) {
      await fs.writeFile(filePath, template);
      console.log(
        logSymbols.success,
        chalk.green(`Successfully generated test file ${chalk.white(filePath)}`)
      );
    } else {
      console.log(logSymbols.warning, chalk.yellow(`File already exists ${chalk.white(filePath)}`));
    }
  }
}

module.exports = {
  FileService,
};
