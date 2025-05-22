import { PlayerInfo } from "../infrastructure/PlayerProvider";
import * as fs from "fs";

const rawData = JSON.parse(fs.readFileSync("src/data/raw_data.json", "utf-8"));

const players: PlayerInfo[] = [];

const team = rawData.team.abbreviation;
const conference = "";
const division = "";

for (const athlete of rawData.athletes) {

    const name = athlete.displayName;
    const height = athlete.height;
    const displayHeight = athlete.displayHeight[0] + athlete.displayHeight[1] + athlete.displayHeight[3];
    const age = athlete.age;
    const position = athlete.position?.abbreviation;
    const jerseyNumber = parseInt(athlete.jersey);

    players.push({name, height, displayHeight, age, position, jerseyNumber, team, conference , division});
  }

// append
const fileContents = fs.readFileSync("src/data/clean_data.json", 'utf-8');
const existingData: PlayerInfo[] = fileContents ? JSON.parse(fileContents) : [];
const updatedData = [...existingData, players];
fs.writeFileSync("src/data/clean_data.json", JSON.stringify(updatedData, null, 2));