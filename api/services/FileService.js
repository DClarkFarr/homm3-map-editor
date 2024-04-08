const path = require("path");
const { readdir } = require("fs/promises");

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
}

const fileService = new FileService();

module.exports = fileService;
module.exports.FileService = FileService;
