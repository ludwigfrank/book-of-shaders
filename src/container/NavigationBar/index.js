import React, { Component } from 'react'

// Components
import Background from './Background'
import ChapterCounter from './components/ChapterCounter'
import ChapterSpheres from './components/ChapterSpheres'

import Typography from '../../components/Typography'


export default class NavigationBar extends Component {
    state = {
        hover: false
    }

    render () {
        return (
            <Background>
                <ChapterCounter />
            </Background>
        )
    }
}