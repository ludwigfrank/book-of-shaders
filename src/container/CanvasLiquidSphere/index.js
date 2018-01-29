import React, { Component } from 'react'


import LiquidSphere from './three'


export default class CanvasLiquidSphere extends Component {
    state = {

    }

    getChallenges = ( challenge ) => {
        const chellanges = {
            'size-big' : 1,
            'color-blue': 3,
            'color-red': 3,
            'form-calm': 3,
            'form-excite': 4,
        }
    }

    render () {
        return (
            <div>
                <LiquidSphere />
            </div>
        )
    }
}