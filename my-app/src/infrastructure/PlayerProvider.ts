import { BalldontlieAPI } from "@balldontlie/sdk";

export interface PlayerInfo {
    name: string;
    position: string;
    height: string;
    jerseyNumber: number;
    draftYear: number;
    conference: string;
    division: string;
    team: string;
    country: string;
}

export class PlayerProvider {

    private static playerList: PlayerInfo[] | null = null;

    static async initializePlayerList(): Promise<void> {

        if (!this.playerList) {

            const API_KEY: string = process.env.REACT_APP_API_KEY || "";
            if (!API_KEY) {
                throw new Error("Missing API key");
            }
            const api = new BalldontlieAPI({ apiKey: API_KEY });
            let allPlayers: any[] = [];

            for (let i = 0; i < 5; i++) {
                let getPage = await api.nba.getPlayers({per_page: 100, cursor: i * 100});
                allPlayers = allPlayers.concat(getPage.data);
            } // change to espn api

            this.playerList = allPlayers.filter(
                p => p.draft_year && p.jersey_number && parseInt(p.draft_year) >= 2004)
                .map(p => ({
                    name: `${p.first_name} ${p.last_name}`,
                    position: p.position,
                    height: p.height,
                    jerseyNumber: parseInt(p.jersey_number),
                    draftYear: parseInt(p.draft_year),
                    conference: p.team?.conference,
                    division: p.team?.division,
                    team: p.team?.abbreviation,
                    country: p.country,
            }));
        }
    }
    
    static async getRandomPlayer(): Promise<PlayerInfo> {
        
        await this.initializePlayerList();
        const randomIndex = Math.floor(Math.random() * this.playerList!.length);
        return this.playerList![randomIndex];
    }

    static async findPlayerByName(name: string): Promise<PlayerInfo> {

        await this.initializePlayerList();
        const findPlayer: PlayerInfo | undefined = this.playerList?.find(
            p => p.name.toLowerCase().trim() === name.toLowerCase().trim()
        );

        if (!findPlayer) {
            throw new Error(`Player "${name}" not found`);
        }
        return findPlayer;
    }

    static async findPlayers(search: string): Promise<PlayerInfo[]> {

        await this.initializePlayerList();
        const getPlayers: PlayerInfo[] = this.playerList!.filter(
            p => p.name.toLowerCase().trim().includes(search.toLowerCase().trim())
        )
        return getPlayers;
    }
}