import React, { Component } from 'react';

export default class Market extends React.Component {

    render() {
        const { eventDescription } = this.props.details.event.oracle
        return (
            <li>
                <li className="market"> 
                    <div className="market-name">{eventDescription.title}</div> 
                    <div className="market-number">{eventDescription.resolutionDate}</div>
                    <div className="market-volume">{this.props.details.tradingVolume} ETH Volume</div>
                </li>
            </li>
        )
    }

} 