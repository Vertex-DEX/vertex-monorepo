var VertexFactory = artifacts.require('VertexFactory')

module.exports = function(deployer, network, accounts) {
  var _feeToSetter = '0x0000000000000000000000000000000000000000'

  console.log(`Network: ${network}`)
  console.log(`Deployer: ${accounts[0]}`)

  return deployer.deploy(VertexFactory, _feeToSetter, { from: accounts[0] })
}
