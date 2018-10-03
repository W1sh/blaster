//jshint esversion: 6

// fazer reverse time (maybe)
window.onload = boot;

var player;
var timer = 0;
var fpsCap = 1000 / 60;
var fps = 0;
var starfield;
var entities = [];
var components = [];
var enemies = [];
var lasers = [];
var explosions = [];
var firing = false;
var paused = false;
var interval;
var animateBackground = true;
var mouseX, mouseY;
var drawInterval, updateInterval, spawnShortInterval, spawnLongInterval, energyRegenerationInterval;
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
    },
    comp: {
        canvas: null,
        ctx: null
    }
};

function boot() {
    canvasses.entities.canvas = document.getElementById("entities");
    canvasses.entities.ctx = canvasses.entities.canvas.getContext("2d");
    canvasses.background.canvas = document.getElementById("background");
    canvasses.background.ctx = canvasses.background.canvas.getContext("2d");
    canvasses.comp.canvas = document.getElementById("comp");
    canvasses.comp.ctx = canvasses.comp.canvas.getContext("2d");

    canvasses.entities.canvas.width = window.innerWidth;
    canvasses.entities.canvas.height = window.innerHeight;
    canvasses.background.canvas.width = window.innerWidth;
    canvasses.background.canvas.height = window.innerHeight;
    canvasses.comp.canvas.width = window.innerWidth;
    canvasses.comp.canvas.height = window.innerHeight;

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
        100, (canvasses.entities.canvas.height >> 1) - 37, "one_green");
    nave.scale(0.4, 0.4);
    nave.rotation = 90;
    /*var enemy = new Enemy(gSpriteSheets['assets//enemies.png'], 10, 10, "short");
    enemy.rotation = 0;
    enemies.push(enemy);*/

    player = new Player(0, nave);

    barra = new Bar((canvasses.comp.canvas.width >> 2) + 200,
        canvasses.comp.canvas.height - 31, 200, 20, canvasses.comp.ctx, '',
        "white", "white", "darkblue", player.energy);

    starfield = new Starfield(canvasses.background.canvas);
    starfield.initialize();
    entities.push(player.ship);
    components.push(barra);
    //entities.push(enemy);

    canvasses.comp.canvas.addEventListener("mousemove", mouseMoveAction, false);
    canvasses.comp.canvas.addEventListener("mousedown", shootLasers, false);
    canvasses.comp.canvas.addEventListener("mouseup", shootLasers, false);
    canvasses.comp.canvas.addEventListener("mouseout", function () {
        animateBackground = false;
    }, false);
    canvasses.comp.canvas.addEventListener("mouseover", function () {
        animateBackground = true;
    }, false);

    window.addEventListener("keydown", onKeyAction, false);
    window.addEventListener("keyup", onKeyAction, false);

    drawInterval = setInterval(draw, fpsCap);
    updateInterval = setInterval(update, fpsCap);
    spawnShortInterval = setInterval(function () {
        spawnEnemy("short");
    }, 2000);
    spawnLongInterval = setInterval(function () {
        spawnEnemy("long");
    }, 2000);
    energyRegenerationInterval = setInterval(function () {
        if (player.energy + player.energyRegeneration <= 100){
            player.energy += player.energyRegeneration;
            components[0].update(player.energy);
        }
    }, 1000);
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
            window.clearInterval(spawnShortInterval);
            window.clearInterval(spawnLongInterval);
            window.clearInterval(energyRegenerationInterval);
        } else {
            drawInterval = setInterval(draw, fpsCap);
            updateInterval = setInterval(update, fpsCap);
            spawnShortInterval = setInterval(function () {
                spawnEnemy("short");
            }, 2000);
            spawnLongInterval = setInterval(function () {
                spawnEnemy("long");
            }, 2000);
            energyRegenerationInterval = setInterval(function () {
                player.energy += player.energyRegeneration;
                components[0].update(player.energy);
            }, 1000);
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
    if (e.type === "mousedown") {
        fire();
        interval = setInterval(fire, 200);
    } else {
        window.clearInterval(interval);
    }
    function fire(){
        if (player.energy < 2){
            window.clearInterval(interval);
            return;
        } 
        var pew = new Laser(gSpriteSheets['assets//beams.png'], 0, 0, "green_ball");
        //pew.rotation = player.ship.rotation;
        pew.x = (player.ship.x + player.ship.width / 2) - pew.width / 2;
        pew.y = (player.ship.y + player.ship.height / 2) - pew.height / 2;
        var dx = mouseX - (player.ship.x + player.ship.width / 2);
        var dy = mouseY - (player.ship.y + player.ship.height / 2);
        var mag = Math.sqrt(dx * dx + dy * dy);
        pew.vx = (dx / mag) * pew.speed;
        pew.vy = (dy / mag) * pew.speed;
        entities.push(pew);
        lasers.push(pew);
        player.energy -= 2;
        components[0].update(player.energy);
    }
}

