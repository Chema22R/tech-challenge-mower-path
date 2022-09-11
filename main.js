const readline = require('readline');

/*
 * Initializations
 */
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const input = [];
const output = [];
const plateau = [];
const regexps = {
    instructions: /^[LRM]+$/u,
    plateau: /^\d+\s\d+$/u,
    position: /^(?:\d+\s){2}[NESW]$/u
};

class Mower {
    constructor(position, instructions) {
        const [x, y, orientation] = position.split(/\s/u);

        this.x = Number(x);
        this.y = Number(y);
        this.orientation = orientation;
        this.instructions = instructions.split('');
    }

    run() {
        this.instructions.forEach((instruction) => instruction === 'M' ? this.move() : this.turn(instruction));

        output.push(`${this.x} ${this.y} ${this.orientation}`);
    }

    move() {
        switch (this.orientation) {
            case 'N':
                this.y += this.y === plateau[1] || collision(`${this.x} ${this.y + 1}`) ? 0 : 1;
                break;
            case 'E':
                this.x += this.x === plateau[0] || collision(`${this.x + 1} ${this.y}`) ? 0 : 1;
                break;
            case 'S':
                this.y -= this.y === 0 || collision(`${this.x} ${this.y - 1}`) ? 0 : 1;
                break;
            case 'W':
                this.x -= this.x === 0 || collision(`${this.x - 1} ${this.y}`) ? 0 : 1;
                break;
            default:
                break;
        }
    }

    turn(direction) {
        const orientations = ['N', 'E', 'S', 'W'];
        const index = orientations.indexOf(this.orientation);

        if (direction === 'L') {
            this.orientation = orientations[index === 0 ? orientations.length - 1 : index - 1];
        } else if (direction === 'R') {
            this.orientation = orientations[index === orientations.length - 1 ? 0 : index + 1];
        }
    }
}


/*
 * Input/output event handlers
 */
rl.prompt();
rl.on('line', processInput);
rl.on('close', writeOutput);

console.log('Introduce the instructions line by line and press CTRL+C when finished\n');


/*
 * Support functions
 */

// Processes the input, validates it and runs the mowers
function processInput(inputLine) {
    const line = inputLine.replace(/\s+/gu, ' ').trim().toUpperCase();

    if (line.length === 0) {
        return;
    }

    if (input.length === 0) {
        if (regexps.plateau.test(line)) {
            plateau.push(...line.split(/\s/u).map(Number));
        } else {
            console.warn('The first line is the upper-right coordinates of the plateau and they are'
            + ' represented by a combination of X and Y coordinates (e.g. <5 5>). Try again...\n');
            return;
        }
    } else if (input.length % 2 === 1) {
        if (!regexps.position.test(line)) {
            console.warn('This line is a mower’s position and it is represented by a combination'
            + ' of X and Y coordinates and a letter representing one of the four cardinal compass'
            + ' points (N, E, S, W) (e.g. <1 2 N>). Try again...\n');
            return;
        } else if (collision(line.substring(0, line.lastIndexOf(' ')).trim())) {
            console.warn('There´s already a mower on that position and we don´t want to stack them.'
            + ' Try again...\n');
            return;
        }
    } else if (input.length % 2 === 0) {
        if (regexps.instructions.test(line)) {
            new Mower(input[input.length - 1], line).run();
        } else {
            console.warn('This line is a series of instructions telling a mower how to explore the'
            + ' plateau and it is represented by a combination of Left (L), Right (R) and Move (M)'
            + ' orders (e.g. <LMLMLMLMM>). Try again...\n');
            return;
        }
    }

    input.push(line);
}

// Returns true if there´s a mower on the given position
function collision(newPosition) {
    return output.filter((position) => position.includes(newPosition)).length;
}

// Writes the output to the console
function writeOutput() {
    console.log(`\nYour input was:\n${input.join('\n')}\n`);
    console.log(`The resulting output was:\n${output.join('\n')}`);
    rl.close();
}