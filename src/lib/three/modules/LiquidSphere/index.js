import { BufferGeometry, Mesh, OctahedronGeometry, ShaderMaterial, UniformsLib, UniformsUtils } from 'three'
/* eslint import/no-webpack-loader-syntax: off */
import vert from "./object_vert.js"
import frag from "./object_frag.js"
import { tween, easing } from 'popmotion'

class LiquidSphere extends Mesh {
    constructor () {
        super()
        this.geometry = new BufferGeometry()
        this.geometry.fromGeometry( new OctahedronGeometry( 5, 6 ) )
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
                        value: 1.0
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
                        value: 0
                    },
                    noiseIntensity: {
                        type: 'f',
                        value: 8.0
                    }
                }
            ]),
            vertexShader: vert,
            fragmentShader: frag,
            lights: true,
        })
    }


    changeRadius = ( newRadius ) => {
        const oldRadius = this.material.uniforms.radius.value

        tween({
            from: oldRadius,
            to: newRadius,
            ease: easing.easeInOut,
            duration: 6000
        }).start( v => this.material.uniforms.radius.value = v)
    }

    changeNoise = ( newIntensity ) => {
        const oldIntensity = this.material.uniforms.noiseIntensity.value

        tween({
            from: oldIntensity,
            to: newIntensity,
            ease: easing.linear,
            duration: 4000,
        }).start( v =>
            this.material.uniforms.noiseIntensity.value = v
        )
    }

    changeColor = ( newColor ) => {
        const oldColor = this.material.uniforms.mixColor.value
        const oldIntensity = this.material.uniforms.mixIntensity.value

        const colorIntensity = newColor[3]
        const colorRGB = newColor.splice(0,3)

        tween({
            from: oldColor,
            to: colorRGB,
            ease: easing.linear,
            duration: 4000,
        }).start( v =>
            this.material.uniforms.mixColor.value = v
        )

        tween({
            from: oldIntensity,
            to: colorIntensity,
            ease: easing.linear,
            duration: 4000,
        }).start( v => this.material.uniforms.mixIntensity.value = v
        )
    }
}
// sohere wegcoden

export default LiquidSphere
