import React, { Component } from 'react'
import styled from 'react-emotion'

import GridGuidesPng from '../img/8pxGuides.png'
import AppBar from '../container/AppBar'
import NavigationBar from '../container/NavigationBar'
import AppInfo from '../container/AppInfo'
import AppInfoRight from '../container/AppInfoRight'
import ScreenEffect from '../container/ScreenEffect'
import LiquidSphere from '../container/CanvasLiquidSphere'
import Article from '../container/Article'


const GridGuides = styled('div')`
  position: fixed;
  top: 0;
  background: url(${ GridGuidesPng }) repeat;
  // opacity: 0.1;
  width: 100%;
  height: 100%;
  z-index: 10000;
`

export default class Interface extends Component {
    state = {

    }

    render () {
        return (
            <div>
                <NavigationBar />
                <AppBar />
                <AppInfo />
                <Article />
            </div>
        )
    }
}