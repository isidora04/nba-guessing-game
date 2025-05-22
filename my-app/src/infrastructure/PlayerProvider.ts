import data from "../data/clean_data.json";

export interface PlayerInfo {
    name: string;
    position: string;
    height: number;
    displayHeight: string;
    jerseyNumber: number;
    age: number;
    team: string;
    conference: string;
    division: string;
}

export class PlayerProvider {

    private static playerList: PlayerInfo[] | null = null;

    static async initializePlayerList(): Promise<void> {

        if (!this.playerList) {

            // process the data file
            let allPlayers: any[] = [];

            for (const team of data) {
                for (const player of team) {
                    allPlayers.push(player);
                }
            }
            this.playerList = allPlayers;
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