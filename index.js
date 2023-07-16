//setup Phase of the code
console.log("Yes");
if (window.location.pathname.endsWith("index.html")) {
	const SubmitPixelButton = document.getElementById("SubmitButton"); //get the submit button on the main menu
	const pixelWidthForm = document.getElementById("pxWInput"); //get the user imputed pixel width

	SubmitPixelButton.addEventListener("click", SetGameUp);

	function SetGameUp() {
		localStorage.setItem("width", pixelWidthForm.value);
		localStorage.setItem("height", pixelWidthForm.value * (9 / 16));

		console.log("YEP");

		window.location.href = "game.html";
	}
}

//The actual game logic
function ScaleValue(value) {
	//this gives the ratio between the new resolution and the old resolution
	return value * (localStorage.getItem("width") / 1024);
}
function ScaleVector(value) {
	//same as scale value, but with a vector 2
	return { x: ScaleValue(value.x), y: ScaleValue(value.y) };
}

function resizeTheCanvas() {
	// allows user to resize the canvas if they want to
	localStorage.removeItem("width");
	localStorage.removeItem("height");
	window.location.href = "index.html";
}

if (window.location.pathname.endsWith("game.html")) {
	if (localStorage.getItem("width") == "undefined") {
		window.location.href = "index.html"; //if the play hasn't configured their preffered resolution, they will get sent back to do so.
	}
	document.getElementById("resizeC").addEventListener("click", resizeTheCanvas);

	const canvas = document.querySelector("canvas");
	const c = canvas.getContext("2d");

	canvas.width = localStorage.getItem("width"); //the base resolution for this game will be 1024 by 576
	canvas.height = localStorage.getItem("height");

	c.fillRect(0, 0, canvas.width, canvas.height);

	const gravity = ScaleValue(0.2);

	class Sprite {
		constructor({ position, velocity }) {
			this.scaledPosition = ScaleVector(position); // adjust the position of the sprite
			this.scaledVelocity = ScaleVector(velocity);
			this.scaledHeight = ScaleValue(150);
		}

		draw() {
			c.fillStyle = "red";
			c.fillRect(this.scaledPosition.x, this.scaledPosition.y, ScaleValue(50), this.scaledHeight);
		}

		update() {
			this.draw();

			this.scaledPosition.x += this.scaledVelocity.x;
			this.scaledPosition.y += this.scaledVelocity.y;

			if (this.scaledPosition.y + this.scaledHeight + this.scaledVelocity.y >= canvas.height) {
				this.scaledVelocity.y = 0;
				this.scaledPosition.y = canvas.height - this.scaledHeight;
			} else {
				this.scaledVelocity.y += gravity;
			}
		}
	}

	const player = new Sprite({ position: { x: 0, y: 0 }, velocity: { x: 0, y: 0 } });

	const enemy = new Sprite({ position: { x: 400, y: 100 }, velocity: { x: 0, y: 0 } });

	const keys = {
		a: {
			pressed: false
		},
		d: {
			pressed: false
		}
	};

	function animate() {
		window.requestAnimationFrame(animate);

		c.fillStyle = "black";
		c.fillRect(0, 0, canvas.width, canvas.height);

		player.update();
		enemy.update();

		if (keys.d.pressed) {
			player.scaledVelocity.x = ScaleValue(1);
		} else if (keys.a.pressed) {
			player.scaledVelocity.x = ScaleValue(-1);
		} else {
			player.scaledVelocity.x = ScaleValue(0);
		}
	}

	animate();

	window.addEventListener("keydown", (event) => {
		switch (event.key) {
			case "d":
				keys.d.pressed = true;
				break;
			case "a":
				keys.a.pressed = true;
				break;
		}
		console.log(event.key);
	});

	window.addEventListener("keyup", (event) => {
		switch (event.key) {
			case "d":
				keys.d.pressed = false;
				break;
			case "a":
				keys.a.pressed = false;
				break;
		}
		console.log(event.key);
	});
}
