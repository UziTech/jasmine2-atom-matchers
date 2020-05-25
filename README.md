[![Actions Status](https://github.com/UziTech/jasmine2-atom-matchers/workflows/CI/badge.svg)](https://github.com/UziTech/jasmine2-atom-matchers/actions)

# Jasmine 2.x-3.x Atom Matchers

This will add the matchers from Atom for Jasmine 2.x or 3.x

# install

```sh
npm install --save-dev jasmine2-atom-matchers
```

```js
// in your jasmine helpers.js
require("jasmine2-atom-matchers")
```

# Matchers

## toBeInstanceOf(Class)

Matches if expected is an instance of Class

## toHaveLength(length)

Matches if expected.length === length

## toExistOnDisk()

Matches if expected path exists

## toHaveFocus()

Matches if expected element has focus

## toShow()

Matches if expected element is not `display: none;`

## toEqualPath(path)

Matches if normalized expected path === normalized path

## toHaveClass(className)

Matches if $(element).hasClass(className)

## toBeVisible()

Matches if $(element).is(":visible")

## toBeHidden()

Matches if $(element).is(":hidden")

## toBeSelected()

Matches if $(element).is(":selected")

## toBeChecked()

Matches if $(element).is(":checked")

## toBeEmpty()

Matches if $(element).is(":empty")

## toBeDisabled()

Matches if $(element).is(":disabled")

## toExist()

Matches if $(element).length > 0

## toHaveAttr(attrName[, attrValue])

Matches if $(element).attr(attrName) !== undefined and optionally $(element).attr(attrName) === attrValue

## toHaveId(id)

Matches if $(element).attr("id") === id

## toHaveHtml(html)

Matches if $(element).html() === html

## toHaveText(text)

Matches if $(element).text() === text

## toHaveValue(value)

Matches if $(element).val() === value

## toHaveData(dataKey[, dataValue])

Matches if $(element).data(dataKey) !== undefined and optionally $(element).data(dataKey) === dataValue

## toMatchSelector(selector)

Matches if $(element).is(selector)

## toContain(element|selector)

Matches if $(element).find(element|selector).length > 0

## toHandle(eventName)

Matches if $(element).on(eventName)

## toHandleWith(eventName, eventHandler)

Matches if $(element).on(eventName, eventHandler)
