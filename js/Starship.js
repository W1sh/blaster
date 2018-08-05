var Starship = Entity.extend(function () {
    var _this = this;
    this.health = 3;
    this.currState = undefined; // estado atual;
    this.invulnerable = false;
    this.invulnerableTime = 3;
    this.invisivel=false;
    this.cont=0;    
    this.states = {
        one_blue: 'one_blue',
        one_green: 'one_green',
        one_red: 'one_red',
        two_blue: 'two_blue',
        two_green: 'two_green',
        two_red: 'two_red',
        three_blue: 'three_blue',
        three_green: 'three_green',
        three_red: 'three_red',
    };

    this.constructor = function (spriteSheet, x, y, skin) {
        this.super();
        this.spriteSheet = spriteSheet;
        this.x = x;
        this.y = y;
        if (skin === "one_blue") {
            this.currState = this.states.one_blue;
        } else if (skin === "one_green") {
            this.currState = this.states.one_green;
        } else if (skin === "one_red") {
            this.currState = this.states.one_red;
        } else if (skin === "two_blue:") {
            this.currState = this.states.two_blue;
        } else if (skin === "two_green") {
            this.currState = this.states.two_green;
        } else if (skin === "two_red") {
            this.currState = this.states.two_red;
        } else if (skin === "three_blue") {
            this.currState = this.states.three_blue;
        } else if (skin === "three_green") {
            this.currState = this.states.three_green;
        } else if (skin === "three_red") {
            this.currState = this.states.three_red;
        }
        this.rotation = 0;
        this.currentFrame = 0;
        setup();
    };

    this.rotate = function (x, y, addRotation) {
        this.rotation = (Math.atan2((y - this.height / 2) - this.y, (x - this.width / 2) - this.x) * 180 / Math.PI) + addRotation;
    };

    function setup() {
        _this.eStates.one_blue = _this.spriteSheet.getStats('one_blue');
        _this.eStates.one_green = _this.spriteSheet.getStats('one_green');
        _this.eStates.one_red = _this.spriteSheet.getStats('one_red');
        _this.eStates.two_blue = _this.spriteSheet.getStats('two_blue');
        _this.eStates.two_green = _this.spriteSheet.getStats('two_green');
        _this.eStates.two_red = _this.spriteSheet.getStats('two_red');
        _this.eStates.three_blue = _this.spriteSheet.getStats('three_blue');
        _this.eStates.three_green = _this.spriteSheet.getStats('three_green');
        _this.eStates.three_red = _this.spriteSheet.getStats('three_red');
        _this.frames = _this.eStates[_this.currState];
        _this.width = _this.frames[0].width;
        _this.height = _this.frames[0].height;
    }
    this.render = function (ds) {
        if (!this.active) return;
        ds.save();
        var sprite = this.getSprite();

        ds.translate(Math.floor(this.x + (this.width / 2)),
            Math.floor(this.y + (this.height / 2)));
        ds.rotate(this.rotation * Math.PI / 180);

        if (this.invulnerable) {
            this.cont++;
            if(this.cont< fpsCap*this.invulnerableTime){
                if(this.cont % 5 === 0){
                    this.invisivel = this.invisivel === true ? false : true;
                }
            // invulnerableTime * 60 = numero de frames desenhados, 
            // invisivel  -> alpha -> invisivel -> alpha
            if(this.invisivel){
                ds.restore();
                return;
            }
            ds.globalAlpha=0.5;
            }else{
                this.invisivel = false;
                this.invulnerable = false;
                this.cont = 0;
            }
        }

        ds.drawImage(
            this.spriteSheet.img,
            sprite.x, sprite.y,
            sprite.width, sprite.height,
            Math.floor(-this.width / 2), Math.floor(-this.height / 2),
            this.width * this.scaleFactor, this.height * this.scaleFactor
        );
        ds.restore();
    };
});