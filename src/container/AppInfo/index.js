import React, { Component } from 'react'
import styled from 'react-emotion'

import Typography from '../../components/Typography'
import AppInfoWrapper from './AppInfoWrapper'


const Wrapper = styled('div')`
  margin-left: calc(64px + 32px); 
  margin-top: calc(64px + 28px);
  max-width: 300px;
`

const AppInfoContent = ({ info }) => {
    return (
        <div>
            { info.map(( info, index ) =>
                <AppInfoWrapper info={ info } key={ info + index }/>
            )}
        </div>
    )
}



export default class AppInfo extends Component {
    state = {
        info: [
            [{
                label: 'User',
                description: 'D - 29348209348'
            }, {
                label: 'Location',
                description: 'Germany'
            }, {
                label: 'Login',
                description: new Date().toLocaleTimeString()
            }, {
                label: 'Duration',
                description: '00:00:00:00'
            }],
            [{
                label: 'Processor',
                description: 'Intel'
            },{
                label: 'System',
                description: 'Mac OS X 10.13.1'
            }, {
                label: '64-BIT MODE',
                description: 'enabled'
            }]
        ]
    }

    componentDidMount () {
        const upgradeTime = 0
        let seconds = upgradeTime

        setInterval(() => {
            const days        = Math.floor(seconds/24/60/60)
            const hoursLeft   = Math.floor((seconds) - (days*86400))
            const hours       = Math.floor(hoursLeft/3600)
            const minutesLeft = Math.floor((hoursLeft) - (hours*3600))
            const minutes     = Math.floor(minutesLeft/60)
            let remainingSeconds = seconds % 60

            if (remainingSeconds < 10) {
                remainingSeconds = "0" + remainingSeconds
            }

            // console.log(('0' + days).slice(-2) + ":" + ('0' + hours).slice(-2) + ":" + ('0' + minutes).slice(-2) + ":" + remainingSeconds)

            seconds ++

            this.setState((prevState, props) => { return {
                ...prevState,
                info: prevState.info.map(info => info.map( item => {
                    return item.label === 'Duration'
                        ? { ...item, description: ('0' + days).slice(-2) + ":" + ('0' + hours).slice(-2) + ":" + ('0' + minutes).slice(-2) + ":" + remainingSeconds }
                        : item
                }))
            }})

        }, 1000)



    }

    render () {
        const { info } = this.state
        return (
            <Wrapper>
                <AppInfoContent info={ info }/>
            </Wrapper>
        )
    }
}
