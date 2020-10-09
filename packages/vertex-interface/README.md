# Vertex Interface

An open source interface for Vertex.

- Website: [vert.exchange](https://vert.exchange/)
- Interface: [app.vert.exchange](https://app.vert.exchange)
- Twitter: []()
- Email: [info@vert.exchange](mailto:contact@vert.exchange)
- Whitepaper: [Link]()

## Accessing the Vertex Interface

To access the Vertex Interface visit [app.vert.exchange](https://app.vert.exchange).

### Configuring the environment (optional)

To have the interface default to a different network when a wallet is not connected:

1. Make a copy of `.env` named `.env.local`
2. Change `REACT_APP_NETWORK_ID` to `"{YOUR_NETWORK_ID}"`
3. Change `REACT_APP_NETWORK_URL` to e.g. `"https://{YOUR_NETWORK_ID}.infura.io/v3/{YOUR_INFURA_KEY}"`

Note that the interface only works on testnets where both Vertex and
[multicall](https://github.com/makerdao/multicall) are deployed.
The interface will not work on other networks.
