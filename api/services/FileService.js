const path = require("path");
const { readdir, readFile } = require("fs/promises");

class FileService {
  getTemplateDirectory() {
    return path.normalize(process.env.TEMPLATES_PATH);
  }

  async getTemplateFolders() {
    var dir = this.getTemplateDirectory();

    return (await readdir(dir, { withFileTypes: true }))
      .filter((dirent) => dirent.isDirectory())
      .map((obj) => obj.name);
  }
  async getTemplates() {
    var dirs = await this.getTemplateFolders();

    return dirs.map((name) => {
      return {
        id: encodeURIComponent(name),
        name: name,
      };
    });
  }

  async getTemplate(id) {
    var dir = this.getTemplateDirectory();
    var templatePath = path.join(dir, id, "rmg.txt");

    const rawString = await readFile(templatePath, "utf8");

    return this.stringToTemplate(rawString);
  }

  async stringToTemplate(rawString) {
    const lines = rawString.split(/\r\n/);

    // console.log("lines are", lines);

    const parsedLines = lines.map((rawLine) => {
      return rawLine.split(/\t/);
    });

    console.log("raw string was", rawString);

    const rawHeaders = parsedLines.shift();

    let prevValue = "";
    const headers = [];
    rawHeaders.forEach((h, i) => {
      if (h) {
        prevValue = "T:" + h;
      }
      headers.push(h || prevValue);
    });

    const rawCategories = parsedLines.shift();

    let prevCategory = "T:empty";
    const categories = [];
    rawCategories.forEach((c, i) => {
      if (c) {
        prevCategory = "T:" + c;
      }
      categories.push(c || prevCategory);
    });

    const rawLabels = parsedLines.shift();

    const labels = [];
    rawLabels.forEach((l, i) => {
      labels.push(l);
    });

    const blocks = [];
    let currentBlock = [];

    console.log("before blocks", parsedLines, "length", parsedLines.length);

    while (parsedLines.length) {
      const line = parsedLines.shift();
      if (line[0].length) {
        if (currentBlock.length) {
          blocks.push(currentBlock);
          currentBlock = [];
        }
      }

      const blockLine = currentBlock.length;
      currentBlock.push([]);

      line.forEach((value, i) => {
        currentBlock[blockLine][i] = value;
      });
    }

    if (currentBlock.length) {
      blocks.push(currentBlock);
    }

    return {
      headers,
      categories,
      labels,
      blocks,
    };
  }
}

const fileService = new FileService();

module.exports = fileService;
module.exports.FileService = FileService;
