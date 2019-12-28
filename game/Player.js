class Player {
    constructor(options) {
        this.id = options.id;
        this.x = options.x || 0;
        this.y = options.y || 0;
        this.vx = options.vx || 0;
        this.vy = options.vy || 0;
        this.minSpeed = 40; // pixels per second
        this.maxSpeed = 80; // pixels per second
        this.animation = Math.random() > 0.5 ? "idle_left" : "idle_right";
        this.equipment = {
            "head": undefined,
            "torso": undefined,
            "belt": undefined,
            "legs": undefined,
            "weapon": undefined,
            "hands": undefined,
            "feet": undefined,
            "ring1": undefined,
            "ring2": undefined,
            "offhand": undefined
        };
        this.inventory = [];
        this.controls = {
            left: false,
            right: false,
            up: false,
            down: false
        };
        this.spriteSheets = {
            idle_left: {
                img: "/game/assets/player_idle.png",
                frames: 7,
                frameDelay: 200,
                dimensions: [958, 967],
                horiz_scale: -1,
                vert_scale: 1
            },
            idle_right: {
                img: "/game/assets/player_idle.png",
                frames: 7,
                frameDelay: 200,
                dimensions: [958, 967],
                horiz_scale: 1,
                vert_scale: 1
            },
            move_left: {
                img: "/game/assets/player_walk.png",
                frames: 7,
                frameDelay: 200,
                dimensions: [1032, 1002],
                horiz_scale: -1,
                vert_scale: 1
            },
            move_right: {
                img: "/game/assets/player_walk.png",
                frames: 7,
                frameDelay: 200,
                dimensions: [1032, 1002],
                horiz_scale: 1,
                vert_scale: 1
            },
            move_up: {
                img: "/game/assets/player_walk.png",
                frames: 7,
                frameDelay: 200,
                dimensions: [1032, 1002],
                horiz_scale: 1,
                vert_scale: 1
            },
            move_down: {
                img: "/game/assets/player_walk.png",
                frames: 7,
                frameDelay: 200,
                dimensions: [1032, 1002],
                horiz_scale: -1,
                vert_scale: 1
            },
            jump_left: {
                img: "/game/assets/player_jump.png",
                frames: 7,
                frameDelay: 200,
                dimensions: [979, 1040],
                horiz_scale: -1,
                vert_scale: 1
            },
            jump_right: {
                img: "/game/assets/player_jump.png",
                frames: 7,
                frameDelay: 200,
                dimensions: [979, 1040],
                horiz_scale: 1,
                vert_scale: 1
            },
            hurt_left: {
                img: "/game/assets/player_hurt.png",
                frames: 7,
                frameDelay: 200,
                dimensions: [1197, 1083],
                horiz_scale: -1,
                vert_scale: 1
            },
            hurt_right: {
                img: "/game/assets/player_hurt.png",
                frames: 7,
                frameDelay: 200,
                dimensions: [1197, 1083],
                horiz_scale: 1,
                vert_scale: 1
            },
            die_left: {
                img: "/game/assets/player_die.png",
                frames: 7,
                frameDelay: 200,
                dimensions: [1958, 1244],
                horiz_scale: -1,
                vert_scale: 1
            },
            die_right: {
                img: "/game/assets/player_die.png",
                frames: 7,
                frameDelay: 200,
                dimensions: [1958, 1244],
                horiz_scale: 1,
                vert_scale: 1
            },
        }
    }
}