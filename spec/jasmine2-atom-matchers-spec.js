"use strict";
/* globals zdescribe */

require("jasmine-should-fail");

var path = require("path");

var jsdom = require("jsdom");

beforeAll(function (done) {
	jsdom.env(
		"<html><head></head><body></body></html>",
		function (err, window) {
			window.jasmine = global.jasmine;
			for (var i in window) {
				if (!global.hasOwnProperty(i)) {
					global[i] = window[i];
				}
			}
			require("../src/jasmine2-atom-matchers");
			done();
		}
	);
});

describe("matchers", function () {
	beforeEach(function () {
		this.domContainer = document.createElement("div");
		this.domContainer.id = "matchers-specs-container";
		document.body.appendChild(this.domContainer);
	});

	afterEach(function () {
		this.domContainer.remove();
	});
	describe("passing", function () {
		it("should define toBeInstanceOf", function () {
			expect([]).toBeInstanceOf(Array);
			expect([]).not.toBeInstanceOf(Function);
		});

		it("should define toHaveLength", function () {
			expect([1, 2]).toHaveLength(2);
			expect([1, 2]).not.toHaveLength(1);
		});

		it("should define toExistOnDisk", function () {
			expect(path.resolve(__dirname, "../package.json")).toExistOnDisk();
			expect(path.resolve(__dirname, "./package.json")).not.toExistOnDisk();
		});

		it("should define toHaveFocus", function () {
			var input1 = document.createElement("input");
			var input2 = document.createElement("input");
			this.domContainer.appendChild(input1);
			this.domContainer.appendChild(input2);
			input1.focus();
			expect(input1).toHaveFocus();
			expect(input2).not.toHaveFocus();
		});

		it("should define toShow", function () {
			var div1 = document.createElement("div");
			var div2 = document.createElement("div");
			div1.style.display = "block";
			div2.style.display = "none";
			this.domContainer.appendChild(div1);
			this.domContainer.appendChild(div2);
			expect(div1).toShow();
			expect(div2).not.toShow();
		});

		it("should define toEqualPath", function () {
			var path1 = path.resolve(__dirname, ".");
			var path2 = path.resolve(__dirname, "..");
			expect(path1).toEqualPath(__dirname);
			expect(path2).not.toEqualPath(__dirname);
		});
	});

	zdescribe("failing", function () {
		it("should define toBeInstanceOf", function () {
			expect([]).not.toBeInstanceOf(Array);
			expect([]).toBeInstanceOf(Function);
		});

		it("should define toHaveLength", function () {
			expect([1, 2]).not.toHaveLength(2);
			expect([1, 2]).toHaveLength(1);
		});

		it("should define toExistOnDisk", function () {
			expect(path.resolve(__dirname, "../package.json")).not.toExistOnDisk();
			expect(path.resolve(__dirname, "./package.json")).toExistOnDisk();
		});

		it("should define toHaveFocus", function () {
			var input1 = document.createElement("input");
			var input2 = document.createElement("input");
			this.domContainer.appendChild(input1);
			this.domContainer.appendChild(input2);
			input1.focus();
			expect(input1).not.toHaveFocus();
			expect(input2).toHaveFocus();
		});

		it("should define toShow", function () {
			var div1 = document.createElement("div");
			var div2 = document.createElement("div");
			div1.style.display = "block";
			div2.style.display = "none";
			this.domContainer.appendChild(div1);
			this.domContainer.appendChild(div2);
			expect(div1).not.toShow();
			expect(div2).toShow();
		});

		it("should define toEqualPath", function () {
			expect(path.resolve(__dirname, ".")).not.toEqualPath(__dirname);
			expect(path.resolve(__dirname, "..")).toEqualPath(__dirname);
		});
	});
});
