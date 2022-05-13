const HTMLFlipCardElementTemplate = document.createElement('template');
HTMLFlipCardElementTemplate.innerHTML = `
<div class="flip-card" id="flipCard">
	<span class="top top-back">
		<span digit="next"></span>
	</span>
	<span class="top top-front">
		<span digit="current"></span>
	</span>
	<span class="bottom-back">
		<span digit="current"></span>
	</span>
	<span class="bottom-front">
		<span digit="next"></span>
	</span>
</div>
<style>
:host{
	--animation-time: var(--flip-card-animation-time, 0.5s);
	--perspective: var(--flip-card-perspective, 600px);
}

.flip-card{
	width: 1em;
	height: 1.142857em;
	margin: 0.08em;
	--border-width: 0.01em;
	--border-radius: 0.15em;
	border-radius: var(--border-radius);
	text-align: center;
	position: relative;
	pointer-events: none;
	box-shadow: 0 3px 4px 0 rgba(0, 0, 0, .2),inset 2px 4px 0 0 rgba(255, 255, 255, .08);
}
.flip-card>*{
	overflow: hidden;
	position: absolute;
	width: 100%;
	height: 50%;
	background-color: white;
	left: 0px;
	border: var(--border-width) solid grey;
}
.flip-card>.top{
	border-radius: var(--border-radius) var(--border-radius) 0 0;
	border-bottom: var(--border-width) solid lightgrey;
	transform-origin: bottom center;
}
.flip-card>.bottom-front{
	border-radius: 0 0 var(--border-radius) var(--border-radius);
	top: calc(50% + 1px);
	height: calc(50% - 1px);
	transform-origin: top center;
	border-top: none;
}
.flip-card>.bottom-front>*{
	position: relative;
	display: block;
	transform: translate(0,calc(-50% - 1px));
}
.top-back{
	z-index: 5;
}
.bottom-back{
	z-index: 2;
	pointer-events: auto;
}
.top-front,
.bottom-front{
	z-index: 7;
}
.flip-card>.bottom-back{
	border-radius: var(--border-radius);
	top:0px;/*calc(-1 * var(--border-width));*/
	transform-origin: bottom center;
	height: 100%
}
.flip-card>.top-front{
	height:calc(50%);
	border-bottom: none;
}
.flip-card>.bottom-back>*{
	transform: translate(0,1px);
}
.flip-card>.bottom-front{
	transform: perspective(var(--perspective)) rotateX(90deg);
	top: calc(50% + 2px);
	height:calc(50% - 2px);
}
.flip-card.flip>.top-front{
	animation: flip-top var(--animation-time) linear;
}
.flip-card.flip>.bottom-front{
	animation: flip-bottom var(--animation-time) linear;
}
.flip-card:not(.flip)>:where(.top-front, .bottom-front){
	opacity: 0;
}
@keyframes flip-top {
	0%{
		transform: perspective(var(--perspective)) rotateX(0deg);
	}
	50%{
		transform: perspective(var(--perspective)) rotateX(-90deg);
	}
	100%{
		transform: perspective(var(--perspective)) rotateX(-90deg);
	}
}
@keyframes flip-bottom {
	0%{
		transform: perspective(var(--perspective)) rotateX(90deg);
	}
	50%{
		transform: perspective(var(--perspective)) rotateX(90deg);
	}
	100%{
		transform: perspective(var(--perspective)) rotateX(0deg);
	}
}
</style>
`


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
		var next = element.querySelectorAll("[digit=\"next\"]")
		next.forEach(el=>{
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
customElements.define('flip-card-', HTMLFlipCardElementElement);
