import React, { Component } from 'react'
import styled from 'react-emotion'

// Components
import Background from './Background'

import Typography from '../../components/Typography'

const BarLeft = styled('div')`
  position: relative;
  align-self: center;
  flex-grow: 1;
  flex-basis: 0;
`

const BarCenter = styled('div')`
  position: relative;
  align-self: center;
  justify-self: center;
  flex-grow: 1;
  flex-basis: 0;
  text-align: center;
  margin-left: -64px;
`

const BarRight = styled('div')`
  position: relative;
  align-self: center;
  justify-self: center;
  vertical-align: middle;
  flex-grow: 1;
  flex-basis: 0;
`

export default class AppBar extends Component {
    state = {

    }

    render () {
        return (
            <Background>
                <BarLeft>
                    <Typography type='caption' tt='uppercase' size='small' > Book of Shades v. 30.03-beta </Typography>
                </BarLeft>
                <BarCenter>
                    <Typography type='caption' size='small' color='primary' weight='medium'> About this book </Typography>
                </BarCenter>
                <BarRight>

                </BarRight>
            </Background>
        )
    }
}