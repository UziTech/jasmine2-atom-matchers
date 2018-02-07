"use strict";

(function (global) {

	if (!global.jasmine) {
		throw new Error("jasmine must be loaded before jasmine2-atom-matchers");
	}

	if (!global.document) {
		throw new Error("jasmine2-atom-matchers requires a window with a document");
	}

	require("./jasmine2-jquery");

	"use babel";

	var path = require("path");
	var fs = require("fs");
	var _ = require("underscore-plus");

	global.beforeEach(function () {

		global.jasmine.addCustomEqualityTester(function (a, b) {
			// Use underscore's definition of equality for toEqual assertions
			var result = _.isEqual(a, b);
			if (result) {
				return true;
			}
			// return undefined to allow jasmines regular toEqual
		});

		global.jasmine.addMatchers({
			toBeInstanceOf: function () {
				return {
					compare: function (actual, expected) {
						var result = {};
						result.pass = actual instanceof expected;
						var beOrNotBe = (result.pass ? "not be" : "be");
						result.message = "Expected " + global.jasmine.pp(actual) + " to " + beOrNotBe + " instance of " + expected.name + " class";
						return result;
					}
				};
			},

			toHaveLength: function () {
				return {
					compare: function (actual, expected) {
						var result = {};
						if (!actual) {
							result.message = "Expected object " + actual + " has no length method";
							result.pass = false;
						} else {
							result.pass = (actual.length === expected);
							var haveOrNotHave = (result.pass ? "not have" : "have");
							result.message = "Expected object with length " + actual.length + " to " + haveOrNotHave + " length " + expected + "";
						}
						return result;
					}
				};
			},

			toExistOnDisk: function () {
				return {
					compare: function (actual) {
						var result = {};
						result.pass = fs.existsSync(actual);
						var toOrNotTo = (result.pass ? "not to" : "to");
						result.message = "Expected path '" + actual + "' " + toOrNotTo + " exist.";
						return result;
					}
				};
			},

			toHaveFocus: function () {
				return {
					compare: function (actual) {
						var result = {};
						var element = (actual.jquery ? actual.get(0) : actual);
						result.pass = (element === global.document.activeElement) || element.contains(global.document.activeElement);
						var toOrNotTo = (result.pass ? "not to" : "to");
						if (!global.document.hasFocus()) {
							console.error("Specs will fail because the Dev Tools have focus. To fix this close the Dev Tools or click the spec runner.");
						}
						result.message = "Expected element '" + actual + "' or its descendants " + toOrNotTo + " have focus.";
						return result;
					}
				};
			},

			toShow: function () {
				return {
					compare: function (actual) {
						// TODO: this needs to be fixed (since when is display "inline" hidden)
						var result = {};
						var element = (actual.jquery ? actual.get(0) : actual);
						result.pass = _.contains(["block", "inline-block", "static", "fixed"], element.style.display);
						var toOrNotTo = (result.pass ? "not to" : "to");
						result.message = "Expected element '" + element + "' or its descendants " + toOrNotTo + " show.";
						return result;
					}
				};
			},

			toEqualPath: function () {
				return {
					compare: function (actual, expected) {
						var result = {};
						var actualPath = path.normalize(actual);
						var expectedPath = path.normalize(expected);
						result.pass = actualPath === expectedPath;
						var beOrNotBe = (result.pass ? "not be" : "be");
						result.message = "Expected path '" + actualPath + "' to " + beOrNotBe + " equal to '" + expectedPath + "'.";
						return result;
					}
				};
			}
		});
	});

})(typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {});
