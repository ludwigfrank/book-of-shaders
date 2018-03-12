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

import Typography from '../../components/Typography'

const CenterContent = styled('div')`
  left: 0;
  position: absolute;
  top: 50%;
  pointer-events: none;
  transform: translateY(-50%);
  z-index: ${props => props.theme.elevation.xl};
`

const IntroWrapper = styled('div')`
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  opacity: ${props => props.visible ? 1 : 0 };
  pointer-events: ${props => props.visible ? 'auto' : 'none' };
  transition: all 2s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 10000;
`

const IntroWrapperText = styled('div')`
  width: 450px
`

const Button = styled('div')`
  padding: 6px 16px 8px 16px;
  margin-top: 32px;
  border-radius: 4px;
  color: ${props => props.theme.color.dark.type.primary};
  border: 1px solid ${props => props.theme.color.dark.type.secondary};
  text-transform: uppercase;
  font-size: 13px;
  letter-spacing: 2px;
  line-height: 24px;
`


const Intro = ({ visible, handleClick }) => {

    return (
        <IntroWrapper visible={ visible }>
            <IntroWrapperText>
                <Typography>
                    <span style={{color: '#fff', opacity: 0.8, lineHeight: 1.8, letterSpacing: '0.5px', textTransform: 'none'}}>
                        The youngest kids tried to squeeze themselves through the legs of the crowd of adults, trying to get a seat where they could see her. Wrangling for the front most place on the floor, looking up from time to time, to the woman sitting on a fur against the wall of the bunker. Everyone wanted to make sure they still preserved a decent distance between them and her.
A few weeks ago a group of colony hunters found her outside. No one knew how she could have survived the radiation, but the lumps covering her body made clear her story must be truthful: She lived before the apocalypse. When the strange spheres she described as Motus could be controlled and represented the recourse of energy for all of us…
                    </span>
                </Typography>
            </IntroWrapperText>
            <Button onClick={() => handleClick()}>
                <Typography color={'primary'} theme={'dark'} tt={'uppercase'} spacing={2}>
                    Enter First Chapter
                </Typography>
            </Button>
        </IntroWrapper>
    )
}


export default class CanvasLiquidSphere extends Component {
    constructor ( props ) {
        super( props )

        this.state = {
            intro: true
        }
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
        this.startIntro()
    }

    startIntro = () => {
        this.sphere.changeRadius(6)
    }

    endIntro = () => {
        this.setState({ intro: false })
        this.sphere.changeRadius(1)
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
                <Intro visible={ this.state.intro } handleClick={ this.endIntro }/>
                <CenterContent
                    innerRef={ e => this.canvas = e }
                />
            </div>
        )
    }
}