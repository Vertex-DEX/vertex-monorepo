pragma solidity 0.5.12;

import "./interfaces/IUniswapV2Factory.sol";

import "./UniswapV2.sol";

contract UniswapV2Factory is IUniswapV2Factory {
    event ExchangeCreated(address indexed token0, address indexed token1, address exchange, uint256 exchangeCount);

    struct Pair {
        address token0;
        address token1;
    }

    bytes public exchangeBytecode;
    uint256 public chainId;
    uint256 public exchangeCount;

    mapping (address => Pair) private exchangeToPair;
    mapping (address => mapping(address => address)) private token0ToToken1ToExchange;

    constructor(bytes memory _exchangeBytecode, uint256 _chainId) public {
        require(_exchangeBytecode.length >= 0x20, "UniswapV2Factory: SHORT_BYTECODE");
        exchangeBytecode = _exchangeBytecode;
        chainId = _chainId;
    }

    function getPair(address tokenA, address tokenB) private pure returns (Pair memory) {
        return tokenA < tokenB ? Pair({ token0: tokenA, token1: tokenB }) : Pair({ token0: tokenB, token1: tokenA });
    }

    function createExchange(address tokenA, address tokenB) external returns (address exchange) {
        require(tokenA != tokenB, "UniswapV2Factory: SAME_ADDRESS");
        require(tokenA != address(0) && tokenB != address(0), "UniswapV2Factory: ZERO_ADDRESS");

        Pair memory pair = getPair(tokenA, tokenB);

        require(token0ToToken1ToExchange[pair.token0][pair.token1] == address(0), "UniswapV2Factory: EXCHANGE_EXISTS");

        bytes memory exchangeBytecodeMemory = exchangeBytecode;
        uint256 exchangeBytecodeLength = exchangeBytecode.length;
        bytes32 salt = keccak256(abi.encodePacked(pair.token0, pair.token1, chainId));
        assembly {
            exchange := create2(
                0,
                add(exchangeBytecodeMemory, 0x20),
                exchangeBytecodeLength,
                salt
            )
        }
        UniswapV2(exchange).initialize(pair.token0, pair.token1, chainId);
        exchangeToPair[exchange] = pair;
        token0ToToken1ToExchange[pair.token0][pair.token1] = exchange;

        emit ExchangeCreated(pair.token0, pair.token1, exchange, exchangeCount++);
    }

    function getTokens(address exchange) external view returns (address, address) {
        Pair storage pair = exchangeToPair[exchange];
        return (pair.token0, pair.token1);
    }

    function getExchange(address tokenA, address tokenB) external view returns (address) {
        Pair memory pair = getPair(tokenA, tokenB);
        return token0ToToken1ToExchange[pair.token0][pair.token1];
    }
}
