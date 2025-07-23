// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

/**
 * @title BasedMemeToken
 * @dev ERC20 token with based memecoin features
 */
contract BasedMemeToken is ERC20, Ownable, ReentrancyGuard {
    uint256 public immutable maxSupply;
    uint256 public fundraisingTarget;
    uint256 public fundraisedAmount;
    uint256 public creatorAllocation;
    address public creator;
    address public liquidityPool;
    bool public liquidityAdded;
    bool public tradingEnabled;
    
    mapping(address => uint256) public contributions;
    address[] public contributors;
    
    event FundraisingContribution(address indexed contributor, uint256 amount);
    event LiquidityAdded(address indexed pool, uint256 tokenAmount, uint256 ethAmount);
    event TradingEnabled();
    
    modifier onlyCreator() {
        require(msg.sender == creator, "Only creator can call this function");
        _;
    }
    
    modifier tradingActive() {
        require(tradingEnabled, "Trading not enabled yet");
        _;
    }
    
    constructor(
        string memory name,
        string memory symbol,
        uint256 _maxSupply,
        uint256 _fundraisingTarget,
        uint256 _creatorAllocation,
        address _creator
    ) ERC20(name, symbol) {
        maxSupply = _maxSupply * 10**decimals();
        fundraisingTarget = _fundraisingTarget;
        creatorAllocation = _creatorAllocation;
        creator = _creator;
        
        // Mint creator allocation
        uint256 creatorTokens = (maxSupply * creatorAllocation) / 100;
        _mint(creator, creatorTokens);
    }
    
    /**
     * @dev Contribute to token fundraising
     */
    function contribute() external payable nonReentrant {
        require(!liquidityAdded, "Fundraising completed");
        require(msg.value > 0, "Must contribute ETH");
        require(fundraisedAmount + msg.value <= fundraisingTarget, "Fundraising target exceeded");
        
        if (contributions[msg.sender] == 0) {
            contributors.push(msg.sender);
        }
        
        contributions[msg.sender] += msg.value;
        fundraisedAmount += msg.value;
        
        emit FundraisingContribution(msg.sender, msg.value);
        
        // Check if fundraising target is reached
        if (fundraisedAmount >= fundraisingTarget) {
            _finalizeFundraising();
        }
    }
    
    /**
     * @dev Finalize fundraising and prepare for liquidity addition
     */
    function _finalizeFundraising() internal {
        // Calculate tokens for contributors
        uint256 contributorTokens = maxSupply - balanceOf(creator);
        
        // Distribute tokens to contributors based on their contribution
        for (uint256 i = 0; i < contributors.length; i++) {
            address contributor = contributors[i];
            uint256 contribution = contributions[contributor];
            uint256 tokenAmount = (contributorTokens * contribution) / fundraisedAmount;
            _mint(contributor, tokenAmount);
        }
    }
    
    /**
     * @dev Add liquidity to Uniswap V3 (Base chain)
     */
    function addLiquidity(address _liquidityPool) external onlyCreator {
        require(fundraisedAmount >= fundraisingTarget, "Fundraising target not reached");
        require(!liquidityAdded, "Liquidity already added");
        
        liquidityPool = _liquidityPool;
        liquidityAdded = true;
        
        // Transfer ETH to creator for liquidity provision
        payable(creator).transfer(address(this).balance);
        
        emit LiquidityAdded(_liquidityPool, totalSupply(), fundraisedAmount);
    }
    
    /**
     * @dev Enable trading after liquidity is added
     */
    function enableTrading() external onlyCreator {
        require(liquidityAdded, "Liquidity must be added first");
        tradingEnabled = true;
        emit TradingEnabled();
    }
    
    /**
     * @dev Override transfer to enforce trading restrictions
     */
    function _transfer(
        address from,
        address to,
        uint256 amount
    ) internal virtual override {
        if (from != creator && to != creator && from != address(0)) {
            require(tradingEnabled, "Trading not enabled");
        }
        super._transfer(from, to, amount);
    }
    
    /**
     * @dev Get contribution details
     */
    function getContributionDetails() external view returns (
        uint256 target,
        uint256 raised,
        uint256 contributorCount,
        bool completed
    ) {
        return (
            fundraisingTarget,
            fundraisedAmount,
            contributors.length,
            liquidityAdded
        );
    }
}

