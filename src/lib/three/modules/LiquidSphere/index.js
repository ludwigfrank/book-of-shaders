import { BufferGeometry, Mesh, OctahedronGeometry, ShaderMaterial, UniformsLib, UniformsUtils } from 'three'
/* eslint import/no-webpack-loader-syntax: off */
import vert from "./object_vert.js"
import frag from "./object_frag.js"

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
                    }
                }
            ]),
            vertexShader: vert,
            fragmentShader: frag,
            lights: true,
        })
    }
}
// sohere wegcoden

export default LiquidSphere
