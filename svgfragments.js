"use strict";

const fragmentEvents = ["fragmentshown", "fragmenthidden"];
const fragmentSelector = ".fragment";
const objectSelector = 'object[type="image/svg+xml"]';
const SVGStylesheet = "plugin/svgfragments/svgfragments.css";


// SVG fragment class
//
//   SVG fragment instance comprised of one HTML and one SVG element whose
//   class attributes should be kept in sync. The fragment class encapsulates
//   and facilitates this duality.
//
class SVGFragment{

	// HTML element
	HTMLElement = null;

	// SVG element initial class attribute
	SVGClassName = null;

	// Class constructor
	constructor(HTMLElement){
		this.HTMLElement = HTMLElement;
		this.SVGClassName = this.SVGElement.className.baseVal;     // N.b. SVGAnimatedString (https://developer.mozilla.org/en-US/docs/Web/API/Element/className#Notes)
	}

	// SVG document
	get SVGDocument(){
		return this.HTMLElement.closest(objectSelector).contentDocument;
	}

	// SVG selector
	get SVGSelector(){
		return this.HTMLElement.dataset.selector;
	}

	// SVG element
	get SVGElement(){
		// N.b. 
		//   * First match only
		return this.SVGDocument.querySelector(this.SVGSelector);
	}

	// Synchronize class attributes
	sync(){
		this.SVGElement.className.baseVal = this.SVGClassName + " " + this.HTMLElement.className;
	}

}


// Plugin class
class SVGFragmentsPlugin{

	// SVGFragment instance array
	SVGFragments = [];

	// Plugin [ID](https://revealjs.com/creating-plugins/#plugin-definition)
	id = "SVGFragments";

	// Plugin class constructor
	constructor(){}

	// Plugin [initialization function](https://revealjs.com/creating-plugins/#plugin-definition)
	init(reveal){

		// HTML dependent initializations
		this.initHTMLDependent();

		// Add [fragment event](https://revealjs.com/fragments/#events) listeners
		this.addFragmentEventListeners();

	}

	// HTML dependent initializations
	initHTMLDependent(){

		// DOM dependent initializations
		let onDOMContentLoaded = (event) => {

			// SVG dependent initializations
			this.initSVGDependent();

		};

		// DOM state handling
		switch(document.readyState){
			case "loading":
				document.addEventListener("DOMContentLoaded", onDOMContentLoaded);
				break;
			case "interactive":
			case "complete":
				onDOMContentLoaded(null);
		}

	}

	// SVG  dependent initializations
	initSVGDependent(){

		// SVG DOM dependent initializations
		let onload = (event) => {

			// Inject SVG stylesheet
			this.injectSVGStylesheet(event.target);

			// Add SVGFragments
			this.addSVGFragments(event.target);

		}

		// SVG DOM state handling
		//
		//   Despite SVG document.readyState === "complete", SVG DOM does not seem to have
		//   been parsed. Have to instead wait for SVG window.load event to ensure DOM parsing.
		//   To ensure window.load has not yet been dispatched however, usually inspect 
		//   document.readyState, however this will probably just show "complete"! As such,
		//   can only rely on DOM access success/failure to detect SVG DOM parsing state.
		//
		let onSVGDocument = (event) => {
			let objElement = event.target;
			let SVGDocument = objElement.contentDocument;
			let SVGWindow = objElement.contentWindow;
			if(SVGDocument.documentElement.tagName.toLowerCase() !== "svg") SVGWindow.addEventListener("load", (event) => onload({target: objElement}));
			else onload({target: objElement});
		}

		// SVG document state handling
		//
		//   N.b. Acts on __ALL__ SVG documents in HTML document
		//
		document.querySelectorAll(objectSelector).forEach(
			(element) => {
				if(!element.contentDocument) element.addEventListener("load", onSVGDocument);
				else onSVGDocument({target: element});
			}
		);

	}

	// Inject SVG stylesheet
	injectSVGStylesheet(objElement){
		let SVGDocument = objElement.contentDocument;
		let piNode = SVGDocument.createProcessingInstruction(
			"xml-stylesheet",
			`type="text/css" href="${document.location.pathname}${SVGStylesheet}"`
		);
		SVGDocument.insertBefore(piNode, SVGDocument.documentElement);
	}

	// Add SVGFragment instances to SVGFragments array
	addSVGFragments(objElement){
		objElement.querySelectorAll(`${objectSelector} ${fragmentSelector}`).forEach(
			(element) => {
				let fragment = new SVGFragment(element);
				if(element.parentElement === objElement) fragment.sync();                // Sync top-level fragments only
				this.SVGFragments.push(fragment);
			}
		);
	}

	// Add fragment event listeners
	addFragmentEventListeners(){

		// Fragment event handler
		let onFragmentEvent = (event) => {

			let HTMLFragments = event.fragments;
			this.SVGFragments.filter(
				(SVGFragment_) => HTMLFragments.includes(SVGFragment_.HTMLElement)
			).forEach(
				(SVGFragment_) => SVGFragment_.sync()
			);

		};

		// Add fragmentEvent listeners
		for(let fragmentEvent of fragmentEvents) Reveal.on(fragmentEvent, onFragmentEvent);

	}

}


const SVGFragments = () => {return new SVGFragmentsPlugin();}
