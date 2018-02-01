import React, { Component } from 'react'
import {
    WebGLRenderer, PerspectiveCamera, Scene, Sprite, SpriteMaterial, OctahedronGeometry, Mesh,
    LineBasicMaterial, MeshBasicMaterial, Vector3, IcosahedronGeometry, FaceNormalsHelper, VertexNormalsHelper,
    CatmullRomCurve3, Geometry, Line, BufferGeometry
} from 'three'
import styled from 'react-emotion'
import GridGuidesPng from '../../img/24pxPoint.png'
import Typography from '../../components/Typography/index'



const Wrapper = styled('div')`
  width: 10vw;
  right: 24px;
  position: absolute;
  height: calc(100% - 64px);
  top: 64px;
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
const HEIGHT = window.innerHeight - 64
const ARC_SEGMENTS = 200
const ARC_POINTS = 20
const TRANSLATION_X = 6

let t = 0

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

        this.splines = []
        this.curvePoints = []
        this.curveSegments = 400

        this.positions = []


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
        this.camera.position.z = 100

        this.scene = new Scene()

        this.initObjects()

        this.renderer = new WebGLRenderer({
            antialias: true,
            alpha: true
        });
        this.renderer.setPixelRatio( window.devicePixelRatio )
        this.renderer.setSize( WIDTH, HEIGHT )
        this.canvas.appendChild( this.renderer.domElement )
    }

    initObjects = () => {


        const geometry = new Geometry()

        for ( let i = - ARC_SEGMENTS / 2; i < ARC_SEGMENTS / 2; i ++ ) {
            geometry.vertices.push( new Vector3() )
        }

        geometry.computeBoundingSphere()
        geometry.verticesNeedUpdate = true

        const material = new LineBasicMaterial({
            color: 0xff0000,
            opacity: 0.35,
            linewidth: 4
        })

        const createCurvePoints = () => {
            const curvePoints = []
            for ( let i = - ARC_POINTS / 2 ; i < ARC_POINTS / 2; i ++ ) {
                curvePoints.push(new Vector3(Math.random()* 4, i * TRANSLATION_X, 0 ))
            }
            return curvePoints
        }

        //Create a closed wavey loop
        const curve = new CatmullRomCurve3( createCurvePoints() );
        curve.curveType = 'catmullrom'
        curve.mesh = new Line( geometry.clone(), material)
        curve.mesh.castShadow = true

        this.splines.push( curve )

        this.splines.map( spline => {
            this.scene.add( spline.mesh )
        })

        this.updateCurves()
        this.updateSplineOutline()
        this.updateCurves()
        this.updateCurves()
        this.updateCurves()
        this.updateCurves()
    }

    updateSplineOutline = () => {
        this.splines.map( spline => {
            for ( let i = 0; i < ARC_SEGMENTS; i ++ ) {
                let p = spline.mesh.geometry.vertices[ i ]
                let t = i / ( ARC_SEGMENTS - 1 )
                spline.getPoint( t, p )
            }
            spline.mesh.geometry.verticesNeedUpdate = true;
        })
    }

    updateCurves = () => {
        this.splines.map( spline => {
            const curve = spline

            const newPoints = [...curve.points]
            for ( let p = 0; p < newPoints.length ; p ++) {
                newPoints[p].setY(newPoints[p].y - TRANSLATION_X)
            }
            newPoints.shift()

            newPoints.push(new Vector3(
                5,
                60,
                0))
            // remove the last element
            //ath.sin( Math.sin(t) * Math.tan(t * Math.PI) * Math.PI / 8 )

            // add the new vector
            console.log(newPoints)
            curve.points = newPoints
        })
        this.updateSplineOutline()
    }

    renderSketch = () => {
        const { amountY, amountX } = this.state
        this.camera.lookAt( this.scene.position )

        this.count += 0.1

        this.renderer.render( this.scene, this.camera )
    }

    animateSketch = () => {
        requestAnimationFrame( this.animateSketch )
        t += 0.1
        // this.updateCurves()

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
