const canvas = document.querySelector("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const c = canvas.getContext("2d");

// Utility Functions________________
var distance = function(x1, y1, x2, y2) {
  let x = x1 - x2;
  let y = y1 - y2;
  return Math.sqrt(x * x + y * y);
};


// Variables and Objects_____________
var particleArray;
// Get Mouse Position
var mouse = {
  x: undefined,
  y: undefined,
  radius: (canvas.height / 100) * (canvas.width / 100)
};

// Event Listners____________________
window.addEventListener("mousemove", event => {
  mouse.x = event.x;
  mouse.y = event.y;
});

// reinitialize the canvas on window size change
window.addEventListener('resize',() => {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	mouse.radius = (canvas.height/100)*canvas.width/100;
	init();
	// animate();
});

window.addEventListener('mouseout',() => {
	mouse.x = undefined;
	mouse.y = undefined;
});

// create particles
var Particle = function(x, y, directionX, directionY, size, color) {
  this.x = x;
  this.y = y;
  this.directionX = directionX;
  this.directionY = directionY;
  this.size = size;
  this.color = color;

  // Methods to draw individual particles
  this.draw = function() {
    c.beginPath();
    c.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
    c.fillStyle = "#23558c";
    c.fill();
  };

  //   Check particle position, check mouse position, move the particles , draw the particles;
  this.update = function() {
    // check if the particle is within canvas
    if (this.x > canvas.width || this.x < 0) this.directionX = -this.directionX;
    if (this.y > canvas.height || this.y < 0)
      this.directionY = -this.directionY;

    // else if(this.x<canvas.width || this.x>0)

	// check collision .. mosue position/particle position
	let dist = distance(mouse.x,mouse.y,this.x,this.y);
    if (dist < mouse.radius + this.size) {
      if (mouse.x < this.x && this.x < canvas.width - this.size * 10) {
        // mouse is  to the left of the particle .. so push towards right
        this.x += 10;
      }
      if (mouse.x > this.x && this.x > this.size * 10) {
        // mouse is  to the right side .. so push to the left.
        this.x -= 10;
      }
      if (mouse.y < this.y && this.y < canvas.height - this.size * 10) {
        // mouse is  to the bottom of the particle .. so push towards up
        this.y += 10;
      }
      if (mouse.y > this.y && this.y > this.size * 10) {
        // mouse is to the top of the particle ..so push towards down
        this.y += 10;
      }
    }

    // Runs for every particle over and over
    this.x += this.directionX;
    this.y += this.directionY;
    this.draw(); //draw the particle;
  };
};

// create all the particles;
function init() {
  particleArray = [];
  let numOfParticles = (canvas.height * canvas.width) / 11000;
  for (let i = 0; i < numOfParticles; i++) {
    let size = Math.random() * 5 + 1;
    let x = Math.random() * (innerWidth - size * 2 - size * 2) + size * 2;
    let y = Math.random() * (innerHeight - size * 2 - size * 2) + size * 2;
    let directionX = Math.random() * 5 - 2.5;
    let directionY = Math.random() * 5 - 2.5;
    let color = "#23558c";

    particleArray.push(new Particle(x, y, directionX, directionY, size, color));
  }
}


// To animate the particles

function animate() {
	requestAnimationFrame(animate);
	c.clearRect(0,0,innerWidth,innerHeight);

	particleArray.forEach(element => {
		element.update();
	});
	connect();
}

// To connect between particles 
function connect() {
	let opacityValue = 1;

	for (let i = 0; i < particleArray.length; i++) {
		for (let j = i; j < particleArray.length; j++) {
			let dist = distance(particleArray[i].x,particleArray[i].y,particleArray[j].x,particleArray[j].y);
			// console.log(dist);
			if(dist<(canvas.width/100)*(canvas.height/100)){
				opacityValue = 1- (dist/200);
				c.strokeStyle = `rgba(31,85,140,${opacityValue})`;
				c.lineWidth = 1;
				c.beginPath();
				c.moveTo(particleArray[i].x,particleArray[i].y);
				c.lineTo(particleArray[j].x,particleArray[j].y);
				c.stroke();
			}
			
		}
		
	}
}


init();
animate();