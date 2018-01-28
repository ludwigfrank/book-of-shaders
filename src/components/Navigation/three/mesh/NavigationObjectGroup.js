import {
    Group,
    MeshToonMaterial,
    OctahedronBufferGeometry,
    Vector3
} from 'three'
import {
    tween,
    easing
} from 'popmotion'


const DEFAULT_OPTIONS = {
    positionIdle: [ 0, 0, 0 ],
    positionActive: [ 4, 4, 4 ],
    name: 'NavigationObjectGroup',
}

export default class NavigationObjectGroup extends Group {
    constructor ( opts = DEFAULT_OPTIONS ) {
        super()
        this.positionIdle = opts.positionIdle
        this.positionActive = opts.positionActive
        this.position.set( ...opts.positionIdle )
        this.name = opts.name
    }

    animatePosition = ( vector = [ 0, 0, 0 ], duration = 0.3, type = 'easeInOut'  ) => {
        const [ targetX, targetY, targetZ ] = vector
        const { x, y, z } = this.position

        tween( {
            from: { x, y, z },
            to: { x: targetX, y: targetY, Z: targetZ },
            ease: easing[type],
            duration: duration
        } ).start( v => this.position.set( v.x, v.y, v.z ))
    }
}