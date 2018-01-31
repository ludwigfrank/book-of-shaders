import React, { Component } from 'react'
import styled from 'react-emotion'
import {
    PerspectiveCamera, Scene,
    WebGLRenderer,
} from 'three'

import Force2 from '../../lib/modules/Force2'
import Light from './Light'

import LiquidSphere from '../../lib/three/modules/LiquidSphere/index'
import AnimationGroup from '../../lib/three/modules/AnimationGroup/index'

const CenterContent = styled('div')`
  left: 0;
  position: absolute;
  top: 50%;
  pointer-events: none;
  transform: translateY(-50%);
  z-index: ${props => props.theme.elevation.xl};
`


export default class CanvasLiquidSphere extends Component {
    constructor ( props ) {
        super( props )

        // Scene
        this.scene = new Scene()

        // Camera
        this.camera = new PerspectiveCamera( 50, props.width / props.height , 0.01, 1000 )

        // Sphere
        this.sphere = new LiquidSphere
        this.group = new AnimationGroup

        this.renderer = new WebGLRenderer( {
            antialias: true,
            logarithmicDepthBuffer: true,
            alpha: true
        })

        this.force = new Force2
    }

    static defaultProps = {
        width: window.innerWidth,
        height: window.innerHeight,
        activeChallenge: null,
        activeChallengeResolved: true
    }

    componentDidMount () {
        this.init()
    }

    componentWillReceiveProps ({ activeChallenge, activeChallengeResolved }, nextContext) {
        console.log("HEAALLL")
        if ( activeChallenge !== this.props.activeChallenge ) this.startNewChallenge( activeChallenge )
        if ( activeChallengeResolved !== this.props.activeChallengeResolved
            && activeChallengeResolved === true ) {
            this.resolveChallenge()
        }
    }

    startNewChallenge = ( activeChallenge ) => {
        switch ( activeChallenge ) {
            case 'challenge-color':
                this.sphere.changeColor( [ 1.0, 0.2, 0.2, 1.0 ] )
                this.sphere.changeRadius( 4 )
                break;
            case 'challenge-noise':
                this.sphere.changeNoise( 2 )
                this.sphere.changeRadius( 3 )
                break;
        }
    }

    resolveChallenge = () => {
        this.sphere.changeRadius( 1 )
        this.sphere.changeColor( [0.0, 0.0, 0.0, 0.0] )
        this.sphere.changeNoise( 8 )
    }

    init = () => {
        const { width, height } = this.props

        // Scene
        this.group.add( this.sphere )
        this.scene.add( this.group )

        // Camera
        this.camera.position.z = 40

        // Light
        Light( this.scene )

        // Renderer
        this.renderer.setSize( width, height )

        // Initialize Force
        this.force.anchor.set(1, 0)
        this.force.velocity.set(1, 0)
        this.force.k = 0.645
        this.force.d = 0.16

        // Render to canvas
        this.renderCanvas()
        this.canvas.appendChild( this.renderer.domElement )
    }

    // Rendering
    renderCanvas = () => {
        // Frames
        requestAnimationFrame( this.renderCanvas )
        this.renderer.render( this.scene, this.camera )

        this.updateForce()
        this.updateUniforms()
    }

    // Update Sphere Force
    updateForce = () => {
        this.force.applyHook( 0, this.force.k )
        this.force.applyDrag( this.force.d )
        this.force.updateVelocity()
    }

    // Update Sphere Uniforms
    updateUniforms = () => {
        this.sphere.material.uniforms.time.value += (Math.random() * (2 - 1 + 1)) + 1
        // this.sphere.material.uniforms.radius.value = this.force.velocity.x
        this.sphere.material.uniforms.distort.value = this.force.velocity.x / 2 - 0.1
    }

    render () {
        return (
            <div>
                <CenterContent
                    innerRef={ e => this.canvas = e }
                />
            </div>
        )
    }
}