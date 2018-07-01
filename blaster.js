//jshint esversion: 6

window.onload = boot;

var starfield;
var entities = [];
var enemies = [];
var lasers = [];
var explosions = [];
var firing = false;
var paused = false;
var interval;
var animateBackground = true;
var mouseX, mouseY;
var drawInterval, updateInterval, spawnInterval;
var keydown = {
    left: false,
    right: false,
    up: false,
    down: false
};
var canvasses = {
    entities: {
        canvas: null,
        ctx: null
    },
    background: {
        canvas: null,
        ctx: null
    }
};

function boot() {
    canvasses.entities.canvas = document.getElementById("entities");
    canvasses.entities.ctx = canvasses.entities.canvas.getContext("2d");
    canvasses.background.canvas = document.getElementById("background");
    canvasses.background.ctx = canvasses.background.canvas.getContext("2d");

    var spBackground = new SpriteSheet();
    spBackground.load("assets//background.png", "assets//background.json", loaded);
    var spNave = new SpriteSheet();
    spNave.load("assets//playerships.png", "assets//playerships.json", loaded);
    var spLasers = new SpriteSheet();
    spLasers.load("assets//beams.png", "assets//beams.json", loaded);
    var spEnemies = new SpriteSheet();
    spEnemies.load("assets//enemies.png", "assets//enemies.json", loaded);
    var spExplosion = new SpriteSheet();
    spExplosion.load("assets//explosion.png", "assets//explosion.json", loaded);
}

function loaded() {
    if (Object.keys(gSpriteSheets).length < 5) return;

    nave = new Starship(gSpriteSheets['assets//playerships.png'],
        100, (canvasses.entities.canvas.height >> 1) - 37, "one_red");
    nave.scale(0.4, 0.4);
    nave.rotation = 90;
    var enemy = new Enemy(gSpriteSheets['assets//enemies.png'], 10, 10, "short");
    enemy.rotation = 0;
    enemies.push(enemy);

    starfield = new Starfield(canvasses.background.canvas);
    starfield.initialize();
    entities.push(nave);
    entities.push(enemy);

    canvasses.entities.canvas.addEventListener("mousemove", mouseMoveAction, false);
    canvasses.entities.canvas.addEventListener("mousedown", shootLasers, false);
    canvasses.entities.canvas.addEventListener("mouseup", shootLasers, false);
    canvasses.entities.canvas.addEventListener("mouseout", function () {
        animateBackground = false;
    }, false);
    canvasses.entities.canvas.addEventListener("mouseover", function () {
        animateBackground = true;
    }, false);

    window.addEventListener("keydown", onKeyAction, false);
    window.addEventListener("keyup", onKeyAction, false);

    drawInterval = setInterval(draw, 10);
    updateInterval = setInterval(update, 10);
    spawnInterval = setInterval(function () {
        randomSpawn("short");
    }, 2000);
}

function onKeyAction(e) {
    if (e.keyCode === 87) {
        keydown.up = (e.type === "keydown");
    }
    if (e.keyCode === 65) {
        keydown.left = (e.type === "keydown");
    }
    if (e.keyCode === 68) {
        keydown.right = (e.type === "keydown");
    }
    if (e.keyCode === 83) {
        keydown.down = (e.type === "keydown");
    }
    if (e.keyCode === 32 && e.type === "keydown") {
        shootLasers(e);
    }
    if (e.keyCode === 27 && e.type === "keydown") {
        paused = !paused;
        if (paused) {
            window.clearInterval(drawInterval);
            window.clearInterval(updateInterval);
            window.clearInterval(spawnInterval);
        } else {
            drawInterval = setInterval(draw, 10);
            updateInterval = setInterval(update, 10);
            spawnInterval = setInterval(function () {
                randomSpawn("short");
            }, 2000);
        }
    }
}

function mouseMoveAction(e) {
    if (paused) return;
    mouseX = e.clientX - canvasses.entities.canvas.offsetLeft;
    mouseY = e.clientY - canvasses.entities.canvas.offsetTop;
}

function shootLasers(e) {
    if (paused) return;
    firing = (e.type === "mousedown");
    if (firing) {
        var pew = new Laser(gSpriteSheets['assets//beams.png'], 0, 0, "red_ball");
        //pew.rotation = nave.rotation;
        pew.x = (nave.x + nave.width / 2) - pew.width / 2;
        pew.y = (nave.y + nave.height / 2) - pew.height / 2;
        var dx = mouseX - (nave.x + nave.width / 2);
        var dy = mouseY - (nave.y + nave.height / 2);
        var mag = Math.sqrt(dx * dx + dy * dy);
        pew.vx = (dx / mag) * pew.speed;
        pew.vy = (dy / mag) * pew.speed;
        entities.push(pew);
        lasers.push(pew);
        interval = setInterval(function () {
            var pew = new Laser(gSpriteSheets['assets//beams.png'], 0, 0, "red_ball");
            //pew.rotation = nave.rotation;
            pew.x = (nave.x + nave.width / 2) - pew.width / 2;
            pew.y = (nave.y + nave.height / 2) - pew.height / 2;
            var dx = mouseX - (nave.x + nave.width / 2);
            var dy = mouseY - (nave.y + nave.height / 2);
            var mag = Math.sqrt(dx * dx + dy * dy);
            pew.vx = (dx / mag) * pew.speed;
            pew.vy = (dy / mag) * pew.speed;
            entities.push(pew);
            lasers.push(pew);
        }, 200);
    } else {
        clearInterval(interval);
    }
}

