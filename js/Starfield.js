var Starfield = function (canvas) {
    var canv = canvas;
    var ctx = canvas.getContext("2d");
    var numStars = 1000;
    var radius = 1;
    var centerX, centerY;
    var stars = [], star;
    var i;

    this.initialize = function () {
        centerX = canv.width / 2;
        centerY = canv.height / 2;

        stars = [];
        for (i = 0; i < numStars; i++) {
            star = {
                x: Math.random() * canv.width,
                y: Math.random() * canv.height,
                z: (Math.random() * 1000) + 500//Math.random() * canv.width
            };
            stars.push(star);
        }
    };

    this.move = function () {
        for (i = 0; i < numStars; i++) {
            star = stars[i];
            star.x -= 0.2;

            if (star.x <= 0) {
                star.x = canv.width;
            }
        }
    };

    this.draw = function () {
        var pixelX, pixelY, pixelRadius;
        var focalLength = canv.width;

        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canv.width, canv.height);
        ctx.fillStyle = "white";
        ctx.globalAlpha = 0.5;
        for (i = 0; i < numStars; i++) {
            star = stars[i];

            pixelX = (star.x - centerX) * (focalLength / star.z);
            pixelX += centerX;
            pixelY = (star.y - centerY) * (focalLength / star.z);
            pixelY += centerY;
            pixelRadius = radius * (focalLength / star.z);

            ctx.beginPath();
            ctx.arc(pixelX, pixelY, pixelRadius, 0, 2 * Math.PI);
            ctx.fill();
        }
    };
};