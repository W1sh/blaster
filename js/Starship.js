var Starship = Entity.extend(function () {
    var _this = this;
    this.currState = undefined; // estado atual;
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
        if(skin === "one_blue"){
            this.currState = this.states.one_blue;
        }else if(skin === "one_green"){
            this.currState = this.states.one_green;
        }else if(skin === "one_red"){
            this.currState = this.states.one_red;
        }else if(skin === "two_blue:"){
            this.currState = this.states.two_blue;
        }else if(skin === "two_green"){
            this.currState = this.states.two_green;
        }else if(skin === "two_red"){
            this.currState = this.states.two_red;
        }else if(skin === "three_blue"){
            this.currState = this.states.three_blue;
        }else if(skin === "three_green"){
            this.currState = this.states.three_green;
        }else if(skin === "three_red"){
            this.currState = this.states.three_red;
        }
        this.rotation = 0;
        this.currentFrame = 0;
        setup();
    };

    this.rotate = function (x, y, addRotation) {
        //console.log("Click do rato: " + x + " : " + y);
        //console.log("Centro da nave: " + (this.x + this.width/2) + " : " + (this.y + this.height));
        this.rotation = (Math.atan2((y - this.height/2) - this.y, (x - this.width/2) - this.x) * 180 / Math.PI) + addRotation;
    };

    /*this.getShootingPositions = function(){
        var positionX = this.x + Math.cos(this.rotation) * 10;
        var positionY = this.y + Math.sin(this.rotation) * 10;
        console.log("Centro da nave: " + (this.x + this.width/2) + " : " + (this.y + this.height/2));
        return [positionX, positionY];
    };*/

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
});