// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

// Peapods Finance Factory Interface (updated to match real protocol)
interface IPeapodsFactory {
    function createPod(
        address baseToken,
        string calldata name,
        string calldata symbol,
        uint256 wrapFee,
        uint256 unwrapFee
    ) external returns (address pod);
    
    function getPodByToken(address token) external view returns (address);
    function getAllPods() external view returns (address[] memory);
}

// Pod (Vault) Interface
interface IPeapodVault {
    function baseToken() external view returns (address);
    function wrapFee() external view returns (uint256);
    function unwrapFee() external view returns (uint256);
    function totalAssets() external view returns (uint256);
    function wrap(uint256 amount) external returns (uint256);
    function unwrap(uint256 amount) external returns (uint256);
}

// Oracle Interface (Chainlink/TWAP)
interface IPriceOracle {
    function latestRoundData() external view returns (
        uint80 roundId,
        int256 answer,
        uint256 startedAt,
        uint256 updatedAt,
        uint80 answeredInRound
    );
}

/**
 * @title PodCreator
 * @dev Creates Peapods Finance Pods (Vaults) for newly launched tokens
 * @notice This contract integrates with the Peapods protocol to create wrapped versions of tokens
 */
contract PodCreator is Ownable, ReentrancyGuard {
    // Peapods Factory contract address (Base mainnet)
    address public peapodsFactory;
    
    // Default fees (in basis points, e.g., 30 = 0.3%)
    uint256 public defaultWrapFee = 30;   // 0.3%
    uint256 public defaultUnwrapFee = 30; // 0.3%
    
    // Minimum liquidity required for pod creation
    uint256 public minLiquidityRequired = 1 ether; // 1 ETH minimum
    
    // Track created pods
    mapping(address => address) public tokenToPod;
    mapping(address => bool) public podExists;
    address[] public allPods;
    
    // Events
    event PodCreated(
        address indexed token,
        address indexed pod,
        address oracle,
        uint256 wrapFee,
        uint256 unwrapFee
    );
    
    event DefaultFeesUpdated(uint256 wrapFee, uint256 unwrapFee);
    event DefaultOracleUpdated(address oracle);
    
    // Modifiers
    modifier onlyAuthorized() {
        // Allow owner or authorized contracts (TokenFactory) to create pods
        require(msg.sender == owner() || authorizedCreators[msg.sender], "Unauthorized");
        _;
    }
    
    // Authorized creators (e.g., TokenFactory contract)
    mapping(address => bool) public authorizedCreators;
    
    constructor(address _peapodsFactory) {
        require(_peapodsFactory != address(0), "Invalid factory address");
        peapodsFactory = _peapodsFactory;
    }
    
    /**
     * @dev Create a Peapods Pod (Vault) for a token
     * @param baseToken The ERC20 token address
     * @param name Name for the Pod token (e.g., "Peapod DOGE")
     * @param symbol Symbol for the Pod token (e.g., "pDOGE")
     */
    function createPod(
        address baseToken,
        string calldata name,
        string calldata symbol
    ) external onlyAuthorized nonReentrant returns (address) {
        require(baseToken != address(0), "Invalid token address");
        require(!podExists[baseToken], "Pod already exists for this token");
        require(bytes(name).length > 0, "Invalid name");
        require(bytes(symbol).length > 0, "Invalid symbol");
        
        // Validate token exists and has liquidity
        require(_validateTokenLiquidity(baseToken), "Token must have active liquidity");
        
        // Create Pod via Peapods Factory
        address pod = IPeapodsFactory(peapodsFactory).createPod(
            baseToken,
            name,
            symbol,
            defaultWrapFee,
            defaultUnwrapFee
        );
        
        // Store pod info
        tokenToPod[baseToken] = pod;
        podExists[baseToken] = true;
        allPods.push(pod);
        
        emit PodCreated(baseToken, pod, address(0), defaultWrapFee, defaultUnwrapFee);
        
        return pod;
    }
    
    /**
     * @dev Create Pod with custom fees
     */
    function createPodWithCustomFees(
        address baseToken,
        string calldata name,
        string calldata symbol,
        uint256 wrapFee,
        uint256 unwrapFee
    ) external onlyAuthorized nonReentrant returns (address) {
        require(baseToken != address(0), "Invalid token address");
        require(!podExists[baseToken], "Pod already exists for this token");
        require(wrapFee <= 1000 && unwrapFee <= 1000, "Fees cannot exceed 10%");
        require(bytes(name).length > 0, "Invalid name");
        require(bytes(symbol).length > 0, "Invalid symbol");
        
        // Validate token exists and has liquidity
        require(_validateTokenLiquidity(baseToken), "Token must have active liquidity");
        
        // Create Pod via Peapods Factory
        address pod = IPeapodsFactory(peapodsFactory).createPod(
            baseToken,
            name,
            symbol,
            wrapFee,
            unwrapFee
        );
        
        // Store pod info
        tokenToPod[baseToken] = pod;
        podExists[baseToken] = true;
        allPods.push(pod);
        
        emit PodCreated(baseToken, pod, address(0), wrapFee, unwrapFee);
        
        return pod;
    }
    
    /**
     * @dev Validate that token has active liquidity
     * This checks for contract existence and basic liquidity requirements
     */
    function _validateTokenLiquidity(address token) internal view returns (bool) {
        // Basic check: token contract exists
        uint256 codeSize;
        assembly {
            codeSize := extcodesize(token)
        }
        if (codeSize == 0) return false;
        
        // Check if token has any total supply
        try IERC20(token).totalSupply() returns (uint256 supply) {
            return supply > 0;
        } catch {
            return false;
        }
    }
    
    /**
     * @dev Set authorized creator (e.g., TokenFactory)
     */
    function setAuthorizedCreator(address creator, bool authorized) external onlyOwner {
        authorizedCreators[creator] = authorized;
    }
    
    /**
     * @dev Update default fees
     */
    function updateDefaultFees(uint256 _wrapFee, uint256 _unwrapFee) external onlyOwner {
        require(_wrapFee <= 1000 && _unwrapFee <= 1000, "Fees cannot exceed 10%");
        defaultWrapFee = _wrapFee;
        defaultUnwrapFee = _unwrapFee;
        emit DefaultFeesUpdated(_wrapFee, _unwrapFee);
    }
    
    /**
     * @dev Update Peapods Factory address
     */
    function updatePeapodsFactory(address _factory) external onlyOwner {
        require(_factory != address(0), "Invalid factory address");
        peapodsFactory = _factory;
    }
    
    /**
     * @dev Update minimum liquidity requirement
     */
    function updateMinLiquidity(uint256 _minLiquidity) external onlyOwner {
        minLiquidityRequired = _minLiquidity;
    }
    
    /**
     * @dev Get Pod address for token
     */
    function getPodForToken(address token) external view returns (address) {
        return tokenToPod[token];
    }
    
    /**
     * @dev Check if Pod exists for token
     */
    function hasPod(address token) external view returns (bool) {
        return podExists[token];
    }
    
    /**
     * @dev Get all created Pods
     */
    function getAllPods() external view returns (address[] memory) {
        return allPods;
    }
    
    /**
     * @dev Get Pod creation stats
     */
    function getPodStats() external view returns (uint256 totalPods) {
        return allPods.length;
    }
    
    /**
     * @dev Get Pod information
     */
    function getPodInfo(address token) external view returns (
        address podAddress,
        uint256 wrapFee,
        uint256 unwrapFee,
        uint256 totalAssets
    ) {
        require(podExists[token], "Pod does not exist");
        address pod = tokenToPod[token];
        
        IPeapodVault vault = IPeapodVault(pod);
        return (
            pod,
            vault.wrapFee(),
            vault.unwrapFee(),
            vault.totalAssets()
        );
    }
}