function update() {
    player.ship.rotate(mouseX, mouseY, 90);
    checkMovement();
    checkColisions();
    clearArrays();
}

function checkMovement() {
    if (keydown.up && player.ship.top() - 2 >= 0) {
        player.ship.y -= 2;
    }
    if (keydown.down && player.ship.bottom() + 2 <= canvasses.entities.canvas.height) {
        player.ship.y += 2;
    }
    if (keydown.right && player.ship.right() + 2 <= canvasses.entities.canvas.width) {
        player.ship.x += 2;
    }
    if (keydown.left && player.ship.left() - 2 >= 0) {
        player.ship.x -= 2;
    }
}

function checkColisions() {
    for (var laser of lasers) {
        if (laser.right() < 0 || laser.left() > canvasses.entities.canvas.width ||
            laser.bottom() < 0 || laser.top() > canvasses.entities.canvas.height) {
            laser.active = false;
            continue;
        }
        if (laser.hitTestCircle(player.ship) && laser.currState === laser.states.red_ball) {
            laser.active = false;
            if (!player.ship.invulnerable) {
                player.health--;
                player.ship.invulnerable = true;
            }
            if (player.health <= 0) {
                player.ship.active = false;
                var explosion = new Explosion(gSpriteSheets['assets//explosion.png'],
                    player.ship.x, player.ship.y, player.ship.width, player.ship.height);
                entities.push(explosion);
                explosions.push(explosion);
                setTimeout(endGame, 100);
            }
            continue;
        }

        for (var otherLaser of lasers) {
            if (laser.hitTestCircle(otherLaser) && laser.currState !== otherLaser.currState){
                laser.active = false;
                otherLaser.active = false;
                var laserExplosion = new Explosion(gSpriteSheets['assets//explosion.png'],
                laser.x, laser.y, laser.width, laser.height);
                entities.push(laserExplosion);
                explosions.push(laserExplosion);
                break;
            }
        }

        for (var enemy of enemies) {
            if (laser.hitTestCircle(enemy) && laser.currState === laser.states.green_ball) {
                if (enemy.health - laser.damage <= 0) {
                    player.energy+=2;
                    components[0].update(player.energy);
                    var enemyExplosion = new Explosion(gSpriteSheets['assets//explosion.png'],
                        enemy.x, enemy.y, enemy.width, enemy.height);
                    enemy.active = false;
                    if (enemy.type === "long") window.clearInterval(enemy.interval);
                    player.score += enemy.value;
                    entities.push(enemyExplosion);
                    explosions.push(enemyExplosion);
                } else {
                    enemy.health -= laser.damage;
                }
                laser.active = false;
                
                break;
            }
        }
    }

    for (var enemy of enemies) {
        if (enemy.type === "short") {
            enemy.rotate(player.ship.x, player.ship.y, 90);
            var dx = player.ship.x - (enemy.x + enemy.width / 2);
            var dy = player.ship.y - (enemy.y + enemy.height / 2);
            var mag = Math.sqrt(dx * dx + dy * dy);
            enemy.vx = (dx / mag) * 1;
            enemy.vy = (dy / mag) * 1;
        }
        if (enemy.right() < 0 || enemy.left() > canvasses.entities.canvas.width ||
            enemy.bottom() < 0 || enemy.top() > canvasses.entities.canvas.height) {
            enemy.active = false;
            continue;
        }
        if (enemy.hitTestRectangle(player.ship)) {
            var enemyExplosion = new Explosion(gSpriteSheets['assets//explosion.png'],
                enemy.x, enemy.y, enemy.width, enemy.height);
            enemy.active = false;
            if (enemy.type === "long") window.clearInterval(enemy.interval);
            entities.push(enemyExplosion);
            explosions.push(enemyExplosion);

            if (!player.ship.invulnerable) {
                player.health--;
                player.ship.invulnerable = true;
            }
            if (player.health <= 0) {
                var playerExplosion = new Explosion(gSpriteSheets['assets//explosion.png'],
                    player.ship.x, player.ship.y, player.ship.width, player.ship.height);
                player.ship.active = false;
                entities.push(playerExplosion);
                explosions.push(playerExplosion);
                setTimeout(endGame, 100);
            }
        }
    }
}

