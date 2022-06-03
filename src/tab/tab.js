const HTMLTabContainerElementTemplate = document.createElement('template');
HTMLTabContainerElementTemplate.innerHTML = `
<div part="tab"></div>
<div>
	<slot></slot>
</div>
<style>
:host{
	background-color: white;
	display:flex;
	flex-direction: column
}
:host>div:nth-of-type(1){
	display:flex;
	flex-wrap:wrap;
}
/*:host>div:nth-of-type(1)>button{
}*/
:host>div:nth-of-type(2){
	height:max-height;
}
</style>
`

class HTMLTabContainerElement extends HTMLElement {
	#size;
	#shadowRoot;
	#tabContents;
	#tabButtons;
	#tabCounter;
	constructor() {
		super();

		this.Tabs = new Dictionary();
		
		this.#size = 0;
		
		this.#shadowRoot = this.attachShadow({mode: 'open'});
		
		this.#shadowRoot.appendChild(HTMLTabContainerElementTemplate.content.cloneNode(true));
		
		this.#tabContents = this.#shadowRoot.children[1];
		this.#tabButtons = this.#shadowRoot.children[0];

		this.#tabCounter = 0;
		
		for (var i = 0; i < this.children.length; i++){
			this.#addTab(this.children[i]);
		}
		var observer = new MutationObserver(function(mutations) {
			mutations.forEach(function(mutation) {
				if (mutation.addedNodes.length){
					mutation.addedNodes.forEach(function(Node){
						this.#addTab(Node);
					})
				}
				if (mutation.removedNodes.length){
					mutation.addedNodes.forEach(function(Node){
						this.#removeTab(Node);
					})
				}
			})
		});
		observer.observe(this, { childList: true })
	}
	#addTab(tabElement){
		if ((tabElement.tagName == "TAB-") && (tabElement.parentElement == this)){
			var tabTitle = tabElement.getAttribute("Title") || "Tab"+this.#tabCounter;
			this.Tabs(tabTitle,tabElement);
			this.#tabCounter++;
			var btn = document.createElement("button");
			btn.textContent = tabTitle;
			console.log(tabTitle)
			this.#tabButtons.appendChild(btn);
		}else{
			console.group("ERROR")
			console.dir(tabElement)
			console.error("not a valid tab element for this container.")
			console.groupEnd()
		}
	}
	
}
customElements.define('tab-container-', HTMLTabContainerElement);






const HTMLTabElementTemplate = document.createElement('template');
HTMLTabElementTemplate.innerHTML = `
<style>
:host:is(*[hidden]){
	display: none !important;
}
:host{
	background-color: white;
	padding: 1em;
}
</style>
`
class HTMLTabElement extends HTMLElement {
	#shadowRoot;
	constructor() {
		super();
		this.#shadowRoot = this.attachShadow({mode: 'closed'});
		this.#shadowRoot.appendChild(HTMLTabElementTemplate.content.cloneNode(true));
	}
}
customElements.define('tab-', HTMLTabElement);
