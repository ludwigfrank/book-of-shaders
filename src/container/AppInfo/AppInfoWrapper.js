import React from 'react'
import { object, array } from 'prop-types'
import styled from 'react-emotion'

import AppInfoLine from './AppInfoLine'

const Wrapper = styled('div')`
  margin-top: 32px;
`


const AppInfoLines = ({ info }) => {
    return (
        <div>
            { info.map( ( item, index) => {
                return <AppInfoLine
                    label={ item.label }
                    description={ item.description }
                    key={ item.label + item.description }
                />
            }) }
        </div>
    )
}

const AppInfoWrapper = ({
         info
    }) => {

    return (
        <Wrapper>
            <AppInfoLines info={ info }/>
        </Wrapper>
    )
}

AppInfoWrapper.propTypes = {
    info: array.isRequired,
}

export default AppInfoWrapper