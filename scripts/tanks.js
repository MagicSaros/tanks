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
    constructor(x, y, width, height, hullColor, trackColor, speed, direction) {
        super(x, y, width, height, null, speed, direction);
        this._hullColor = hullColor;
        this._trackColor = trackColor;
        this._offsetX = this._width / 2;
        this._offsetY = this._height / 2;
        this._lengthX = this._width + 1;
        this._lengthY = this._height + 1;
        this._track = new Track(this._x, this._y, this._width, this._height, this._trackColor, this._speed, this._direction);
    }

    get direction() {
        return this._direction;
    }

    set direction(direction) {
        this._direction = direction;
    }

    draw() {
        let prevColor = ctx.fillStyle;
        ctx.fillStyle = this._hullColor;
        ctx.fillRect(this._x - this._offsetX, this._y - this._offsetY, this._lengthX, this._lengthY);
        ctx.fillStyle = this._trackColor;
        this._track.draw();
        ctx.fillStyle = prevColor;
    }

    isHit(x, y) {
        
    }

    move() {
        super.move();
        this._track.direction = this._direction;
        this._track.move();
    }

    clear() {
        this._track.clear();
        ctx.clearRect(this._x - this._offsetX, this._y - this._offsetY, this._lengthX, this._lengthY);
    }
}

