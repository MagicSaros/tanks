let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
let fieldWidth = canvas.width;
let fieldHeight = canvas.height;
let canfi = new CanFi(canvas);

class Element {
    constructor(width, height, color) {
        this._width = width;
        this._height = height;
        this._color = color;
    }

    get width() {
        return this._width;
    }

    get height() {
        return this._height;
    }

    get color() {
        return this._color;
    }
}

class Hull extends Element {
    constructor(width, height, color) {
        super(width, height, color);
        this._offsetX = (this._width - 1) / 2; // 10px
        this._offsetY = (this._height - 1) / 2; // 10px
    }

    get offsetWidth() {
        return this._offsetX;
    }

    get offsetHeight() {
        return this._offsetY;
    }

    draw(x, y, direction) {
        let prevColor = ctx.fillStyle;
        ctx.fillStyle = this._color;
        ctx.fillRect(x - this._offsetX, y - this._offsetY, this._width, this._height);
        ctx.fillStyle = prevColor;
    }

    clear(x, y, direction) {
        ctx.clearRect(x - this._offsetX, y - this._offsetY, this._width, this._height);
    }
}

class Track extends Element {
    constructor(width, height, color) {
        super(width, height, color);
        this._offsetX = (this._width - 1) / 2; // 1px
        this._offsetY = (this._height - 1) / 2; // 10px
    }
    
    get offsetWidth() {
        return this._offsetX;
    }

    get offsetHeight() {
        return this._offsetY;
    }

    draw(x, y, direction) {
        let prevColor = ctx.fillStyle;
        ctx.fillStyle = this._color;
        switch(direction) {
            case 'up':
            case 'down':
            ctx.fillRect(x - this._offsetX, y - this._offsetY, this._width, this._height);
            break;
            case 'left':
            case 'right':
            ctx.fillRect(x - this._offsetY, y - this._offsetX, this._height, this._width);
            break;    
        }
        ctx.fillStyle = prevColor;
    }
    
    clear(x, y, direction) {
        switch(direction) {
            case 'up':
            case 'down':
            ctx.clearRect(x - this._offsetX, y - this._offsetY, this._width, this._height);
            break;
            case 'left':
            case 'right':
            ctx.clearRect(x - this._offsetY, y - this._offsetX, this._height, this._width);
            break;    
        }
    }
}

class Turret extends Element {
    constructor(width, height, color) {
        super(width, height, color);
        this._offsetX = (this._width - 1) / 2; // 5px
        this._offsetY = (this._height - 1) / 2; // 5px
        
    }

    get offsetWidth() {
        return this._offsetX;
    }

    get offsetHeight() {
        return this._offsetY;
    }

    draw(x, y, direction) {
        let prevColor = ctx.fillStyle;
        ctx.fillStyle = this._color;
        ctx.fillRect(x - this._offsetX, y - this._offsetY, this._width, this._height);
        ctx.fillStyle = prevColor;
    }
    
    clear(x, y, direction) {
        ctx.clearRect(x - this._offsetX, y - this._offsetY, this._width, this._height);
    }
}

class Cannon extends Element {
    constructor(width, height, color) {
        super(width, height, color);
        this._offsetX = (this._width - 1) / 2; // 1px
        this._offsetY = (this._height - 1) / 2; // 7px
    }

    get offsetWidth() {
        return this._offsetX;
    }

    get offsetHeight() {
        return this._offsetY;
    }

    draw(x, y, direction) {
        let prevColor = ctx.fillStyle;
        ctx.fillStyle = this._color;
        switch(direction) {
            case 'up':
            case 'down':
            ctx.fillRect(x - this._offsetX, y - this._offsetY, this._width, this._height);
            break;
            case 'left':
            case 'right':
            ctx.fillRect(x - this._offsetY, y - this._offsetX, this._height, this._width);
            break;
        }
        ctx.fillStyle = prevColor;
    }

    clear(x, y, direction) {
        switch(direction) {
            case 'up':
            case 'down':
            ctx.clearRect(x - this._offsetX, y - this._offsetY, this._width, this._height);
            break;
            case 'left':
            case 'right':
            ctx.clearRect(x - this._offsetY, y - this._offsetX, this._height, this._width);
            break;
        }
    }
}

class Bullet {
    constructor(x, y, width, height, color, direction, speed) {
        this._x = x;
        this._y = y;
        this._width = width; // 3px
        this._height = height;  // 5px
        this._color = color;
        this._direction = direction;
        this._speed = speed;
        this._offsetWidth = (this._width - 1) / 2; // 1px
        this._offsetHeight = (this._height - 1) / 2; // 2px
    }

    set direction(direction) {
        this._direction = direction;
    }

    get offsetWidth() {
        return this._offsetWidth;
    }

    get offsetHeight() {
        return this._offsetHeight;
    }

