var Enemy = Entity.extend(function () {
    this.currState = undefined; // estado atual;
    this.type = undefined;
    this.health = 0;
    this.fireCooldown = 0;
    this.value = 0;
    this.interval = undefined;
    var _this = this;
    var canFire = false;

    this.states = {
        short: 'short',
        long: 'long'
    };

    this.constructor = function (spriteSheet, x, y, skin) {
        this.super();
        this.spriteSheet = spriteSheet;
        this.x = x;
        this.y = y;
        this.type = skin;
        if (skin === "short") {
            this.currState = this.states.short;
            this.health = 40;
            this.value = 50;
        } else if (skin === "long") {
            this.currState = this.states.long;
            this.health = 20;
            this.fireCooldown = 100;
            this.value = 75;
        }
        this.rotation = 0;
        this.currentFrame = 0;
        setup();
    };

    this.getSprite = function () {
        return this.frames[this.currentFrame];
    };

    function setup() {
        _this.eStates.short = _this.spriteSheet.getStats('short');
        _this.eStates.long = _this.spriteSheet.getStats('long');
        _this.frames = _this.eStates[_this.currState];
        _this.width = _this.frames[0].width;
        _this.height = _this.frames[0].height;
    }
});