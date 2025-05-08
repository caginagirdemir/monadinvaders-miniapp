// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract OnePerWalletNFT is ERC721URIStorage, Ownable {
    uint256 public tokenCounter;
    string public baseTokenURI;
    mapping(address => bool) public hasMinted;

    constructor(string memory _baseTokenURI) ERC721("OnePerWalletNFT", "1NFT") {
        tokenCounter = 0;
        baseTokenURI = _baseTokenURI;
    }

    function mint() public {
        require(!hasMinted[msg.sender], "You already minted.");

        uint256 newTokenId = tokenCounter;
        _safeMint(msg.sender, newTokenId);
        _setTokenURI(newTokenId, baseTokenURI);

        hasMinted[msg.sender] = true;
        tokenCounter++;
    }
}
