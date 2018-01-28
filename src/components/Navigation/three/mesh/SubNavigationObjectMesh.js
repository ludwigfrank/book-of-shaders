import {
    Mesh,
    MeshToonMaterial,
    OctahedronBufferGeometry,
    Vector3
} from 'three'
import {
    tween,
    easing
} from 'popmotion'


export default class SubNavigationObjectMesh extends Mesh {
    constructor ( position = [ 0, 0, 0 ], positionActive = [ 4, 4, 4 ], title ) {
        super()
        this.geometry = new OctahedronBufferGeometry( 0.5 )
        this.material = new MeshToonMaterial( {
            color: 0x0E0D15,
            shininess: 38,
            flatShading: true,
            wireframe: false,
        } )
        this.castShadow = true
        this.position.set( ...position )
        this.title = title
        this.positionIdle = position
        this.positionActive = positionActive
    }

    rotate = ( x, y, z ) => {
        this.rotation.x += x
        this.rotation.y += y
        this.rotation.z += z
    }

    animateZ = ( value, index = 1 ) => {
        const { scale } = this
        tween({
            from: this.position.z,
            to: value,
            duration: 300 + 100 * index,
            ease: easing.easeInOut,
        }).start((v) => this.position.set( this.position.x, this.position.y, v))
    }

    animateY = ( value, index = 1 ) => {
        const { scale } = this
        tween({
            from: this.position.y,
            to: value,
            duration: 300 + 100 * index,
            ease: easing.easeInOut,
        }).start((v) => this.position.set( this.position.x, v, this.position.z))
    }
}