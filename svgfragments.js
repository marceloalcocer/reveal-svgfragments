"use strict";

const fragmentEvents = ["fragmentshown", "fragmenthidden"];
const SVGFragmentClass = "svg-fragment";
const SVGStylesheet = "/plugin/svgfragments/svgfragments.css";

class Fragment{

	HTMLElement = null;

	constructor(HTMLElement){
		this.HTMLElement = HTMLElement;
	}

	get isSVGFragment(){
		return this.HTMLElement.matches(`.${SVGFragmentClass}`);
	}

	SVGAssertWrapper(fun){
		let ret = null;
		if(this.isSVGFragment) ret = fun();
		return ret;
	}

	get SVGDocument(){
		return this.SVGAssertWrapper(
			() => this.HTMLElement.parentElement.contentDocument
		);
	}

	get SVGSelector(){
		return this.SVGAssertWrapper(
			() => this.HTMLElement.dataset.selector
		);
	}

	get SVGElement(){
		return this.SVGAssertWrapper(
			// N.b. 
			//   * First match only
			() => this.SVGDocument.querySelector(this.SVGSelector)
		);
	}

	syncClasses(){
		this.SVGAssertWrapper(
			// N.b.
			//   * Overwrites any previous class entries
			//   * Leaves unused SVGFragmentClass
			() => {this.SVGElement.classList = this.HTMLElement.classList;}
		)
	}

}

class SVGFragmentsPlugin{

	id = "SVGFragments";

	constructor(){}

	init(reveal){
		if(document.readyState === "complete") this.initializeSVGDocuments();
		else window.addEventListener("load", (event) => {this.initializeSVGDocuments();})
		this.addFragmentEventListeners();
	}

	initializeSVGDocuments(){
		this.injectSVGStylesheet();
		this.syncSVGFragmentClasses();
	}

	injectSVGStylesheet(){
		// N.b
		//   * Injects stylehseet into all SVG documents in HTML document
		document.querySelectorAll('object[type="image/svg+xml"]').forEach(
			(element) => {
				let SVGDocument = element.contentDocument;
				let piNode = SVGDocument.createProcessingInstruction(
					"xml-stylesheet",
					`type="text/css" href="${SVGStylesheet}"`
				);
				SVGDocument.insertBefore(piNode, SVGDocument.documentElement);
			}
		)
	}

	syncSVGFragmentClasses(){
		document.querySelectorAll(`.${SVGFragmentClass}`).forEach(
			(element) => {new Fragment(element).syncClasses();}
		);
	}

	addFragmentEventListeners(){
		for(let fragmentEvent of fragmentEvents){
			Reveal.on(
				fragmentEvent,
				(event) => {new Fragment(event.fragment).syncClasses();}
			);
		}
	}

}

const SVGFragments = () => {return new SVGFragmentsPlugin();}
