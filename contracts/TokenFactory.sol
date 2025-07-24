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

// PodCreator Interface
interface IPodCreator {
    function createPod(
        address baseToken,
        string calldata name,
        string calldata symbol
    ) external returns (address pod);
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
    uint256 public constant HARDCAP = 0.001 ether; // Fixed hardcap for testing
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
    
    // PodCreator contract
    IPodCreator public podCreator;
    
    uint24 public constant POOL_FEE = 3000; // 0.3%
    int24 public constant TICK_SPACING = 60;
    
    mapping(address => uint256) public contributions;
    address[] public contributors;
    
    
    event FundraisingContribution(address indexed contributor, uint256 amount);
    event LiquidityAdded(address indexed pool, uint256 tokenId, uint256 tokenAmount, uint256 ethAmount);
    event PodCreated(address indexed token, address indexed pod);
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
        address _creator,
        address _podCreator
    ) ERC20(name, symbol) {
        maxSupply = _maxSupply * 10**decimals();
        fundraisingTarget = HARDCAP; // Fixed target for all tokens
        creatorAllocation = _creatorAllocation;
        creator = _creator;
        podCreator = IPodCreator(_podCreator);
        
        // Mint creator allocation
        uint256 creatorTokens = (maxSupply * creatorAllocation) / 100;
        _mint(creator, creatorTokens);
    }

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

    function _finalizeFundraisingAndAddLiquidity() internal {
        emit HardcapReached(fundraisedAmount);
        
        // Token distribution logic
        uint256 remainingSupply = maxSupply - balanceOf(creator);
        uint256 contributorTokens = (remainingSupply * 90) / 100;
        
        for (uint256 i = 0; i < contributors.length; i++) {
            address contributor = contributors[i];
            uint256 contribution = contributions[contributor];
            uint256 tokenAmount = (contributorTokens * contribution) / fundraisedAmount;
            _mint(contributor, tokenAmount);
        }
        
        // Liquidity provision
        uint256 ethForLiquidity = (fundraisedAmount * 90) / 100;
        uint256 tokensForLiquidity = (remainingSupply * 10) / 100;
        
        _mint(address(this), tokensForLiquidity);
        _addLiquidityToUniswapV3(ethForLiquidity, tokensForLiquidity);
        
        uint256 creatorETH = fundraisedAmount - ethForLiquidity;
        if (creatorETH > 0) {
            payable(creator).transfer(creatorETH);
        }
        
        liquidityAdded = true;
        tradingEnabled = true;
        emit TradingEnabled();
        
        _createPeapodsPod();
    }

    function _addLiquidityToUniswapV3(uint256 ethAmount, uint256 tokenAmount) internal {
        // Approve WETH and token for transfer
        WETH.approve(address(POSITION_MANAGER), ethAmount);
        approve(address(POSITION_MANAGER), tokenAmount);

        // Get or create the pool
        address pool = UNISWAP_V3_FACTORY.getPool(address(WETH), address(this), POOL_FEE);
        if (pool == address(0)) {
            pool = POSITION_MANAGER.createAndInitializePoolIfNecessary{value: 0.001 ether}(
                address(WETH),
                address(this),
                POOL_FEE,
                887272206655779155743433531351700
            );
        }
        liquidityPool = pool;

        // Calculate tick boundaries
        int24 tickLower = (block.number / TICK_SPACING) * TICK_SPACING;
        int24 tickUpper = ((block.number / TICK_SPACING) + 1) * TICK_SPACING;

        // Mint the liquidity position
        (liquidityTokenId, , , ) = POSITION_MANAGER.mint{value: ethAmount}(
            INonfungiblePositionManager.MintParams({
                token0: address(WETH),
                token1: address(this),
                fee: POOL_FEE,
                tickLower: tickLower,
                tickUpper: tickUpper,
                amount0Desired: ethAmount,
                amount1Desired: tokenAmount,
                amount0Min: 0,
                amount1Min: 0,
                recipient: address(this),
                deadline: block.timestamp + 3600
            })
        );

        emit LiquidityAdded(pool, liquidityTokenId, tokenAmount, ethAmount);
    }

    function _createPeapodsPod() internal {
        if (address(podCreator) != address(0) && liquidityPool != address(0)) {
            try podCreator.createPod(address(this), string(abi.encodePacked("Peapod ", name())), string(abi.encodePacked("p", symbol()))) returns (address pod) {
                emit PodCreated(address(this), pod);
            } catch {
                // Pod creation failed, but don't revert
            }
        }
    }

    function _transfer(address from, address to, uint256 amount) internal virtual override {
        if (from != creator && to != creator && from != address(0) && from != address(this)) {
            require(tradingEnabled, "Trading not enabled");
        }
        super._transfer(from, to, amount);
    }

    // View functions
    function getContributionDetails() external view returns (uint256 target, uint256 raised, uint256 hardcap, uint256 contributorCount, bool completed) {
        return (fundraisingTarget, fundraisedAmount, HARDCAP, contributors.length, liquidityAdded);
    }

    function getLiquidityDetails() external view returns (address pool, uint256 tokenId, bool added) {
        return (liquidityPool, liquidityTokenId, liquidityAdded);
    }
}

