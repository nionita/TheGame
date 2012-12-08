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

function Quad() {
	this.draw = function(ctx) {
		ctx.save();
		ctx.translate(ball.x, ball.y);
		var r = ball.r;
		ctx.fillStyle = ball.color;
		ctx.strokeStyle = "#D0D0F4";
		ctx.lineWidth = 2;
		ctx.beginPath();
		ctx.moveTo(r, r);
		ctx.lineTo(-r, r);
		ctx.lineTo(-r, -r);
		ctx.lineTo(r, -r);
		ctx.closePath();
		ctx.fill();
		ctx.stroke();
		ctx.restore();
	}
}
