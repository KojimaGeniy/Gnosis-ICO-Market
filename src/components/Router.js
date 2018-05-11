import React from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'

import MarketList from './MarketList'
import Admin from './Admin'
import NotFound from './Admin'

const Router = () => (
            <BrowserRouter>
                <Switch>
                    <Route exact path="/" component={MarketList} />
                    <Route exact path="/Admin" component={Admin} />
                    <Route exact component={NotFound} />
                </Switch>
            </BrowserRouter>
        )

export default Router