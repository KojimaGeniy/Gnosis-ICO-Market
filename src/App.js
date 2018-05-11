import React, { Component} from 'react';
import getWeb3 from './getWeb3'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
//import { default as contract } from 'truffle-contract'
import './App.css';
import Admin from './components/Admin';
import MarketList from './components/MarketList';

const Gnosis = require('@gnosis.pm/gnosisjs')
var web3;

let gnosisInstance

class App extends Component {
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
        //Loto.setProvider(web3.currentProvider);
    })

    this.requestMarkets();
  }

  //WE WILL NOT BE SLAVES
  // checkRound() {
  //   let gnosis, ipfsHash
  //   async function createDescription () {
  //       gnosis = await Gnosis.create()
  //       ipfsHash = await gnosis.publishEventDescription({
  //           title: 'Who will win the U.S. presidential election of 2016?',
  //           description: 'Every four years, the citizens of the United States vote for their next president...',
  //           resolutionDate: '2016-11-08T23:00:00-05:00',
  //           outcomes: ['Clinton', 'Trump', 'Other'],
  //       })
  //       // now the event description has been uploaded to ipfsHash and can be used
  //       console.assert(
  //           (await gnosis.loadEventDescription(ipfsHash)).title ===
  //           'Who will win the U.S. presidential election of 2016?',
  //       )
  //       console.info(`Ipfs hash: https://ipfs.infura.io/api/v0/cat?stream-channels=true&arg=${ipfsHash}`)
  //   }
  //   createDescription()
  // }

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
      console.log(title.results[0].event.oracle.eventDescription.title)
      
  }

  render() {
    return (
      <div className="App">
        <Router>
          <div>
            <header className="App-header">
              <h1 className="App-title">Here will be potentially navigation menu</h1>
              <Link to="/admin">Admin</Link>
              <Link to="/">Market List</Link>
            </header>
            <p className="App-intro">
              <Route exact path="/" component={MarketList} />
              <Route exact path="/admin" component={Admin} />
            </p>
          </div>
        </Router>
      </div>
    );
  }
}

export default App;