import { PlayerInfo } from "../infrastructure/PlayerProvider";

type MatchType = "correct" | "incorrect" | "higher" | "lower";

export interface AttributeFeedback {
  value: string | number;
  match: MatchType;
  isClose?: boolean;
}

export interface GuessFeedback {
  name: AttributeFeedback;
  position: AttributeFeedback;
  height: AttributeFeedback;
  jerseyNumber: AttributeFeedback;
  conference: AttributeFeedback;
  division: AttributeFeedback;
  team: AttributeFeedback;
  age: AttributeFeedback;
}

export class HandleGuess {

    // return a blank GuessFeedback object
    static getBlankGuess(): GuessFeedback {
        return {
            name: {value: "", match: "incorrect"},
            position: {value: "", match: "incorrect"},
            height: {value: "", match: "incorrect"},
            jerseyNumber: {value: "", match: "incorrect"},
            conference: {value: "", match: "incorrect"},
            division: {value: "", match: "incorrect"},
            team: {value: "", match: "incorrect"},
            age: {value: "", match: "incorrect"}
        }
    }

    // compare the user's guess with the target and return a GuessFeedback object
    static checkGuess(guess: PlayerInfo, target: PlayerInfo): GuessFeedback {
        
        const res: GuessFeedback = {
            name: {   
                value: guess.name, 
                match: guess.name === target.name ? "correct" : "incorrect"
            },
            position: {
                value: guess.position, 
                match: guess.position === target.position ? "correct" : "incorrect"
            },
            height: {
                value: guess.displayHeight, 
                match: guess.height === target.height ? "correct" :
                    guess.height > target.height 
                    ? "lower" : "higher",
                isClose: guess.height !== target.height && Math.abs(guess.height - target.height) <= 2 ? true : false // within 2 inches
            },
            jerseyNumber: {
                value: guess.jerseyNumber, 
                match: guess.jerseyNumber === target.jerseyNumber ? "correct" :
                    guess.jerseyNumber > target.jerseyNumber ? "lower" : "higher",
                isClose: guess.jerseyNumber !== target.jerseyNumber && Math.abs(guess.jerseyNumber - target.jerseyNumber) <= 2 ? true : false // within 2 numbers
            },
            age: {
                value: guess.age, 
                match: guess.age === target.age ? "correct" :
                    guess.age > target.age ? "lower" : "higher",
                isClose: guess.age !== target.age && Math.abs(guess.age - target.age) <= 2 ? true : false // within 2 years
            },
            conference: {
                value: guess.conference, 
                match: guess.conference === target.conference ? "correct" : "incorrect"
            },
            division: {
                value: guess.division, 
                match: guess.division === target.division ? "correct" : "incorrect"
            },
            team: {
                value: guess.team, 
                match: guess.team === target.team ? "correct" : "incorrect"
            },
        };

        return res
    }
}