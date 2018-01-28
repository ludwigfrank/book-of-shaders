import {
    Vector2
} from 'three'

export default class Force2 {
    constructor () {
        this.velocity = new Vector2()
        this.acceleration = new Vector2()
        this.anchor = new Vector2()
        this.mass = 1
    }

    updateVelocity = () => {
        this.acceleration.divideScalar( this.mass )
        this.velocity.add( this.acceleration )
    }

    applyForce = ( vector ) => {
        this.acceleration.add( vector )
    }

    applyFriction = (mu, normal = 1) => {
        const force = this.acceleration.clone()
        force.multiplyScalar( -1 )
        force.normalize()
        force.multiplyScalar( mu )
        this.applyForce( force )
    }

    applyDrag = ( value ) => {
        const force = this.acceleration.clone()
        force.multiplyScalar( -1 )
        force.normalize()
        force.multiplyScalar( this.acceleration.length() * value )
        this.applyForce( force )
    }

    applyHook = ( rest_length, k ) => {
        const force = this.velocity.clone().sub( this.anchor )
        const distance = force.length() - rest_length
        force.normalize()
        force.multiplyScalar( -1 * k * distance )
        this.applyForce( force )
    }
}