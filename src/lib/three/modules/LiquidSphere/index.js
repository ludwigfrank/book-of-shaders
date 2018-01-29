import { BufferGeometry, Mesh, OctahedronGeometry, ShaderMaterial, UniformsLib, UniformsUtils, Vector3 } from 'three'
/* eslint import/no-webpack-loader-syntax: off */
import vert from "./object_vert.js"
import frag from "./object_frag.js"
import { tween, easing } from 'popmotion'

class LiquidSphere extends Mesh {
    constructor () {
        super()
        this.geometry = new BufferGeometry()
        this.geometry.fromGeometry( new OctahedronGeometry( 5, 5 ) )
        this.material = new ShaderMaterial({
            uniforms: UniformsUtils.merge([
                UniformsLib['lights'],
                {
                    time: {
                        type: 'f',
                        value: 0
                    },
                    radius: {
                        type: 'f',
                        value: 5
                    },
                    distort: {
                        type: 'f',
                        value: 10.4
                    },
                    mixColor: {
                        type: 'vec3',
                        value: [0.1, 0.1, 1.0]
                    },
                    mixIntensity: {
                        type: 'f',
                        value: 1
                    }
                }
            ]),
            vertexShader: vert,
            fragmentShader: frag,
            lights: true,
        })
    }

    changeColor = ( newColor ) => {
        const oldColor = this.material.uniforms.mixColor.value

        tween({
            from: oldColor,
            to: newColor,
            ease: easing.linear,
            duration: 4000,
        }).start( v =>
            this.material.uniforms.mixColor.value = v
        )


        console.log( oldColor )
    }

}
// sohere wegcoden

export default LiquidSphere
