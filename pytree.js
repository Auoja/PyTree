var Pytree = function(canvas, size, steps, scale) {
    var ctx = canvas.getContext('2d');
    ctx.lineCap = 'square';

    var width = canvas.width = size * 6;
    var height = canvas.height = size * 4;

    var startX = Math.round(width * 0.5);
    var startY = height - Math.round(size * 0.5) - 1;

    var scale = Math.max(scale, 0.5);

    var rootSquare = new Square(new Vec(startX, startY), size * 0.5, new Vec(0, 1));

    var squares = rootSquare.subdivide(steps, scale);

    function renderSquare(sq, depth) {
        var color = Math.round(210 * depth / (steps + 1));
        ctx.fillStyle = "rgba(" + color + ", " + 128 + ", " + 128 + ", 1)";

        ctx.beginPath();
        ctx.moveTo(sq.p1.x, sq.p1.y);
        ctx.lineTo(sq.p2.x, sq.p2.y);
        ctx.lineTo(sq.p3.x, sq.p3.y);
        ctx.lineTo(sq.p4.x, sq.p4.y);
        ctx.closePath();
        ctx.fill();
    }

    this.render = function() {
        depth = 1;
        for (var property in squares) {
            if (squares.hasOwnProperty(property)) {
                depth++;
                for ( var i = squares[property].length - 1; i >= 0; i--) {
                    renderSquare(squares[property][i], depth);
                }
            }
        }
    };

    return this;
};

var Square = function(origin, size, normal) {
    this.origin = origin;
    this.normal = normal.normalize();
    var angle = Math.atan2(this.normal.x, this.normal.y);

    this.p1 = origin._add((new Vec(-size, -size)).rotateR(angle));
    this.p2 = origin._add((new Vec(size, -size)).rotateR(angle));
    this.p3 = origin._add((new Vec(size, size)).rotateR(angle));
    this.p4 = origin._add((new Vec(-size, size)).rotateR(angle));

    this.translate = function(v) {
        this.p1.add(v);
        this.p2.add(v);
        this.p3.add(v);
        this.p4.add(v);
        this.origin.add(v);
    }

    this._subdivide = function(steps, scale, squares, depth) {
        if (depth > steps) {
            return squares;
        }

        var newSize = size * scale;
        var rad = Math.acos((size * 0.5) / newSize);

        var sq1normal = normal._rotateR(rad).normalize();
        var sq1 = new Square(origin, newSize, sq1normal);
        sq1.translate(this.p1._subtract(sq1.p4));

        var sq2normal = normal._rotateR(-rad).normalize();
        var sq2 = new Square(origin, newSize, sq2normal);
        sq2.translate(this.p2._subtract(sq2.p3));

        if (!squares[depth]) {
            squares[depth] = [];
        }
        squares[depth].push(sq1);
        squares[depth].push(sq2);

        depth++;
        if (!squares[depth]) {
            squares[depth] = [];
        }
        squares[depth].concat(sq1._subdivide(steps, scale, squares, depth));
        squares[depth].concat(sq2._subdivide(steps, scale, squares, depth));

        return squares;
    }

    this.subdivide = function(steps, scale) {
        var squares = {};
        squares[0] = [this];
        return this._subdivide(steps, scale, squares, 1);
    }

    return this;
};

var Vec = function(x, y) {

    this.x = x;
    this.y = y;


    this.fromDegree = function(degree) {
        var rad = degree * (Math.PI / 180);
        return new Vec(Math.cos(rad), Math.sin(rad)).normalize();
    };

    this.add = function(v) {
        this.x += v.x;
        this.y += v.y;

        return this;
    };

    this.subtract = function(v) {
        this.x -= v.x;
        this.y -= v.y;

        return this;
    };

    this.divide = function(value) {
        this.x /= value;
        this.y /= value;

        return this;
    };

    this.multiply = function(value) {
        this.x *= value;
        this.y *= value;

        return this;
    };

    this.length = function() {
        return Math.sqrt((this.x * this.x) + (this.y * this.y));
    };

    this.normalize = function() {
        var length = this.length();
        if (length === 0) {
            return this;
        }
        return this.divide(length);
    };

    this.rotate = function(degree) {
        var rad = degree * (Math.PI / 180);
        var x = this.x * Math.cos(rad) + this.y * Math.sin(rad);
        var y = -this.x * Math.sin(rad) + this.y * Math.cos(rad);
        this.x = x;
        this.y = y;
        return this;
    };

    this.rotateR = function(rad) {
        var x = this.x * Math.cos(rad) + this.y * Math.sin(rad);
        var y = -this.x * Math.sin(rad) + this.y * Math.cos(rad);
        this.x = x;
        this.y = y;
        return this;
    };

    this.copy = function() {
        return new Vec(this.x, this.y);
    };

    this._add = function(v) {
        return new Vec(this.x + v.x, this.y + v.y);
    };

    this._subtract = function(v) {
        return new Vec(this.x - v.x, this.y - v.y);
    };

    this._divide = function(value) {
        return new Vec(this.x / value, this.y / value);
    };

    this._multiply = function(value) {
        return new Vec(this.x * value, this.y * value);
    };

    this._normalize = function() {
        var length = this.length();
        if (length === 0) {
            return this;
        }
        return this._divide(length);
    };

    this._rotate = function(degree) {
        var rad = degree * (Math.PI / 180);
        var x = this.x * Math.cos(rad) + this.y * Math.sin(rad);
        var y = -this.x * Math.sin(rad) + this.y * Math.cos(rad);
        return new Vec(x, y);
    };

    this._rotateR = function(rad) {
        var x = this.x * Math.cos(rad) + this.y * Math.sin(rad);
        var y = -this.x * Math.sin(rad) + this.y * Math.cos(rad);
        return new Vec(x, y);
    };

    return this;
}