/**
 * @title BasedTokenFactory
 * @dev Factory contract for deploying based meme tokens
 */
contract BasedTokenFactory is ReentrancyGuard {
    struct TokenInfo {
        address tokenAddress;
        string name;
        string symbol;
        address creator;
        uint256 createdAt;
        uint256 fundraisingTarget;
        bool isActive;
    }
    
    mapping(address => TokenInfo) public tokens;
    address[] public deployedTokens;
    mapping(address => address[]) public creatorTokens;
    
    uint256 public deploymentFee = 0.001 ether; // Fee for token deployment
    address public feeRecipient;
    
    event TokenDeployed(
        address indexed tokenAddress,
        address indexed creator,
        string name,
        string symbol,
        uint256 maxSupply,
        uint256 fundraisingTarget
    );
    
    event DeploymentFeeUpdated(uint256 newFee);
    
    constructor(address _feeRecipient) {
        feeRecipient = _feeRecipient;
    }
    
    /**
     * @dev Deploy a new based meme token
     */
    function deployToken(
        string memory name,
        string memory symbol,
        uint256 maxSupply,
        uint256 fundraisingTargetETH,
        uint256 creatorAllocation
    ) external payable nonReentrant returns (address) {
        require(msg.value >= deploymentFee, "Insufficient deployment fee");
        require(bytes(name).length > 0, "Name cannot be empty");
        require(bytes(symbol).length > 0, "Symbol cannot be empty");
        require(maxSupply > 0, "Max supply must be greater than 0");
        require(fundraisingTargetETH > 0, "Fundraising target must be greater than 0");
        require(creatorAllocation <= 20, "Creator allocation cannot exceed 20%");
        
        // Deploy new token contract
        BasedMemeToken newToken = new BasedMemeToken(
            name,
            symbol,
            maxSupply,
            fundraisingTargetETH,
            creatorAllocation,
            msg.sender
        );
        
        address tokenAddress = address(newToken);
        
        // Store token information
        tokens[tokenAddress] = TokenInfo({
            tokenAddress: tokenAddress,
            name: name,
            symbol: symbol,
            creator: msg.sender,
            createdAt: block.timestamp,
            fundraisingTarget: fundraisingTargetETH,
            isActive: true
        });
        
        deployedTokens.push(tokenAddress);
        creatorTokens[msg.sender].push(tokenAddress);
        
        // Transfer deployment fee
        if (msg.value > 0) {
            payable(feeRecipient).transfer(msg.value);
        }
        
        emit TokenDeployed(
            tokenAddress,
            msg.sender,
            name,
            symbol,
            maxSupply,
            fundraisingTargetETH
        );
        
        return tokenAddress;
    }
    
    /**
     * @dev Get all deployed tokens
     */
    function getAllTokens() external view returns (address[] memory) {
        return deployedTokens;
    }
    
    /**
     * @dev Get tokens created by a specific address
     */
    function getTokensByCreator(address creator) external view returns (address[] memory) {
        return creatorTokens[creator];
    }
    
    /**
     * @dev Get token information
     */
    function getTokenInfo(address tokenAddress) external view returns (TokenInfo memory) {
        return tokens[tokenAddress];
    }
    
    /**
     * @dev Get deployment statistics
     */
    function getDeploymentStats() external view returns (
        uint256 totalTokens,
        uint256 activeTokens
    ) {
        totalTokens = deployedTokens.length;
        activeTokens = 0;
        
        for (uint256 i = 0; i < deployedTokens.length; i++) {
            if (tokens[deployedTokens[i]].isActive) {
                activeTokens++;
            }
        }
    }
    
    /**
     * @dev Update deployment fee (only owner)
     */
    function updateDeploymentFee(uint256 newFee) external {
        require(msg.sender == feeRecipient, "Only fee recipient can update fee");
        deploymentFee = newFee;
        emit DeploymentFeeUpdated(newFee);
    }
    
    /**
     * @dev Update fee recipient (only current fee recipient)
     */
    function updateFeeRecipient(address newRecipient) external {
        require(msg.sender == feeRecipient, "Only current fee recipient can update");
        require(newRecipient != address(0), "Invalid recipient address");
        feeRecipient = newRecipient;
    }
}