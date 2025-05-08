// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract GameScores {
    struct Score {
        address player;
        uint256 value;
    }

    mapping(address => uint256) public playerScores;
    address[] public players;

    function submitScore(uint256 _score) public {
        uint256 currentScore = playerScores[msg.sender];

        if (_score > currentScore) {
            // Yeni skor daha yüksekse güncelle
            playerScores[msg.sender] = _score;

            // Eğer ilk kez oynuyorsa listeye ekle
            if (currentScore == 0) {
                players.push(msg.sender);
            }
        }
    }

    function getHighScores() public view returns (Score[] memory) {
        uint256 count = players.length;
        Score[] memory scores = new Score[](count);

        for (uint256 i = 0; i < count; i++) {
            address player = players[i];
            scores[i] = Score(player, playerScores[player]);
        }

        return scores;
    }
}