function update() {
    nave.rotate(mouseX, mouseY, 90);
    checkMovement();
    checkColisions();
    clearArrays();
}

function checkMovement() {
    if (keydown.up && nave.top() - 2 >= 0) {
        nave.y -= 2;
    }
    if (keydown.down && nave.bottom() + 2 <= canvasses.entities.canvas.height) {
        nave.y += 2;
    }
    if (keydown.right && nave.right() + 2 <= canvasses.entities.canvas.width) {
        nave.x += 2;
    }
    if (keydown.left && nave.left() - 2 >= 0) {
        nave.x -= 2;
    }
}

function checkColisions() {
    for (var laser of lasers) {
        if (laser.right() < 0 || laser.left() > canvasses.entities.canvas.width ||
            laser.bottom() < 0 || laser.top() > canvasses.entities.canvas.height) {
            laser.active = false;
        }
        for (var enemy of enemies) {
            if (laser.hitTestCircle(enemy)) {
                if (enemy.health - laser.damage <= 0) {
                    var explosion = new Explosion(gSpriteSheets['assets//explosion.png'],
                        enemy.x, enemy.y, enemy.width, enemy.height);
                    enemy.active = false;
                    entities.push(explosion);
                    explosions.push(explosion);
                } else {
                    enemy.health -= laser.damage;
                }
                laser.active = false;
            }
        }
    }
    for (var enemy of enemies) {
        if (enemy.type === "short") {
            enemy.rotate(nave.x, nave.y, 90);
            var dx = nave.x - (enemy.x + enemy.width / 2);
            var dy = nave.y - (enemy.y + enemy.height / 2);
            var mag = Math.sqrt(dx * dx + dy * dy);
            enemy.vx = (dx / mag) * 1;
            enemy.vy = (dy / mag) * 1;
        }
        if (enemy.right() < 0 || enemy.left() > canvasses.entities.canvas.width ||
            enemy.bottom() < 0 || enemy.top() > canvasses.entities.canvas.height) {
            enemy.active = false;
        }
        if (enemy.hitTestRectangle(nave)) {
            var enemyExplosion = new Explosion(gSpriteSheets['assets//explosion.png'],
                enemy.x, enemy.y, enemy.width, enemy.height);
            enemy.active = false;
            entities.push(enemyExplosion);
            explosions.push(enemyExplosion);
            var playerExplosion = new Explosion(gSpriteSheets['assets//explosion.png'],
                nave.x, nave.y, nave.width, nave.height);
            nave.active = false;
            entities.push(playerExplosion);
            explosions.push(playerExplosion);
            setTimeout(endGame, 100);
        }
    }
}

function draw() {
    if (animateBackground) {
        starfield.move();
        starfield.draw();
    }

    canvasses.entities.ctx.clearRect(0, 0, canvasses.entities.canvas.width, canvasses.entities.canvas.height);
    for (var i = 0; i < entities.length; i++) {
        entities[i].update();
        entities[i].render(canvasses.entities.ctx);
        entities[i].drawColisionBoundaries(canvasses.entities.ctx, true, false, "blue", "red");
    }
}

function randomSpawn(enemyType) {
    random = Math.floor(Math.random() * Math.floor(2));
    var x, y;
    if (random === 0) {
        x = Math.floor(Math.random() * Math.floor(canvasses.entities.canvas.width)) + 10;
        y = 10;
    } else {
        x = 10;
        y = Math.floor(Math.random() * Math.floor(canvasses.entities.canvas.height)) + 10;
    }
    var enemy = new Enemy(gSpriteSheets['assets//enemies.png'], x, y, enemyType);
    enemy.rotate(nave.x, nave.y, 90);
    var dx = nave.x - (enemy.x + enemy.width / 2);
    var dy = nave.y - (enemy.y + enemy.height / 2);
    var mag = Math.sqrt(dx * dx + dy * dy);
    enemy.vx = (dx / mag) * 2;
    enemy.vy = (dy / mag) * 2;
    enemies.push(enemy);
    entities.push(enemy);
}

function endGame() {
    entities = [];
    enemies = [];
    lasers = [];
    explosions = [];
    window.clearInterval(drawInterval);
    window.clearInterval(updateInterval);
    window.clearInterval(spawnInterval);
    alert("Game over");
    document.location.reload();
}

function clearArrays() {
    function filterByActive(obj) {
        if (obj.active === true) return obj;
    }
    entities = entities.filter(filterByActive);
    enemies = enemies.filter(filterByActive);
    lasers = lasers.filter(filterByActive);
    explosions = explosions.filter(filterByActive);
}