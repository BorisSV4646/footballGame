// ?код для реализации игры
// /\*_
// _ @dev The structure of the game.
// \*/
// struct PlayGame {
// address winner;
// address[] players;
// uint256 reward;
// bool start;
// }

// /\*_
// _ @dev A link to the game number and information about it.
// \*/
// mapping(uint256 => PlayGame) public allGames;

// address[] memory playersZero = new address[](2);
// playersZero[0] = player1;
// playersZero[1] = player2;

// PlayGame memory newGame = PlayGame({
// winner: address(0),
// players: playersZero,
// reward: amount \* 2,
// start: true
// });

// allGames[gameId] = newGame;
// emit StartGameEvent(amount, gameId);
// gameId++;
