import React, { Component } from 'react'
import { ThemeProvider } from 'emotion-theming'
import { BrowserRouter as Router, Route } from 'react-router-dom'

// Pages
import HomePage from './pages/Home'
import Interface from './pages/Interface'

// Others
import { THEME } from './theme'
import globalStyle from './theme/global'


class App extends Component {
    render() {
        return (
            <ThemeProvider theme={ THEME }>
                <Router>
                    <div>
                        <Route exact path='/' component={ Interface } />
                    </div>
                </Router>
            </ThemeProvider>
        )
    }
}

export default App
