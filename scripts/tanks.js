let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
let fieldWidth = canvas.width;
let fieldHeight = canvas.height;
let canfi = new CanFi(canvas);

class Element {
    constructor(x, y, width, height, color, speed, direction) {
        this._x = x;
        this._y = y;
        this._width = width;
        this._height = height;
        this._color = color;
        this._speed = speed;
        this._direction = direction;
    }

    move() {
        switch(this._direction) {
            case 'up':
            this._y -= this._speed;
            break;
            case 'down':
            this._y += this._speed;
            break;
            case 'left':
            this._x -= this._speed;
            break;
            case 'right':
            this._x += this._speed;
            break;
        }
    }
}

class Hull extends Element {
    constructor(x, y, width, height, color, speed, direction) {
        super(x, y, width, height, color, speed, direction);
        this._offsetX = this._width / 2;
        this._offsetY = this._height / 2;
        this._lengthX = this._width + 1;
        this._lengthY = this._height + 1;
    }

    get direction() {
        return this._direction;
    }

    draw() {
        let prevColor = ctx.fillStyle;
        ctx.fillStyle = this._color;
        ctx.fillRect(this._x - this._offsetX, this._y - this._offsetY, this._lengthX, this._lengthY);
        ctx.fillStyle = prevColor;
    }
}

class Cannon extends Element {
    constructor(x, y, width, height, color, speed, direction) {
        super(x, y, width, height, color, speed, direction);
        this._offsetX = this._width / 20;
        this._offsetY = this._height;
        this._lengthX = this._width / 10 + 1;
        this._lengthY = this._height / 2 + this._height / 4;
    }

    draw(direction) {
        this._direction = direction;
        let prevColor = ctx.fillStyle;
        ctx.fillStyle = this._color;
        switch(this._direction) {
            case 'up':
            ctx.fillRect(this._x - this._offsetX, this._y - this._offsetY, this._lengthX, this._lengthY);
            break;
            case 'down':
            ctx.fillRect(this._x - this._offsetX, this._y + this._offsetY - this._lengthY + 1, this._lengthX, this._lengthY);
            break;
            case 'left':
            ctx.fillRect(this._x - this._offsetY, this._y - this._offsetX, this._lengthY, this._lengthX);
            break;
            case 'right':
            ctx.fillRect(this._x + this._offsetY - this._lengthY + 1, this._y - this._offsetX, this._lengthY, this._lengthX);
            break;
        }
        ctx.fillStyle = prevColor;
    }
}

class Turret extends Element {
    constructor(x, y, width, height, color, speed, direction) {
        super(x, y, width, height, color, speed, direction);
        this._offsetX = this._width / 4;
        this._offsetY = this._height / 4;
        this._lengthX = this._width / 2 + 1;
        this._lengthY = this._height / 2 + 1;
    }

    get direction() {
        return this._direction;
    }

    draw() {
        let prevColor = ctx.fillStyle;
        ctx.fillStyle = this._color;
        ctx.fillRect(this._x - this._offsetX, this._y - this._offsetY, this._lengthX, this._lengthY);
        ctx.fillStyle = prevColor;
    }
}

class Track extends Element {
    constructor(x, y, width, height, color, speed, direction) {
        super(x, y, width, height, color, speed, direction);
        this._offsetX = this._width / 2;
        this._offsetY = this._height / 2;
        this._lengthX = this._width / 10;
        this._lengthY = this._height + 1;
    }

    draw(direction) {
        this._direction = direction;
        let prevColor = ctx.fillStyle;
        ctx.fillStyle = this._color;
        switch(this._direction) {
            case 'up':
            case 'down':
            ctx.fillRect(this._x - this._offsetX, this._y - this._offsetY, this._lengthX, this._lengthY);
            ctx.fillRect(this._x + this._offsetX- this._lengthX + 1, this._y - this._offsetY, this._lengthX, this._lengthY);
            break;
            case 'left':
            case 'right':
            ctx.fillRect(this._x - this._offsetX, this._y - this._offsetY, this._lengthY, this._lengthX);
            ctx.fillRect(this._x - this._offsetX, this._y + this._offsetY- this._lengthX + 1, this._lengthY, this._lengthX);
            break;    
        }
        ctx.fillStyle = prevColor;
    }
}

class Tank {
    constructor(x, y, width, height, elementsColors, speed, direction) {
        this._x = x;
        this._y = y;
        this._width = width;
        this._height = height;
        this._colors = elementsColors;
        this._speed = this.speed;
        this._direction = direction;
        this._hull = new Hull(this._x, this._y, this._width, this._height, this._colors.hullColor, this._speed, this._direction);
        this._track = new Track(this._x, this._y, this._width, this._height, this._colors.trackColor, this._speed, this._direction);
        this._turret = new Turret(this._x, this._y, this._width, this._height, this._colors.turretColor, this._speed, this._direction);
        this._cannon = new Cannon(this._x, this._y, this._width, this._height, this._colors.cannonColor, this._speed, this._direction);
    }

    draw() {
        this._hull.draw();
        this._track.draw(this._hull.direction);
        this._turret.draw();
        this._cannon.draw(this._turret.direction);
    }

    move() {
        this._hull.move();
        this._track.move();
        this._turret.move();
        this._cannon.move();
    }
}

let size = 20;

let tank = null;
let tankX = 500;
let tankY = 300;
let tankSpeed = 1;
let tankStartDirection = 'up';

let elementsColors = {
    hullColor : 'darkgreen',
    turretColor : 'darkgrey',
    cannonColor : 'black',
    trackColor : 'grey'
};

tank = new Tank(tankX, tankY, size, size, elementsColors, tankSpeed, tankStartDirection);
tank.draw();

// setInterval(() => {
//     ctx.clearRect(0, 0, fieldWidth, fieldHeight);
//     tank.move();
//     tank.draw();
// }, 100)
