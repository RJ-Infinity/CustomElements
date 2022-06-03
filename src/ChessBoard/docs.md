# ChessBoard
## this is the basic signiture of the two classes it provides

```js
class HTMLChessBoardElementElement extends HTMLElement {
	size;
	disabled;

	constructor()
	connectedCallback()
	refreshBoard()
	putPiece(position, pieceName, pieceColour)
	removePiece(position)
	getPeice(position)
	highlightPiece(position, value, remove=false)
	toIndex(location)
	toCoord(Index)
	constructBoard()
}
class HTMLChessPeiceElementElement extends HTMLElement {
	pieceColour;
	pieceName;
	image;
	constructor()
	getPeice()
}
```

### `size` typeof `number`

this is the width and height of the board in squares

### `disabled` typeof `Array[{x,y}]`
this is the array containing the disabled squares should not be writen to

### `constructor`
this is the constructor 

### `connectedCallback`
this is called when the element is connected to a DOM

### `refreshBoard`
this is called when the board needs to be redrawn (Note this will remove all peices and start from fresh as if it has just been created)

### `putPiece`
this puts a peice in the specified position
> ### `position`
> this is coord that the peice gets put in

> ### `pieceName`
> this is the name of the piece as specifed in the list of chess-piece-'s

> ### `pieceColour`
> this is the colour of the piece as specifed in the list of chess-piece-'s

### `removePiece`
this removes any piece in the given position (Note if the location has no piece in it this function does nothing different and acts as if it removed a piece)
> ### `position`
> this is the coord specifing the location where the piece will be removed

### `getPeice`
this retrieves the piece in the specified location
>### `position`
>this is the coord specifing the location where the peice information will be fetched from 

### `highlightPiece`
this highlights the pice in one of five ways
>### `position`
>this is the coord specifing the location where the peice to be highlighted is

>### `value`
>this is the highlight type and must be one of
>`["yellow", "red", "circle", "border", "encircle"]`
>if it is not an error is thrown
>
>"yellow" and "red" tint the square the respective colour and are not compatible with one another
>
>"circle", "border" and "encircle" are not compatible with one another either
>
>"circle" puts a dot in the center of the square "border" puts a border round the square and "encircle" puts a large circle in the square

>optional `remove` this specifies whether to remove the highlight or add it default is `false`

### `toIndex`
this converts Coord notaition to an Index object

throws an error if the Coord is invalid
>### `coord`
>this is the coord that is to be converted


### `toCoord`
this is the reverse of the `toIndex` function

throws an error if the Index is invalid
>### `Index`
>this is the index to be converted to a coord


Note although `mouseDown`, `mouseUp` and `mouseClick` are "public" they are not suposed to be called from outside the class and will most likely throw an error if called from outside



## Events

### chessrefreshed
this is called after refreshBoard has finished

### chessclick
this happens on click but provides more information on the square clicked

### chessmouseup
this happens on mouseup but provides more information on the square clicked

### chessmousedown
this happens on mousedown but provides more information on the square clicked