"use strict";

var jsdom = require("jsdom");

var $ = require("jquery")(jsdom.jsdom().defaultView);

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
			global.HTMLElement = window.HTMLElement;
			require("../src/jasmine2-atom-matchers");
			done();
		}
	);
});

describe("jasmine-jquery", function () {
	beforeEach(function () {
		var self = this;
		this.domContainer = $("<div id='jasmine-jquery-specs-container' />").appendTo(document.body);
		this.tag = function (tag) {
			var $el = $("<" + tag + " />");
			$el.attach = function () {
				return $el.appendTo(self.domContainer);
			};
			return $el;
		};
	});

	afterEach(function () {
		this.domContainer.remove();
	});

	describe("functions", function () {
		it("should define jasmine.JQuery.browserTagCaseIndependentHtml", function () {
			var html = "<DIV></DIV>";
			expect(jasmine.JQuery.browserTagCaseIndependentHtml(html)).toBe("<div></div>");
		});

		it("should define jasmine.JQuery.toElement", function () {
			var $div = $("<div/>");
			var div = jasmine.JQuery.toElement($div);
			expect(div instanceof HTMLElement).toBe(true);
			expect(function () {
				jasmine.JQuery.toElement($(".not-an-element"));
			}).toThrowError();
			expect(function () {
				jasmine.JQuery.toElement(1);
			}).toThrowError();
		});

		it("should define jasmine.JQuery.elementToString", function () {
			var $div = $("<div/>");
			expect(jasmine.JQuery.elementToString($div)).toBe("<div></div>");
			expect(jasmine.JQuery.elementToString(1)).toBe("1");
		});

		it("should define jasmine.JQuery.elementToTagString", function () {
			var $div = $("<div class='test'/>");
			expect(jasmine.JQuery.elementToTagString($div)).toBe("<div class=\"test\">");
			expect(jasmine.JQuery.elementToTagString(1)).toBe("1");
		});
	});

	describe("matchers", function () {
		it("should define toHaveClass", function () {
			var div = this.tag("div").addClass("test");
			expect(div).toHaveClass("test");
			expect(div[0]).toHaveClass("test");
			expect(div).not.toHaveClass("invalid");
			expect(div[0]).not.toHaveClass("invalid");
		});

		// it("should define toBeVisible", function () {
		// 	var div = this.tag("div").attach();
		// 	expect(div).toBeVisible();
		// 	expect(div[0]).toBeVisible();
		// 	div.hide();
		// 	expect(div).not.toBeVisible();
		// 	expect(div[0]).not.toBeVisible();
		// });
		//
		// it("should define toBeHidden", function () {
		// 	var div = this.tag("div").attach();
		// 	div.hide();
		// 	expect(div).toBeHidden();
		// 	expect(div[0]).toBeHidden();
		// 	div.show();
		// 	expect(div).not.toBeHidden();
		//
		// 	// don't ask me why this is needed
		// 	div.text("test");
		// 	expect(div[0]).not.toBeHidden();
		// });

		it("should define toBeSelected", function () {
			var option1 = this.tag("option");
			var option2 = this.tag("option");
			var select = this.tag("select").append(option1, option2);
			expect(option1).toBeSelected();
			expect(option1[0]).toBeSelected();
			expect(option2).not.toBeSelected();
			expect(option2[0]).not.toBeSelected();
		});

		it("should define toBeChecked", function () {
			var checkbox = this.tag("input").attr({ type: "checkbox" }).prop({ checked: true });
			expect(checkbox).toBeChecked();
			expect(checkbox[0]).toBeChecked();
			checkbox.prop({ checked: false });
			expect(checkbox).not.toBeChecked();
			expect(checkbox[0]).not.toBeChecked();
		});

		it("should define toBeEmpty", function () {
			var div = this.tag("div");
			expect(div).toBeEmpty();
			expect(div[0]).toBeEmpty();
			div.text("test");
			expect(div).not.toBeEmpty();
			expect(div[0]).not.toBeEmpty();
		});

		it("should define toExist", function () {
			var div = this.tag("div");
			var doesntExist = $(".doesnt-exist");
			expect(div).toExist();
			expect(div[0]).toExist();
			expect(doesntExist).not.toExist();
		});

		it("should define toHaveAttr", function () {
			var div = this.tag("div").attr({ test: "this" });
			expect(div).toHaveAttr("test");
			expect(div).toHaveAttr("test", "this");
			expect(div[0]).toHaveAttr("test");
			expect(div[0]).toHaveAttr("test", "this");
			expect(div).not.toHaveAttr("that");
			expect(div).not.toHaveAttr("test", "that");
			expect(div[0]).not.toHaveAttr("that");
			expect(div[0]).not.toHaveAttr("test", "that");
		});

		it("should define toHaveId", function () {
			var div = this.tag("div");
			expect(div).not.toHaveId("test");
			expect(div[0]).not.toHaveId("test");
			div.attr({ id: "test" });
			expect(div).toHaveId("test");
			expect(div[0]).toHaveId("test");
			expect(div).not.toHaveId("invalid");
			expect(div[0]).not.toHaveId("invalid");
		});

		it("should define toHaveHtml", function () {
			var div = this.tag("div").html("<div></div>");
			expect(div).toHaveHtml("<div></div>");
			expect(div[0]).toHaveHtml("<div></div>");
			expect(div).not.toHaveHtml("<span></span>");
			expect(div[0]).not.toHaveHtml("<span></span>");
		});

		it("should define toHaveText", function () {
			var div = this.tag("div").text("test");
			expect(div).toHaveText("test");
			expect(div[0]).toHaveText("test");
			expect(div).not.toHaveText("invalid");
			expect(div[0]).not.toHaveText("invalid");
		});

		it("should define toHaveValue", function () {
			var input = this.tag("input").val("test");
			expect(input).toHaveValue("test");
			expect(input[0]).toHaveValue("test");
			expect(input).not.toHaveValue("invalid");
			expect(input[0]).not.toHaveValue("invalid");
		});

		it("should define toHaveData", function () {
			var div = this.tag("div");
			div[0].dataset = { test: "this" };
			div.data({ test: "this" });
			expect(div).toHaveData("test");
			expect(div).toHaveData("test", "this");

			// The next two tests will fail if you use div.data({test: "this"})
			// because jQuery does not save the data in dataset on the element
			expect(div[0]).toHaveData("test");
			expect(div[0]).toHaveData("test", "this");
			expect(div).not.toHaveData("that");
			expect(div).not.toHaveData("test", "that");
			expect(div[0]).not.toHaveData("that");
			expect(div[0]).not.toHaveData("test", "that");
		});

		it("should define toMatchSelector", function () {
			var div = this.tag("div").addClass("test");
			expect(div).toMatchSelector(".test");
			expect(div[0]).toMatchSelector(".test");
			expect(div).not.toMatchSelector(".invalid");
			expect(div[0]).not.toMatchSelector(".invalid");
		});

		it("should define toContain", function () {
			var divNotIn = this.tag("div").addClass("test");
			var divInner = this.tag("div").addClass("test");
			var div = this.tag("div").append(divInner);
			expect(div).toContain(divInner);
			expect(div).toContain(".test");
			expect(div[0]).toContain(divInner[0]);
			expect(div[0]).toContain(".test");
			expect(div).not.toContain(divNotIn);
			expect(div).not.toContain(".invalid");
			expect(div[0]).not.toContain(divNotIn[0]);
			expect(div[0]).not.toContain(".invalid");
		});

		it("should define toBeDisabled", function () {
			var input = this.tag("input").prop({ disabled: true });
			expect(input).toBeDisabled();
			expect(input[0]).toBeDisabled();
			input.prop({ disabled: false });
			expect(input).not.toBeDisabled();
			expect(input[0]).not.toBeDisabled();
		});

		it("should define toHandle", function () {
			var div = this.tag("div");
			expect(div).not.toHandle("click");

			// don't ask me why they check .data("events");
			div.data({ events: { "click": [function () {}] } });
			expect(div).toHandle("click");
		});

		it("should define toHandleWith", function () {
			var fn = function () {};
			var div = this.tag("div");
			expect(div).not.toHandle("click", fn);

			// don't ask me why they check .data("events");
			div.data({ events: { "click": [fn] } });
			expect(div).toHandle("click", fn);
		});
	});
});
