import React, { Component } from 'react'

import ArticleText from './ArticleText'
import { Wrapper } from './components'



export default class Article extends Component {
    state = {

    }

    render () {
        return (
            <Wrapper>
                <ArticleText />
            </Wrapper>
        )
    }
}