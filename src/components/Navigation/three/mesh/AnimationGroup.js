import {
    Group,
    MeshToonMaterial,
    OctahedronBufferGeometry,
    Vector3
} from 'three'

import {
    tween,
    easing,
    keyframes
} from 'popmotion'

import { extend } from 'underscore'

const DEFAULTS = {
    position: [ 0, 0, 0 ],
    positionActive: [ 2, 2, 2 ],
    name: 'Group',
}

export default class AnimationGroup extends Group {
    constructor ( options = { } ) {
        super()
        const opts = extend( DEFAULTS, options )
        this.positionActive = opts.positionActive
        this.positionIdle = opts.position
        this.position.set( ...opts.position )
        this.name = opts.name
    }

    rotate = ( x, y, z ) => {
        this.rotation.x += x
        this.rotation.y += y
        this.rotation.z += z
    }

    animateRotation = () => {
        keyframes({
            values: [
                { x: 0 },
                { x: Math.PI / 200 }
            ],
            duration: 3000,
            easings: easing.linear,
            loop: Infinity
        }).start( v =>  {
            const { x, y, z } = this.rotation
            this.rotation.fromArray(
                [ x + Math.random(v.x) / 10, y + Math.random(v.x) / 10, y + Math.random(v.y) / 10]
            )
        })
    }


    animatePosition = ( vector = [ 0, 0, 0 ], duration = 0.3, type = 'easeInOut'  ) => {
        const [ targetX, targetY, targetZ ] = vector
        const { x, y, z } = this.position

        tween({
            from: { x, y, z },
            to: { x: targetX, y: targetY, z: targetZ },
            duration: 300 + 100 * duration,
            ease: easing[type],
        }).start((v) => {
            this.position.set( v.x, v.y, v.z )
        })
    }
}