pragma solidity 0.5.12;

import "../interfaces/IERC20.sol";

import "../libraries/SafeMath256.sol";

contract ERC20 is IERC20 {
    using SafeMath256 for uint256;

    // ERC-20 data
    string public name;
    string public symbol;
    uint8 public decimals;
    uint256 public totalSupply;
    mapping (address => uint256) public balanceOf;
    mapping (address => mapping (address => uint256)) public allowance;

    // ERC-191 data
    uint256 public chainId;
    mapping (address => uint256) public nonceFor;

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);

    constructor(string memory _name, string memory _symbol, uint8 _decimals, uint256 _totalSupply) public {
        name = _name;
        symbol = _symbol;
        decimals = _decimals;
        mint(msg.sender, _totalSupply);
    }

    function initialize(uint256 _chainId) internal {
        require(chainId == 0, "ERC20: ALREADY_INITIALIZED");
        chainId = _chainId;
    }

    function mint(address to, uint256 value) internal {
        totalSupply = totalSupply.add(value);
        balanceOf[to] = balanceOf[to].add(value);
        emit Transfer(address(0), to, value);
    }

    function _burn(address from, uint256 value) internal {
        balanceOf[from] = balanceOf[from].sub(value);
        totalSupply = totalSupply.sub(value);
        emit Transfer(from, address(0), value);
    }

    function _transfer(address from, address to, uint256 value) private {
        balanceOf[from] = balanceOf[from].sub(value);
        balanceOf[to] = balanceOf[to].add(value);
        emit Transfer(from, to, value);
    }

    function _approve(address owner, address spender, uint256 value) private {
        allowance[owner][spender] = value;
        emit Approval(owner, spender, value);
    }

    function transfer(address to, uint256 value) external returns (bool) {
        _transfer(msg.sender, to, value);
        return true;
    }

    function burn(uint256 value) external {
        _burn(msg.sender, value);
    }

    function approve(address spender, uint256 value) external returns (bool) {
        _approve(msg.sender, spender, value);
        return true;
    }

    function approveMeta(
        address owner, address spender, uint256 value, uint256 nonce, uint256 expiration, uint8 v, bytes32 r, bytes32 s
    )
        external
    {
        require(chainId != 0, "ERC20: UNINITIALIZED");
        require(nonce == nonceFor[owner]++, "ERC20: INVALID_NONCE");
        require(expiration > block.timestamp, "ERC20: EXPIRED_SIGNATURE");

        require(v == 27 || v == 28, "ECDSA: INVALID_V");
        require(uint256(s) <= 0x7FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF5D576E7357A4501DDFE92F46681B20A0, "ECDSA: INVALID_S");

        bytes32 digest = keccak256(abi.encodePacked(
            hex'19',
            hex'00',
            address(this),
            keccak256(abi.encodePacked(
                owner, spender, value, nonce, expiration, chainId
            ))
        ));

        address recoveredAddress = ecrecover(digest, v, r, s);
        require(recoveredAddress != address(0), "ERC20: INVALID_RECOVERED_ADDRESS");
        require(owner == recoveredAddress, "ERC20: INVALID_SIGNATURE");

        _approve(owner, spender, value);
    }

    function transferFrom(address from, address to, uint256 value) external returns (bool) {
        if (allowance[from][msg.sender] != uint256(-1)) {
            allowance[from][msg.sender] = allowance[from][msg.sender].sub(value);
        }
        _transfer(from, to, value);
        return true;
    }

    function burnFrom(address from, uint256 value) external {
        if (allowance[from][msg.sender] != uint256(-1)) {
            allowance[from][msg.sender] = allowance[from][msg.sender].sub(value);
        }
        _burn(from, value);
    }
}
