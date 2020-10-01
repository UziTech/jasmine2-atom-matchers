"use strict";

(function (global) {

	if (!global.jasmine) {
		throw new Error("jasmine must be loaded before jasmine2-jquery");
	}

	var $ = require("jquery");
	var _ = require("underscore-plus");

	global.jasmine.JQuery = function () {};

	global.jasmine.JQuery.browserTagCaseIndependentHtml = function (html) {
		var div = document.createElement("div");
		div.innerHTML = html;
		return div.innerHTML;
	};

	global.jasmine.JQuery.toElement = function (element) {
		if (element instanceof HTMLElement) {
			return element;
		}
		if (element.jquery) {
			if (element.length === 0) {
				throw new Error(element.selector + " does not match an element");
			}
			return element[0];
		}
		throw new Error(element + " is not an element");
	};

	global.jasmine.JQuery.elementToString = function (element) {
		try {
			return global.jasmine.JQuery.toElement(element).outerHTML;
		} catch (ex) {}
		return element.toString();
	};

	global.jasmine.JQuery.elementToTagString = function (element) {
		var matches = global.jasmine.JQuery.elementToString(element).match(/^<.*?>/);
		if (!matches) {
			return element.toString();
		}
		return matches[0];
	};

	global.jasmine.JQuery.matchersClass = {};

	var jQueryMatchers = {
		toHaveClass: function (options, actual, className) {
			var result = {};
			if (actual instanceof HTMLElement) {
				result.pass = actual.classList.contains(className);
			} else {
				result.pass = actual.hasClass(className);
			}
			var haveOrNotHave = (result.pass ? "not have" : "have");
			var actualString = actual.selector ? actual.selector : global.jasmine.JQuery.elementToTagString(actual);
			result.message = "Expected '" + actualString + "' to " + haveOrNotHave + " class '" + className + "'";
			return result;
		},

		toBeVisible: function (options, actual) {
			var result = {};
			if (actual instanceof HTMLElement) {
				result.pass = actual.offsetWidth !== 0 || actual.offsetHeight !== 0;
			} else {

				result.pass = actual.is(":visible");
			}
			var beOrNotBe = (result.pass ? "not be" : "be");
			var actualString = actual.selector ? actual.selector : global.jasmine.JQuery.elementToTagString(actual);
			result.message = "Expected '" + actualString + "' to " + beOrNotBe + " visible";
			return result;
		},

		toBeHidden: function (options, actual) {
			var result = {};
			if (actual instanceof HTMLElement) {
				result.pass = actual.offsetWidth === 0 || actual.offsetHeight === 0;
			} else {
				result.pass = actual.is(":hidden");
			}
			var beOrNotBe = (result.pass ? "not be" : "be");
			var actualString = actual.selector ? actual.selector : global.jasmine.JQuery.elementToTagString(actual);
			result.message = "Expected '" + actualString + "' to " + beOrNotBe + " hidden";
			return result;
		},

		toBeSelected: function (options, actual) {
			var result = {};
			if (actual instanceof HTMLElement) {
				result.pass = actual.selected;
			} else {
				result.pass = actual.is(":selected");
			}
			var beOrNotBe = (result.pass ? "not be" : "be");
			var actualString = actual.selector ? actual.selector : global.jasmine.JQuery.elementToTagString(actual);
			result.message = "Expected '" + actualString + "' to " + beOrNotBe + " selected";
			return result;
		},

		toBeChecked: function (options, actual) {
			var result = {};
			if (actual instanceof HTMLElement) {
				result.pass = actual.checked;
			} else {
				result.pass = actual.is(":checked");
			}
			var beOrNotBe = (result.pass ? "not be" : "be");
			var actualString = actual.selector ? actual.selector : global.jasmine.JQuery.elementToTagString(actual);
			result.message = "Expected '" + actualString + "' to " + beOrNotBe + " checked";
			return result;
		},

		toBeEmpty: function (options, actual) {
			var result = {};
			if (actual instanceof HTMLElement) {
				result.pass = actual.innerHTML === "";
			} else {
				result.pass = actual.is(":empty");
			}
			var beOrNotBe = (result.pass ? "not be" : "be");
			var actualString = global.jasmine.JQuery.elementToString(actual);
			result.message = "Expected '" + actualString + "' to " + beOrNotBe + " empty";
			return result;
		},

		toExist: function (options, actual) {
			var result = {};
			result.pass = (actual instanceof HTMLElement || actual.length > 0);
			var toOrNotTo = (result.pass ? "not to" : "to");
			var actualString = actual.selector ? actual.selector : global.jasmine.JQuery.elementToTagString(actual);
			result.message = "Expected '" + actualString + "' " + toOrNotTo + " exist";
			return result;
		},

		toHaveAttr: function (options, actual, attributeName, expectedAttributeValue) {
			var result = {};
			var actualAttributeValue;
			if (actual instanceof HTMLElement) {
				actualAttributeValue = actual.getAttribute(attributeName);
			} else {
				actualAttributeValue = actual.attr(attributeName);
			}
			result.pass = hasProperty(actualAttributeValue, expectedAttributeValue);
			var haveOrNotHave = (result.pass ? "not have" : "have");
			var actualString = actual.selector ? actual.selector : global.jasmine.JQuery.elementToTagString(actual);
			var attrString = attributeName + (typeof expectedAttributeValue !== "undefined" ? "='" + expectedAttributeValue.replace(/'/g, "\\'") + "'" : "");
			result.message = "Expected '" + actualString + "' to " + haveOrNotHave + " attribute " + attrString + "";
			return result;
		},

		toHaveId: function (options, actual, id) {
			var result = {};
			if (actual instanceof HTMLElement) {
				result.pass = actual.getAttribute("id") === id;
			} else {
				result.pass = actual.attr("id") === id;
			}
			var haveOrNotHave = (result.pass ? "not have" : "have");
			var actualString = actual.selector ? actual.selector : global.jasmine.JQuery.elementToTagString(actual);
			result.message = "Expected '" + actualString + "' to " + haveOrNotHave + " id '" + id + "'";
			return result;
		},

		toHaveHtml: function (options, actual, html) {
			var result = {};
			var actualHTML;
			if (actual instanceof HTMLElement) {
				actualHTML = actual.innerHTML;
			} else {
				actualHTML = actual.html();
			}
			result.pass = actualHTML === global.jasmine.JQuery.browserTagCaseIndependentHtml(html);
			var haveOrNotHave = (result.pass ? "not have" : "have");
			var actualString = global.jasmine.JQuery.elementToString(actual);
			result.message = "Expected '" + actualString + "' to " + haveOrNotHave + " html '" + html + "'";
			return result;
		},

		toHaveText: function (options, actual, text) {
			var result = {};
			var actualText;
			if (actual instanceof HTMLElement) {
				actualText = actual.textContent;
			} else {
				actualText = actual.text();
			}

			if (text && typeof text.test === "function") {
				result.pass = text.test(actualText);
			} else {
				result.pass = actualText === text;
			}
			var haveOrNotHave = (result.pass ? "not have" : "have");
			var actualString = global.jasmine.JQuery.elementToString(actual);
			result.message = "Expected '" + actualString + "' to " + haveOrNotHave + " text '" + text + "'";
			return result;
		},

		toHaveValue: function (options, actual, value) {
			var result = {};
			if (actual instanceof HTMLElement) {
				result.pass = actual.value === value;
			} else {
				result.pass = actual.val() === value;
			}
			var haveOrNotHave = (result.pass ? "not have" : "have");
			var actualString = actual.selector ? actual.selector : global.jasmine.JQuery.elementToTagString(actual);
			result.message = "Expected '" + actualString + "' to " + haveOrNotHave + " value '" + value + "'";
			return result;
		},

		toHaveData: function (options, actual, key, expectedValue) {
			var result = {};
			if (actual instanceof HTMLElement) {
				var camelCaseKey = _.camelize(key);
				result.pass = hasProperty(actual.dataset[camelCaseKey], expectedValue);
			} else {
				result.pass = hasProperty(actual.data(key), expectedValue);
			}
			var haveOrNotHave = (result.pass ? "not have" : "have");
			var actualString = actual.selector ? actual.selector : global.jasmine.JQuery.elementToTagString(actual);
			var dataString = key + (typeof expectedValue !== "undefined" ? "='" + expectedValue.replace(/'/g, "\\'") + "'" : "");
			result.message = "Expected '" + actualString + "' to " + haveOrNotHave + " data " + dataString + "";
			return result;
		},

		toMatchSelector: function (options, actual, selector) {
			var result = {};
			if (actual instanceof HTMLElement) {
				result.pass = actual.matches(selector);
			} else {
				result.pass = actual.is(selector);
			}
			var matchOrNotMatch = (result.pass ? "not match" : "match");
			var actualString = actual.selector ? actual.selector : global.jasmine.JQuery.elementToTagString(actual);
			result.message = "Expected '" + actualString + "' to " + matchOrNotMatch + " selector " + selector + "";
			return result;
		},

		toContain: function (options, actual, contained) {
			var result = {};
			if (actual instanceof HTMLElement) {
				if (typeof contained === "string") {
					result.pass = actual.querySelector(contained);
				} else {
					result.pass = actual.contains(contained);
				}
			} else {
				result.pass = actual.find(contained).length > 0;
			}
			var toOrNotTo = (result.pass ? "not to" : "to");
			var actualString = global.jasmine.JQuery.elementToString(actual);
			var containedString = (typeof contained === "string" ? contained : global.jasmine.JQuery.elementToString(contained));
			result.message = "Expected '" + actualString + "' " + toOrNotTo + " contain '" + containedString + "'";
			return result;
		},

		toBeDisabled: function (options, actual) {
			var result = {};
			if (actual instanceof HTMLElement) {
				result.pass = actual.disabled;
			} else {
				result.pass = actual.is(":disabled");
			}
			var beOrNotBe = (result.pass ? "not be" : "be");
			var actualString = actual.selector ? actual.selector : global.jasmine.JQuery.elementToTagString(actual);
			result.message = "Expected '" + actualString + "' to " + beOrNotBe + " disabled";
			return result;
		},

		// tests the existence of a specific event binding
		toHandle: function (options, actual, eventName) {
			var result = {};
			var events = actual.data("events");
			result.pass = events && events[eventName].length > 0;
			var toOrNotTo = (result.pass ? "not to" : "to");
			var actualString = actual.selector ? actual.selector : global.jasmine.JQuery.elementToTagString(actual);
			result.message = "Expected '" + actualString + "' " + toOrNotTo + " handle '" + eventName + "'";
			return result;
		},

		// tests the existence of a specific event binding + handler
		toHandleWith: function (options, actual, eventName, eventHandler) {
			var result = {};
			var stack = actual.data("events")[eventName];
			result.pass = false;
			for (var i = 0; i < stack.length; i++) {
				if (stack[i].handler === eventHandler) {
					result.pass = true;
					break;
				}
			}
			var toOrNotTo = (result.pass ? "not to" : "to");
			var actualString = actual.selector ? actual.selector : global.jasmine.JQuery.elementToTagString(actual);
			result.message = "Expected '" + actualString + "' " + toOrNotTo + " handle '" + eventName + "' with '" + eventHandler.name + "'";
			return result;
		}
	};

	function hasProperty(actualValue, expectedValue) {
		if (typeof expectedValue === "undefined") {
			return (typeof actualValue !== "undefined" && actualValue !== null);
		}
		// eslint-disable-next-line eqeqeq
		return (actualValue == expectedValue);
	};

	function bindMatcher(methodName) {
		var builtInMatcher = global.jasmine.matchers[methodName];
		global.jasmine.JQuery.matchersClass[methodName] = function (util, customEqualityTesters) {
			return {
				compare: function (actual) {
					if (actual && (actual.jquery || actual instanceof HTMLElement)) {
						var options = {
							util: util,
							customEqualityTesters: customEqualityTesters
						};
						var args = [options].concat(Array.from(arguments));
						return jQueryMatchers[methodName].apply(this, args);
					}

					if (typeof builtInMatcher === "function") {
						return builtInMatcher(util, customEqualityTesters).compare.apply(this, arguments);
					}

					return {
						pass: false,
						message: actual + " is not an element"
					};
				}
			};
		};
	};

	for (var methodName in jQueryMatchers) {
		bindMatcher(methodName);
	}

	global.beforeEach(function () {
		global.jasmine.addMatchers(global.jasmine.JQuery.matchersClass);
	});

})(typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {});
