"use strict";

const fragmentEvents = ["fragmentshown", "fragmenthidden"];
const SVGFragmentClass = "svg-fragment";

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
		if(document.readyState === "complete") this.initializeSVGFragments();
		else window.addEventListener("load", (event) => {this.initializeSVGFragments();})
		this.addFragmentEventListeners();
	}

	initializeSVGFragments(){
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
