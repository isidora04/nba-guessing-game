import { useEffect, useState } from "react";
import { PlayerInfo, PlayerProvider } from "../infrastructure/PlayerProvider";
import { GuessFeedback, HandleGuess } from "../logic/HandleGuess";
import { Trophy, CircleHelp, RefreshCw, ArrowDown, ArrowUp } from "lucide-react";
import './gamePage.css';
import DarkModeToggle from "../components/DarkModeToggle";

const GamePage = () => {

    const defaultGuess: GuessFeedback = HandleGuess.getBlankGuess();

    const divisionShortForm = {
        Atlantic: "Atl",
        Central: "Cen",
        Southeast: "SE",
        Northwest: "NW",
        Pacific: "Pac",
        Southwest: "SW",
    };

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
    const [ helpPopup, setHelpPopup ] = useState(false);
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
        }, 700);
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
                    <button className="circle-help" onClick={() => setHelpPopup(!helpPopup)}>
                        <CircleHelp />
                    </button>
                    <span className="dark-toggle"><DarkModeToggle></DarkModeToggle></span>
                </div>
            </div>

            {helpPopup && <>
                <div className="help-popup">
                    <div className="help-container">
                    <h3>How to Play</h3>
                        <ul className="instructions">
                            <li>Try to guess the NBA player in 8 guesses</li>
                            <li>After each guess, you'll see which attributes match the target player</li>
                            <li>Green means a perfect match</li>
                            <li>Red means incorrect</li>
                            <li>Play as many rounds as you want!</li>
                        </ul>
                    </div>
                </div>
            </>}

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
            <div className="results-table">
                <div className="table-header">
                    <div className="name-col">Name</div>
                    <div><span className="full-label">Team</span><span className="short-label">Team</span></div>
                    <div><span className="full-label">Conference</span><span className="short-label">Conf</span></div>
                    <div><span className="full-label">Division</span><span className="short-label">Div</span></div>
                    <div><span className="full-label">Position</span><span className="short-label">Pos</span></div>
                    <div><span>Age</span></div>
                    <div><span className="full-label">Height</span><span className="short-label">Ht</span></div>
                    <div><span className="full-label">Number</span><span className="short-label">#</span></div>
                </div>
                {guesses.map((guess, index) => (
                    <div className="results-table-row" key={index}>
                        {guess.name.value === "" ? <div className="unknown-row">?</div> : 
                            <>
                            <p className={`${guess.name.match} name-col`}>{guess.name.value}</p>
                            <p className={guess.team.match}>{guess.team.value}</p>
                            <p className={guess.conference.match}>{guess.conference.value}</p>
                            <p className={guess.division.match}><span className="full-div">{guess.division.value}</span>
                            {/* 
                            // @ts-ignore */}
                                <span className="short-div">{divisionShortForm[guess.division.value]}</span>
                            </p>
                            <p className={guess.position.match}>{guess.position.value}</p>
                            <p className={guess.age.match}>
                                <span>
                                    {guess.age.value}
                                    {guess.age.match === "lower" && <ArrowDown className="arrow" />}
                                    {guess.age.match === "higher" && <ArrowUp className="arrow" />}
                                </span>
                            </p>
                            <p className={guess.height.match}>
                                <span>
                                    {guess.height.value}
                                    {guess.height.match === "lower" && <ArrowDown className="arrow" />}
                                    {guess.height.match === "higher" && <ArrowUp className="arrow" />}
                                </span>
                            </p>
                            <p className={guess.jerseyNumber.match}>
                                <span>
                                    {guess.jerseyNumber.value}
                                    {guess.jerseyNumber.match === "lower" && <ArrowDown className="arrow" />}
                                    {guess.jerseyNumber.match === "higher" && <ArrowUp className="arrow" />}
                                </span>
                            </p>
                        </>
                        }
                    </div>)
                )}
            </div>

            <button className="give-up" disabled={lossPopup || winPopup}
                onClick={() => handleLoss()}>Give up?</button>

            {lossPopup && 
                <div className="loss-popup-container">
                    <h3>Game Over!</h3>
                    <p>{`The player was `}
                            <span style={{color: "#f97316", fontWeight: "700"}}  
                            >{targetPlayer.name}</span>
                        {` (${targetPlayer.team}, ${targetPlayer.position})`}</p>
                    <button className="play-again-button" onClick={() => startNewRound()}
                        ><RefreshCw />Play Again</button>
                </div>}

            {winPopup && 
                <div className="win-popup-container">
                    <h3>You won! 🏆</h3>
                    <p>{`The player was `}
                            <span style={{color: "#f97316", fontWeight: "700"}}
                            >{targetPlayer.name}</span>
                        {` (${targetPlayer.team}, ${targetPlayer.position})`}</p>
                    <button className="play-again-button" onClick={() => startNewRound()}
                        ><RefreshCw />Play Again</button>
                </div>}
        </div>
    )
}

export default GamePage;