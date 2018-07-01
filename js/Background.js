var Background = Entity.extend(function () {
    var _this = this;
    this.currState = undefined; // estado atual;
    this.states = {
        unique: 'unique'
    };

    this.constructor = function (spriteSheet, x, y) {
        this.super();
        this.x = x;
        this.y = y;
        this.spriteSheet = spriteSheet;
        this.currState = this.states.unique;
        setup();
    };

    setup = function () {
        _this.eStates.unique = _this.spriteSheet.getStats('unique');
        _this.frames = _this.eStates[_this.currState];
        _this.width = _this.frames[0].width; //atualizar a altura 
        _this.height = _this.frames[0].height; // atualizar os 
    };

    this.drawColisionBoundaries = function (ctx, boundingRect, boundingCircle, colorR, colorC) { return;};

    this.render = function (ds) {
        if (!this.active) return;
        var sprite = this.getSprite();

        ds.drawImage(
            this.spriteSheet.img,
            sprite.x, sprite.y,
            sprite.width, sprite.height,
            this.x, this.y,
            this.width, this.height
        );
    };
});