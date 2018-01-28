import React, { Component } from 'react'
import { string } from 'prop-types'
import styled from 'react-emotion'

import Typography from '../../components/Typography'


const AppInfoLineWrapper = styled('div')`
  width: 200px;
  margin-bottom: 2px;
  & > span {
    display: inline-block;
    width: 100px;
  }
`

class AppInfoLine extends Component {
    constructor (props) {
        super (props)
    }

    shouldComponentUpdate (nextProps, nextState, nextContext) {
        if (nextProps.description === this.props.description) return false
    }

    render () {
        const { label, description } = this.props
        return (
            <AppInfoLineWrapper>
                <Typography type='caption' size='tiny' color='disabled' tt='uppercase'> { label } </Typography>
                <Typography type='caption' size='tiny' color='disabled' weight='medium'> { description } </Typography>
            </AppInfoLineWrapper>
        )
    }
}

AppInfoLine.propTypes = {
    label: string,
    description: string
}

export default AppInfoLine

