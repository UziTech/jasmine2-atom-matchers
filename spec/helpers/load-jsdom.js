"use strict";

var JSDOM = require("jsdom").JSDOM;

var jsdomWindow = (new JSDOM("<!doctype html><html><head><meta charset='utf-8'></head><body></body></html>", {url: "http://localhost/"})).window;

var $ = require("jquery")(jsdomWindow);

jsdomWindow.jasmine = global.jasmine;
for (var i in jsdomWindow) {
	if (!global.hasOwnProperty(i)) {
		global[i] = jsdomWindow[i];
	}
}
global.HTMLElement = jsdomWindow.HTMLElement;

require("../../src/jasmine2-atom-matchers");
