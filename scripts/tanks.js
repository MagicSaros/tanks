let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
let fieldWidth = canvas.width;
let fieldHeight = canvas.height;
let canfi = new CanFi(canvas);

class Element {
    constructor(x, y, width, height, color) {
        this._x = x;
        this._y = y;
        this._width = width;
        this._height = height;
        this._color = color;
    }
}

class Hull extends Element {
    constructor(x, y, width, height, color) {
        super(x, y, width, height, color);
    }

    draw() {
        let prevColor = ctx.fillStyle;
        ctx.fillStyle = this._color;
        ctx.fillRect(this._x - this._width / 2, this._y - this._height / 2, this._width + 1, this._height + 1);
        ctx.fillStyle = prevColor;
    }
}

class Cannon extends Element {
    constructor(x, y, width, height, color) {
        super(x, y, width, height, color);
    }

    draw() {
        let prevColor = ctx.fillStyle;
        ctx.fillStyle = this._color;
        ctx.fillRect(this._x - this._width / 20, this._y - this._height, this._width / 10 + 1, this._height / 2 + this._height / 4);
        ctx.fillStyle = prevColor;
    }
}

class Turret extends Element {
    constructor(x, y, width, height, color) {
        super(x, y, width, height, color);
    }

    draw() {
        let prevColor = ctx.fillStyle;
        ctx.fillStyle = this._color;
        ctx.fillRect(this._x - this._width / 4, this._y - this._height / 4, this._width / 2 + 1, this._height / 2 + 1);
        ctx.fillStyle = prevColor;
    }
}

class Track extends Element {
    constructor(x, y, width, height, color) {
        super(x, y, width, height, color);
    }

    draw() {
        let prevColor = ctx.fillStyle;
        ctx.fillStyle = this._color;
        ctx.fillRect(this._x - this._width / 2, this._y - this._height / 2, this._width / 10, this._height + 1);
        ctx.fillRect(this._x + this._width / 2 + 1 - this._width / 10, this._y - this._height / 2, this._width / 10, this._height + 1);
        ctx.fillStyle = prevColor;
    }
}

let size = 20;

let hull = null;
let hullX = 500;
let hullY = 300;
let hullColor = 'darkgreen';

let turret = null;
let turretX = hullX;
let turretY = hullY;
let turretColor = 'grey';

let cannon = null;
let cannonX = hullX;
let cannonY = hullY;
let cannonColor = 'black';

let track = null;
let trackX = hullX;
let trackY = hullY;
let trackColor = 'darkgrey';

hull = new Hull(hullX, hullY, size, size, hullColor);
hull.draw();

turret = new Turret(turretX, turretY, size, size, turretColor);
turret.draw();

cannon = new Cannon(cannonX, cannonY, size, size, cannonColor);
cannon.draw();

track = new Track(trackX, trackY, size, size, trackColor);
track.draw();   