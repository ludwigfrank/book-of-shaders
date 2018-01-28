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

import { extend } from 'underscore'

const DEFAULTS = {
    position: [ 0, 0, 0 ],
    positionActive: [ 4, 4, 4 ],
    name: 'NavigationObjectMesh',
    material: new MeshToonMaterial( {
        color: 0x0E0D15,
        shininess: 38,
        flatShading: true,
        wireframe: false,
    } ),
    geometry: new OctahedronBufferGeometry(1),
    castShadow: true
}

export default class NavigationObjectMesh extends Mesh {
    constructor ( options = { } ) {
        super()
        const opts = extend( DEFAULTS, options )
        this.geometry = opts.geometry
        this.material = opts.material
        this.castShadow = opts.castShadow
        this.positionActive = opts.positionActive
        this.positionIdle = opts.position
        this.position.set( ...opts.position )
        this.name = opts.name
        this.visible = opts.visible

        // Hide the Element if its a Group
        if ( this.name.includes('GROUP') ) {
            this.material.transparent = true
            this.material.opacity = 0
            this.castShadow = false
        }
    }
}