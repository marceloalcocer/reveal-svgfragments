"use strict";

const fragmentEvents = ["fragmentshown", "fragmenthidden"];
const fragmentClass = "fragment";
const SVGFragmentClass = "svg-fragment";
const SVGStylesheet = "/plugin/svgfragments/svgfragments.css";


class SVGFragment{

	HTMLElement = null;

	constructor(HTMLElement){
		this.HTMLElement = HTMLElement;
	}

	get SVGDocument(){
		return this.HTMLElement.parentElement.contentDocument;
	}

	get SVGSelector(){
		return this.HTMLElement.dataset.selector;
	}

	get SVGElement(){
		// N.b. 
		//   * First match only
		return this.SVGDocument.querySelector(this.SVGSelector);
	}

	update(){
		// N.b.
		//   * Overwrites any previous class entries
		//   * Leaves unused SVGFragmentClass
		this.SVGElement.classList = this.HTMLElement.classList;
	}

}


class SVGFragmentsPlugin{

	id = "SVGFragments";

	constructor(){}

	init(reveal){
		this.initHTMLDependent();
		this.addFragmentEventListeners();
	}

	initHTMLDependent(){
		let onDOMContentLoaded = (event) => {
			this.initSVGDependent();
			this.addFragmentClasses();
			this.syncFragments();
		};
		switch(document.readyState){
			case "loading":
				document.addEventListener("DOMContentLoaded", onDOMContentLoaded);
				break;
			case "interactive":
			case "complete":
				onDOMContentLoaded(null);
		}
	}

	addFragmentClasses(){
		document.querySelectorAll(`.${SVGFragmentClass}`).forEach(
			(element) => element.classList.add(fragmentClass)
		);
	}

	syncFragments(){
		if(Reveal.isReady()) Reveal.syncFragments();
		else Reveal.on("ready", (event) => Reveal.syncFragments());
	}

	initSVGDependent(){
		let onload = (event) => {
			this.injectSVGStylesheet(event.target);
			this.updateSVGClasses(event.target);
		}
		let onSVGDocument = (event) => {
			// Despite SVG document.readyState === "complete", SVG DOM does not seem to have
			// been parsed. Have to instead wait for SVG window.load event to ensure DOM parsing.
			// To ensure window.load has not yet been dispatched however, usually inspect 
			// document.readyState, however this will probably just show "complete"! As such,
			// can only rely on DOM access success/failure to detect SVG DOM parsing state.
			let objElement = event.target;
			let SVGDocument = objElement.contentDocument;
			let SVGWindow = objElement.contentWindow;
			if(SVGDocument.documentElement.tagName.toLowerCase() !== "svg") SVGWindow.addEventListener("load", (event) => onload({target: objElement}));
			else onload({target: objElement});
		}
		// N.b
		//   * Acts on __ALL__ SVG documents in HTML document
		document.querySelectorAll('object[type="image/svg+xml"]').forEach(
			(element) => {
				if(!element.contentDocument) element.addEventListener("load", onSVGDocument);
				else onSVGDocument({target: element});
			}
		);
	}

	injectSVGStylesheet(objElement){
		let SVGDocument = objElement.contentDocument;
		let piNode = SVGDocument.createProcessingInstruction(
			"xml-stylesheet",
			`type="text/css" href="${SVGStylesheet}"`
		);
		SVGDocument.insertBefore(piNode, SVGDocument.documentElement);
	}

	updateSVGClasses(objElement){
		objElement.querySelectorAll(`.${SVGFragmentClass}`).forEach(
			(element) => {
				let fragment = new SVGFragment(element);
				fragment.update();
			}
		);
	}

	addFragmentEventListeners(){
		for(let fragmentEvent of fragmentEvents){
			Reveal.on(
				fragmentEvent,
				(event) => {
					if (event.fragment.matches(`.${SVGFragmentClass}`)){
						let fragment = new SVGFragment(event.fragment);
						fragment.update();
					}
				}
			);
		}
	}

}


const SVGFragments = () => {return new SVGFragmentsPlugin();}
