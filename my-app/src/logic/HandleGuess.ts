import { PlayerInfo } from "../infrastructure/PlayerProvider";

type MatchType = "correct" | "incorrect" | "partial" | "higher" | "lower";

export interface AttributeFeedback {
  value: string | number;
  match: MatchType;
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

    static checkGuess(guess: PlayerInfo, target: PlayerInfo): GuessFeedback {
        
        const res: GuessFeedback = {
            name: {   
                value: guess.name, 
                match: guess.name === target.name ? "correct" : "incorrect"
            },
            position: {
                value: guess.position, 
                match: guess.position === target.position ? "correct" :
                    guess.position.split("-").includes(target.position) ||
                    target.position.split("-").includes(guess.position) 
                    ? "partial" : "incorrect"
            },
            height: {
                value: guess.displayHeight, 
                match: guess.height === target.height ? "correct" :
                    guess.height > target.height 
                    ? "lower" : "higher"
            },
            jerseyNumber: {
                value: guess.jerseyNumber, 
                match: guess.jerseyNumber === target.jerseyNumber ? "correct" :
                    guess.jerseyNumber > target.jerseyNumber ? "lower" : "higher"
            },
            age: {
                value: guess.age, 
                match: guess.age === target.age ? "correct" :
                    guess.age > target.age ? "lower" : "higher"
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