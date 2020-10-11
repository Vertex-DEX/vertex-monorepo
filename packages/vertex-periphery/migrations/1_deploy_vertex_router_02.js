var VertexRouter02 = artifacts.require('VertexRouter02')

module.exports = function(deployer, network, accounts) {
  console.log(`Network: ${network}`)
  console.log(`Deployer: ${accounts[0]}`)

  var factory
  var weth

  if (network === 'kovan') {
    factory = '0xfd0e5F90AA36aA083352cC9B710f0C98b6A42624'
    weth = '0xd0a1e359811322d97991e03f863a0c30c2cf029c'
  }

  console.log(`Factory: ${factory}`)
  console.log(`WETH: ${weth}`)

  return deployer.deploy(VertexRouter02, factory, weth, { from: accounts[0] })
}
