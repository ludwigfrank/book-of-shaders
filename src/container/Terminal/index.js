import React, { Component } from 'react'
import styled, { keyframes, css } from 'react-emotion'

import TerminalText from './TerminalText'

const Wrapper = styled('div')`
  width: ${props => props.isShown ? 600 : 550}px;
  height: ${props => props.isShown ? 440 : 350}px;
  opacity: ${props => props.isShown ? 1 : 0};
  position: absolute;
  background-color: black;
  border-radius: 8px;
  box-shadow: ${props => props.isShown ? props.theme.shadows[20] : props.theme.shadows[1]};
  z-index: ${props => props.theme.elevation.xxl};
  top: 48px;
  left: 48px;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  ${ props => !props.isShown && css`pointer-events: none`};
`

const Header = styled('div')`
  width: 100%;
  height: 32px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.15);
`

const HeaderText = styled('span')`
  font-family: ${ props => props.theme.type.family.primary };
  font-weight: 600;
  font-size: ${ props => props.theme.type.size.tiny }em;
  text-align: center;
  box-sizing: border-box;
  letter-spacing: 1px;
  display: block;
  line-height: 32px;
  color: white;
  opacity: 0.45;
`

const Gradient = styled('div')`
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(255,255,255,0.15) 0%,rgba(255,255,255,0) 100%); 
  position: absolute;
`

const BlinkAnimation = keyframes`
    from { background-color: #FF0; }
    50% { 
      background-color: #AA0; 
      box-shadow: rgba(0, 0, 0, 0.2) 0 0px 0px 0px }
    to { background-color: #FF0; }
`


const RedLed = styled('div')`
  left: 16px;
  top: 14px;
  position: absolute;
  border-radius: 50%;
  width: 6px;
  height: 6px;
  box-shadow: rgba(0, 0, 0, 0.2) 0 -1px 7px 1px, #0FF 0 0 5px, #FF0 0 0 8px;
  animation: ${ BlinkAnimation } 1s infinite;
`

const TerminalFile = ({ showTerminal, activeChallenge, activeChallengeResolved }) => {
    return <TerminalText
        isShown={ showTerminal }
        activeChallenge={ activeChallenge }
        activeChallengeResolved={ activeChallengeResolved }
    />
}

export default class Terminal extends Component {
    state = {
        fileName: 'experiment-v12.cpp',
        isShown: true
    }

    static defaultProps = {
        showTerminal: false,
        activeChallenge: 'challenge-color'
    }

    render () {
        const { fileName } = this.state
        const { showTerminal, activeChallenge, activeChallengeResolved } = this.props

        return (
            <Wrapper isShown={ showTerminal }>
                <Header>
                    <RedLed />
                    <HeaderText> { fileName } </HeaderText>
                    <TerminalFile
                        showTerminal={ showTerminal }
                        activeChallenge={ activeChallenge }
                        activeChallengeResolved={ activeChallengeResolved }
                    />
                </Header>
            </Wrapper>
        )
    }

}