//jshint esversion: 6

class Player {
    constructor(givenScore, givenShip) {
        this.score = givenScore === undefined ? 0 : givenScore;
        this.ship = givenShip;
    }
}
