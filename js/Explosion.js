var Explosion = Entity.extend(function () {
    this.currState = undefined; // estado atual;
    var _this = this;
 
    this.states = {
       explosion: 'explosion'
    };
 
    this.constructor = function (spriteSheet, x, y, width, height) {
       this.super();
       this.spriteSheet = spriteSheet;
       this.x = x;
       this.y = y;
       this.width = width;
       this.height = height;
       this.currState = this.states.explosion;
       this.currentFrame = 0;
       setup();
    };
 
    this.update = function () {
       if (!this.active) return;
       this.currentFrame = this.currentFrame < this.frames.length - 1 ? this.currentFrame + 1 : this.currentFrame;

       if (this.currentFrame == this.frames.length - 1) this.active = false;
    };
 
    this.getSprite = function () {
       return this.frames[this.currentFrame];
    };
 
    function setup() {
       _this.eStates.explosion = _this.spriteSheet.getStats('explosion');
       _this.frames = _this.eStates[_this.currState];
    }
 });