/**
 * @title BasedTokenFactory
 * @dev Factory contract for deploying based meme tokens
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
    
    uint256 public deploymentFee = 0 ether;
    address public feeRecipient;
    address public podCreator;
    
    event TokenDeployed(address indexed tokenAddress, address indexed creator, string name, string symbol, uint256 maxSupply, uint256 fundraisingTarget);
    event DeploymentFeeUpdated(uint256 newFee);
    event PodCreatorUpdated(address indexed podCreator);
    
    constructor(address _feeRecipient, address _podCreator) {
        feeRecipient = _feeRecipient;
        podCreator = _podCreator;
    }
    
    function deployToken(
        string memory name,
        string memory symbol,
        uint256 maxSupply,
        uint256 creatorAllocation
    ) external payable returns (address) {
        require(msg.value >= deploymentFee, "Insufficient deployment fee");
        require(bytes(name).length > 0, "Name cannot be empty");
        require(bytes(symbol).length > 0, "Symbol cannot be empty");
        require(maxSupply > 0, "Max supply must be greater than 0");
        require(creatorAllocation <= 20, "Creator allocation cannot exceed 20%");
        
        BasedMemeToken newToken = new BasedMemeToken(
            name,
            symbol,
            maxSupply,
            0.001 ether, // Fixed fundraising target
            creatorAllocation,
            msg.sender,
            podCreator
        );
        
        address tokenAddress = address(newToken);
        
        tokens[tokenAddress] = TokenInfo({
            tokenAddress: tokenAddress,
            name: name,
            symbol: symbol,
            creator: msg.sender,
            createdAt: block.timestamp,
            fundraisingTarget: 0.001 ether,
            isActive: true,
            liquidityPool: address(0)
        });
        
        deployedTokens.push(tokenAddress);
        creatorTokens[msg.sender].push(tokenAddress);
        
        if (msg.value > 0) {
            payable(feeRecipient).transfer(msg.value);
        }
        
        emit TokenDeployed(tokenAddress, msg.sender, name, symbol, maxSupply, 0.001 ether);
        
        return tokenAddress;
    }

    // View functions
    function getAllTokens() external view returns (address[] memory) {
        return deployedTokens;
    }

    function getTokensByCreator(address creator) external view returns (address[] memory) {
        return creatorTokens[creator];
    }

    function getTokenInfo(address tokenAddress) external view returns (TokenInfo memory) {
        return tokens[tokenAddress];
    }

    function getDeploymentStats() external view returns (uint256 totalTokens, uint256 activeTokens) {
        totalTokens = deployedTokens.length;
        activeTokens = 0;
        
        for (uint256 i = 0; i < deployedTokens.length; i++) {
            if (tokens[deployedTokens[i]].isActive) {
                activeTokens++;
            }
        }
    }

    function updateDeploymentFee(uint256 newFee) external {
        require(msg.sender == feeRecipient, "Only fee recipient can update fee");
        deploymentFee = newFee;
        emit DeploymentFeeUpdated(newFee);
    }

    function updatePodCreator(address _podCreator) external {
        require(msg.sender == feeRecipient, "Only fee recipient can update");
        podCreator = _podCreator;
        emit PodCreatorUpdated(_podCreator);
    }
}
