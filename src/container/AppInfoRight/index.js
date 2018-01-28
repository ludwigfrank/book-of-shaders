import React, { Component } from 'react'
import styled from 'react-emotion'

import Typography from '../../components/Typography'
import ReadingBehaviour from './ReadingBehaviour'


const Wrapper = styled('div')`
  right: 0;
  position: fixed;
  top: calc(64px + 28px);
  width: 228px;
  height: calc(100vh - 64px + 28px);
`


export default class AppInfo extends Component {


    render () {
        return (
            <Wrapper>
                <ReadingBehaviour />
            </Wrapper>
        )
    }
}
