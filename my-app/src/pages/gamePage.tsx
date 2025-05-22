import { useEffect, useState } from "react";
import { PlayerInfo, PlayerProvider } from "../infrastructure/PlayerProvider";
import { GuessFeedback, HandleGuess } from "../logic/HandleGuess";
import { Trophy, CircleHelp, RefreshCw, ArrowDown, ArrowUp } from "lucide-react";
import './gamePage.css';

const GamePage = () => {

    const defaultGuess: GuessFeedback = HandleGuess.getBlankGuess();

    const [ targetPlayer, setTargetPlayer ] = useState<PlayerInfo>({
            name: "",
            position: "",
            height: -1,
            displayHeight: "",
            jerseyNumber: -1,
            conference: "",
            division: "",
            team: "",
            age: -1
    });
    const [ guessCount, setGuessCount ] = useState(0);
    const [ guesses, setGuesses ] = useState<GuessFeedback[]>(Array(8).fill(defaultGuess));
    const [ searchResults, setSearchResults ] = useState<any[]>([]);
    const [ search, setSearch ] = useState("");
    const [ winCount, setWinCount ] = useState(0);
    const [ gamesPlayed, setGamesPlayed ] = useState(0);
    const [ error, setError ] = useState("");
    const [ winPopup, setWinPopup ] = useState(false);
    const [ lossPopup, setLossPopup ] = useState(false);

    useEffect(() => { 
        startNewRound();
    }, []);

    const startNewRound = async () => {
        try {
            setGuessCount(0); // reset if needed from previous round
            setGuesses(Array(8).fill(defaultGuess));
            setWinPopup(false);
            setLossPopup(false);

            const randomPlayer = await PlayerProvider.getRandomPlayer();
            setTargetPlayer(randomPlayer);
        } catch (error) {
            setError(`Error: ${error}`);
        }
    }

    useEffect(() => {
        const getData = setTimeout(async () => {
            if (search.trim() === "") {
                setSearchResults([]);
                return;
            }
            try {
                const matches = await PlayerProvider.findPlayers(search);
                setSearchResults(matches);
            } catch (error) {
                setError(`Error: ${error}`);
            }
        }, 1000);
        return () => clearTimeout(getData);
    }, [search]);

    const handleClick = async (player: PlayerInfo) => {
        try {
            if (!targetPlayer.name) {
                setError("Error: could not get target player");
                return;
            }

            const getPlayer = await PlayerProvider.findPlayerByName(player.name);

            const guessFeedback = await HandleGuess.checkGuess(getPlayer, targetPlayer);
            const newGuesses: GuessFeedback[] = guesses.map(
                (g: GuessFeedback, index: number) => index === guessCount ? guessFeedback : g);
            setGuesses(newGuesses);
            setGuessCount(guessCount + 1);

            if (guessFeedback.name.match === "correct") {
                setWinCount(winCount + 1);
                handleWin();
            }
            if (guessFeedback.name.match !== "correct" && guessCount + 1 === 8) {
                handleLoss();
            }
            setSearch(""); // reset
            setSearchResults([]);
        } catch (error) {
            setError(`Error: ${error}`);
        }
    }

    const handleWin = () => {
        setWinCount(winCount + 1);
        setGamesPlayed(gamesPlayed + 1);
        setWinPopup(true);
    }

    const handleLoss = () => {
        setGamesPlayed(gamesPlayed + 1);
        setLossPopup(true);
    }

    return (
        <div className="game-container">
            <div className="game-header">
                <h1>NBA Guessing Game</h1>
                <p>Guess the NBA player in 8 tries!</p>
                <div className="num-wins">
                    <p><Trophy className="trophy" />{winCount}/{gamesPlayed} wins</p>
                    <button className="circle-help"><CircleHelp /></button>
                </div>
            </div>

            {error && <p className="error-text">{error}</p>}

            <input type="text" placeholder="Search players" className="search-bar"
                value={search} onChange={(e) => setSearch(e.target.value)} 
                disabled={winPopup || lossPopup} />
            {searchResults.length !== 0 && 
                (<div className={searchResults.length > 4 ? "search-results results-scroll" : "search-results"}>
                    {
                        searchResults.map((player) => (
                            <button key={player.name} onClick={() => handleClick(player)}
                                >{player.name}</button>
                        ))
                    }
                </div>)
            }
            <table className="results-table">
                <thead className="table-header">
                    <tr className="table-headings">
                        <th>Name</th>
                        <th>Team</th>
                        <th>Conference</th>
                        <th>Division</th>
                        <th>Position</th>
                        <th>Age</th>
                        <th>Height</th>
                        <th>Number</th>
                    </tr>
                </thead>
                <tbody className="table-body">
                {guesses.map((guess, index) => (
                    <tr className="results-table-row" key={index}>
                        {guess.name.value === "" ? <td colSpan={9} className="unknown-row">?</td> : 
                            <><td className={guess.name.match}>{guess.name.value}</td>
                            <td className={guess.team.match}>{guess.team.value}</td>
                            <td className={guess.conference.match}>{guess.conference.value}</td>
                            <td className={guess.division.match}>{guess.division.value}</td>
                            <td className={guess.position.match}>{guess.position.value}</td>
                            <td className={guess.age.match}>
                                <div>
                                    {guess.age.value}
                                    {guess.age.match === "lower" && <ArrowDown className="arrow" />}
                                    {guess.age.match === "higher" && <ArrowUp className="arrow" />}
                                </div>
                            </td>
                            <td className={guess.height.match}>
                                <div>
                                    {guess.height.value}
                                    {guess.height.match === "lower" && <ArrowDown className="arrow" />}
                                    {guess.height.match === "higher" && <ArrowUp className="arrow" />}
                                </div>
                            </td>
                            <td className={guess.jerseyNumber.match}>
                                <div>
                                    {guess.jerseyNumber.value}
                                    {guess.jerseyNumber.match === "lower" && <ArrowDown className="arrow" />}
                                    {guess.jerseyNumber.match === "higher" && <ArrowUp className="arrow" />}
                                </div>
                            </td>
                        </>
                        }
                    </tr>)
                )}
                </tbody>
            </table>

            <button className="give-up" disabled={lossPopup || winPopup}
                onClick={() => handleLoss()}>Give up?</button>

            {lossPopup && 
                <div className="loss-popup-container">
                    <h3>Game Over!</h3>
                    <div>{`The player was `}
                            <p className="target-name">{targetPlayer.name}</p>
                        {`(${targetPlayer.team}, ${targetPlayer.position})`}</div>
                    <button className="play-again-button" onClick={() => startNewRound()}
                        ><RefreshCw />Play Again</button>
                </div>}

            {winPopup && 
                <div className="win-popup-container">
                    <h3>You won! 🏆</h3>
                    <div>{`The player was `}
                            <p className="target-name">{targetPlayer.name}</p>
                        {`(${targetPlayer.team}, ${targetPlayer.position})`}</div>
                    <button className="play-again-button" onClick={() => startNewRound()}
                        ><RefreshCw />Play Again</button>
                </div>}
        </div>
    )
}

export default GamePage;