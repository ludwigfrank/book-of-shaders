import React, { Component } from 'react'
import styled from 'react-emotion'
import {
    BoxGeometry,
    Mesh, PerspectiveCamera, Scene,
    WebGLRenderer,
    Clock, Color,
    ShadowMaterial, Group, OctahedronBufferGeometry
} from 'three'
import { EffectComposer, RenderPass, GlitchPass, FilmPass, BokehPass, BlurPass } from 'postprocessing'

import Force2 from '../../../lib/modules/Force2'
import Light from './Light'

import LiquidSphere from '../../../lib/three/modules/LiquidSphere'
import AnimationGroup from '../../../lib/three/modules/AnimationGroup'

const CenterContent = styled('div')`
  left: 0;
  position: absolute;
  top: 50%;
  pointer-events: none;
  transform: translateY(-50%);
`


export default class Liquid extends Component {
    constructor ( props ) {
        super( props )

        // Scene
        this.scene = new Scene()

        // Camera
        this.camera = new PerspectiveCamera( 50, props.width / props.height , 0.01, 1000 )

        // Sphere
        this.sphere = new LiquidSphere
        this.group = new AnimationGroup

        // RenderPass
        this.renderPass = new RenderPass( this.scene, this.camera )
        this.renderPass.renderToScreen = true

        this.force = new Force2
    }

    static defaultProps = {
        width: window.innerWidth,
        height: window.innerHeight
    }

    componentDidMount () {
        this.init()
    }

    init = () => {
        const { width, height } = this.props

        this.group.add( this.sphere )
        this.scene.add( this.group )

        this.camera.position.z = 60

        Light( this.scene )

        const renderer = new WebGLRenderer( {
            antialias: true,
            logarithmicDepthBuffer: true,
            alpha: true
        })
        renderer.setSize( width, height )
        renderer.gammaInput = true
        renderer.gammaOutput = true
        renderer.shadowMap.enabled = true

        this.composer = new EffectComposer( renderer, {
            stencilBuffer: true,
            depthTexture: true
        } )
        this.composer.setSize( width, height )
        this.composer.addPass( this.renderPass )
        this.renderer = this.composer.renderer

        this.canvas.appendChild( this.renderer.domElement )
        this.clock = new Clock()

        // console.log(this.sphere.material.uniforms)
        this.sphere.changeColor([1.0, 0.2, 0.2])

        this.initForce()
        this.renderCanvas()
    }

    // Initializing
    initForce = () => {
        // Force
        this.force.anchor.set(1, 0)
        this.force.velocity.set(1, 0)
        this.force.k = 0.645
        this.force.d = 0.16
    }


    // Rendering
    renderCanvas = () => {
        // Frames
        requestAnimationFrame( this.renderCanvas )
        this.composer.render( this.clock.getDelta() )

        this.updateForce()
        this.updateUniforms()
    }

    updateForce = () => {
        // Update Force
        this.force.applyHook( 0, this.force.k )
        this.force.applyDrag( this.force.d )
        this.force.updateVelocity()
    }

    updateUniforms = () => {
        // Update Sphere Uniforms
        this.sphere.material.uniforms.time.value += (Math.random() * (2 - 1 + 1)) + 1
        this.sphere.material.uniforms.radius.value = this.force.velocity.x
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