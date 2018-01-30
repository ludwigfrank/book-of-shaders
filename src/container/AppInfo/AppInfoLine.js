import React, { Component } from 'react'
import { string } from 'prop-types'
import styled from 'react-emotion'

import Typography from '../../components/Typography'


const AppInfoLineWrapper = styled('div')`
  margin-bottom: 2px;
  & > span {
    display: inline-block;
    width: 96px;
  }
`

class AppInfoLine extends Component {

    shouldComponentUpdate (nextProps, nextState, nextContext) {
        if (nextProps.description === this.props.description) return false
    }

    render () {
        const { label, description } = this.props
        return (
            <AppInfoLineWrapper>
                <Typography type='caption' size='tiny' color='disabled' tt='uppercase'> { label } </Typography>
                <Typography type='caption' size='tiny' color='secondary' weight='bold'> { description } </Typography>
            </AppInfoLineWrapper>
        )
    }
}

AppInfoLine.propTypes = {
    label: string,
    description: string
}

export default AppInfoLine

