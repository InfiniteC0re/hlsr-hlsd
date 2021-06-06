const window1251 = require("windows-1251");
const BinaryFile = require("binary-file");

const {
  HLSD_TYPE,
  HLSD_VERSIONS,
  HLSD_FILETYPE,
  HLSD,
  HLSRCFile,
  HLSD_FILESMETA,
  File,
} = require("./defines");

function readSection(file, sectionName) {
  return new Promise(async (res, rej) => {
    if (sectionName == "HLSD") {
      let hlsd = new HLSD();

      hlsd.size = await file.readUInt32();
      hlsd.version = await file.readUInt16();
      hlsd.type = await file.readUInt8();
      hlsd.firstSection = await file.readUInt32();

      return res(hlsd);
    } else if (sectionName == "HLSC") {
      let hlsc = new HLSRCFile();

      hlsc.size = await file.readUInt32();
      hlsc.name = await getString(file, await file.readUInt16());
      hlsc.description = await getString(file, await file.readUInt16());
      hlsc.game = await getString(file, await file.readUInt16());
      hlsc.author = await getString(file, await file.readUInt16());
      hlsc.scriptless = await file.readUInt8();
      hlsc.scriptJSON = await getString(file, await file.readUInt32());
      hlsc.nextSection = await file.readUInt32();

      res(hlsc);
    } else if (sectionName == "HLSM") {
      let hlsm = new HLSD_FILESMETA();

      let hlsmPos = file.tell() - 4;
      hlsm.size = await file.readUInt32();
      hlsm.countOfFiles = await file.readUInt16();
      hlsm.list = [];

      for (let i = 0; i < hlsm.countOfFiles; i++) {
        let fileOffset = await file.readUInt32();
        let lastPos = file.tell();

        file.seek(hlsmPos + fileOffset);

        let fileInst = new File();
        fileInst.sectSize = await file.readUInt32();
        fileInst.type = await file.readUInt16();
        fileInst.name = await getString(file, await file.readUInt16());
        fileInst.size = await file.readUInt32();
        fileInst.data = await file.read(fileInst.size);

        file.seek(lastPos);
        hlsm.list.push(fileInst);
      }

      return res(hlsm);
    }

    return rej();
  });
}

function getString(file, len) {
  return new Promise(async (res, rej) => {
    let bytes = await file.read(len);
    let str = "";

    bytes.forEach((byte) => {
      str += window1251.decode(String.fromCharCode(byte));
    });

    res(str);
  });
}

module.exports = {
  handleFile(filePath) {
    return new Promise(async (res, rej) => {
      const fs = require("fs");

      if (!fs.existsSync(filePath)) return rej("no file");
      const file = new BinaryFile(filePath, "r", true);

      (async function () {
        await file.open();
        const firstSection = await file.readString(4);

        let fileHeader = await readSection(file, firstSection);

        if (fileHeader instanceof HLSD) {
          if (fileHeader.type == HLSD_TYPE.HLSD_CONFIG) {
            let nextSection;

            nextSection = await file.readString(4);
            let hlsc = await readSection(file, nextSection);
            nextSection = await file.readString(4);
            let hlsm = await readSection(file, nextSection);

            hlsc.hlsd = fileHeader;
            hlsc.filesMeta = hlsm;

            res(hlsc);
          }
        }
      })();
    });
  },
  HLSD_TYPE,
  HLSD_VERSIONS,
  HLSD_FILETYPE,
  HLSD,
  HLSRCFile,
  HLSD_FILESMETA,
  File,
};
