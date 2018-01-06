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

let blockSection = {
    TOP: 'top',
    BOTTOM: 'bottom',
    LEFT: 'left',
    RIGHT: 'right',
    FULL: 'full'
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
    constructor(x, y, width, height, color, direction, speed, blockSize) {
        this._x = x;
        this._y = y;
        this._width = width; // 3px
        this._height = height;  // 5px
        this._color = color;
        this._direction = direction;
        this._speed = speed * 2;
        this._shotId = null;
        this._blockSize = blockSize;
        this._offsetWidth = (this._width - 1) / 2; // 1px
        this._offsetHeight = (this._height - 1) / 2; // 2px
    }

    get direction() {
        return this._direction;
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

    get center() {
        return {
            x: this._x,
            y: this._y
        };
    }

    get shotId() {
        return this._shotId;
    }

    set shotId(value) {
        this._shotId = value;
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

    get hitbox() {
        switch(this._direction) {
            case 'up':
            case 'down':
            return {
                xMin : this._x - this._offsetWidth,
                xMax : this._x + this._offsetWidth,
                yMin : this._y - this._offsetHeight,
                yMax : this._y + this._offsetHeight
            };
            case 'left':
            case 'right':
            return {
                xMin : this._x - this._offsetHeight,
                xMax : this._x + this._offsetHeight,
                yMin : this._y - this._offsetWidth,
                yMax : this._y + this._offsetWidth
            };
        }
    }

    get interbox() {
        switch(this._direction) {
            case 'up':
            return {
                xMin: this._x - this._offsetWidth - (this._blockSize - 1) / 2,
                xMax: this._x + this._offsetWidth + (this._blockSize - 1) / 2,
                yMin: this._y - this._offsetHeight - (this._blockSize - 1) / 2 - 1,
                yMax: this._y + this._blockSize // + this._height
            };
            case 'down':
            return {
                xMin: this._x - this._offsetWidth - (this._blockSize - 1) / 2,
                xMax: this._x + this._offsetWidth + (this._blockSize - 1) / 2,
                yMin: this._y - this._blockSize, // - this._height,
                yMax: this._y + this._offsetHeight + (this._blockSize - 1) / 2 + 1
            };
            case 'left':
            return {
                xMin: this._x - this._offsetWidth - (this._blockSize - 1) / 2 - 1,
                xMax: this._x + this._blockSize, // + this._height,
                yMin: this._y - this._offsetHeight - (this._blockSize - 1) / 2,
                yMax: this._y + this._offsetHeight + (this._blockSize - 1) / 2
            };
            case 'right':
            return {
                xMin: this._x - this._blockSize, // - this._height,
                xMax: this._x + this._offsetWidth + (this._blockSize - 1) / 2 + 1,
                yMin: this._y - this._offsetHeight - (this._blockSize - 1) / 2,
                yMax: this._y + this._offsetHeight + (this._blockSize - 1) / 2
            };
        }
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
        return false;
    }

    isHitboxHit(x, y) {
        if (x >= this.hitbox.xMin && x <= this.hitbox.xMax) {
            if (y >= this.hitbox.yMin && y <= this.hitbox.yMax) {
                return true;
            }
        }
        return false;
    }

    isInterboxHit(x, y) {
        if (x >= this.interbox.xMin && x <= this.interbox.xMax) {
            if (y >= this.interbox.yMin && y <= this.interbox.yMax) {
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

    get center() {
        return {
            x: this._x,
            y: this._y
        };
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
            xMax : this._x + this._hull.offsetWidth,
            yMin : this._y - this._hull.offsetHeight,
            yMax : this._y + this._hull.offsetHeight
        };
    }

    get interbox() {
        let blockSize = this._hull.width;
        switch(this._direction) {
            case 'up':
            return {
                xMin: this._x - this._hull.offsetWidth - (blockSize - 1) / 2,
                xMax: this._x + this._hull.offsetWidth + (blockSize - 1) / 2,
                yMin: this._y - this._hull.offsetHeight - blockSize - 1,
                yMax: this._y - this._hull.offsetHeight
            };
            case 'down':
            return {
                xMin: this._x - this._hull.offsetWidth - (blockSize - 1) / 2,
                xMax: this._x + this._hull.offsetWidth + (blockSize - 1) / 2,
                yMin: this._y + this._hull.offsetHeight,
                yMax: this._y + this._hull.offsetHeight + blockSize + 1
            };
            case 'left':
            return {
                xMin: this._x - this._hull.offsetWidth - blockSize - 1,
                xMax: this._x - this._hull.offsetWidth,
                yMin: this._y - this._hull.offsetHeight - (blockSize - 1) / 2,
                yMax: this._y + this._hull.offsetHeight + (blockSize - 1) / 2
            };
            case 'right':
            return {
                xMin: this._x + this._hull.offsetWidth,
                xMax: this._x + this._hull.offsetWidth + blockSize + 1,
                yMin: this._y - this._hull.offsetHeight - (blockSize - 1) / 2,
                yMax: this._y + this._hull.offsetHeight + (blockSize - 1) / 2
            };
        }
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

    isInterboxHit(x, y) {
        if (x >= this.interbox.xMin && x <= this.interbox.xMax) {
            if (y >= this.interbox.yMin && y <= this.interbox.yMax) {
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
        let blockSize = this._hull.width;
        switch(this._direction) {
            case 'up':
            x = this.cannonAttribs.position.x;
            y = this.cannonAttribs.position.y - this._cannon.offsetHeight + this._bulletProps.height;
            break;
            case 'down':
            x = this.cannonAttribs.position.x;
            y = this.cannonAttribs.position.y + this._cannon.offsetHeight - this._bulletProps.height;
            break;
            case 'left':
            x = this.cannonAttribs.position.x - this._cannon.offsetHeight + this._bulletProps.height;
            y = this.cannonAttribs.position.y;
            break;
            case 'right':
            x = this.cannonAttribs.position.x + this._cannon.offsetHeight - this._bulletProps.height;
            y = this.cannonAttribs.position.y;
            break;
        }
        return new Bullet(x, y, this._bulletProps.width, this._bulletProps.height, this._bulletProps.color, this._direction, this._bulletProps.speed, blockSize);
    }

    clear() {
        this._hull.clear(this.hullAttribs.position.x, this.hullAttribs.position.y);
        this._track.clear(this.trackLeftAttribs.position.x, this.trackLeftAttribs.position.y, this._direction);
        this._track.clear(this.trackRightAttribs.position.x, this.trackRightAttribs.position.y, this._direction);
        this._turret.clear(this.turretAttribs.position.x, this.turretAttribs.position.y);
        this._cannon.clear(this.cannonAttribs.position.x, this.cannonAttribs.position.y, this._direction);
    }
}

class Block {
    constructor(x, y, size) {
        this._x = x;
        this._y = y;
        this._size = size;
        this._section = blockSection.FULL;
        this._isBreakable = false;
        this._isAttackable = true;
        this._isIgnorable = false;
    }

    get offsetSize() {
        return (this._size - 1) / 2;
    }

    get isBreakable() {
        return this._isBreakable;
    }

    get isAttackable() {
        return this._isAttackable;
    }

    get isIgnorable() {
        return this._isIgnorable;
    }

    get section() {
        return this._section;
    }

    set section(value) {
        this._section = value;
    }

    get hitbox() {
        return {
            xMin : this._x - this.offsetSize,
            xMax : this._x + this.offsetSize,
            yMin : this._y - this.offsetSize,
            yMax : this._y + this.offsetSize
        };
    }

    get center() {
        return {
            x: this._x,
            y: this._y
        };
    }

    isHitboxHit(x, y) {
        if (x >= this.hitbox.xMin && x <= this.hitbox.xMax) {
            if (y >= this.hitbox.yMin && y <= this.hitbox.yMax) {
                return true;
            }
        }
        return false;
    }

    clear() {
        ctx.clearRect(this._x - this.offsetSize, this._y - this.offsetSize, this._size, this._size);
    }
}

class Brick extends Block {
    constructor(x, y, size) {
        super(x, y, size);
        this._isBreakable = true;
        this._isBroken = false;
        this._hitbox = {
            xMin : this._x - this.offsetSize,
            xMax : this._x + this.offsetSize,
            yMin : this._y - this.offsetSize,
            yMax : this._y + this.offsetSize
        };
    }

    get hitbox() {
        return this._hitbox;
    }

    set hitbox(value) {
        this._hitbox = value;
    }

    get isBroken() {
        return this._isBroken;
    }

    set isBroken(value) {
        this._isBroken = value;
    }

    draw() {
        let prevColor = ctx.fillStyle;
        ctx.fillStyle = '#bbb';
        ctx.fillRect(this._x - this.offsetSize, this._y - this.offsetSize, this._size, this._size);
        ctx.fillStyle = '#b22222';
        ctx.fillRect(this._x - this.offsetSize + 1, this._y - this.offsetSize + 1, this.offsetSize - 1, this.offsetSize - 1);
        ctx.fillRect(this._x + 1, this._y - this.offsetSize + 1, this.offsetSize - 1, this.offsetSize - 1);
        ctx.fillRect(this._x - this.offsetSize + 1, this._y + 1, this.offsetSize - 1, this.offsetSize - 1);
        ctx.fillRect(this._x + 1, this._y + 1, this.offsetSize - 1, this.offsetSize - 1);
        ctx.fillStyle = prevColor;
        this._section = blockSection.FULL;
    }

    clear(section) {
        switch(section) {
            case 'top':
            ctx.clearRect(this._x - this.offsetSize, this._y - this.offsetSize, this._size, this.offsetSize);
            this._section = blockSection.BOTTOM;
            this.hitbox = {
                xMin : this._x - this.offsetSize,
                xMax : this._x + this.offsetSize,
                yMin : this._y,
                yMax : this._y + this.offsetSize
            };
            break;
            case 'bottom':
            ctx.clearRect(this._x - this.offsetSize, this._y + 1, this._size, this.offsetSize);
            this._section = blockSection.TOP;
            this.hitbox = {
                xMin : this._x - this.offsetSize,
                xMax : this._x + this.offsetSize,
                yMin : this._y - this.offsetSize,
                yMax : this._y
            };
            break;
            case 'left':
            ctx.clearRect(this._x - this.offsetSize, this._y - this.offsetSize, this.offsetSize, this._size);
            this._section = blockSection.RIGHT;
            this.hitbox = {
                xMin : this._x,
                xMax : this._x + this.offsetSize,
                yMin : this._y - this.offsetSize,
                yMax : this._y + this.offsetSize
            };
            break;
            case 'right':
            ctx.clearRect(this._x + 1, this._y - this.offsetSize, this.offsetSize, this._size);
            this._section = blockSection.LEFT;
            this.hitbox = {
                xMin : this._x - this.offsetSize,
                xMax : this._x,
                yMin : this._y - this.offsetSize,
                yMax : this._y + this.offsetSize
            };
            break;
            case 'full':
            ctx.clearRect(this._x - this.offsetSize, this._y - this.offsetSize, this._size, this._size);
            this._section = null;
            break;
        }
    }
}

class Water extends Block {
    constructor(x, y, size) {
        super(x, y, size);
        this._isIgnorable = true;
        this._animationId = null;
    }

    draw() {
        let prevColor = ctx.fillStyle;
        ctx.fillStyle = '#0000cd';
        ctx.fillRect(this._x - this.offsetSize, this._y - this.offsetSize, this._size, this._size);
        ctx.fillStyle = '#0ff';
        ctx.fillRect(this._x + 1, this._y - this.offsetSize / 2, this.offsetSize - 1, this.offsetSize / 5);
        ctx.fillRect(this._x - this.offsetSize + 1, this._y + this.offsetSize / 2, this.offsetSize - 1, this.offsetSize / 5);
        let turn = true;
        this._animationId = setInterval(() => {
            if (turn) {
                ctx.fillStyle = '#0000cd';
                ctx.fillRect(this._x - this.offsetSize, this._y - this.offsetSize, this._size, this._size);
                ctx.fillStyle = '#0ff';
                ctx.fillRect(this._x - this.offsetSize + 1, this._y - this.offsetSize / 2, this.offsetSize - 1, this.offsetSize / 5);
                ctx.fillRect(this._x + 1, this._y + this.offsetSize / 2, this.offsetSize - 1, this.offsetSize / 5);
                turn = !turn;
            } else {
                ctx.fillStyle = '#0000cd';
                ctx.fillRect(this._x - this.offsetSize, this._y - this.offsetSize, this._size, this._size);
                ctx.fillStyle = '#0ff';
                ctx.fillRect(this._x + 1, this._y - this.offsetSize / 2, this.offsetSize - 1, this.offsetSize / 5);
                ctx.fillRect(this._x - this.offsetSize + 1, this._y + this.offsetSize / 2, this.offsetSize - 1, this.offsetSize / 5);
                turn = !turn;
            }
        }, 3000);
        ctx.fillStyle = prevColor;
    }

    clear() {
        ctx.clearRect(this._x - this.offsetSize, this._y - this.offsetSize, this._size, this._size);
        clearInterval(this._animationId);
    }
}

class Metall extends Block {
    constructor(x, y, size) {
        super(x, y, size);
        this._isAttackable = false;
    }

    draw() {
        let prevColor = ctx.fillStyle;
        ctx.fillStyle = "#696969";
        ctx.fillRect(this._x - this.offsetSize, this._y - this.offsetSize, this._size, this._size);
        ctx.fillStyle = "#f8f8ff";
        ctx.fillRect(this._x - this.offsetSize / 2, this._y - this.offsetSize / 2, (this._size - 1) / 2 + 1, (this._size - 1) / 2 + 1);
        ctx.fillStyle = prevColor;
    }

    clear() {
        ctx.clearRect(this._x - this.offsetSize, this._y - this.offsetSize, this._size, this._size);
    }
}

class Stone extends Block {
    constructor(x, y, size) {
        super(x, y, size);
    }

    draw() {
        let prevColor = ctx.fillStyle;
        ctx.fillStyle = "#a9a9a9";
        ctx.fillRect(this._x - this.offsetSize, this._y - this.offsetSize, this._size, this._size);
        ctx.fillStyle = "#595959";
        canfi.fillCircle(this._x, this._y, this.offsetSize / 2);
        ctx.fillStyle = prevColor;
    }
}

class Interaction {

    static isBulletHitsTanks(bullet, tanks) {
        let records = [];
        tanks.forEach((tank, index) => {
            if (tank != null) {
                if (bullet.isInterboxHit(tank.center.x, tank.center.y)) {
                    if (bullet.forePoints.some(point => tank.isHitboxHit(point.x, point.y))) {
                        records.push({
                            isHit: true,
                            target: tank,
                            index: index
                        });
                    } else {
                        records.push({
                            isHit: false,
                            target: tank,
                            index: index
                        });
                    }
                }
            }
        });
        return records;
    }

    static isBulletHitsBlocks(bullet, blocks) {
        let records = [];
        blocks.forEach((block, index) => {
            if (block != null) {
                if (bullet.isInterboxHit(block.center.x, block.center.y)) {
                    if (bullet.forePoints.some(point => block.isHitboxHit(point.x, point.y))) {
                        records.push({
                            isHit: true,
                            target: block,
                            index: index
                        });
                    } else {
                        records.push({
                            isHit: false,
                            target: block,
                            index: index
                        });
                    }
                }
            }
        });
        return records;
    }

    static isBulletHitsBullets(bullet, otherBullets) {
        let records = [];
        otherBullets.forEach((anotherBullet, index) => {
            if (anotherBullet != null && bullet != anotherBullet) {
                if (bullet.isInterboxHit(anotherBullet.center.x, anotherBullet.center.y)) {
                    if (bullet.forePoints.some(point => anotherBullet.isHitboxHit(point.x, point.y))) {
                        records.push({
                            isHit: true,
                            target: anotherBullet,
                            index: index
                        });
                    } else {
                        records.push({
                            isHit: false,
                            target: anotherBullet,
                            index: index
                        });
                    }
                }
            }
        });
        return records;
    }

    static isTankCollidesTanks(tank, otherTanks) {
        let records = [];
        otherTanks.forEach((anotherTank, index) => {
            if (anotherTank != null) {
                if (tank.isInterboxHit(anotherTank.center.x, anotherTank.center.y)) {
                    if (tank.forePoints.some(point => anotherTank.isHitboxHit(point.x, point.y))) {
                        records.push({
                            isCollided: true,
                            target: anotherTank,
                            index: index
                        });
                    } else {
                        records.push({
                            isCollided: false,
                            target: anotherTank,
                            index: index
                        });
                    }
                }
            }
        });
        return records;
    }

    static isTankCollidesBlocks(tank, blocks) {
        let records = [];
        blocks.forEach((block, index) => {
            if (block != null) {
                if (tank.isInterboxHit(block.center.x, block.center.y)) {
                    if (tank.forePoints.some(point => block.isHitboxHit(point.x, point.y))) {
                        records.push({
                            isCollided: true,
                            target: block,
                            index: index
                        });
                    } else {
                        records.push({
                            isCollided: false,
                            target: block,
                            index: index
                        });
                    }
                }
            }
        });
        return records;
    }

    static isBulletHitsWall(bullet) {
        if (bullet.fore.yMin == -1 || bullet.fore.yMax == fieldHeight || bullet.fore.xMin == -1 || bullet.fore.xMax == fieldWidth) {
            return true;
        }
        return false;
    }

    static isTankCollidesWall(tank) {
        if (tank.fore.yMin == -1 || tank.fore.yMax == fieldHeight || tank.fore.xMin == -1 || tank.fore.xMax == fieldWidth) {
            return true;
        }
        return false;
    }
}

class Handler {
    static handleShot(tank, otherTanks, blocks, otherBullets) {
        let bullet = tank.shoot();
        bullet.draw();
        bullet.shotId = setInterval(() => {
            bullet.clear();
            bullet.move();
            let isHitWall = Interaction.isBulletHitsWall(bullet);
            let isHitBlock = false;
            let isHitTank = false;
            let isHitBullet = false;
            let isHitInvulnerable = false;
            let isHitIgnorable = false;
            if (blocks.length != 0) {
                let records = Interaction.isBulletHitsBlocks(bullet, blocks);
                records.forEach(record => {
                    let isHit = record.isHit;
                    isHitBlock += isHit;
                    if (isHit) {
                        let block = record.target;
                        let index = record.index;
                        if (!block.isAttackable) {
                            isHitInvulnerable = true;
                        } else if (block.isIgnorable) {
                            isHitIgnorable = true;
                            isHitBlock = false;
                            block.clear();
                            block.draw();
                        } else if (block.isBroken || !block.isBreakable) {
                            block.clear(blockSection.FULL);
                            blocks.splice(index, 1, null);
                        } else {
                            switch(bullet.direction) {
                                case 'up':
                                block.clear(blockSection.BOTTOM);
                                break;
                                case 'down':
                                block.clear(blockSection.TOP);
                                break;
                                case 'left':
                                block.clear(blockSection.RIGHT);
                                break;
                                case 'right':
                                block.clear(blockSection.LEFT);
                                break;
                            }
                            block.isBroken = true;
                        }
                    } else if (record.target.isIgnorable) {
                        isHitIgnorable = true;
                        isHitBlock += false;
                        record.target.clear();
                        record.target.draw();
                    }
                });
            }
            if (otherTanks.length != 0) {
                let records = Interaction.isBulletHitsTanks(bullet, otherTanks);
                records.forEach(record => {
                    let isHit = record.isHit;
                    isHitTank += isHit;
                    if (isHit) {
                        record.target.clear();
                        otherTanks.splice(record.index, 1, null);
                    }
                });
            }
            if (otherBullets.length != 0) {
                // It's not implemented
            }
            if (isHitBlock || isHitWall || isHitTank || isHitBullet || isHitInvulnerable) {
                tank.clear();
                tank.draw();
                clearInterval(bullet.shotId);
            } else if (!isHitIgnorable) {
                bullet.draw();
            }
        }, 10);
    }

    static handleMove(tank, direction, otherTanks, blocks) {
        tank.clear();
        tank.direction = direction;
        tank.move();
        let isCollidedWall = Interaction.isTankCollidesWall(tank);
        let isCollidedTank = false;
        let isCollidedBlock = false;
        if (otherTanks.length != 0) {
            let records = Interaction.isTankCollidesTanks(tank, otherTanks);
            records.forEach(record => {
                let isCollided = record.isCollided;
                isCollidedTank += isCollided;
                if (isCollided) {
                    record.target.clear();
                    record.target.draw();
                }
            });
        }
        if (blocks.length != 0) {
            let records = Interaction.isTankCollidesBlocks(tank, blocks);
            records.forEach(record => {
                let isCollided = record.isCollided;
                isCollidedBlock += isCollided;
                let block = record.target;
                switch(block.section) {
                    case 'full':
                    block.clear(blockSection.FULL);
                    block.draw();
                    break;
                    case 'top':
                    block.clear(blockSection.FULL);
                    block.draw();
                    block.clear(blockSection.BOTTOM);
                    break;
                    case 'bottom':
                    block.clear(blockSection.FULL);
                    block.draw();
                    block.clear(blockSection.TOP);
                    break;
                    case 'left':
                    block.clear(blockSection.FULL);
                    block.draw();
                    block.clear(blockSection.RIGHT);
                    break;
                    case 'right':
                    block.clear(blockSection.FULL);
                    block.draw();
                    block.clear(blockSection.LEFT);
                    break;
                }
            });
        }
        if (isCollidedBlock || isCollidedTank || isCollidedWall) {
            tank.moveBack();
            tank.draw();    
        } else {
            tank.draw();
        }
    }

    static handleDirectionChange(tank, direction, otherTanks, blocks) {
        tank.clear();
        let isCollidedWall = Interaction.isTankCollidesWall(tank);
        let isCollidedTank = false;
        let isCollidedBlock = false;
        if (otherTanks.length != 0) {
            let records = Interaction.isTankCollidesTanks(tank, otherTanks);
            records.forEach(record => {
                record.target.clear();
                record.target.draw();
            });
        }
        if (blocks.length != 0) {
            let records = Interaction.isTankCollidesBlocks(tank, blocks);
            records.forEach(record => {
                let block = record.target;
                switch(block.section) {
                    case 'full':
                    block.clear(blockSection.FULL);
                    block.draw();
                    break;
                    case 'top':
                    block.clear(blockSection.FULL);
                    block.draw();
                    block.clear(blockSection.BOTTOM);
                    break;
                    case 'bottom':
                    block.clear(blockSection.FULL);
                    block.draw();
                    block.clear(blockSection.TOP);
                    break;
                    case 'left':
                    block.clear(blockSection.FULL);
                    block.draw();
                    block.clear(blockSection.RIGHT);
                    break;
                    case 'right':
                    block.clear(blockSection.FULL);
                    block.draw();
                    block.clear(blockSection.LEFT);
                    break;
                }
            });
        }
        tank.direction = direction;
        tank.draw();
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
    speed: 1
};

let tankEnemyProps = {
    parts: {
        hull: hulls.model2,
        track: tracks.model2,
        turret: turrets.model2,
        cannon: cannons.model2    
    },
    speed: 1
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

let enemies = [];
let blocks = [];
let bullets = [];

let tankPlayer = new Tank(800, 200, tankPlayerProps.parts, direction.UP, tankPlayerProps.speed);
tankPlayer.draw();
enemies.push(new Tank(199, 500, tankEnemyProps.parts, direction.RIGHT, tankEnemyProps.speed));
enemies.forEach(enemy => enemy.draw());

for (let i = 10; i < 600; i += 21) {
    for (let j = 50; j < 200; j += 21) {
        if (j % 2 == 0) {
            blocks.push(new Stone(i, j, size + 1));
        } else {
            blocks.push(new Brick(i, j, size + 1));
        }
    }
}

blocks.forEach(block => block.draw());

$('body').keydown(event => {
    let key = event.keyCode;
    switch(key) {
        case 37:
        case 38:
        case 39:
        case 40:
        let direction = keyActions[key];
        if (tankPlayer.direction === direction) {
            Handler.handleMove(tankPlayer, direction, enemies, blocks);
        } else {
            Handler.handleDirectionChange(tankPlayer, direction, enemies, blocks);
        }
        break;
        case 32:
        Handler.handleShot(tankPlayer, enemies, blocks, bullets);
        break;
    }
});

/* let i = 0;
let delay = 1000;
let others = [tankPlayer];
let pai = () => {
    let id = setTimeout(() => {
        if (i < 6) {
            Handler.handleShot(enemies[0], others, blocks);
        } else if (i < 200) {
            delay = 40;
            Handler.handleMove(enemies[0], direction.UP, others, blocks);
        } else if (i < 210) {
            delay = 1000;
            Handler.handleDirectionChange(enemies[0], direction.RIGHT);
            Handler.handleShot(enemies[0], others, blocks);
        } else if (i < 300) {
            delay = 40;
            Handler.handleMove(enemies[0], direction.RIGHT, others, blocks);
        } else if (i < 305) {
            delay = 1000;
            Handler.handleDirectionChange(enemies[0], direction.LEFT);
        } else if (i < 320) {
            delay = 1000;
            Handler.handleShot(enemies[0], others, blocks);
        } else if (i < 500) {
            delay = 40;
            Handler.handleMove(enemies[0], direction.LEFT, others, blocks);
        } else {
            clearTimeout(id);
        }
        i++;
        pai();
    }, delay);
};

pai(); */
