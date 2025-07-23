// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/math/Math.sol";

// Uniswap V3 Interfaces
interface IUniswapV3Factory {
    function createPool(address tokenA, address tokenB, uint24 fee) external returns (address pool);
    function getPool(address tokenA, address tokenB, uint24 fee) external view returns (address pool);
}

interface INonfungiblePositionManager {
    struct MintParams {
        address token0;
        address token1;
        uint24 fee;
        int24 tickLower;
        int24 tickUpper;
        uint256 amount0Desired;
        uint256 amount1Desired;
        uint256 amount0Min;
        uint256 amount1Min;
        address recipient;
        uint256 deadline;
    }

    function mint(MintParams calldata params) external payable returns (
        uint256 tokenId,
        uint128 liquidity,
        uint256 amount0,
        uint256 amount1
    );

    function createAndInitializePoolIfNecessary(
        address token0,
        address token1,
        uint24 fee,
        uint160 sqrtPriceX96
    ) external payable returns (address pool);
}

interface IWETH9 {
    function deposit() external payable;
    function withdraw(uint256) external;
    function totalSupply() external view returns (uint256);
    function balanceOf(address) external view returns (uint256);
    function transfer(address, uint256) external returns (bool);
    function transferFrom(address, address, uint256) external returns (bool);
    function approve(address, uint256) external returns (bool);
}

/**
 * @title BasedMemeToken
 * @dev ERC20 token with automatic Uniswap V3 liquidity provision
 */
