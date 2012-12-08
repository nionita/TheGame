// Here we define (physical) object types
// with properties, physics of moving
// and draw routines

var PI2 = 2*Math.PI

// A 2d Vector
function Vector(x, y) {
	this.x = x || 0; this.y = y || 0;
	this.addv = function(vec) {
		this.x += vec.x;
		this.y += vec.y;
	}
	this.muls = function(s) {
		this.x *= s;
		this.y *= s;
	}
}

// A body with collision radius, position and velocity
function Body(r, pos, vel) {
	this.rad  = r || 1;	// collision rdius
	this.pos = pos || new Vector();	// position
	this.vel = vel || new Vector();	// velocity
	// Movement is here always with reflection
	// The reflection limits must be ((xmin,ymin), (xmax, ymax))
	this.tick = function(pmin, pmax) {
	    var pos = this.pos;
		var vel = this.vel;
		pos.addv(vel)
		var r = this.rad;
		if (pos.x > pmax.x - r) {
			pos.x = pmax.x - r;
			vel.x = - vel.x;
		} else if (pos.x < pmin.x + r) {
			pos.x = pmin.x + r;
			vel.x = - vel.x;
		}
		if (pos.y > pmax.y - r) {
			pos.y = pmax.y - r;
			vel.y = - vel.y;
		} else if (pos.y < pmin.y + r) {
			pos.y = pmin.y + r;
			vel.y = - vel.y;
		}
	}
}

function Ball(r, pos, vel, col) {
	this.body = new Body(r, pos, vel);
	this.color = col || "rgb(80, 80, 80)";	// aspect
	this.draw = function(ctx) {
		ctx.save();
		ctx.fillStyle = this.color;
		ctx.strokeStyle = "#D0D0F4";
		ctx.lineWidth = 1;
		ctx.beginPath();
		var pos = this.body.pos;
		ctx.arc(pos.x, pos.y, this.body.rad, 0, PI2, false);
		ctx.closePath();
		ctx.fill();
		ctx.stroke();
		ctx.restore();
	};
	this.tick = function(mi, ma) { this.body.tick(mi, ma); }
}

function Sonne(r, pos, vel, per) {
	var pi2 = PI2 / 8;
	this.body = new Body(r, pos, vel);
	this.color = "rgb(110, 10, 20)";	// aspect
	this.per = per || 20;	// rotation time
	this.roll = 0
	this.draw = function(ctx) {
		ctx.save();
		ctx.fillStyle = this.color;
		ctx.strokeStyle = "#D0D0F4";
		ctx.lineWidth = 1;
		ctx.beginPath();
		var pos = this.body.pos;
		ctx.translate(pos.x, pos.y);
		ctx.rotate(PI2 * this.roll / this.per);
		var r = this.body.rad;
		ctx.fillStyle = this.color;
		// ctx.strokeStyle = this.color"#D0D0F4";
		ctx.lineWidth = 1;
		ctx.beginPath();
		ctx.moveTo(r, r);
		ctx.lineTo(-r, r);
		ctx.lineTo(-r, -r);
		ctx.lineTo(r, -r);
		ctx.closePath();
		ctx.fill();
		// ctx.stroke();
		ctx.rotate(pi2);	// the same rotated 45 degrees
		ctx.beginPath();
		ctx.moveTo(r, r);
		ctx.lineTo(-r, r);
		ctx.lineTo(-r, -r);
		ctx.lineTo(r, -r);
		ctx.closePath();
		ctx.fill();
		ctx.restore();
	};
	this.tick = function(mi, ma) {
		this.body.tick(mi, ma);
		this.roll = this.roll + 1
		if (this.roll > this.per) { this.roll = 0 }
	}
}

function Ship(pos) {
	var maxgas = 100;	// maximum time we can accelerate
	var pi2 = Math.PI / 2;
	var power = 0.03;	// absolute acceleration
	var ang = pi2 / 20;	// one degree direction control
	this.body = new Body(5, pos);
	this.dir = 0;		// direction (in radians)
	this.color = "rgb(210, 200, 150)";	// aspect
	this.gas = maxgas;
	this.control_acc = false;	// is just accelerating?
	this.control_left = false;		// direction control
	this.control_right = false;
	this.draw = function(ctx) {
		var pos = this.body.pos;
		var r = this.body.rad * 0.7;
		var r2 = r / 2;
		ctx.save();
		ctx.translate(pos.x, pos.y);
		ctx.rotate(this.dir);
		ctx.fillStyle = this.color;
		if (this.control_acc) {
			ctx.strokeStyle = "#FFD0F0";
		} else if (this.control_left || this.control_right) {
			ctx.strokeStyle = "#80FFF0";
		} else {
			ctx.strokeStyle = "#D0D0F4";
		}
		ctx.lineWidth = 1;
		ctx.beginPath();
		ctx.moveTo(r, 0);
		ctx.lineTo(-r2, r2);
		ctx.lineTo(0, 0);
		ctx.lineTo(-r2, -r2);
		ctx.closePath();
		ctx.fill();
		ctx.stroke();
		ctx.restore();
	};
	this.tick = function(mi, ma) {
		var vel0 = this.body.vel;
		this.body.tick(mi, ma);
		var vel1 = this.body.vel;
		if (vel1.x * vel1.x < 0) { this.dir = Math.PI - this.dir; }
		if (vel1.y * vel1.y < 0) { this.dir = pi2     + this.dir; }
		if (this.control_left) {
			this.dir -= ang;
		}
		if (this.control_right) {
			this.dir += ang;
		}
		if (this.control_acc && this.gas > 0) {
			this.gas -= 1;
			var ax = power * Math.cos(this.dir);
			var ay = power * Math.sin(this.dir);
			var myacc = new Vector(ax, ay);
			vel1.addv(myacc);
		} else if (this.gas < maxgas) {
			this.gas += 1;
		}
	}
}