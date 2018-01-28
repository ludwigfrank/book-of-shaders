import React, { Component } from 'react'
import styled from 'styled-components'
import {
    BoxGeometry,
    Mesh, PerspectiveCamera, Scene,
    WebGLRenderer,
    Clock, Color,
    ShadowMaterial, Group, OctahedronBufferGeometry
} from 'three'
import { EffectComposer, RenderPass, GlitchPass, FilmPass, BokehPass, BlurPass } from 'postprocessing'
import { extend } from 'underscore'

/* eslint import/no-webpack-loader-syntax: off */
import * as PCSS from '!raw-loader!glslify-loader!../lib/shaders/PCSS/PCSS.frag'
import * as PCSSGetShadow from '!raw-loader!glslify-loader!../lib/shaders/PCSS/PCSSGetShadow.frag'

import NavigationObjectMesh from '../components/Navigation/three/mesh/NavigationObjectMesh'
import AnimationGroup from '../components/Navigation/three/mesh/AnimationGroup'
import Force2 from '../lib/modules/Force2'
import Light from '../components/Navigation/three/Light'
import LiquidSphere from '../lib/three/modules/LiquidSphere'

const CenterContent = styled('div')`
  margin: 0 auto;
  width: 600px;
  display: flex;
  align-content: center;
  justify-content: center;
`

const WIDTH = 64
const HEIGHT = 400
const SPACING = 4

const BACKGROUND_COLOR = 0xfafafa
export default class HomePage extends Component {
    constructor () {
        super()

        // Scene
        this.scene = new Scene()

        // Camera
        this.camera = new PerspectiveCamera( 50, WIDTH / HEIGHT, 0.01, 1000 )

        // Group
        this.objectGroup = new Group()
        this.scene.add( this.objectGroup )

        this.liquidSpheres = []

        // Passes
        // BlurPass
        this.blurPass = new BlurPass()
        this.blurPass.renderToScreen = true

        // GlitchPass
        this.glitchPass = new GlitchPass()
        this.glitchPass.renderToScreen = true

        // RenderPass
        this.renderPass = new RenderPass( this.scene, this.camera )
        this.renderPass.renderToScreen = true

        this.force = new Force2()
        this.state = {
           //mock js
        }
    }

    componentDidMount () {
        this.calculateOpenPosition()
    }

    init = () => {
        const { title } = this.state
        this.scene.background = new Color(0xffffff)


        this.camera.position.z = 90

        const planeGeometry = new BoxGeometry( 8, HEIGHT, 1 )
        const planeMaterial = new ShadowMaterial()
        planeMaterial.opacity = 0.16

        this.force.anchor.set(1, 0)
        this.force.velocity.set(1, 0)
        this.force.k = 0.645
        this.force.d = 0.16

        const planeMesh = new Mesh( planeGeometry, planeMaterial )
        planeMesh.receiveShadow = true
        planeMesh.position.set( 0, 0, - 2)
        this.scene.add( planeMesh )

        Light( this.scene )

        const renderer = new WebGLRenderer( {
            antialias: true,
            logarithmicDepthBuffer: true,
        })
        renderer.setSize( WIDTH, HEIGHT )
        renderer.gammaInput = true
        renderer.gammaOutput = true
        renderer.shadowMap.enabled = true

        this.composer = new EffectComposer( renderer, {
            stencilBuffer: true,
            depthTexture: true
        } )
        this.composer.setSize( WIDTH, HEIGHT )

        this.composer.addPass( this.blurPass )
        this.composer.addPass( this.renderPass )

        this.renderer = this.composer.renderer
        this.renderer.setSize( WIDTH, HEIGHT )

        this.canvas.appendChild( this.renderer.domElement )
        this.renderer.domElement.addEventListener( 'mouseenter', () => this.handleMouseEnter() )
        this.renderer.domElement.addEventListener( 'mouseleave', () => this.handleMouseLeave() )
        this.clock = new Clock()
        this.renderCanvas()
        console.log( this.scene )
    }

    renderCanvas = () => {
        // Frames
        requestAnimationFrame( this.renderCanvas )
        this.composer.render( this.clock.getDelta() )

        this.force.applyHook( 0, this.force.k )
        this.force.applyDrag( this.force.d )
        this.force.updateVelocity()


        this.liquidSpheres.map( ( sphere, index ) => {
            sphere.material.uniforms.time.value += (Math.random() * (2 - 1 + 1)) + 1
            sphere.material.uniforms.radius.value = this.force.velocity.x;
            sphere.material.uniforms.distort.value = this.force.velocity.x / 2 - 0.1;
        })
        // Animation
        //
        /*this.objectGroup.children.map( group => {
            const obj = group.children[0]
            obj.rotate( Math.random() * 0.02 + 0.01, Math.random() * 0.02 + 0.01, 0 )
        })*/
    }

    handleMouseEnter = () => {
        const { title } = this.state

        this.objectGroup.children.map( ( group, index ) => {
            group.animatePosition( group.positionActive, index * 0.2)
            group.children[1].children.map( ( subtitle, index ) => {
                subtitle.animatePosition( [ 0, - 1.5 - 1 * index, 0], index * 0.25 )
            } )
        })
    }

    handleMouseLeave = () => {
        this.objectGroup.children.map( group => {
            group.animatePosition( group.positionIdle )
            group.children[1].children.map( ( subtitle, index ) => {
                subtitle.animatePosition( [ 0 , 0 , index * 0.5], index * 0.1 )
            } )
        })
    }

    calculateOpenPosition = () => {
        const { title } = this.state
        const spacing = 1
        let height = 0

        const position = title.reduce( ( acc, curr, index, array ) => {
            const currHeight = spacing + spacing * curr.subtitle.length
            const current = {
                ...curr,
                height: currHeight,
                y:  height
            }
            height += currHeight
            return [ ...acc, current ]
        }, [] )


        this.setState({
            title: position,
        }, () => this.init())
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