contract BasedMemeToken is ERC20, Ownable, ReentrancyGuard {
    uint256 public immutable maxSupply;
    uint256 public fundraisingTarget;
    uint256 public constant HARDCAP = 5 ether; // Fixed hardcap
    uint256 public fundraisedAmount;
    uint256 public creatorAllocation;
    address public creator;
    address public liquidityPool;
    uint256 public liquidityTokenId;
    bool public liquidityAdded;
    bool public tradingEnabled;
    
    // Uniswap V3 contracts on Base
    IUniswapV3Factory public constant UNISWAP_V3_FACTORY = IUniswapV3Factory(0x33128a8fC17869897dcE68Ed026d694621f6FDfD);
    INonfungiblePositionManager public constant POSITION_MANAGER = INonfungiblePositionManager(0x03a520b32C04BF3bEEf7BF4ddf9D2Ff57Dd65EB1);
    IWETH9 public constant WETH = IWETH9(0x4200000000000000000000000000000000000006);
    
    uint24 public constant POOL_FEE = 3000; // 0.3%
    int24 public constant TICK_SPACING = 60;
    
    mapping(address => uint256) public contributions;
    address[] public contributors;
    
    event FundraisingContribution(address indexed contributor, uint256 amount);
    event LiquidityAdded(address indexed pool, uint256 tokenId, uint256 tokenAmount, uint256 ethAmount);
    event TradingEnabled();
    event HardcapReached(uint256 totalRaised);
    
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
        fundraisingTarget = Math.min(_fundraisingTarget, HARDCAP); // Enforce hardcap
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
        require(fundraisedAmount + msg.value <= HARDCAP, "Would exceed hardcap");
        
        if (contributions[msg.sender] == 0) {
            contributors.push(msg.sender);
        }
        
        contributions[msg.sender] += msg.value;
        fundraisedAmount += msg.value;
        
        emit FundraisingContribution(msg.sender, msg.value);
        
        // Check if hardcap is reached
        if (fundraisedAmount >= HARDCAP || fundraisedAmount >= fundraisingTarget) {
            _finalizeFundraisingAndAddLiquidity();
        }
    }
    
    /**
     * @dev Finalize fundraising and automatically add liquidity to Uniswap V3
     */
    function _finalizeFundraisingAndAddLiquidity() internal {
        emit HardcapReached(fundraisedAmount);
        
        // Calculate tokens for contributors (90% of remaining supply)
        uint256 remainingSupply = maxSupply - balanceOf(creator);
        uint256 contributorTokens = (remainingSupply * 90) / 100;
        
        // Distribute tokens to contributors based on their contribution
        for (uint256 i = 0; i < contributors.length; i++) {
            address contributor = contributors[i];
            uint256 contribution = contributions[contributor];
            uint256 tokenAmount = (contributorTokens * contribution) / fundraisedAmount;
            _mint(contributor, tokenAmount);
        }
        
        // Calculate amounts for liquidity (90% of ETH, 10% of remaining tokens)
        uint256 ethForLiquidity = (fundraisedAmount * 90) / 100;
        uint256 tokensForLiquidity = (remainingSupply * 10) / 100;
        
        // Mint tokens for liquidity
        _mint(address(this), tokensForLiquidity);
        
        // Add liquidity to Uniswap V3
        _addLiquidityToUniswapV3(ethForLiquidity, tokensForLiquidity);
        
        // Send remaining ETH to creator (10%)
        uint256 creatorETH = fundraisedAmount - ethForLiquidity;
        if (creatorETH > 0) {
            payable(creator).transfer(creatorETH);
        }
        
        liquidityAdded = true;
        tradingEnabled = true;
        emit TradingEnabled();
    }
    
    /**
     * @dev Add liquidity to Uniswap V3 pool
     */
    function _addLiquidityToUniswapV3(uint256 ethAmount, uint256 tokenAmount) internal {
        // Wrap ETH to WETH
        WETH.deposit{value: ethAmount}();
        
        // Determine token order (token0 < token1)
        address token0 = address(this) < address(WETH) ? address(this) : address(WETH);
        address token1 = address(this) < address(WETH) ? address(WETH) : address(this);
        
        // Calculate sqrt price for initial price (1 token = 0.001 ETH)
        uint160 sqrtPriceX96 = token0 == address(this) ? 
            79228162514264337593543950336000 :  // 1 token = 0.001 ETH
            2505414483750479251539474979520;   // 1 ETH = 1000 tokens
        
        // Create pool if it doesn't exist
        address pool = UNISWAP_V3_FACTORY.getPool(token0, token1, POOL_FEE);
        if (pool == address(0)) {
            pool = POSITION_MANAGER.createAndInitializePoolIfNecessary(
                token0,
                token1,
                POOL_FEE,
                sqrtPriceX96
            );
        }
        
        liquidityPool = pool;
        
        // Calculate tick range (full range for simplicity)
        int24 tickLower = -887272; // Min tick for 0.3% fee tier
        int24 tickUpper = 887272;  // Max tick for 0.3% fee tier
        
        // Approve tokens
        _approve(address(this), address(POSITION_MANAGER), tokenAmount);
        WETH.approve(address(POSITION_MANAGER), ethAmount);
        
        // Prepare mint parameters
        INonfungiblePositionManager.MintParams memory params = INonfungiblePositionManager.MintParams({
            token0: token0,
            token1: token1,
            fee: POOL_FEE,
            tickLower: tickLower,
            tickUpper: tickUpper,
            amount0Desired: token0 == address(this) ? tokenAmount : ethAmount,
            amount1Desired: token0 == address(this) ? ethAmount : tokenAmount,
            amount0Min: 0, // Accept any amount of token0
            amount1Min: 0, // Accept any amount of token1
            recipient: address(this),
            deadline: block.timestamp + 300 // 5 minutes
        });
        
        // Mint liquidity position
        (uint256 tokenId, uint128 liquidity, uint256 amount0, uint256 amount1) = 
            POSITION_MANAGER.mint(params);
        
        liquidityTokenId = tokenId;
        
        emit LiquidityAdded(pool, tokenId, tokenAmount, ethAmount);
    }
    
    /**
     * @dev Override transfer to enforce trading restrictions
     */
    function _transfer(
        address from,
        address to,
        uint256 amount
    ) internal virtual override {
        if (from != creator && to != creator && from != address(0) && from != address(this)) {
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
        uint256 hardcap,
        uint256 contributorCount,
        bool completed
    ) {
        return (
            fundraisingTarget,
            fundraisedAmount,
            HARDCAP,
            contributors.length,
            liquidityAdded
        );
    }
    
    /**
     * @dev Get liquidity details
     */
    function getLiquidityDetails() external view returns (
        address pool,
        uint256 tokenId,
        bool added
    ) {
        return (
            liquidityPool,
            liquidityTokenId,
            liquidityAdded
        );
    }
    
    /**
     * @dev Emergency function to enable trading (only creator, only if something goes wrong)
     */
    function emergencyEnableTrading() external onlyCreator {
        require(liquidityAdded, "Liquidity must be added first");
        tradingEnabled = true;
        emit TradingEnabled();
    }
}

/**
 * @title BasedTokenFactory
 * @dev Factory contract for deploying based meme tokens with auto-liquidity
 */
contract BasedTokenFactory {
    struct TokenInfo {
        address tokenAddress;
        string name;
        string symbol;
        address creator;
        uint256 createdAt;
        uint256 fundraisingTarget;
        bool isActive;
        address liquidityPool;
    }
    
    mapping(address => TokenInfo) public tokens;
    address[] public deployedTokens;
    mapping(address => address[]) public creatorTokens;
    
    uint256 public deploymentFee = 0.001 ether;
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
     * @dev Deploy a new based meme token with auto-liquidity
     */
    function deployToken(
        string memory name,
        string memory symbol,
        uint256 maxSupply,
        uint256 fundraisingTargetETH,
        uint256 creatorAllocation
    ) external payable returns (address) {
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
            isActive: true,
            liquidityPool: address(0) // Will be set when liquidity is added
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
     * @dev Update token info with liquidity pool address
     */
    function updateTokenLiquidityPool(address tokenAddress, address poolAddress) external {
        require(tokens[tokenAddress].tokenAddress != address(0), "Token not found");
        BasedMemeToken token = BasedMemeToken(tokenAddress);
        require(msg.sender == address(token) || msg.sender == tokens[tokenAddress].creator, "Unauthorized");
        
        tokens[tokenAddress].liquidityPool = poolAddress;
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
     * @dev Update deployment fee (only fee recipient)
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