# SVGFragments

A [reval.js](https://github.com/hakimel/reveal.js) plugin to enable SVG element [fragments](https://revealjs.com/fragments/).

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

Include `svgfragments.js` in the presenation (after `reveal.js`), and add `SVGFragments` to the `plugins` array when initializing `Reveal`;

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

Include SVG documents in the presentation using `<object>` tags.  Add child tags with `class="svg-fragment"` to mark elements within the SVG file as fragments. Elements are specified using [CSS selectors](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Selectors) in the `data-selector` attribute;

```svg
<!-- circles.svg -->
<svg>
  <circle id="circle0" r="10.0" cy="10.0" cx="0.0" />
  <circle id="circle1" r="10.0" cy="10.0" cx="20.0" />
  <circle id="circle2" r="10.0" cy="10.0" cx="40.0" />
</svg>
```

```html
<object data="circles.svg" type="image/svg+xml">
  <span class="svg-fragment" data-selector="#circle1"></span>
</object>
```

[Fragment effects](https://revealjs.com/fragments/) and [indices](https://revealjs.com/fragments/#fragment-order) can be added as normal;

```html
<object data="circles.svg" type="image/svg+xml">
  <span class="svg-fragment fade-in" data-fragment-index="2" data-selector="#circle0"></span>
  <span class="svg-fragment fade-up" data-fragment-index="1" data-selector="#circle1"></span>
  <span class="svg-fragment fade-down" data-fragment-index="3" data-selector="#circle2"></span>
</object>
```

however, highlight effects are not applied to SVG elements correctly.

[Nested fragments](https://revealjs.com/fragments/#nested-fragments) are currently not supported.

