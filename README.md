# Tippy AngularJS

AngularJS (v1) directive for [Tippy.js](https://github.com/atomiks/tippyjs) 3.

## Installation

```
npm i tippy-angularjs
```

## Usage

Place a `<tippy>` as a child of the element it describes.

```js
import tippyAngular from 'tippy-angularjs'
import 'tippy.js/dist/tippy.css'

angular.module('app', [tippyAngular])
```

```html
<button>
  Increment
  <tippy>add one to the count</tippy>
</button>
```

## Native Attributes

The majority of options listed on the [All Options](https://atomiks.github.io/tippyjs/all-options/) page have been implemented.

Please ensure you pass them as kebab case. For example, `arrowType` should be implemented as:

```html
<tippy arrow-type="sharp">description</tippy>
```

AngularJS provides a few ways for defining attributes. Please see the following table to understand how to properly set attributes.

| Type | Binding | Example |
| ---- | ------- | ------- |
| `boolean` | `<` one way | `interactive="true"` <br> `interactive="$ctrl.value"` |
| `object` | `<` one way | `popper-options="{ eventsEnabled: true }"` <br> `popper-options="$ctrl.options"` |
| `number` | `@` text | `distance="10"` <br> `distance="{{ $ctrl.value }}"` |
| `string` | `@` text | `arrow-type="sharp"` <br> `arrow-type="{{ $ctrl.value }}"` |
| `number, string` | `@` text | `max-width="350"` <br> `max-width="350px"` <br> `max-width="{{ $ctrl.maxWidth }}"` |
| `number, number[]` | `@` text | `duration="100"` <br> `duration="100 250"` <br> `duration="{{ $ctrl.duration[0] }} {{ $ctrl.duration[1] }}"` |
| `string, string[]` | `@` text | `flip-behavior="flip"` <br> `flip-behavior="top bottom"` <br> `flip-behavior="{{ $ctrl.valueX }} {{ $ctrl.valueY }}"` |
| `Function` | `&` expression | `on-hide="$ctrl.log('hide')"` |


## AngularJS Specific Attributes

| Directive | Binding | Description |
|-----------|---------|---------|
| `class` | `@` text | Applys a class to the content wrapper `div`. <br><br> `class="block__element--modifier"` |
| `on-create` | `&` expression | Is executed when the instance is created. `$instance` is avaiable to get a reference to the current instance. <br><br> `on-create="$ctrl.log($instance)"` |

### Unimplemented Attributes

- `allow-html`
- `append-to`
- `append-to`
- `boundary`
- `follow-cursor`
- `hide-on-click`
- `should-popper-hide-on-blur`
- `wait`