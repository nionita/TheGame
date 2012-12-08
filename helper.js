// Helper functions for the game

var $ = function(id) {
		return document.getElementById(id);
};

var attachEvent = function(obj, event, callback) {
	if (obj.addEventListener)
		obj.addEventListener(event, callback, false);
	else if (obj.attachEvent)  
		obj.attachEvent('on' + event, callback);  
	else
		obj['on' + event] = callback;
};

var Game = (function() {
	var TimerInterval = 40;	// in ms
	var canvas = null;
	var ctx = null;
	var width = 0;
	var height = 0;
	var running = false;
	var ball = null;
	var sonne1 = null, sonne2 = null;
	var ship = null;
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

		ball.draw(ctx); sonne1.draw(ctx); sonne2.draw(ctx); ship.draw(ctx);
	}

	function tick() {
		if (running) {
			ball.tick(pmin, pmax);
			sonne1.tick(pmin, pmax);
			sonne2.tick(pmin, pmax);
			ship.tick(pmin, pmax);
			updateCanvas();
		}
	}

	function initBall() {
		var pos = new Vector(150, 65);
		var vel = new Vector(3, 2);
		ball = new Ball(5, pos, vel, "rgb(88, 24, 10)");
	}

	function initSonne() {
		var pos = new Vector(450, 5);
		var vel = new Vector(2, 5);
		sonne1 = new Sonne(10, pos, vel, 50);
		pos = new Vector(650, 55);
		vel = new Vector(1, 4);
		sonne2 = new Sonne(12, pos, vel, 30);
	}

	function initShip() {
		var pos = new Vector(45, 545);
		ship = new Ship(pos);
	}

	// For the keys we have following values:
	// 38 (up)    - accelerate
	// 37 (left)  - turn left
	// 39 (right) - turn right
	// all the rest we ignore
	function onkeydown(e) {
        if (e.which == 38) {
			ship.control_acc = true;
		} else if (e.which == 37) {
			ship.control_left = true;
			ship.control_right = false;
		} else if (e.which == 39) {
			ship.control_left = false;
			ship.control_right = true;
		}
		$("height").innerHTML = e.which;
    }

	function onkeyup(e) {
        if (e.which == 38) {
			ship.control_acc = false;
		} else if (e.which == 37 || e.which == 39) {
			ship.control_left = false;
			ship.control_right = false;
		}
		$("width").innerHTML = e.which;
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
			initBall(); initSonne(); initShip();
            attachEvent(window, 'keydown', onkeydown);
            attachEvent(window, 'keyup', onkeyup);
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