function draw() {
    timer++;
    fps++;
    canvasses.entities.ctx.clearRect(0, 0, canvasses.entities.canvas.width, canvasses.entities.canvas.height);
    canvasses.comp.ctx.clearRect(0, 0, canvasses.comp.canvas.width, canvasses.comp.canvas.height);
    if (animateBackground) {
        starfield.move();
        starfield.draw();
    }
    canvasses.entities.ctx.font = "20px Arial";
    canvasses.entities.ctx.fillStyle = "white";
    canvasses.entities.ctx.fillText("FPS: " + Math.floor(fps / Math.floor(timer / 60)) +
        " Entities: " + entities.length + " Score: " + player.score + " Energy: " + player.energy, 10, 30);

    for (var i = 0; i < entities.length; i++) {
        entities[i].update();
        entities[i].render(canvasses.entities.ctx);
        //entities[i].drawColisionBoundaries(canvasses.entities.ctx, true, false, "blue", "red");
    }
    for (var j = 0; j < components.length; j++) {
        components[j].render(canvasses.comp.ctx);
    }
}

function spawnEnemy(enemyType) {
    var x, y;
    var random = (enemyType === "short") ? Math.floor(Math.random() * 2) : 1;
    if (random === 0) {
        random = Math.floor(Math.random() * 2);
        x = Math.floor(Math.random() * Math.floor(canvasses.entities.canvas.width)) + 10;
        y = (random === 0) ? 10 : canvasses.entities.canvas.height - 10;
    } else {
        random = Math.floor(Math.random() * 2);
        x = (random === 0) ? 10 : canvasses.entities.canvas.width - 10;
        y = Math.floor(Math.random() * Math.floor(canvasses.entities.canvas.height)) + 10;
    }
    var enemy = new Enemy(gSpriteSheets['assets//enemies.png'], x, y, enemyType);
    if (enemyType === "short") {
        enemy.rotate(player.ship.x, player.ship.y, 90);
        var dx = player.ship.x - (enemy.x + enemy.width / 2);
        var dy = player.ship.y - (enemy.y + enemy.height / 2);
        var mag = Math.sqrt(dx * dx + dy * dy);
        enemy.vx = (dx / mag) * 2;
        enemy.vy = (dy / mag) * 2;
    } else if (enemyType === "long") {
        enemy.vx = (enemy.x > 10) ? -2 : 2;
        enemy.rotation = (enemy.x > 10) ? 270 : 90;
        enemy.vy = 0;
        enemy.interval = setInterval(function () {
            var pew = new Laser(gSpriteSheets['assets//beams.png'], enemy.x + enemy.width / 2,
                enemy.y + enemy.height / 2, "red_ball");
            pew.vx = enemy.vx > 0 ? 5 : -5;
            entities.push(pew);
            lasers.push(pew);
        }, 1000);
    }
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
    window.clearInterval(spawnShortInterval);
    window.clearInterval(spawnLongInterval);
    window.clearInterval(energyRegenerationInterval);
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