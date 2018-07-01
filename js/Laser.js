var Laser = Entity.extend(function () {
      var _this = this;
      this.currState = undefined; // estado atual
      this.damage = 10;
      this.speed = 5;

      this.states = {
            blue_ball: 'blue_ball',
            green_ball: 'green_ball',
            purple_ball: 'purple_ball',
            yellow_ball: 'yellow_ball',
            red_ball: 'red_ball',
            teal_ball: 'RED_HIT',
            laser: 'laser'
      };

      this.constructor = function (spriteSheet, x, y, skin, rot) {
            this.super();
            this.spriteSheet = spriteSheet;
            this.x = x;
            this.y = y;
            this.vx = 0;
            this.vy = 0;
            switch (skin) {
                  case "blue_ball":
                        this.currState = this.states.blue_ball;
                        break;
                  case "green_ball":
                        this.currState = this.states.green_ball;
                        break;
                  case "purple_ball":
                        this.currState = this.states.purple_ball;
                        break;
                  case "yellow_ball":
                        this.currState = this.states.yellow_ball;
                        break;
                  case "red_ball":
                        this.currState = this.states.red_ball;
                        break;
                  case "teal_ball":
                        this.currState = this.states.teal_ball;
                        break;
                  case "laser":
                        this.currState = this.states.laser;
                        break;
            }
            rot !== undefined ? this.rotation = rot : this.rotation = 90;
            this.currentFrame = 0;
            setup();
      };

      function setup() {
            _this.eStates.blue_ball = _this.spriteSheet.getStats('blue_ball');
            _this.eStates.green_ball = _this.spriteSheet.getStats('green_ball');
            _this.eStates.purple_ball = _this.spriteSheet.getStats('purple_ball');
            _this.eStates.yellow_ball = _this.spriteSheet.getStats('yellow_ball');
            _this.eStates.red_ball = _this.spriteSheet.getStats('red_ball');
            _this.eStates.teal_ball = _this.spriteSheet.getStats('teal_ball');
            _this.eStates.laser = _this.spriteSheet.getStats('laser');
            _this.frames = _this.eStates[_this.currState];
            _this.width = _this.frames[0].width;
            _this.height = _this.frames[0].height;
      }

      /*this.drawColisionBoundaries = function (ctx, boundingRect) {
            if (ctx === undefined) return;

            if (boundingRect) {
                  ctx.save();
                  ctx.beginPath();
                  ctx.translate(this.x, this.y);
                  ctx.rotate(this.rotation * Math.PI / 180);
                  ctx.translate(-this.x, -this.y);
                  ctx.rect(this.x, this.y, this.width, this.height);
                  ctx.lineWidth = 1;
                  ctx.strokeStyle = "blue";
                  ctx.stroke();
                  ctx.restore();
            }
      };*/

      /*this.render = function (ds) {
            if (!this.active) return;
            ds.save();
            var sprite = this.getSprite();

            ds.translate(posicaoDisparo[0], posicaoDisparo[1]);
            ds.rotate(nave.rotation * Math.PI / 180);
            ds.strokeStyle = "yellow";
            ds.strokeRect(-10 / 2, -10 / 2 + 25, 10, 10);
            ds.restore();
            ds.save();

            ds.translate(this.x, this.y);
            if (this.rotation != 0) {
                  ds.rotate(this.rotation * Math.PI / 180);
            }
            ds.translate(-this.x, -this.y);

            ds.drawImage(
                  this.spriteSheet.img,
                  sprite.x, sprite.y,
                  sprite.width, sprite.height,
                  this.x, this.y,
                  this.width * this.scaleFactor, this.height * this.scaleFactor
            );
            ds.restore(); // repor o estado guardado
      };*/
});