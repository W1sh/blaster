var Bar = Component.extend(function () {
   this.energy = 0;
   var _this = this;
   var fillWith = 100;
   this.text = "";
   var borderColor = "white";
   var fillColor = "red";
   var textColor = "black";
   var prevEnergy = -1;

   this.constructor = function (x, y, w, h, drawContext, _text, _textColor, _borderColor, _fillColor, energy) {
      this.super();
      this.x = x;
      this.y = y;
      this.width = w;
      this.height = h;
      this.ctx = drawContext;
      borderColor = _borderColor != undefined ? _borderColor : "white";
      fillColor = _fillColor != undefined ? _fillColor : "red";
      textColor = _textColor != undefined ? _textColor : "black";
      this.text = _text;
      this.update(energy);
   };

   this.update = function (energyLevel) {
      if (energyLevel < 0) energyLevel = 0;
      if (energyLevel > 100) energyLevel = 100;
      this.energy = energyLevel;
      this.fillWith = this.energy / 100 * this.width;
   };

   this.render = function () {

      //if (this.energy == prevEnergy) return;
      //prevEnergy = this.energy;
      //this.ctx.clearRect(this.x - 40, this.y - 40, this.width + 80, this.height + 80);
      // this.ctx.clearRect(0, 0, canvas.width, canvas.height);
      this.ctx.save();
      //desenho do fundo
      this.ctx.beginPath();
      /*this.ctx.shadowColor = this.shadow.shadowColor;
      this.ctx.shadowBlur = this.shadow.shadowBlur;
      this.ctx.shadowOffsetX = this.shadow.shadowOffsetX;
      this.ctx.shadowOffsetY = this.shadow.shadowOffsetY;*/

      this.ctx.rect(this.x, this.y, this.width, this.height);
      this.ctx.fillStyle = 'black';
      this.ctx.fill();
      this.ctx.closePath();
      this.ctx.restore();
      //desenho do preenchimento
      this.ctx.beginPath();
      this.ctx.rect(this.x, this.y, this.fillWith, this.height);
      var grd = this.ctx.createLinearGradient(this.x, this.y, this.x, this.y + this.height);
      grd.addColorStop(0, fillColor);
      grd.addColorStop(0.35, fillColor);
      grd.addColorStop(0.5, "blue");
      grd.addColorStop(0.65, fillColor);
      grd.addColorStop(1, fillColor);
      this.ctx.fillStyle = grd;
      this.ctx.fill();
      this.ctx.closePath();

      //desenho do bordo
      this.ctx.beginPath();
      this.ctx.lineWidth = 2;
      this.ctx.rect(this.x, this.y, this.width, this.height);
      this.ctx.strokeStyle = borderColor;
      this.ctx.stroke();
      this.ctx.closePath();
      this.ctx.font = "10px Arial";
      this.ctx.fillText(this.text, this.left(), this.bottom() + 10);
   };
});
