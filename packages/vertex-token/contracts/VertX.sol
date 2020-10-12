// SPDX-License-Identifier: MIT

pragma solidity ^0.6.0;

import "./ERC20.sol";
import "./ERC20Burnable.sol";

contract VertX is ERC20, ERC20Burnable {
    using SafeMath for uint256;

    mapping(address => uint256) private _balances;
    mapping(address => mapping(address => uint256)) private _allowed;

    uint256 public constant INITIAL_SUPPLY = 400000000 * 10**18;

    constructor() public payable ERC20("VertX", "VERTX") {
        _mint(msg.sender, INITIAL_SUPPLY);
    }

    function calculateFee(uint256 amount)
        internal
        pure
        returns (uint256 feeAmount)
    {
        uint256 roundValue = amount.ceil(100);
        feeAmount = roundValue.div(100);
    }

    function transfer(address recipient, uint256 amount)
        public
        virtual
        override
        returns (bool)
    {
        uint256 tokensToBurn = calculateFee(amount);
        uint256 tokensToTransfer = amount.sub(tokensToBurn);
        _burn(msg.sender, tokensToBurn);
        _transfer(msg.sender, recipient, tokensToTransfer);
        return true;
    }

    function transferFrom(
        address sender,
        address recipient,
        uint256 amount
    ) public virtual override returns (bool) {
        uint256 tokensToBurn = calculateFee(amount);
        uint256 tokensToTransfer = amount.sub(tokensToBurn);
        _burn(sender, tokensToBurn);
        _transfer(sender, recipient, tokensToTransfer);
        uint256 decreasedAllowance = allowance(sender, msg.sender).sub(
            amount,
            "ERC20: transfer amount exceeds allowance"
        );
        _approve(sender, msg.sender, decreasedAllowance);
        return true;
    }
}