    get fore() {
        switch(this._direction) {
            case 'up':
            return {
                xMin : this._x - this._offsetWidth,
                xMax : this._x + this._offsetWidth,
                yMin : this._y - this._offsetHeight,
                yMax : this._y - this._offsetHeight
            };
            case 'down':
            return {
                xMin : this._x - this._offsetWidth,
                xMax : this._x + this._offsetWidth,
                yMin : this._y + this._offsetHeight,
                yMax : this._y + this._offsetHeight
            };
            case 'left':
            return {
                xMin : this._x - this._offsetHeight,
                xMax : this._x - this._offsetHeight,
                yMin : this._y - this._offsetWidth,
                yMax : this._y + this._offsetWidth
            };
            case 'right':
            return {
                xMin : this._x + this._offsetHeight,
                xMax : this._x + this._offsetHeight,
                yMin : this._y - this._offsetWidth,
                yMax : this._y + this._offsetWidth
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
            case 'down':
            ctx.fillRect(this._x - this._offsetWidth, this._y - this._offsetHeight, this._width, this._height);
            break;
            case 'left':
            case 'right':
            ctx.fillRect(this._x - this._offsetHeight, this._y - this._offsetWidth, this._height, this._width);
            break;
        }
        ctx.fillStyle = prevColor;
    }

    clear() {
        switch(this._direction) {
            case 'up':
            case 'down':
            ctx.clearRect(this._x - this._offsetWidth, this._y - this._offsetHeight, this._width, this._height);
            break;
            case 'left':
            case 'right':
            ctx.clearRect(this._x - this._offsetHeight, this._y - this._offsetWidth, this._height, this._width);
            break;
        }
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

    isForeHit(x, y) {
        if (x >= this.fore.xMin && x <= this.fore.xMax) {
            if (y >= this.fore.yMin && y <= this.fore.yMax) {
                return true;
            }
        }
        if (y >= this.fore.yMin && y <= this.fore.yMax) {
            if (x >= this.fore.xMin && x <= this.fore.xMax) {
                return true;
            }
        }
        return false;
    }
}

class Tank {
    constructor(x, y, parts, direction, speed) {
        this._x = x;
        this._y = y;
        this._hull = parts.hull;
        this._track = parts.track;
        this._turret = parts.turret;
        this._cannon = parts.cannon;
        this._direction = direction;
        this._speed = speed;
        this._bulletProps = {
            width: this._cannon.width,
            height: (this._hull.height - 1) / 5 + 1,
            color: this._cannon.color,
            speed: this._speed
        };
    }

    get direction() {
        return this._direction;
    }

    set direction(direction) {
        this._direction = direction;
    }

    get hullAttribs() {
        let x = this._x;
        let y = this._y;
        return {
            position: {
                x: x,
                y: y
            }
        };
    }

    get trackLeftAttribs() {
        let x;
        let y;
        switch(this._direction) {
            case 'up':
            x = this._x - this._hull.offsetWidth + this._track.offsetWidth;
            y = this._y - this._hull.offsetHeight + this._track.offsetHeight;
            break;
            case 'down':
            x = this._x + this._hull.offsetWidth - this._track.offsetWidth;
            y = this._y + this._hull.offsetHeight - this._track.offsetHeight;
            break;
            case 'left':
            x = this._x - this._hull.offsetHeight + this._track.offsetHeight;
            y = this._y + this._hull.offsetWidth - this._track.offsetWidth;
            break;
            case 'right':
            x = this._x + this._hull.offsetHeight - this._track.offsetHeight;
            y = this._y - this._hull.offsetWidth + this._track.offsetWidth;
            break;
        }
        return {
            position: {
                x: x,
                y: y
            }
        };
    }

    get trackRightAttribs() {
        let x;
        let y;
        switch(this._direction) {
            case 'up':
            x = this._x + this._hull.offsetWidth - this._track.offsetWidth;
            y = this._y - this._hull.offsetHeight + this._track.offsetHeight;
            break;
            case 'down':
            x = this._x - this._hull.offsetWidth + this._track.offsetWidth;
            y = this._y + this._hull.offsetHeight - this._track.offsetHeight;
            break;
            case 'left':
            x = this._x - this._hull.offsetHeight + this._track.offsetHeight;
            y = this._y - this._hull.offsetWidth + this._track.offsetWidth;
            break;
            case 'right':
            x = this._x + this._hull.offsetHeight - this._track.offsetHeight;
            y = this._y + this._hull.offsetWidth - this._track.offsetWidth;
            break;
        }
        return {
            position: {
                x: x,
                y: y
            }
        };
    }

    get turretAttribs() {
        let x = this._x;
        let y = this._y;
        return {
            position: {
                x: x,
                y: y
            }
        };
    }

    get cannonAttribs() {
        let x;
        let y;
        switch(this._direction) {
            case 'up':
            x = this._x;
            y = this._y - this._turret.offsetHeight - this._cannon.offsetHeight;
            break;
            case 'down':
            x = this._x;
            y = this._y + this._turret.offsetHeight + this._cannon.offsetHeight;
            break;
            case 'left':
            x = this._x - this._turret.offsetWidth - this._cannon.offsetHeight;
            y = this._y;
            break;
            case 'right':
            x = this._x + this._turret.offsetWidth + this._cannon.offsetHeight;
            y = this._y;
            break;
        }
        return {
            position: {
                x: x,
                y: y
            }
        };
    }

    get bulletProps() {
        return this._bulletProps;
    }

    set bulletProps(value) {
        this._bulletProps.width = value.width;
        this._bulletProps.height = value.height;
        this._color = value.color;
        this._speed = value.speed;
    }

    draw() {
        this._hull.draw(this.hullAttribs.position.x, this.hullAttribs.position.y, this._direction);
        this._track.draw(this.trackLeftAttribs.position.x, this.trackLeftAttribs.position.y, this._direction);
        this._track.draw(this.trackRightAttribs.position.x, this.trackRightAttribs.position.y, this._direction);
        this._turret.draw(this.turretAttribs.position.x, this.turretAttribs.position.y, this._direciton);
        this._cannon.draw(this.cannonAttribs.position.x, this.cannonAttribs.position.y, this._direction);
    }

    get activeBorder() {
        return {
            xMin : this._x - this._hull.offsetWidth,
            yMin : this._y - this._hull.offsetHeight,
            xMax : this._x + this._hull.offsetWidth,
            yMax : this._y + this._hull.offsetHeight
        };
    }

    isBorderHit(x, y) {
        if (x >= this.activeBorder.xMin && x <= this.activeBorder.xMax) {
            if (y >= this.activeBorder.yMin && y <= this.activeBorder.yMax) {
                console.log(x, y);
                return true;
            }
        }
        if (y >= this.activeBorder.yMin && y <= this.activeBorder.yMax) {
            if (x >= this.activeBorder.xMin && x <= this.activeBorder.xMax) {
                
                return true;
            }
        }
        return false;
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

    shoot() {
        let x;
        let y;
        switch(this._direction) {
            case 'up':
            x = this.cannonAttribs.position.x;
            y = this.cannonAttribs.position.y - this._cannon.offsetHeight - this._bulletProps.height;
            break;
            case 'down':
            x = this.cannonAttribs.position.x;
            y = this.cannonAttribs.position.y + this._cannon.offsetHeight + this._bulletProps.height;
            break;
            case 'left':
            x = this.cannonAttribs.position.x - this._cannon.offsetHeight - this._bulletProps.height;
            y = this.cannonAttribs.position.y;
            break;
            case 'right':
            x = this.cannonAttribs.position.x + this._cannon.offsetHeight + this._bulletProps.height;
            y = this.cannonAttribs.position.y;
            break;
        }
        return new Bullet(x, y, this._bulletProps.width, this._bulletProps.height, this._bulletProps.color, this._direction, this._bulletProps.speed);
    }

    clear() {
        this._hull.clear(this.hullAttribs.position.x, this.hullAttribs.position.y);
        this._track.clear(this.trackLeftAttribs.position.x, this.trackLeftAttribs.position.y, this._direction);
        this._track.clear(this.trackRightAttribs.position.x, this.trackRightAttribs.position.y, this._direction);
        this._turret.clear(this.turretAttribs.position.x, this.turretAttribs.position.y);
        this._cannon.clear(this.cannonAttribs.position.x, this.cannonAttribs.position.y, this._direction);
    }
}

let size = 20; // 20px is standart size

let tank = null;
let tankX = 500;
let tankY = 300;
let tankSpeed = 2;
let tankDirection = 'up';

let hullProps = {
    width: size + 1,
    height: size + 1,
    color: 'darkgreen'
};

let trackProps = {
    width: size / 10 + 1,
    height: size + 1,
    color: 'gray'
};

let turretProps = {
    width: size / 2 + 1,
    height: size / 2 + 1,
    color: 'darkgray'
};

let cannonProps = {
    width: size / 10 + 1,
    height: size / 2 + size / 5 + 1,
    color: 'black'
};

let tankParts = {
    hull: new Hull(hullProps.width, hullProps.height, hullProps.color),
    track: new Track(trackProps.width, trackProps.height, trackProps.color),
    turret: new Turret(turretProps.width, turretProps.height, turretProps.color),
    cannon: new Cannon(cannonProps.width, cannonProps.height, cannonProps.color)
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

tank = new Tank(tankX, tankY, tankParts, tankDirection, tankSpeed);
tank.draw();
let enemy = new Tank(400, 100, tankParts, 'up', tankSpeed);
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
        tank.shoot();
        let bullet = tank.shoot();
        bullet.draw();
        let shootId = setInterval(() => {
            bullet.clear();
            bullet.move();
            if (bullet.forePoints.some(point => enemy.isBorderHit(point.x, point.y))) {
                clearInterval(shootId);
                bullet.clear();
                enemy.clear();
            } else {
                bullet.draw();
            }
        }, 5);
        break;
    }
});
