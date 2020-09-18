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
		if(document.readyState === "complete") this.initializeSVGDocuments();
		else window.addEventListener("load", (event) => {this.initializeSVGDocuments();})
		this.addFragmentEventListeners();
	}

	initializeSVGDocuments(){
		this.injectSVGStylesheet();
		this.updateSVGFragments();
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

	updateSVGFragments(){
		document.querySelectorAll(`.${SVGFragmentClass}`).forEach(
			(element) => {
				let fragment = new SVGFragment(element);
				fragment.update()
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
