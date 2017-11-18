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

    set direction(direction) {
        this._direction = direction;
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

    set direction(direction) {
        this._direction = direction;
    }

    draw() {
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

    set direction(direction) {
        this._direction = direction;
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

    set direction(direction) {
        this._direction = direction;
    }

    draw() {
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

class Bullet extends Element {
    constructor(x, y, width, height, color, speed, direction) {
        super(x, y, width, height, color, speed, direction);
        this._offsetX = this._width / 20;
        this._offsetY = this._height + (this._height / 10 + 1) * 2;
        this._lengthX = this._width / 10 + 1;
        this._lengthY = (this._height / 10 + 1) * 2;
    }

    set direction(direction) {
        this._direction = direction;
    }

    draw() {
        let prevColor = ctx.fillStyle;
        ctx.fillStyle = this._color;
        switch(this._direction) {
            case 'up':
            ctx.fillRect(this._x - this._offsetX, this._y - this._offsetY, this._lengthX, this._lengthY);
            break;
            case 'down':
            ctx.fillRect(this._x - this._offsetX, this._y + this._offsetY - this._lengthY, this._lengthX, this._lengthY);
            break;
            case 'left':
            ctx.fillRect(this._x - this._offsetY, this._y - this._offsetX, this._lengthY, this._lengthX);
            break;
            case 'right':
            ctx.fillRect(this._x + this._offsetY - this._lengthY, this._y - this._offsetX, this._lengthY, this._lengthX);
            break;
        }
        ctx.fillStyle = prevColor;
    }

    clear() {
        switch(this._direction) {
            case 'up':
            ctx.clearRect(this._x - this._offsetX, this._y - this._offsetY, this._lengthX, this._lengthY);
            break;
            case 'down':
            ctx.clearRect(this._x - this._offsetX, this._y + this._offsetY - this._lengthY, this._lengthX, this._lengthY);
            break;
            case 'left':
            ctx.clearRect(this._x - this._offsetY, this._y - this._offsetX, this._lengthY, this._lengthX);
            break;
            case 'right':
            ctx.clearRect(this._x + this._offsetY - this._lengthY, this._y - this._offsetX, this._lengthY, this._lengthX);
            break;
        }
    }
}

class Tank {
    constructor(x, y, width, height, elementsColors, speed, direction) {
        this._x = x;
        this._y = y;
        this._width = width;
        this._height = height;
        this._colors = elementsColors;
        this._speed = speed;
        this._direction = direction;
        this._hull = new Hull(this._x, this._y, this._width, this._height, this._colors.hullColor, this._speed, this._direction);
        this._track = new Track(this._x, this._y, this._width, this._height, this._colors.trackColor, this._speed, this._direction);
        this._turret = new Turret(this._x, this._y, this._width, this._height, this._colors.turretColor, this._speed, this._direction);
        this._cannon = new Cannon(this._x, this._y, this._width, this._height, this._colors.cannonColor, this._speed, this._direction);
    }

    set direction(direction) {
        this._direction = direction;
        this._hull.direction = direction;
        this._track.direction = direction;
        this._turret.direction = direction;
        this._cannon.direction = direction;
    }

    draw() {
        this._hull.draw();
        this._track.draw();
        this._turret.draw();
        this._cannon.draw();
    }

    move() {
        this._hull.move();
        this._track.move();
        this._turret.move();
        this._cannon.move();
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

    shoot() {
        let bulletX = this._x;
        let bulletY = this._y;
        let bulletSpeed = this._speed * 2;
        let bullet = new Bullet(bulletX, bulletY, this._width, this._height, this._colors.bulletColor, bulletSpeed, this._direction);
        setInterval(() => {
            bullet.clear();
            bullet.move();
            bullet.draw();
        }, 10);
    }
}

let size = 20;

let tank = null;
let tankX = 500;
let tankY = 300;
let tankSpeed = 2;
let tankDirection = 'up';

let elementsColors = {
    hullColor : 'darkgreen',
    turretColor : 'darkgrey',
    cannonColor : 'black',
    trackColor : 'grey',
    bulletColor : 'black'
};

let keyActions = {
    32: 'space',
    37: 'left',
    38: 'up',
    39: 'right',
    40: 'down', 
    65: 'left',
    87: 'up',
    68: 'right',
    83: 'down'
};

tank = new Tank(tankX, tankY, size, size, elementsColors, tankSpeed, tankDirection);
tank.draw();

$('body').keydown(event => {
    let key = event.keyCode;
    switch(key) {
        case 37:
        case 38:
        case 39:
        case 40:
        tank.direction = keyActions[key];
        ctx.clearRect(0, 0, fieldWidth, fieldHeight);
        tank.move();
        tank.draw();
        break;
        case 32:
        tank.shoot();
        break;
    }
});

// setInterval(() => {
//     ctx.clearRect(0, 0, fieldWidth, fieldHeight);
//     tank.move();
//     tank.draw();
// }, 10);
