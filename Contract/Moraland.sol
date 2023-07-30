// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract Moraland is ERC721URIStorage{
    constructor() ERC721("Moraland", "MLND") {}
    event Assigned(uint256 indexed tokenId, address indexed assignee, bytes bytesId);

    function assign(string calldata tokenURI, bytes memory bytesId) public {
        require(bytesId.length >= 16, "Invalid input length"); // Ensure data is at least 16 bytes
        require(exist(bytesId) == false, "Plot already assigned");
        uint256 _tokenId;
        assembly {
            _tokenId := mload(add(bytesId, 16))
        }
        _mint(msg.sender, _tokenId);
        _setTokenURI(_tokenId, tokenURI);
        emit Assigned(_tokenId, msg.sender, bytesId);
    }

    function exist(bytes memory bytesId) public view returns (bool){
        require(bytesId.length >= 16, "Invalid input length"); // Ensure data is at least 16 bytes
        uint256 _tokenId;
        assembly {
            _tokenId := mload(add(bytesId, 16))
        }
        return _exists(_tokenId);
    }




    function stringToByes(string memory str) public pure returns (bytes memory) {
    return bytes(str);
    }

}