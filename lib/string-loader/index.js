"use strict";

const lzstr = require("lz-string");

module.exports = function (content) {
	this.cacheable && this.cacheable();
	const compressed = lzstr.compressToBase64(this.inputValue || content);
	return `var l=require("lz-string");module.exports=l.decompressFromBase64("${compressed}")`;
};
