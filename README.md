# SVGFragments

A [reveal.js](https://github.com/hakimel/reveal.js) plugin to enable SVG element [fragments](https://revealjs.com/fragments/).

[Live demo](https://marceloalcocer.github.io/svgfragments.html)

## Installation

Copy the repository to the `plugin` directory of your `reveal.js` installation;

```shell
reveal.js/plugin $  wget https://github.com/marceloalcocer/reveal-svgfragments/archive/master.zip
reveal.js/plugin $  unzip master.zip && rm master.zip
reveal.js/plugin $  mv reveal-svgfragments-master svgfragments
reveal.js/plugin $
reveal.js/plugin $  # …or perhaps…
reveal.js/plugin $
reveal.js/plugin $  git clone https://github.com/marceloalcocer/reveal-svgfragments.git svgfragments
```

Include `svgfragments.js` in the presentation (after `reveal.js`), and add `SVGFragments` to the `plugins` array when initializing `Reveal`;

```html
<script src="dist/reveal.js"></script>
<script src="plugin/svgfragments/svgfragments.js"></script>
<script>
  Reveal.initialize({
    plugins: [ SVGFragments ]
  });
</script>
```

## Usage

Include SVG documents in the presentation using `<object>` tags.  Add child tags with `class="fragment"` to mark elements within the SVG file as fragments. Elements are specified using [CSS selectors](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Selectors) in the `data-selector` attribute;

```svg
<!-- circles.svg -->
<svg>
  <circle id="circle0" r="10.0" cy="10.0" cx="0.0" />
  <circle id="circle1" r="10.0" cy="10.0" cx="20.0" />
  <circle id="circle2" r="10.0" cy="10.0" cx="40.0" />
</svg>
```

```html
<!-- presentation.html -->
<object data="circles.svg" type="image/svg+xml">
  <span class="fragment" data-selector="#circle1"></span>
</object>
```

[Fragment effects](https://revealjs.com/fragments/), [nested fragments](https://revealjs.com/fragments/#nested-fragments), and [fragment indices](https://revealjs.com/fragments/#fragment-order) can be used as normal;

```html
<!-- presentation.html -->
<object data="circles.svg" type="image/svg+xml">
  <span class="fragment fade-in" data-fragment-index="2" data-selector="#circle0">
    <span class="fragment fade-out" data-fragment-index="3" data-selector="#circle0"></span>
  </span>
  <span class="fragment fade-up" data-fragment-index="1" data-selector="#circle1"></span>
  <span class="fragment fade-down" data-fragment-index="4" data-selector="#circle2"></span>
</object>
```

Some fragment effects (e.g. highlights) may however not apply correctly to SVG elements.

