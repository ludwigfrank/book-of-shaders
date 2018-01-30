import React, { Component } from 'react'
import styled, { keyframes } from 'react-emotion'

const CodeCanvasWrapper = styled('div')`
  position: absolute;
  width: 320px;
  height: 420px;
  left: 32%;
  top: 88px;
  border-radius: 8px;
  background-color: white;
  z-index: ${props => props.theme.elevation.l };
  box-shadow: ${props => props.theme.shadows[props.theme.elevation.l]};
`

const BackgroundShift = keyframes`
    0%{background-position:50% 0%}
    50%{background-position:50% 100%}
    100%{background-position:50% 0%}
`

const SketchBackground = styled('div')`
  width: 100%;
  height: 100%;
  border-radius: 8px;
  background: linear-gradient(347deg, #aea5b7, #3100eb);
  background-size: 400% 400%;
  animation: ${ BackgroundShift } 30s ease infinite;
`


const SketchTitle = styled('div')`
  font-family: ${props => props.theme.type.family.primary };
  color: white;
  font-size: ${props => props.theme.type.size.medium}em;
  font-weight: 300;
  text-transform: uppercase;
  letter-spacing: 2px;
  position: absolute;
  left: 24px;
  top: 24px;
`

export default class CodeCanvas extends Component {
    state = {

    }


    render() {
        return (
            <CodeCanvasWrapper>
                <SketchTitle>
                    Sketch 3201
                 </SketchTitle>
                <SketchTitle style={{opacity: '0.4', top: '48px'}}>
                    D - 29348209348
                </SketchTitle>
                <SketchBackground />
            </CodeCanvasWrapper>
        )
    }
}