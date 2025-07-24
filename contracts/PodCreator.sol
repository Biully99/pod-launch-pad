// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

// Peapods Finance Factory Interface
interface IPeapodsFactory {
    function createPod(
        address baseToken,
        string calldata name,
        string calldata symbol,
        uint256 wrapFee,
        uint256 unwrapFee
    ) external returns (address pod);
}

/**
 * @title PodCreator
 * @dev Creates Peapods Finance Pods for newly launched tokens
 */
contract PodCreator is Ownable, ReentrancyGuard {
    address public peapodsFactory;
    
    uint256 public defaultWrapFee = 30;   // 0.3%
    uint256 public defaultUnwrapFee = 30; // 0.3%
    uint256 public minLiquidityRequired = 1 ether;
    
    mapping(address => address) public tokenToPod;
    mapping(address => bool) public podExists;
    address[] public allPods;
    mapping(address => bool) public authorizedCreators;
    
    event PodCreated(address indexed token, address indexed pod, address oracle, uint256 wrapFee, uint256 unwrapFee);
    event DefaultFeesUpdated(uint256 wrapFee, uint256 unwrapFee);
    
    modifier onlyAuthorized() {
        require(msg.sender == owner() || authorizedCreators[msg.sender], "Unauthorized");
        _;
    }
    
    constructor(address _peapodsFactory) {
        require(_peapodsFactory != address(0), "Invalid factory address");
        peapodsFactory = _peapodsFactory;
    }
    
    function createPod(
        address baseToken,
        string calldata name,
        string calldata symbol
    ) external onlyAuthorized nonReentrant returns (address) {
        require(baseToken != address(0), "Invalid token address");
        require(!podExists[baseToken], "Pod already exists for this token");
        require(bytes(name).length > 0, "Invalid name");
        require(bytes(symbol).length > 0, "Invalid symbol");
        
        require(_validateTokenLiquidity(baseToken), "Token must have active liquidity");
        
        address pod = IPeapodsFactory(peapodsFactory).createPod(
            baseToken,
            name,
            symbol,
            defaultWrapFee,
            defaultUnwrapFee
        );
        
        tokenToPod[baseToken] = pod;
        podExists[baseToken] = true;
        allPods.push(pod);
        
        emit PodCreated(baseToken, pod, address(0), defaultWrapFee, defaultUnwrapFee);
        
        return pod;
    }
    
    function _validateTokenLiquidity(address token) internal view returns (bool) {
        uint256 codeSize;
        assembly {
            codeSize := extcodesize(token)
        }
        if (codeSize == 0) return false;
        
        try IERC20(token).totalSupply() returns (uint256 supply) {
            return supply > 0;
        } catch {
            return false;
        }
    }
    
    function setAuthorizedCreator(address creator, bool authorized) external onlyOwner {
        authorizedCreators[creator] = authorized;
    }
    
    function updateDefaultFees(uint256 _wrapFee, uint256 _unwrapFee) external onlyOwner {
        require(_wrapFee <= 1000 && _unwrapFee <= 1000, "Fees cannot exceed 10%");
        defaultWrapFee = _wrapFee;
        defaultUnwrapFee = _unwrapFee;
        emit DefaultFeesUpdated(_wrapFee, _unwrapFee);
    }
    
    function updatePeapodsFactory(address _factory) external onlyOwner {
        require(_factory != address(0), "Invalid factory address");
        peapodsFactory = _factory;
    }
    
    // View functions
    function getPodForToken(address token) external view returns (address) {
        return tokenToPod[token];
    }
    
    function hasPod(address token) external view returns (bool) {
        return podExists[token];
    }
    
    function getAllPods() external view returns (address[] memory) {
        return allPods;
    }
}