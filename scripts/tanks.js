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

class Tank {
    constructor(x, y, width, height, elementsColors, direction) {
        this._x = x;
        this._y = y;
        this._width = width;
        this._height = height;
        this._colors = elementsColors;
        this._direction = direction;
        this._hull = new Hull(this._x, this._y, this._width, this._height, this._colors.hullColor);
        this._track = new Track(this._x, this._y, this._width, this._height, this._colors.trackColor);
        this._turret = new Turret(this._x, this._y, this._width, this._height, this._colors.turretColor);
        this._cannon = new Cannon(this._x, this._y, this._width, this._height, this._colors.cannonColor);
    }

    draw() {
        this._hull.draw();
        this._track.draw();
        this._turret.draw();
        this._cannon.draw();
    }
}

let size = 20;

let tank = null;
let tankX = 500;
let tankY = 300;

let elementsColors = {
    hullColor : 'darkgreen',
    turretColor : 'darkgrey',
    cannonColor : 'black',
    trackColor : 'grey'
};

tank = new Tank(tankX, tankY, size, size, elementsColors);
tank.draw();