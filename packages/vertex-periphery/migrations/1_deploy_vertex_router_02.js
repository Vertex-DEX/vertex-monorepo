var VertexRouter02 = artifacts.require('VertexRouter02')

module.exports = function(deployer, network, accounts) {
  var factory = '0x0000000000000000000000000000000000000000'
  var weth = '0x0000000000000000000000000000000000000000'

  console.log(`Network: ${network}:`)
  console.log(`Deployer: ${accounts[0]}`)

  return deployer.deploy(VertexRouter02, factory, weth, { from: accounts[0] })
}
