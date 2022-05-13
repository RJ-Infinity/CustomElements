# FlipCards

this is a libary that adds a flip card they look a little like this
![FlipCard Image](https://github.com/RJ-Infinity/CustomElements/blob/main/FlipCard/FlipCardImage.png?raw=true)

here it is flipping
![FlipCard Gif](https://github.com/RJ-Infinity/CustomElements/blob/main/FlipCard/FlipCardClock.gif?raw=true)

you put it into your html like this
```html
<!DOCTYPE html>
<html>
	<head>
		...
		<script src="CustomElements/FlipCard.min.js"></script> <!-- for the minified version -->
		<script src="CustomElements/FlipCard/FlipCard.js"></script> <!-- for the source version -->
		...
	</head>
	<body>
		...
		<flip-card->1<!-- this is the initial value --></flip-card->
		...
	</body>
</html>
```

to get it to flip you can change the textContent (either directly or not) or if you want to flip it without changing the value you can run this js

```js
flipCard = document.getElementById("flip");
flipCard.flip();
```
to change the contents without flipping the card you can run this
```js
flipCard.changeNoFlip(newValue);
```
where `newValue` is anything that can become a string

it also has a range of customisation options here they all are set to there default values
```css
flip-card-{
	--flip-card-animation-time: 0.5s;
	--flip-card-perspective: 600px;
	--flip-card-split-style: solid;
	--flip-card-split-colour: lightgrey;
	--flip-card-radius: 0.15em;
	--flip-card-background-top: white;
	--flip-card-background-bottom: white;
	--flip-card-background-full: white;
	/* the `color`, `font`, `width`, `height` cascade down to the `flip-card-` like so */
	color: black;
	font: bold 7em sans-serif;
	width: 1em;
	height: 1.142857em;
	/* the height looks a bit stupid if it is more than `2em` as the character is just on the top row
}
```