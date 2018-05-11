import React, { Component } from 'react';
import getWeb3 from './../getWeb3'
//import { default as contract } from 'truffle-contract'
import './../App.css';

const Gnosis = require('@gnosis.pm/gnosisjs')
let web3;

let gnosisInstance

export default class Admin extends Component {
  constructor(props) {
    super(props) 
    
    this.state = {
      disabled: true,
    }
  }
  
  componentWillMount() {
    //Get network provider
    
    getWeb3
    .then(results => {
        web3 = results.web3;
    })
  }


  async createMarket() {
    
    //NICE FUNCTION VERY FLEXIBLE AND READABLE

    const title = document.getElementById('title').value
    const description = document.getElementById('description').value
    const resolutionDate = document.getElementById('resolution').value
    const outcomeType = document.getElementById('outcomeType').value
    const outcomes = document.getElementById('outcomes').value  //[]
    const curr = document.getElementById('currency').value
    const fee = document.getElementById('fee').value
    const funding = document.getElementById('funding').value

    let ipfsHash, oracle, event, market;
    gnosisInstance = await Gnosis.create()
   
    ipfsHash = await gnosisInstance.publishEventDescription({
      title,
      description,
      resolutionDate,
      outcomes,
    })
    console.assert(
      (await gnosisInstance.loadEventDescription(ipfsHash)).title ===
      title,
    )
    console.info(`Ipfs hash: https://ipfs.infura.io/api/v0/cat?stream-channels=true&arg=${ipfsHash}`) 
    //Oracle creation
    oracle = await gnosisInstance.createCentralizedOracle(ipfsHash)
    console.info(`Oracle created with address ${oracle.address}`)
    //Event creation
    event = await gnosisInstance.createCategoricalEvent({
        collateralToken: gnosisInstance.etherToken,
        oracle,
        outcomeCount: outcomes.length,
    })
    console.info(`Categorical event created with address ${event.address}`)
    //Market creation
    market = await gnosisInstance.createMarket({
        event,
        marketMaker: gnosisInstance.lmsrMarketMaker,
        fee: 50000 
        // signifies a 5% fee on transactions
    })
    console.info(`Market created with address ${market.address}`)

    // Fund the market with 4 ETH
    const txResults = await Promise.all([
          [gnosisInstance.etherToken.constructor, await gnosisInstance.etherToken.deposit.sendTransaction({ value: funding/*4e18*/ })],
          [gnosisInstance.etherToken.constructor, await gnosisInstance.etherToken.approve.sendTransaction(market.address, funding)],
          [market.constructor, await market.fund.sendTransaction(4e18)],
    ].map(([contract, txHash]) => contract.syncTransaction(txHash)))
  
    //Check expected outcomes
    txResults.forEach((txResult, i) => {
          Gnosis.requireEventFromTXResult(txResult, outcomes[i])
    })
  }

  async publishScalarDescriptionEvent() {
    const lowerBound = '80'
    const upperBound = '100'

    const ipfsHash = await gnosisInstance.publishEventDescription({
        title: 'What will be the annual global land and ocean temperature anomaly for 2017?',
        description: 'The anomaly is with respect to the average temperature for the 20th century and is as reported by the National Centers for Environmental Services...',
        resolutionDate: '2017-01-01T00:00:00+00:00',
        lowerBound,
        upperBound,
        decimals: 2,
        unit: '°C',
    })

    const oracle = await gnosisInstance.createCentralizedOracle(ipfsHash)

    const event = await gnosisInstance.createScalarEvent({
        collateralToken: gnosisInstance.etherToken,
        oracle,
        // Note that these bounds should match the values published on IPFS
        lowerBound,
        upperBound,
    })
    //This sets up an event with a lower bound of 0.80°C and an upper bound of 1.00°C.
  }

  // const initGnosisConnection = async (GNOSIS_OPTIONS) => {
  //   try {
  //     gnosisInstance = await Gnosis.create(GNOSIS_OPTIONS)
  //     console.info('Gnosis Integration: connection established') // eslint-disable-line no-console
  //   } catch (err) {
  //     console.error('Gnosis Integration: connection failed') // eslint-disable-line no-console
  //     console.error(err) // eslint-disable-line no-console
  //   }
  // }



  // fundEvent() {
  //   let gnosis
  //   let market
  //   async function createMarket() {
  //     gnosis = await Gnosis.create()
  //   market = await gnosis.createMarket({
  //   event,
  //   marketMaker: gnosis.lmsrMarketMaker,
  //   fee: 50000 // signifies a 5% fee on transactions
  //   // see docs at Gnosis.createMarket (api-reference.html#createMarket) for more info
  //   })
  //   console.info(`Market created with address ${market.address}`)
  //   }
  //   createMarket()

  //   async function fund() {
  //     // Fund the market with 4 ETH
  //     const txResults = await Promise.all([
  //     [gnosis.etherToken.constructor, await gnosis.etherToken.deposit.sendTransaction({ value: 4e18 })],
  //     [gnosis.etherToken.constructor, await gnosis.etherToken.approve.sendTransaction(market.address, 4e18)],
  //     [market.constructor, await market.fund.sendTransaction(4e18)],
  //     ].map(([contract, txHash]) => contract.syncTransaction(txHash)))
  //     const expectedEvents = [
  //     'Deposit',
  //     'Approval',
  //     'MarketFunding',
  //     ]
  //     txResults.forEach((txResult, i) => {
  //     Gnosis.requireEventFromTXResult(txResult, expectedEvents[i])
  //     })
  //     }
  //     fund()
  // }

  async buyToken() {
    let gnosis
      gnosis = await Gnosis.create()
      await gnosis.etherToken.deposit({from: "0x9de88e0a9Fa6d30dF271eec31C55eE0358E8f7f9",value: 500000000000000000})
      await gnosis.etherToken.approve("0x9de88e0a9Fa6d30dF271eec31C55eE0358E8f7f9", 500000000000000000)
  }

  check() {
    let raz = 1;
    raz === 1 ? console.log('Odin') : console.log('Ne odin')
  }

  render() {
    return (
      <div className="addMarket">
        <label>Admin page for creating market</label>
        <div><input type="text" id="title" placeholder="Title" /></div>
        <div><textarea type="text" id="description" placeholder="Description" /></div>
        <div><input type="text" id="resolution" placeholder="Resolution Date" /></div>
        <div>
          <select id="outcomeType" >
            <option value="categorical">Categorical</option>
            <option value="scalar">Scalar</option>
          </select>
        </div>
        <div><input type="text" id="outcomes" placeholder="Outomes array" /></div>
        <div><input type="text" id="currency" placeholder="Currency" /></div>
        <div><input type="text" id="fee" placeholder="Fee" /></div>
        <div><input type="text" id="funding" placeholder="Funding amount" /></div>
        <pre><button onClick={this.check}>Create market</button></pre>
      </div>
    );
  }
}
