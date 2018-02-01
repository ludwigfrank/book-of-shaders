import React, { Component } from 'react'
import {
    WebGLRenderer, PerspectiveCamera, Scene, Sprite, SpriteMaterial, OctahedronGeometry, Mesh,
    LineBasicMaterial, MeshBasicMaterial, Vector3
} from 'three'
import styled from 'react-emotion'
import GridGuidesPng from '../../../img/24pxPoint.png'
import Typography from '../../../components/Typography/index'



const Wrapper = styled('div')`
  margin-top: 0px;
`

const CanvasWrapper = styled('div')`
  top: 0;
  margin-top: 4px;
`

const WrapperBackground = styled('div')`
  background: url(${ GridGuidesPng }) repeat;
  opacity: 0.2;
  width: 100%;
  height: 100%;
  position: absolute;
`

const WIDTH = 190
const HEIGHT = 190

export default class ReadingBehaviour extends Component {
    constructor ( props ) {
        super( props )
        this.camera = null
        this.scene = null
        this.renderer = null

        this.particles = []
        this.count = 0

        this.movementX = 0
        this.movementY = 0

        this.state = {

            separation: 10,
            separationX: 10,
            amountX: 20,
            amountY: 20,
        }
    }

    initSketch = () => {
        const { amountX, amountY, separation, separationX } = this.state

        this.camera = new PerspectiveCamera( 75, WIDTH / HEIGHT, 1, 10000 )
        this.camera.position.z = 400

        this.scene = new Scene()

        const geometry = new OctahedronGeometry( 1, 2 )
        const material = new MeshBasicMaterial( {
            color: 0x000000
        } );

        let i, particle = 0
        i = 0
        for ( let ix = 0; ix < this.state.amountX; ix ++ ) {
            for ( let iy = 0; iy < this.state.amountY; iy ++ ) {
                particle = this.particles[ i ++ ] = new Mesh( geometry, material )

                let vertex1 = new Vector3();
                vertex1.x = Math.random() * 2 - 1;
                vertex1.y = Math.random() * 2 - 1;
                vertex1.normalize();
                vertex1.multiplyScalar( 100 + Math.random() * 30 );

                particle.position.x = vertex1.x
                particle.position.y = vertex1.y

                this.scene.add( particle )
            }
        }

        this.renderer = new WebGLRenderer({
            antialias: true,
            alpha: true
        });
        this.renderer.setPixelRatio( window.devicePixelRatio )
        this.renderer.setSize( WIDTH, HEIGHT )
        this.canvas.appendChild( this.renderer.domElement )
    }

    renderSketch = () => {
        const { amountY, amountX } = this.state
        this.camera.lookAt( this.scene.position )
        let i = 0
        let particle

        for ( let ix = 0; ix < amountX; ix ++ ) {
            for ( let iy = 0; iy < amountY; iy ++ ) {
                particle = this.particles[ i++ ]


                particle.scale.x = particle.scale.y = ( Math.sin( ( ix + this.count ) * 0.3) ) * 4 +
                    ( Math.cos( ( iy + this.count ) * 0.5 ) + 1 ) * 5;
            }
        }

        this.count += 0.1

        this.renderer.render( this.scene, this.camera )
    }

    animateSketch = () => {
        requestAnimationFrame( this.animateSketch )
        this.renderSketch()
    }

    handleMouseMove = (e) => {
        const { movementX, movementY } = e
        this.movementX = movementX
        this.movementY = movementY

    }

    componentDidMount () {

        document.onmousemove = (e) => this.handleMouseMove(e)

        this.initSketch()
        this.animateSketch()
    }

    render () {
        return (
            <Wrapper>
                <Typography type='caption' size='tiny' color='disabled' tt='uppercase'> FOCUS COORDINATES </Typography>
                <CanvasWrapper innerRef={ e => this.canvas = e }>
                    <WrapperBackground />
                </CanvasWrapper>
            </Wrapper>
        )
    }
}
