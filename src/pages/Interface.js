import React, { Component } from 'react'
import styled from 'react-emotion'

import GridGuidesPng from '../img/8pxGuides.png'
import AppBar from '../container/AppBar'
import NavigationBar from '../container/NavigationBar'
import AppInfo from '../container/AppInfo'
import AppInfoRight from '../container/AppInfoRight'
import ScreenEffect from '../container/ScreenEffect'
import LiquidSphere from '../container/CanvasLiquidSphere'
import Terminal from '../container/Terminal'
import Article from '../container/Article'
import CodeEditor from '../container/CodeEditor'
import CodeCanvas from '../container/CodeEditor/CodeCanvas'

const GridGuides = styled('div')`
  position: fixed;
  top: 0;
  background: url(${ GridGuidesPng }) repeat;
  // opacity: 0.1;
  width: 100%;
  height: 100%;
  z-index: 10000;
`

export default class Interface extends Component {
    state = {
        showTerminal: false,
        challenges: [
            'challenge-color',
            'challenge-noise'
        ],
        activeChallenge: null,
        activeChallengeResolved: true
    }

    componentDidMount () {
        window.addEventListener('keydown', (value) => {
            const { key, ctrlKey } = value

            // Toggle Terminal
            if (key === 'j' && ctrlKey) {
                this.setState({
                    showTerminal: !this.state.showTerminal,
                })
            }

            // Start new Challenge
            // Todo: make it activate automatically after the corresponding article is finished reading
            if (key === 'c' && ctrlKey) {
                this.startNewChallenge()
            }

            // Confirm the Terminal Input
            // Todo: create a notification in the terminal that shows the user it is possible
            if (key === 'Enter' && ctrlKey) {
                this.terminalConfirmInput()
            }
        })

    }

    startNewChallenge = () => {
        const { challenges, activeChallenge, activeChallengeResolved } = this.state

        // If the current challenge is not resolved, return
        if ( activeChallengeResolved === false ) return

        // Set the resolved to false
        this.setState({ activeChallengeResolved: false })

        // Initialize challenge variable
        let challenge

        // Init first Challenge
        if (activeChallenge === null) challenge = challenges[0]

        // Cycle through the array of challenges
        else {
            const index = challenges.findIndex((c) => c === activeChallenge)
            if ( index === challenges.length - 1) challenge = challenges[0]
            else challenge = challenges[index + 1]
        }

        this.setState({ activeChallenge: challenge })

        console.log('NEW CHALLENGE: ' + challenge)
    }

    terminalConfirmInput = () => {
        this.setState({
            activeChallengeResolved: true,
        })
    }

    /*
    *
    *      <LiquidSphere activeChallenge={ activeChallenge } activeChallengeResolved={ activeChallengeResolved }/>
           <ScreenEffect activeChallengeResolved={ activeChallengeResolved }/>
    * */


    render () {
        const { showTerminal, activeChallenge, activeChallengeResolved } = this.state
        return (
            <div>
                <NavigationBar />
                <AppBar />
                <AppInfo />
                <Article />
                <CodeEditor />
                <CodeCanvas />
                <LiquidSphere activeChallenge={ activeChallenge } activeChallengeResolved={ activeChallengeResolved }/>
                <ScreenEffect activeChallengeResolved={ activeChallengeResolved }/>
                <Terminal showTerminal={ showTerminal } activeChallenge={ activeChallenge } activeChallengeResolved={ activeChallengeResolved }/>
            </div>
        )
    }
}