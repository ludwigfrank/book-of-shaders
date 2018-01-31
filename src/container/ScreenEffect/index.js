import React, { Component } from 'react'
import styled from 'react-emotion'
import {
    BoxGeometry,
    Mesh, PerspectiveCamera, Scene,
    WebGLRenderer,
    Clock, Color,
    ShadowMaterial, Group, OctahedronBufferGeometry, FogExp2
} from 'three'
import { EffectComposer, RenderPass, FilmPass, GlitchPass } from '../../lib/vendor/postprocessing'
import { extend } from 'underscore'


const CenterContent = styled('div')`
  left: 0;
  top: 0;
  position: absolute;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 100000;
`

const WIDTH = window.innerWidth
const HEIGHT = window.innerHeight

export default class ScreenEffect extends Component {
    constructor () {
        super()

        // Scene
        this.scene = new Scene()

        // Camera
        this.camera = new PerspectiveCamera( 50, WIDTH / HEIGHT, 0.01, 1000 )


        // FilmPass
        this.filmPass = new FilmPass({
            grayscale: false,
            sepia: false,
            vignette: true,
            eskil: true,
            scanlines: true,
            noise: true,
            noiseIntensity: 1,
            scanlineIntensity: 0.1,
            scanlineDensity: 1.5,
            greyscaleIntensity: 1.0,
            sepiaIntensity: 0.5,
            vignetteOffset: 0.5,
            vignetteDarkness: 1.2
        })
        this.filmPass.renderToScreen = true

        // GlitchPass
        this.glitchPass = new GlitchPass({
            mode: 1
        })
        this.glitchPass.renderToScreen = false
        this.glitchPass.enabled = false

        // RenderPass
        this.renderPass = new RenderPass( this.scene, this.camera )
        this.renderPass.renderToScreen = false

    }


    componentDidMount () {
        this.init()
    }

    componentWillReceiveProps ({ activeChallengeResolved }, nextContext) {
        this.glitchPass.enabled = !activeChallengeResolved
    }

    init = () => {


        this.camera.position.z = 90
        this.scene.fog = new FogExp2(0x000000, 0.0025);
        // this.scene.background = new Color( 0xbfd1e5 )

        const renderer = new WebGLRenderer( {
            antialias: true,
            logarithmicDepthBuffer: true,
            alpha: true
        })
        renderer.setSize( WIDTH, HEIGHT )
        renderer.gammaInput = true
        renderer.gammaOutput = true
        renderer.shadowMap.enabled = true
        renderer.setClearColor( 0xffffff, 0.1 );

        this.composer = new EffectComposer( renderer, {
            stencilBuffer: true,
            depthTexture: true
        } )

        this.composer.setSize( WIDTH, HEIGHT )

        this.composer.addPass( this.renderPass )
        this.composer.addPass( this.glitchPass )
        this.composer.addPass( this.filmPass )

        this.renderer = this.composer.renderer
        this.renderer.setSize( WIDTH, HEIGHT )

        this.canvas.appendChild( this.renderer.domElement )
        this.renderer.domElement.addEventListener( 'mouseenter', () => this.handleMouseEnter() )
        this.renderer.domElement.addEventListener( 'mouseleave', () => this.handleMouseLeave() )
        this.clock = new Clock()
        this.renderCanvas()
    }

    renderCanvas = () => {
        // Frames
        requestAnimationFrame( this.renderCanvas )
        this.composer.render( this.clock.getDelta() )
    }

    handleMouseEnter = () => {

    }

    handleMouseLeave = () => {

    }

    /*
    *                 <Scrim activeChallengeResolved={ this.props.activeChallengeResolved }/>
    */

    render () {
        return (
                <CenterContent
                    innerRef={ e => this.canvas = e }
                />
        )
    }
}