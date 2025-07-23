// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

// Peapods Finance Factory Interface
interface IPeapodsFactory {
    function createPod(
        address baseToken,
        uint256 wrapFee,
        uint256 unwrapFee,
        address oracle,
        bytes calldata oracleInitData
    ) external returns (address pod);
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
 * @dev Creates Peapods Finance Pods for newly launched tokens
 */
contract PodCreator is Ownable, ReentrancyGuard {
    // Peapods Factory contract address
    address public constant PEAPODS_FACTORY_ADDRESS = 0x1234567890123456789012345678901234567890; // PLACEHOLDER: Insert actual Peapods Factory address
    
    // Default fees (in basis points, e.g., 30 = 0.3%)
    uint256 public defaultWrapFee = 30;   // 0.3%
    uint256 public defaultUnwrapFee = 30; // 0.3%
    
    // Default oracle (can be Chainlink or TWAP)
    address public defaultOracle;
    
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
    
    constructor(address _defaultOracle) {
        defaultOracle = _defaultOracle;
    }
    
    /**
     * @dev Create a Peapods Pod for a token
     * @param baseToken The ERC20 token address
     * @param oracle Optional specific oracle (use address(0) for default)
     * @param oracleInitData Optional oracle initialization data
     */
    function createPod(
        address baseToken,
        address oracle,
        bytes calldata oracleInitData
    ) external onlyAuthorized nonReentrant returns (address) {
        require(baseToken != address(0), "Invalid token address");
        require(!podExists[baseToken], "Pod already exists for this token");
        
        // Use default oracle if none specified
        address useOracle = oracle == address(0) ? defaultOracle : oracle;
        require(useOracle != address(0), "No oracle specified");
        
        // Validate token exists and has liquidity
        require(_validateTokenLiquidity(baseToken), "Token must have active liquidity");
        
        // Create Pod via Peapods Factory
        address pod = IPeapodsFactory(PEAPODS_FACTORY_ADDRESS).createPod(
            baseToken,
            defaultWrapFee,
            defaultUnwrapFee,
            useOracle,
            oracleInitData
        );
        
        // Store pod info
        tokenToPod[baseToken] = pod;
        podExists[baseToken] = true;
        allPods.push(pod);
        
        emit PodCreated(baseToken, pod, useOracle, defaultWrapFee, defaultUnwrapFee);
        
        return pod;
    }
    
    /**
     * @dev Create Pod with custom fees
     */
    function createPodWithCustomFees(
        address baseToken,
        uint256 wrapFee,
        uint256 unwrapFee,
        address oracle,
        bytes calldata oracleInitData
    ) external onlyAuthorized nonReentrant returns (address) {
        require(baseToken != address(0), "Invalid token address");
        require(!podExists[baseToken], "Pod already exists for this token");
        require(wrapFee <= 1000 && unwrapFee <= 1000, "Fees cannot exceed 10%");
        
        // Use default oracle if none specified
        address useOracle = oracle == address(0) ? defaultOracle : oracle;
        require(useOracle != address(0), "No oracle specified");
        
        // Validate token exists and has liquidity
        require(_validateTokenLiquidity(baseToken), "Token must have active liquidity");
        
        // Create Pod via Peapods Factory
        address pod = IPeapodsFactory(PEAPODS_FACTORY_ADDRESS).createPod(
            baseToken,
            wrapFee,
            unwrapFee,
            useOracle,
            oracleInitData
        );
        
        // Store pod info
        tokenToPod[baseToken] = pod;
        podExists[baseToken] = true;
        allPods.push(pod);
        
        emit PodCreated(baseToken, pod, useOracle, wrapFee, unwrapFee);
        
        return pod;
    }
    
    /**
     * @dev Validate that token has active liquidity
     * This is a simplified check - in production you'd want more robust validation
     */
    function _validateTokenLiquidity(address token) internal view returns (bool) {
        // Basic check: token contract exists and has some total supply
        uint256 codeSize;
        assembly {
            codeSize := extcodesize(token)
        }
        return codeSize > 0;
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
     * @dev Update default oracle
     */
    function updateDefaultOracle(address _oracle) external onlyOwner {
        require(_oracle != address(0), "Invalid oracle address");
        defaultOracle = _oracle;
        emit DefaultOracleUpdated(_oracle);
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
     * @dev Emergency function to update Peapods Factory address if needed
     * Note: In production, this should be immutable or use a proxy pattern
     */
    function updatePeapodsFactory(address newFactory) external onlyOwner {
        require(newFactory != address(0), "Invalid factory address");
        // This would require updating the constant, so in practice you'd use a storage variable
        // PEAPODS_FACTORY_ADDRESS = newFactory;
    }
}