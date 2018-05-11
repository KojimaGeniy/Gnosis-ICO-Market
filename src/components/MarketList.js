import React, { Component } from 'react';
import getWeb3 from './../getWeb3'
//import { default as contract } from 'truffle-contract'
import './../App.css';

import Market from './Market';

const Gnosis = require('@gnosis.pm/gnosisjs')
let web3;

let cont = [    
  {
    id: 1,
    name: 'Darth',
    phone: '375'
  },
  {
    id: 2,
    name: 'Vader',
    phone: '375'
  }];

//let gnosisInstance

class Admin extends Component {
  constructor(props) {
    super(props)

    this.state = {
      disabled: true,
      market: []
    }
  }
  
  componentWillMount() {
    //Get network provider

    getWeb3
    .then(results => {
        web3 = results.web3;
        //Loto.setProvider(web3.currentProvider);
    })
    this.requestMarkets();
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



  async buyToken() {
    let gnosis
      gnosis = await Gnosis.create()
      await gnosis.etherToken.deposit({from: "0x9de88e0a9Fa6d30dF271eec31C55eE0358E8f7f9",value: 500000000000000000})
      await gnosis.etherToken.approve("0x9de88e0a9Fa6d30dF271eec31C55eE0358E8f7f9", 500000000000000000)
  }

  async requestMarkets() {
    const address = 'creator=9de88e0a9fa6d30df271eec31c55ee0358e8f7f9'

    const url = `https://gnosisdb.rinkeby.gnosis.pm/api/markets/?${address}`

    const restFetch = url =>
    fetch(url)
    .then(res => new Promise((resolve, reject) => (res.status >= 400 ? reject(res.statusText) : resolve(res))))
    .then(res => res.json())
    .catch(err =>
      new Promise((resolve, reject) => {
        console.warn(`Gnosis DB: ${err}`)
        reject(err)
      }))

      let title 
      await restFetch(url).then(response => title = response)
      this.setState({ market: title.results})
      console.log(this.state.market[0].tradingVolume)

      //how the fuck

      //ok it works

      //Ok speaking about components:
      //Header - All the Rocket menus + balance and some info
      //AdminForm - simple form for publishing, it's prefered to use 
      //  single account (at most two)
      //MarketList - ul/li list of separated markets
      //Market - small definition of market (preview)
      //MarketDescription - Full definition of market, with charts and 
      //  user funding of it
      //  all the shit will go here
      //(optional)Side menu - idea of side scroll status-menu
      
  }

  render() {
    return (
      <div className="App">
        <pre><label>Market List goes here:</label></pre>
        <div className="markets">
          <ul className="market-list">
            {
              this.state.market.map(el => {
                return (
                  <Market details={el}/>
                )
              })
              }
          </ul>
        </div>
        <pre><button onClick={this.buyToken}>Deposit!</button></pre>
      </div>
    );
  }
}

export default Admin;