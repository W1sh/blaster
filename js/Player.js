//jshint esversion: 6

class Player {
    
    constructor(givenScore, givenShip) {
        this.energy = 100;
        this.energyRegeneration = 1; // per second
        this.health = 3;
        this.score = givenScore === undefined ? 0 : givenScore;
        this.ship = givenShip;
    }
}
