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
            this.rotation = (rot !== undefined) ? rot : 90;
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
});