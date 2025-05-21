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
  draftYear: AttributeFeedback;
  conference: AttributeFeedback;
  division: AttributeFeedback;
  team: AttributeFeedback;
  country: AttributeFeedback;
}

export class HandleGuess {
    
    static parseHeight(height: string): number {
        const [feet, inches] = height.split("-").map(Number);
        return feet * 12 + inches;
    }

    static getBlankGuess(): GuessFeedback {
        return {
            name: {value: "", match: "incorrect"},
            position: {value: "", match: "incorrect"},
            height: {value: "", match: "incorrect"},
            jerseyNumber: {value: "", match: "incorrect"},
            draftYear: {value: "", match: "incorrect"},
            conference: {value: "", match: "incorrect"},
            division: {value: "", match: "incorrect"},
            team: {value: "", match: "incorrect"},
            country: {value: "", match: "incorrect"}
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
                value: guess.height, 
                match: guess.height === target.height ? "correct" :
                    this.parseHeight(guess.height) > this.parseHeight(target.height) 
                    ? "lower" : "higher"
            },
            jerseyNumber: {
                value: guess.jerseyNumber, 
                match: guess.jerseyNumber === target.jerseyNumber ? "correct" :
                    guess.jerseyNumber > target.jerseyNumber ? "lower" : "higher"
            },
            draftYear: {
                value: guess.draftYear, 
                match: guess.draftYear === target.draftYear ? "correct" :
                    guess.draftYear > target.draftYear ? "lower" : "higher"
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
            country: {
                value: guess.country, 
                match: guess.country === target.country ? "correct" : "incorrect"
            },
        };

        return res
    }
}