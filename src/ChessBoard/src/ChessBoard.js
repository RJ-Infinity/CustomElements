class HTMLChessBoardElementElement extends HTMLElement {
	#shadowRoot;
	size;
	disabled;
	#pieces = undefined;
	#isMouseDown = false;
	#mouseDownOn = undefined;
	#letters = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"];
	#numbers = ["0","1","2","3","4","5","6","7","8","9"];
	#highlights = ["yellow", "red", "circle", "border", "encircle"]
	constructor() {
		super();
		this.#shadowRoot = this.attachShadow({mode: 'closed'});
		this.#shadowRoot.appendChild(HTMLChessBoardElementTemplate.content.cloneNode(true));
	}
	connectedCallback(){
		this.refreshBoard();
	}
	refreshBoard(){
		this.#shadowRoot.removeChild(this.#shadowRoot.getElementById("main"));
		this.#shadowRoot.appendChild(HTMLChessBoardElementTemplate.content.cloneNode(true));
		this.size = parseInt(this.getAttribute("size")) || 8;
		this.#shadowRoot.getElementById("main").style.setProperty("--width", this.size);

		if (this.getAttribute("disabled")){
			this.disabled = this.getAttribute("disabled").split(" ").filter(el=>el!=="").map(el=>{
				var returnv = this.toIndex(el);
				if (returnv === undefined){
					throw `Error ${el} is not a valid `
				}
				return returnv;
			});
		}else{
			this.disabled = []
		}
		this.disabled.includes = function(searchElement,fromIndex = 0){
			var found = false;
			this.slice(fromIndex).forEach((el)=>{
				if (!found){
					found = (el.x == searchElement.x && el.y == searchElement.y)
				}
			});
			return found;
		}

		this.#constructBoard()
		
	}
	#getPieces(){
		this.#pieces = [];
		this.childNodes.forEach(el=>{
			if (el.nodeName.toUpperCase() == "CHESS-PEICE-"){
				this.#pieces.push(el.getPeice());
			}
		});
	}
	putPiece(position, pieceName, pieceColour){
		if (this.#pieces === undefined){
			this.#getPieces()
		}
		var sqrDiv = this.#getSqr(position);
		var piece = this.#pieces.filter(
			el=>(
				el.pieceName == pieceName &&
				el.pieceColour == pieceColour
			)
		)[0];
		if (piece === undefined){
			throw "Error Invalid piece";
		}
		sqrDiv.setAttribute("pieceName", pieceName);
		sqrDiv.setAttribute("pieceColour", pieceColour);
		sqrDiv.appendChild(
			piece.image.cloneNode(true)//clone the peice's image into the sqr
		);
	}
	#getSqr(position){
		var pos = this.toIndex(position);
		if (pos == undefined){
			throw "Error Invalid position";
		}
		var sqrDiv = this.#getSqrDiv(pos);// get the sqr for the pos passed in
		if (sqrDiv == undefined){
			throw "Error Invalid Position";
		}
		return sqrDiv;
	}
	removePiece(position){
		var sqrDiv = this.#getSqr(position);
		sqrDiv.childNodes.forEach(el=>el.remove())
		sqrDiv.removeAttribute("pieceName");
		sqrDiv.removeAttribute("pieceColour");
	}
	getPeice(position){
		var sqrDiv = this.#getSqr(position);
		var pieceName = sqrDiv.getAttribute("pieceName");
		var pieceColour = sqrDiv.getAttribute("pieceColour");
		if (pieceName == null || pieceColour == null || parseInt(pieceColour) == NaN){
			return null
		}
		return {pieceColour:parseInt(pieceColour),pieceName:pieceName}
	}
	highlightPiece(position, value, remove=false){
		if (!this.#highlights.includes(value)){
			throw `Error ${value} not a highlight state`
		}
		var sqrDiv = this.#getSqr(position);
		if (sqrDiv == undefined){
			throw "Error Invalid Position";
		}
		if (remove){
			sqrDiv.classList.remove(value)
		}else{
			sqrDiv.classList.add(value)
		}
	}
	#getSqrDiv(pos){
		return this.#shadowRoot.querySelector("[xpos=\""+pos.x+"\"][ypos=\""+pos.y+"\"]")
	}
	toIndex(location){
		location = location.toLowerCase();
		var xStr = "";
		var i=0;
		while (this.#letters.includes(location[i])){
			xStr+=location[i];
			i++;
		}
		var yStr = location.slice(i);
		var x = 0;
		for (let i = 0; i < xStr.length; i++) {
			x+=this.#letters.indexOf(xStr[i]) + this.#letters.length*i;
		}
		var y = 0;
		for (let i = 0; i < yStr.length; i++) {
			var num = this.#numbers.indexOf(yStr[yStr.length - 1 - i])
			if (num == -1){
				return undefined;
			}
			y+= num - 1 + this.#numbers.length*i;
		}
		return {x:x,y:y}
	}
	#base(i){
		var returnv="";
		if (i>this.#letters.length-1){
			returnv = this.#base(Math.floor(i/this.#letters.length)-1);
		}
		i=i%this.#letters.length;
		return returnv + this.#letters[i];
	}
	toCoord(Index){
		if (!("x"in Index&&"y"in Index)){
			throw "Error: object must have both an `x` and `y` for it to be converted to an coord";
		}
		if (typeof(Index.x)!=="number"||typeof(Index.y)!=="number"){
			throw "Error: `x` and `y` must both be numbers";
		}
		if (Index.x<0||Index.y<0){
			throw "Error: `x` and `y` must be larger than 0";
		}
		return this.#base(Index.x)+String(Index.y+1);
	}
	mouseDown(el, e){
		if (this !== el.parentNode.parentNode.host){
			throw "Error: el has not got a valid parent (mouseDown should only be called internaly)"
		}
		// this.#mouseDownOn = e.originalTarget;
		// this.#isMouseDown = true;
		const event = new CustomEvent('chessmouseup', {
			bubbles:true,
			detail:{
				pos:this.toCoord({
					x:parseInt(el.getAttribute("xpos")),
					y:parseInt(el.getAttribute("ypos"))
				}),
				button:e.button,
				buttons:e.buttons
			}
		});
		this.dispatchEvent(event);
	}
	mouseUp(el, e){
		if (this !== el.parentNode.parentNode.host){
			throw "Error: el has not got a valid parent (mouseUp should only be called internaly)"
		}
		const event = new CustomEvent('chessmouseup', {
			bubbles:true,
			detail:{
				pos:this.toCoord({
					x:parseInt(el.getAttribute("xpos")),
					y:parseInt(el.getAttribute("ypos"))
				}),
				button:e.button,
				buttons:e.buttons
			}
		});
		this.dispatchEvent(event);
	}
	mouseClick(el, e){
		if (this !== el.parentNode.parentNode.host){
			throw "Error: el has not got a valid parent (mouseClick should only be called internaly)"
		}
		const event = new CustomEvent('chessclick', {
			bubbles:true,
			detail:{
				pos:this.toCoord({
					x:parseInt(el.getAttribute("xpos")),
					y:parseInt(el.getAttribute("ypos"))
				}),
				button:e.button,
				buttons:e.buttons
			}
		});
		this.dispatchEvent(event);
	}
	#constructBoard() {
		var main = this.#shadowRoot.getElementById("main");
		var isDark = false;
		for (let i = this.size-1; i >= 0; i--) {
			if (!(this.size%2)){
				isDark = !isDark;
			}
			for (let j = 0; j < this.size; j++) {
				isDark = !isDark;
				var sqr = document.createElement("div");
				sqr.classList.add("board-sqr");
				if(this.disabled.includes({x:j,y:i})){
					sqr.toggleAttribute("disabled");
				}else{
					sqr.classList.add(isDark?"dark":"light");
				}
				sqr.setAttribute("xPos", j)
				sqr.setAttribute("yPos", i)
				sqr.setAttribute("coord", this.toCoord({x:parseInt(j),y:parseInt(i)}))
				sqr.addEventListener("mousedown",function (e){this.parentNode.parentNode.host.mouseDown(this, e)});
				sqr.addEventListener("mouseup",function (e){this.parentNode.parentNode.host.mouseUp(this, e)});
				sqr.addEventListener("click",function (e){this.parentNode.parentNode.host.mouseClick(this, e)});
				main.appendChild(sqr);
			}
		}
	}
}
class HTMLChessPeiceElementElement extends HTMLElement {
	pieceColour;
	pieceName;
	image;
	constructor() {
		super();
	}
	getPeice() {
		var piece = {}
		piece.pieceColour = parseInt(this.getAttribute("pieceColour"));
		piece.pieceName = this.getAttribute("pieceName");
		this.childNodes.forEach(el=> {
			if ((el.nodeName.toUpperCase() == "SVG") && (piece.image === undefined)){
				piece.image = el;
			}
		})
		return piece;
	}
}