const HLSD_TYPE = {
  HLSD_CONFIG: 0x1,
};

const HLSD_VERSIONS = {
  V1: 0x0,
  V1_ENCODED: 0x1,
};

const HLSD_FILETYPE = {
  IMAGE: 0x0,
  VIDEO: 0x1,
  TEXT: 0x2,
  AUDIO: 0x3,
  RIFF: 0x4,
  HLSDARCHIVE: 0x5,
  UNKNOWN: 65535,
};

class HLSD {
  constructor() {
    this.magic = "HLSD";
    this.size = 0;
    this.version = null;
    this.type = null;
    this.firstSection = 0x0;
  }
}

class HLSRCFile {
  constructor() {
    this.hlsd = null;
    this.magic = "HLSC";
    this.size = 0;
    this.name = null;
    this.description = null;
    this.game = null;
    this.author = null;
    this.scriptless = false;
    this.scriptJSON = false;
    this.nextSection = 0x0;
    this.filesMeta = null;
  }
}

class HLSD_FILESMETA {
  constructor() {
    this.magic = "HLSM";
    this.size = 0;
    this.countOfFiles = 0;
    this.list = [];
    this.nextSection = 0x0;
  }
}

class File {
  constructor() {
    this.sectSize = 0;
    this.type = null;
    this.name = null;
    this.size = 0;
    this.data = [];
  }
}

module.exports = {
    HLSD_TYPE,
    HLSD_VERSIONS,
    HLSD_FILETYPE,
    HLSD,
    HLSRCFile,
    HLSD_FILESMETA,
    File
}