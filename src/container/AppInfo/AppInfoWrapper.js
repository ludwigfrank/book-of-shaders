import React from 'react'
import { object, array } from 'prop-types'
import styled from 'react-emotion'

import AppInfoLine from './AppInfoLine'

const Wrapper = styled('div')`

`

const AppInfoLinesWrapper = styled('div')`
`


const AppInfoLines = ({ info }) => {
    return (
        <AppInfoLinesWrapper>
            { info.map( ( item, index) => {
                return <AppInfoLine
                    label={ item.label }
                    description={ item.description }
                    key={ item.label + item.description }
                />
            }) }
        </AppInfoLinesWrapper>
    )
}

const AppInfoWrapper = ({
         info
    }) => {

    return (
        <AppInfoLines info={ info }/>
    )
}

AppInfoWrapper.propTypes = {
    info: array.isRequired,
}

export default AppInfoWrapper