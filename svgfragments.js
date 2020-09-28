"use strict";

const fragmentEvents = ["fragmentshown", "fragmenthidden"];
const fragmentClass = "fragment";
const SVGFragmentClass = "svg-fragment";
const SVGStylesheet = "/plugin/svgfragments/svgfragments.css";


// SVG fragment class
//
//   SVG fragment instance comprised of one HTML and one SVG element whose
//   class attributes should be kept in sync. The fragment class encapsulates
//   and facilitates this duality.
//
class SVGFragment{

	// HTML element
	HTMLElement = null;

	// Class constructor
	constructor(HTMLElement){
		this.HTMLElement = HTMLElement;
	}

	// SVG document
	get SVGDocument(){
		return this.HTMLElement.closest('object[type="image/svg+xml"]').contentDocument;
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
	//
	//   N.b.
	//     * Overwrites any previous class attributes
	//     * Leaves unused SVGFragmentClass
	//
	update(){
		this.SVGElement.classList = this.HTMLElement.classList;
	}

}


// Plugin class
class SVGFragmentsPlugin{

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

			// Add '.fragment' to '.svg-fragment' elements
			this.addFragmentClasses();

			// Register new fragments with reveal.js
			this.syncFragments();

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

	// Add '.fragment' to '.svg-fragment' elements
	addFragmentClasses(){
		document.querySelectorAll(`.${SVGFragmentClass}`).forEach(
			(element) => element.classList.add(fragmentClass)
		);
	}

	// Register new fragments with reveal.js
	syncFragments(){
		if(Reveal.isReady()) Reveal.syncFragments();
		else Reveal.on("ready", (event) => Reveal.syncFragments());
	}

	// SVG  dependent initializations
	initSVGDependent(){

		// SVG DOM dependent initializations
		let onload = (event) => {

			// Inject SVG stylesheet
			this.injectSVGStylesheet(event.target);

			// Set initial classes
			this.updateSVGClasses(event.target);

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
		document.querySelectorAll('object[type="image/svg+xml"]').forEach(
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
			`type="text/css" href="${SVGStylesheet}"`
		);
		SVGDocument.insertBefore(piNode, SVGDocument.documentElement);
	}

	// Set initial classes
	//
	//   N.b. If nested, only need to set for top-level fragments
	//
	updateSVGClasses(objElement){
		objElement.querySelectorAll(`object>.${SVGFragmentClass}`).forEach(
			(element) => { new SVGFragment(element).update(); }
		);
	}

	// Add fragment event listeners
	addFragmentEventListeners(){
		for(let fragmentEvent of fragmentEvents){
			Reveal.on(
				fragmentEvent,
				(event) => {
					for(let fragment of event.fragments){
						if (fragment.matches(`.${SVGFragmentClass}`)) new SVGFragment(fragment).update();
					}
				}
			);
		}
	}

}


const SVGFragments = () => {return new SVGFragmentsPlugin();}
