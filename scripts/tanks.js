let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
let fieldWidth = canvas.width;
let fieldHeight = canvas.height;
let canfi = new CanFi(canvas);

let direction = {
    UP: 'up',
    DOWN: 'down',
    LEFT: 'left',
    RIGHT: 'right'
};

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
    
    get hitbox() {
        return {
            xMin : this._x - this._hull.offsetWidth,
            yMin : this._y - this._hull.offsetHeight,
            xMax : this._x + this._hull.offsetWidth,
            yMax : this._y + this._hull.offsetHeight
        };
    }

    get fore() {
        switch(this._direction) {
            case 'up':
            return {
                xMin : this._x - this._hull.offsetWidth,
                xMax : this._x + this._hull.offsetWidth,
                yMin : this._y - this._hull.offsetHeight,
                yMax : this._y - this._hull.offsetHeight
            };
            case 'down':
            return {
                xMin : this._x - this._hull.offsetWidth,
                xMax : this._x + this._hull.offsetWidth,
                yMin : this._y + this._hull.offsetHeight,
                yMax : this._y + this._hull.offsetHeight
            };
            case 'left':
            return {
                xMin : this._x - this._hull.offsetHeight,
                xMax : this._x - this._hull.offsetHeight,
                yMin : this._y - this._hull.offsetWidth,
                yMax : this._y + this._hull.offsetWidth
            };
            case 'right':
            return {
                xMin : this._x + this._hull.offsetHeight,
                xMax : this._x + this._hull.offsetHeight,
                yMin : this._y - this._hull.offsetWidth,
                yMax : this._y + this._hull.offsetWidth
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
        this._hull.draw(this.hullAttribs.position.x, this.hullAttribs.position.y, this._direction);
        this._track.draw(this.trackLeftAttribs.position.x, this.trackLeftAttribs.position.y, this._direction);
        this._track.draw(this.trackRightAttribs.position.x, this.trackRightAttribs.position.y, this._direction);
        this._turret.draw(this.turretAttribs.position.x, this.turretAttribs.position.y, this._direciton);
        this._cannon.draw(this.cannonAttribs.position.x, this.cannonAttribs.position.y, this._direction);
    }

    isHitboxHit(x, y) {
        if (x >= this.hitbox.xMin && x <= this.hitbox.xMax) {
            if (y >= this.hitbox.yMin && y <= this.hitbox.yMax) {
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

    moveBack() {
        switch(this._direction) {
            case 'up':
            this._y += this._speed;
            break;
            case 'down':
            this._y -= this._speed;
            break;
            case 'left':
            this._x += this._speed;
            break;
            case 'right':
            this._x -= this._speed;
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

class Interaction {
    static isBulletHitsTank(bullet, tank) {
        return bullet.forePoints.some(point => tank.isHitboxHit(point.x, point.y));
    }

    static isBulletHitsWall(bullet) {
        if (bullet.fore.yMin == 0 || bullet.fore.yMax == fieldHeight || bullet.fore.xMin == 0 || bullet.fore.xMax == fieldWidth) {
            return true;
        }
        return false;
    }

    static isTankCollidesTank(tank, anotherTank) {
        return tank.forePoints.some(point => anotherTank.isHitboxHit(point.x, point.y));
    }

    static isTankCollidesWall(tank) {
        if (tank.fore.yMin == 0 || tank.fore.yMax == fieldHeight || tank.fore.xMin == 0 || tank.fore.xMax == fieldWidth) {
            return true;
        }
        return false;
    }
}

class Handler {
    static handleShot(tank, enemies) {
        let bullet = tank.shoot();
        bullet.draw();
        let shotId = setInterval(() => {
            bullet.clear();
            bullet.move();
            if (Interaction.isBulletHitsWall(bullet)) {
                bullet.clear();
                clearInterval(shotId);
            } else if (enemies.length != 0) {
                let isEnemyHit = enemies.some((enemy, index) => {
                    if (Interaction.isBulletHitsTank(bullet, enemy)) {
                        enemy.clear();
                        enemies.splice(index, 1);
                        //delete enemy;
                        return true;
                    }
                    return false;
                });
                if (isEnemyHit) {
                    bullet.clear();
                    clearInterval(shotId);
                } else {
                    bullet.draw();
                }
            } else {
                bullet.draw();
            }
        }, 5);
    }

    static handleCollision(tank, others) {
        if (!Interaction.isTankCollidesWall(tank)) {
            if (others.length != 0) {
                return others.some(anotherTank => Interaction.isTankCollidesTank(tank, anotherTank));
            }
        } else if (Interaction.isTankCollidesWall(tank)) {
            return true;
        }
        return false;
    }

    static handleMove(tank, direction, otherTanks) {
        tank.clear();
        tank.direction = direction;
        tank.move();
        let isCollided = this.handleCollision(tank, otherTanks);
        if (isCollided) {
            tank.moveBack();
            tank.draw();    
        } else {
            tank.draw();
        }
        otherTanks.forEach(tank => tank.clear());
        otherTanks.forEach(tank => tank.draw());
    }
}

let size = 20; // 20px is standart size

let hullSizes = {
    width: size + 1,
    height: size + 1
};

let trackSizes = {
    width: size / 10 + 1,
    height: size + 1
};

let turretSizes = {
    width: size / 2 + 1,
    height: size / 2 + 1
};

let cannonSizes = {
    width: size / 10 + 1,
    height: size / 2 + size / 5 + 1
};

let hulls = {
    model1: new Hull(hullSizes.width, hullSizes.height, '#006400'),
    model2: new Hull(hullSizes.width, hullSizes.height, '#8b0000')
};

let tracks = {
    model1: new Track(trackSizes.width, trackSizes.height, '#aaaaaa'),
    model2: new Track(trackSizes.width, trackSizes.height, '#aaaaaa')
};

let turrets = {
    model1: new Turret(turretSizes.width, turretSizes.height, '#3cb371'),
    model2: new Turret(turretSizes.width, turretSizes.height, '#daa520')
};

let cannons = {
    model1: new Cannon(cannonSizes.width, cannonSizes.height, '#444444'),
    model2: new Cannon(cannonSizes.width, cannonSizes.height, '#444444')
};

let tankPlayerProps = {
    parts: {
        hull: hulls.model1,
        track: tracks.model1,
        turret: turrets.model1,
        cannon: cannons.model1    
    },
    speed: 2
};

let tankEnemyProps = {
    parts: {
        hull: hulls.model2,
        track: tracks.model2,
        turret: turrets.model2,
        cannon: cannons.model2    
    },
    speed: 2
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

let tankPlayer = new Tank(500, 300, tankPlayerProps.parts, direction.UP, tankPlayerProps.speed);
tankPlayer.draw();
enemies = [];
enemies.push(new Tank(200, 100, tankEnemyProps.parts, direction.RIGHT, tankEnemyProps.speed));
enemies.push(new Tank(350, 200, tankEnemyProps.parts, direction.DOWN, tankEnemyProps.speed));
enemies.push(new Tank(700, 300, tankEnemyProps.parts, direction.RIGHT, tankEnemyProps.speed));
enemies.push(new Tank(550, 100, tankEnemyProps.parts, direction.DOWN, tankEnemyProps.speed));
enemies.forEach(enemy => enemy.draw());

$('body').keydown(event => {
    let key = event.keyCode;
    switch(key) {
        case 37:
        case 38:
        case 39:
        case 40:
        let direction = keyActions[key];
        Handler.handleMove(tankPlayer, direction, enemies);
        break;
        case 32:
        Handler.handleShot(tankPlayer, enemies);
        break;
    }
});

/* let others = [tankPlayer];
setInterval(() => {
    enemies.forEach(tank => {
        Handler.handleShot(tank, others);
    })
}, 3000); */
