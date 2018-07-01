var Entity = Class.extend(function () {
    this.spriteSheet = undefined; // Spritesheet associada à entidade	
    this.eStates = {}; // dicionario de estados. Objecto de arrays de estados
    this.frames = []; // array com as frames atuais
    this.currentFrame = 0; // frame atual
    this.x = 0;
    this.y = 0;
    this.width = 0;
    this.height = 0;
    this.alpha = 1;
    this.rotation = 0;
    this.active = true;
    this.vx = 0;
    this.vy = 0;
    this.scaleFactor = 1;
    this.isColliding = false;

    this.constructor = function () {};

    this.update = function () {
        if (!this.active) return;

        this.x += this.vx;
        this.y += this.vy;
    };

    this.rotate = function (x, y, addRotation) {
        this.rotation = (Math.atan2(y - this.y, x - this.x) * 180 / Math.PI) + addRotation;
    };

    this.scale = function (scaleX, scaleY) {
        this.height = this.height * scaleY;
        this.width = this.width * scaleX;
        this.x -= scaleX / 2;
        this.y -= scaleY / 2;
    };

    this.left = function () {
        return this.x;
    };

    this.right = function () {
        return this.x + this.width;
    };

    this.top = function () {
        return this.y;
    };

    this.bottom = function () {
        return this.y + this.height;
    };

    this.getCenterX = function () {
        return this.x + (this.width * 0.5);
    };

    this.getCenterY = function () {
        return this.y + (this.height * 0.5);
    };

    this.getHalfWidth = function () {
        return this.width * 0.5;
    };

    this.getHalfHeight = function () {
        return this.height * 0.5;
    };

    this.getSprite = function () {
        return this.frames[this.currentFrame];
    };

    this.render = function (ds) {
        if (!this.active) return;
        ds.save();
        var sprite = this.getSprite();

        ds.translate(Math.floor(this.x + (this.width / 2)),
            Math.floor(this.y + (this.height / 2)));
        ds.rotate(this.rotation * Math.PI / 180);

        ds.drawImage(
            this.spriteSheet.img,
            sprite.x, sprite.y,
            sprite.width, sprite.height,
            Math.floor(-this.width / 2), Math.floor(-this.height / 2),
            this.width * this.scaleFactor, this.height * this.scaleFactor
        );
        ds.restore();
    };

    this.drawColisionBoundaries = function (ctx, rect) {
        if (ctx === undefined) return;
        if (rect) {
            ctx.save();
            ctx.beginPath();
            ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
            ctx.rotate(this.rotation * Math.PI / 180);
            ctx.translate(-this.x - this.width / 2, -this.y - this.height / 2);
            ctx.rect(this.x, this.y, this.width, this.height);
            ctx.lineWidth = 1;
            ctx.strokeStyle = "yellow";
            ctx.stroke();
            ctx.restore();
        } else {
            ctx.save();
            ctx.beginPath();
            ctx.rotate(this.rotation * 180 / Math.PI);
            ctx.arc(this.getCenterX(), this.getCenterY(),
                (this.getHalfWidth() + this.getHalfHeight()) / 2, 0, 2 * Math.PI, false);
            ctx.lineWidth = 1;
            ctx.strokeStyle = "blue";
            ctx.stroke();
            ctx.restore();
        }
    };

    this.hitTestPoint = function (pointX, pointY) {
        return (pointX > this.left() && pointX < this.right() &&
            pointY > this.top() && pointY < this.bottom());
    };

    this.hitTestCircle = function (otherEntity) {
        // Calcula o vetor entre os centros das circunferencias
        var vx = this.getCenterX() - otherEntity.getCenterX();
        var vy = this.getCenterY() - otherEntity.getCenterY();
        // Calcular a distancia entre as circunferencias, calculando a magnitude do vetor
        // (comprimento do vetor)	  
        var magnitude = Math.sqrt(vx * vx + vy * vy);
        // soma das metades das larguras das entidades
        var totalRadii = this.getHalfWidth() + otherEntity.getHalfWidth();
        // existe colisão se a distancia entre os circulos é menor que o totalRadii
        var hit = magnitude < totalRadii;
        return hit;
    };

    this.hitTestRectangle = function (otherEntity) {
        var hit = false;
        //Calculo do vetor de distancia
        var vx = this.getCenterX() - otherEntity.getCenterX();
        var vy = this.getCenterY() - otherEntity.getCenterY();
        //soma das metades das largura e alturas 
        var combinedHalfWidths = this.getHalfWidth() + otherEntity.getHalfWidth();
        var combinedHalfHeights = this.getHalfHeight() + otherEntity.getHalfHeight();
        // verificar se ha colisão no eixo X
        if (Math.abs(vx) < combinedHalfWidths) {
            //Uma colisão poderá estar a ocorrer. Verificar se ocorre no eixo Y  
            if (Math.abs(vy) < combinedHalfHeights) {
                hit = true;
            } //Existe mesmo uma colisão  
            else {
                hit = false;
            } //Não há colisão no eixo Y    
        } else {
            hit = false;
        } //Não há colisão no eixo X

        return hit;
    };
});