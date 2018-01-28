import React, { Component } from 'react-emotion'
import styled from 'react-emotion'

const Wrapper = styled('div')`
  width: 600px;
  height: 400px;
  position: absolute;
  background-color: black;
  border-radius: 8px;
  box-shadow: ${props => props.theme.shadows[10]};
  z-index: ${props => props.theme.elevation.xxl};
`


export default class Terminal extends Component {
    state = {

    }


    render () {
        return (
            <Wrapper>
                Hole
            </Wrapper>
        )
    }

}