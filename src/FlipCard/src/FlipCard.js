class HTMLFlipCardElementElement extends HTMLElement {
	#shadowRoot;
	constructor() {
		super();
		this.#shadowRoot = this.attachShadow({mode: 'closed'});
		this.#shadowRoot.appendChild(HTMLFlipCardElementTemplate.content.cloneNode(true));
		this.#shadowRoot.querySelectorAll("[digit=\"current\"],[digit=\"next\"]").forEach(el=>{
			el.textContent = this.textContent;
		});

		new MutationObserver((mutationsList, observer) => {
			if(this.textContent.includes("\n")){// this is needed otherwise it fires the event even
				this.textContent = this.textContent.replaceAll("\n","");// when there is no newlines
			}
			if (this.#shouldFlip()){this.flip()}
		}).observe(this, { characterData: true,subtree:true,childList:true });
	}
	#shouldFlip(){
		return (
			this.textContent !=
			this.#shadowRoot.getElementById("flipCard")
				.querySelectorAll("[digit=\"next\"]")[0].textContent
		);
	}
	flip(){
		this.normalize();
		var element = this.#shadowRoot.getElementById("flipCard");
		element.querySelectorAll("[digit=\"next\"]").forEach(el=>{
			el.textContent = this.textContent;
		})
		element.classList.add("flip");
		element.addEventListener('animationend', (e) => {
			if (e.target.parentElement.classList.contains("flip")){
				e.target.parentElement.classList.remove("flip");
				e.target.parentElement.querySelectorAll("[digit=\"current\"]").forEach(el=>{
					el.textContent = e.target.parentElement.querySelectorAll("[digit=\"next\"]")[0].textContent;
				})
			}
		});
	}
	changeNoFlip(changeTo){
		this.#shadowRoot.getElementById("flipCard")
		.querySelectorAll("[digit=\"next\"],[digit=\"current\"]")
		.forEach(el=>{
			el.textContent = changeTo;
		})
		this.textContent = changeTo;
	}
}