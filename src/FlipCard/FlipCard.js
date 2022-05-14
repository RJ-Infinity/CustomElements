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
	width: 1em;
	height: 1.142857em;
	margin: 0.08em;
}

.flip-card{
	--d-flip-card-animation-time: 0.5s;
	--d-flip-card-perspective: 600px;
	--d-flip-card-split-style: solid;
	--d-flip-card-split-colour: lightgrey;
	--d-flip-card-radius: 0.15em;
	--d-flip-card-background-top: white;
	--d-flip-card-background-bottom: white;
	--d-flip-card-background-full: white;
	--d-flip-card-box-shadow: 0 3px 4px 0 rgba(0, 0, 0, .2);

	--d-animation-time: var(--d-flip-card-animation-time);
	--d-perspective: var(--d-flip-card-perspective);
	--d-split-border: var(--d-flip-card-split-style) var(--d-flip-card-split-colour);
	--d-border-radius: var(--d-flip-card-radius);
	--d-background-top: var(--d-flip-card-background-top);
	--d-background-bottom: var(--d-flip-card-background-bottom);
	--d-background-full: var(--d-flip-card-background-full);
	--d-box-shadow: var(--d-flip-card-box-shadow);

	--animation-time: var(--flip-card-animation-time, var(--d-flip-card-animation-time));
	--perspective: var(--flip-card-perspective, var(--d-flip-card-perspective));
	--split-border: var(--flip-card-split-style, var(--d-flip-card-split-style)) var(--flip-card-split-colour, var(--d-flip-card-split-colour));
	--border-radius: var(--flip-card-radius, var(--d-flip-card-radius));
	--background-top: var(--flip-card-background-top,var(--d-flip-card-background-top));
	--background-bottom: var(--flip-card-background-bottom,var(--d-flip-card-background-bottom));
	--background-full: var(--flip-card-background-full,var(--d-flip-card-background-full));
	--box-shadow: var(--flip-card-box-shadow,var(--d-flip-card-box-shadow));

	width: 100%;
	height: 100%;
	--border-width: 0.01em;
	border-radius: var(--border-radius, var(--d-border-radius));
	text-align: center;
	position: relative;
	pointer-events: none;
	box-shadow: var(--box-shadow,var(--d-box-shadow));
}
.flip-card>*{
	overflow: hidden;
	position: absolute;
	width: 100%;
	height: 50%;
	background-color: white;
	left: 0px;
	border: var(--border-width, var(--d-border-width)) solid grey;
}
.flip-card>*>*{
	white-space: nowrap;
}
.flip-card>.top{
	border-radius: var(--border-radius,var(--d-border-radius)) var(--border-radius,var(--d-border-radius)) 0 0;
	border-bottom: var(--border-width,var(--d-border-width)) var(--split-border,var(--d-split-border));
	transform-origin: bottom center;
	background: var(--background-top,var(--d-background-top));
}
.flip-card>.bottom-front{
	border-radius: 0 0 var(--border-radius,var(--d-border-radius)) var(--border-radius,var(--d-border-radius));
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
.flip-card>.top-back{
	z-index: 5;
}
.flip-card>.bottom-back{
	z-index: 2;
	pointer-events: auto;
	background: var(--background-full,var(--d-background-full));
}
.flip-card>.top-front,
.flip-card>.bottom-front{
	z-index: 7;
}
.flip-card>.bottom-back{
	border-radius: var(--border-radius,var(--d-border-radius));
	top:0px;
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
	transform: perspective(var(--perspective),var(--d-perspective)) rotateX(90deg);
	top: calc(50% + 2px);
	height:calc(50% - 2px);
	background: var(--background-bottom,var(--d-background-bottom));
}
.flip-card.flip>.top-front{
	animation: flip-top var(--animation-time,var(--d-animation-time)) linear;
}
.flip-card.flip>.bottom-front{
	animation: flip-bottom var(--animation-time,var(--d-animation-time)) linear;
}
.flip-card:not(.flip)>:where(.top-front, .bottom-front){
	opacity: 0;
}
@keyframes flip-top {
	0%{
		transform: perspective(var(--perspective,var(--d-perspective))) rotateX(0deg);
	}
	50%{
		transform: perspective(var(--perspective,var(--d-perspective))) rotateX(-90deg);
	}
	100%{
		transform: perspective(var(--perspective,var(--d-perspective))) rotateX(-90deg);
	}
}
@keyframes flip-bottom {
	0%{
		transform: perspective(var(--perspective,var(--d-perspective))) rotateX(90deg);
	}
	50%{
		transform: perspective(var(--perspective,var(--d-perspective))) rotateX(90deg);
	}
	100%{
		transform: perspective(var(--perspective,var(--d-perspective))) rotateX(0deg);
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
customElements.define('flip-card-', HTMLFlipCardElementElement);