class Cannon extends Element {
    constructor(x, y, width, height, color, speed, direction) {
        super(x, y, width, height, color, speed, direction);
        this._offsetX = this._width / 20; // 1px
        this._offsetY = this._height; // 20px
        this._lengthX = this._width / 10 + 1; // 3px
        this._lengthY = this._height / 2 + this._height / 4; // 15px
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

    clear() {
        switch(this._direction) {
            case 'up':
            ctx.clearRect(this._x - this._offsetX, this._y - this._offsetY, this._lengthX, this._lengthY);
            break;
            case 'down':
            ctx.clearRect(this._x - this._offsetX, this._y + this._offsetY - this._lengthY + 1, this._lengthX, this._lengthY);
            break;
            case 'left':
            ctx.clearRect(this._x - this._offsetY, this._y - this._offsetX, this._lengthY, this._lengthX);
            break;
            case 'right':
            ctx.clearRect(this._x + this._offsetY - this._lengthY + 1, this._y - this._offsetX, this._lengthY, this._lengthX);
            break;
        }
    }
}

class Turret extends Element {
    constructor(x, y, width, height, color, speed, direction) {
        super(x, y, width, height, color, speed, direction);
        this._offsetX = this._width / 4; // 5px
        this._offsetY = this._height / 4; // 5px
        this._lengthX = this._width / 2 + 1; // 11px
        this._lengthY = this._height / 2 + 1; // 11px
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

    clear() {
        ctx.clearRect(this._x - this._offsetX, this._y - this._offsetY, this._lengthX, this._lengthY);
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

    clear() {
        switch(this._direction) {
            case 'up':
            case 'down':
            ctx.clearRect(this._x - this._offsetX, this._y - this._offsetY, this._lengthX, this._lengthY);
            ctx.clearRect(this._x + this._offsetX- this._lengthX + 1, this._y - this._offsetY, this._lengthX, this._lengthY);
            break;
            case 'left':
            case 'right':
            ctx.clearRect(this._x - this._offsetX, this._y - this._offsetY, this._lengthY, this._lengthX);
            ctx.clearRect(this._x - this._offsetX, this._y + this._offsetY- this._lengthX + 1, this._lengthY, this._lengthX);
            break;    
        }
    }
}

class Bullet extends Element {
    constructor(x, y, width, height, color, speed, direction) {
        super(x, y, width, height, color, speed, direction);
        this._offsetX = this._width / 20; // 1px
        this._offsetY = this._height + (this._height / 10 + 1) * 2; // 26px
        this._lengthX = this._width / 10 + 1; // 3px
        this._lengthY = (this._height / 10 + 1) * 2; // 6px
    }

    set direction(direction) {
        this._direction = direction;
    }

    get fore() {
        switch(this._direction) {
            case 'up':
            return {
                xMin : this._x - this._offsetX,
                xMax : this._x + this._offsetX,
                yMin : this._y - this._lengthY / 2,
                yMax : this._y - this._lengthY / 2
            };
            case 'down':
            return {
                xMin : this._x - this._offsetX,
                xMax : this._x + this._offsetX,
                yMin : this._y + this._lengthY / 2,
                yMax : this._y + this._lengthY / 2
            };
            case 'left':
            return {
                xMin : this._x - this._offsetX,
                xMax : this._x - this._offsetX,
                yMin : this._y - (this._lengthX - 1) / 2,
                yMax : this._y + (this._lengthX - 1) / 2
            };
            case 'right':
            return {
                xMin : this._x + this._offsetX,
                xMax : this._x + this._offsetX,
                yMin : this._y - (this._lengthX - 1) / 2,
                yMax : this._y + (this._lengthX - 1) / 2
            };
        }
    }

    get forePoints() {
        let points = [];
        switch(this._direction) {
            case 'up':
            for (let x = this.fore.xMin; x <= this.fore.xMax; x++) {
                points.push({ x : x, y : this.fore.yMin });
            }
            break;
            case 'down':
            for (let x = this.fore.xMin; x <= this.fore.xMax; x++) {
                points.push({ x : x, y : this.fore.yMax });
            }
            break;
            case 'left':
            for (let y = this.fore.yMin; y <= this.fore.yMax; y++) {
                points.push({ x : this.fore.xMin, y : y });
            }
            break;
            case 'right':
            for (let y = this.fore.yMin; y <= this.fore.yMax; y++) {
                points.push({ x : this.fore.xMax, y : y });
            }
            break;
        }
        return points;
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

    isForeHit(x, y) {
        if (x == this.fore.xMin || x == this.fore.xMax) {
            if (y >= this.fore.yMin && y <= this.fore.yMax) {
                return true;
            }
        }
        if (y == this.fore.yMin || y == this.fore.yMax) {
            if (x >= this.fore.xMin && x <= this.fore.xMax) {
                return true;
            }
        }
        return false;
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
        this._hull = new Hull(this._x, this._y, this._width, this._height, this._colors.hullColor, this._colors.trackColor, this._speed, this._direction);
        this._turret = new Turret(this._x, this._y, this._width, this._height, this._colors.turretColor, this._speed, this._direction);
        this._cannon = new Cannon(this._x, this._y, this._width, this._height, this._colors.cannonColor, this._speed, this._direction);
    }

    set direction(direction) {
        this._direction = direction;
        this._hull.direction = direction;
        this._turret.direction = direction;
        this._cannon.direction = direction;
    }

    draw() {
        this._hull.draw();
        this._turret.draw();
        this._cannon.draw();
    }

    get activeBorder() {
        return {
            xMin : this._x - this._width / 2,
            yMin : this._y - this._height / 2,
            xMax : this._x + this._width / 2,
            yMax : this._y + this._height / 2
        };
    }

    isBorderHit(x, y) {
        if (x == this.activeBorder.xMin || x == this.activeBorder.xMax) {
            if (y >= this.activeBorder.yMin && y <= this.activeBorder.yMax) {
                return true;
            }
        }
        if (y == this.activeBorder.yMin || y == this.activeBorder.yMax) {
            if (x >= this.activeBorder.xMin && x <= this.activeBorder.xMax) {
                return true;
            }
        }
        return false;
    }

    move() {
        this._hull.move();
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
        let bulletSpeed = this._speed;
        let bullet = new Bullet(bulletX, bulletY, this._width, this._height, this._colors.bulletColor, bulletSpeed, this._direction);
        let shootId = setInterval(() => {
            bullet.clear();
            bullet.move();
            bullet.draw();
        }, 5);
        return {
            bullet : bullet,
            bulletId : shootId
        };
    }

    clear() {
        this._hull.clear();
        this._turret.clear();
        this._cannon.clear();
    }
}

let size = 20; // 20px is standart size

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
let enemy = new Tank(500, 100, size, size, elementsColors, tankSpeed, 'right');
enemy.draw();

$('body').keydown(event => {
    let key = event.keyCode;
    switch(key) {
        case 37:
        case 38:
        case 39:
        case 40:
        tank.clear();
        tank.direction = keyActions[key];
        tank.move();
        tank.draw();
        break;
        case 32:
        let bulletShoot = tank.shoot();
        if (bulletShoot.bullet.forePoints.some(point => enemy.isBorderHit(point.x, point.y))) {
            enemy.clear();
            bulletShoot.bullet.clear();
            clearInterval(bulletShoot.bulletId);
        }
        break;
    }
});
