// Helper functions for the game

var $ = function(id) {
		return document.getElementById(id);
};

var Game = (function() {
	var TimerInterval = 40;	// in ms
	var canvas = null;
	var ctx = null;
	var width = 0;
	var height = 0;
	var running = false;
	var ball = null;
	var timer = null;
	var pmin = null;
	var pmax = null;

	function updateCanvas() {
        // Canvas-Hintergrund
        var bkgGrad = ctx.createLinearGradient(0, 0, 0, height);
        bkgGrad.addColorStop(0, '#373E5C');
        bkgGrad.addColorStop(0.4, '#1A1D2B');
        ctx.fillStyle = bkgGrad;
        ctx.fillRect(0, 0, width, height);

		ball.draw(ctx);
	}

	function tick() {
		if (running) {
			ball.tick(pmin, pmax);
			updateCanvas();
		}
	}

	function initBall() {
		var pos = new Vector(150, 65);
		var vel = new Vector(3, 2);
		ball = new Ball(5, pos, vel, "rgb(88, 24, 10)");
	}
	
	return {
		init: function(params) {
			canvas = $("surface");
			canvas.width = 800;
			canvas.height = 800;
			width = canvas.width;
			height = canvas.height;
			$("width").innerHTML = width;
			$("height").innerHTML = height;
			pmin = new Vector(0, 0);
			pmax = new Vector(width, height);
			ctx = canvas.getContext("2d");
			ctx.save();	// warum?
			initBall();
			updateCanvas();
		},

		start: function() {
			if (running) {
				clearTimeout(timer);
				timer = null;
				running = false;
				$("stst").innerHTML = "Start"
			} else {
				timer = setInterval(tick, TimerInterval);
				running = true;
				$("stst").innerHTML = "Stop"
			}
	}
	};
})();

function drawSurface() {
	
}