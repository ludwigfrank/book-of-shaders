import { ShaderMaterial, Uniform } from "three";
import glslify from 'glslify'

const fragment = glslify`
	uniform sampler2D tDiffuse;
	uniform float time;
	
	varying vec2 vUv;
	
	#ifdef NOISE
	
		uniform float noiseIntensity;
	
	#endif
	
	#ifdef SCANLINES
	
		uniform float scanlineIntensity;
		uniform float scanlineCount;
	
	#endif
	
	#ifdef GREYSCALE
	
		#include <common>
	
		uniform float greyscaleIntensity;
	
	#elif defined(SEPIA)
	
		uniform float sepiaIntensity;
	
	#endif
	
	#ifdef VIGNETTE
	
		uniform float vignetteOffset;
		uniform float vignetteDarkness;
	
	#endif
	
	void main() {
	
		vec4 texel = texture2D(tDiffuse, vUv);
		vec3 color = texel.rgb;
	
		#ifdef SCREEN_MODE
	
			vec3 invColor;
	
		#endif
	
		#ifdef NOISE
	
			float x = vUv.x * vUv.y * time * 1000.0;
			x = mod(x, 13.0) * mod(x, 123.0);
			x = mod(x, 0.01);
	
			vec3 noise = texel.rgb * clamp(0.1 + x * 100.0, 0.0, 1.0) * noiseIntensity;
	
			#ifdef SCREEN_MODE
	
				invColor = vec3(1.0) - color;
				vec3 invNoise = vec3(1.0) - noise;
	
				color = vec3(1.0) - invColor * invNoise;
	
			#else
	
				color += noise;
	
			#endif
	
		#endif
	
		#ifdef SCANLINES
	
			vec2 sl = vec2(sin(vUv.y * scanlineCount), cos(vUv.y * scanlineCount));
			vec3 scanlines = texel.rgb * vec3(sl.x, sl.y, sl.x) * scanlineIntensity;
	
			#ifdef SCREEN_MODE
	
				invColor = vec3(1.0) - color;
				vec3 invScanlines = vec3(1.0) - scanlines;
	
				color = vec3(1.0) - invColor * invScanlines;
	
			#else
	
				color += scanlines;
	
			#endif
	
		#endif
	
		#ifdef GREYSCALE
	
			color = mix(color, vec3(linearToRelativeLuminance(color)), greyscaleIntensity);
	
		#elif defined(SEPIA)
	
			vec3 c = color.rgb;
	
			color.r = dot(c, vec3(1.0 - 0.607 * sepiaIntensity, 0.769 * sepiaIntensity, 0.189 * sepiaIntensity));
			color.g = dot(c, vec3(0.349 * sepiaIntensity, 1.0 - 0.314 * sepiaIntensity, 0.168 * sepiaIntensity));
			color.b = dot(c, vec3(0.272 * sepiaIntensity, 0.534 * sepiaIntensity, 1.0 - 0.869 * sepiaIntensity));
	
		#endif
	
		#ifdef VIGNETTE
	
			const vec2 center = vec2(0.5);
	
			#ifdef ESKIL
	
				vec2 uv = (vUv - center) * vec2(vignetteOffset);
				color = mix(color.rgb, vec3(1.0 - vignetteDarkness), dot(uv, uv));
	
			#else
	
				float dist = distance(vUv, center);
				color *= smoothstep(0.8, vignetteOffset * 0.799, dist * (vignetteDarkness + vignetteOffset));
	
			#endif		
	
		#endif
	
		gl_FragColor = vec4(clamp(color, 0.0, 1.0), texel.a);
	
	}
`

const vertex = glslify`
varying vec2 vUv;

void main() {

	vUv = uv;
	gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);

}
`

/**
 * A cinematic shader that provides the following effects:
 *  - Film Grain
 *  - Scanlines
 *  - Vignette
 *  - Greyscale
 *  - Sepia
 *
 * Original scanlines algorithm by Pat "Hawthorne" Shearon.
 *  http://www.truevision3d.com/forums/showcase/staticnoise_colorblackwhite_scanline_shaders-t18698.0.html
 *
 * Optimised scanlines and noise with intensity scaling by Georg "Leviathan"
 * Steinrohder. This version was provided under a Creative Commons Attribution
 * 3.0 License: http://creativecommons.org/licenses/by/3.0.
 *
 * The sepia effect is based on:
 *  https://github.com/evanw/glfx.js
 *
 * The vignette code is based on PaintEffect postprocess from ro.me:
 *  http://code.google.com/p/3-dreams-of-black/source/browse/deploy/js/effects/PaintEffect.js
 */

export class FilmMaterial extends ShaderMaterial {

	/**
	 * Constructs a new film material.
	 *
	 * @param {Object} [options] - The options. Disabled effects will not be included in the final shader and have no negative impact on performance.
	 * @param {Boolean} [options.greyscale=false] - Enable greyscale effect. Greyscale and sepia are mutually exclusive.
	 * @param {Boolean} [options.sepia=false] - Enable sepia effect. Greyscale and sepia are mutually exclusive.
	 * @param {Boolean} [options.vignette=false] - Apply vignette effect.
	 * @param {Boolean} [options.eskil=false] - Use Eskil's vignette approach. The default looks dusty while Eskil looks burned out.
	 * @param {Boolean} [options.screenMode=true] - Whether the screen blend mode should be used for noise and scanlines. Both of these effects are computed independently.
	 * @param {Boolean} [options.noise=true] - Show noise-based film grain.
	 * @param {Boolean} [options.scanlines=true] - Show scanlines.
	 * @param {Number} [options.noiseIntensity=0.5] - The noise intensity. 0.0 to 1.0.
	 * @param {Number} [options.scanlineIntensity=0.05] - The scanline intensity. 0.0 to 1.0.
	 * @param {Number} [options.greyscaleIntensity=1.0] - The intensity of the greyscale effect. 0.0 to 1.0.
	 * @param {Number} [options.sepiaIntensity=1.0] - The intensity of the sepia effect. 0.0 to 1.0.
	 * @param {Number} [options.vignetteOffset=1.0] - The offset of the vignette effect. 0.0 to 1.0.
	 * @param {Number} [options.vignetteDarkness=1.0] - The darkness of the vignette effect. 0.0 to 1.0.
	 */

	constructor(options = {}) {

		const settings = Object.assign({

			screenMode: true,
			noise: true,
			scanlines: true,

			greyscale: false,
			sepia: false,
			vignette: false,
			eskil: false,

			noiseIntensity: 0.5,
			scanlineIntensity: 0.05,
			greyscaleIntensity: 1.0,
			sepiaIntensity: 1.0,

			vignetteOffset: 1.0,
			vignetteDarkness: 1.0

		}, options);

		super({

			type: "FilmMaterial",

			uniforms: {

				tDiffuse: new Uniform(null),
				time: new Uniform(0.0),

				noiseIntensity: new Uniform(settings.noiseIntensity),
				scanlineIntensity: new Uniform(settings.scanlineIntensity),
				scanlineCount: new Uniform(0.0),

				greyscaleIntensity: new Uniform(settings.greyscaleIntensity),
				sepiaIntensity: new Uniform(settings.sepiaIntensity),

				vignetteOffset: new Uniform(settings.vignetteOffset),
				vignetteDarkness: new Uniform(settings.vignetteDarkness)

			},

			fragmentShader: fragment,
			vertexShader: vertex,

			depthWrite: false,
			depthTest: false

		});

		this.setScreenModeEnabled(settings.screenMode);
		this.setNoiseEnabled(settings.noise);
		this.setScanlinesEnabled(settings.scanlines);
		this.setGreyscaleEnabled(settings.greyscale);
		this.setSepiaEnabled(settings.sepia);
		this.setVignetteEnabled(settings.vignette);
		this.setEskilEnabled(settings.eskil);

	}

	/**
	 * Enables or disables the Screen blend mode.
	 *
	 * @param {Boolean} enabled - Whether the Screen blend mode should be enabled.
	 */

	setScreenModeEnabled(enabled) {

		if(enabled) {

			this.defines.SCREEN_MODE = "1";

		} else {

			delete this.defines.SCREEN_MODE;

		}

		this.needsUpdate = true;

	}

	/**
	 * Enables or disables the noise effect.
	 *
	 * @param {Boolean} enabled - Whether the noise effect should be enabled.
	 */

	setNoiseEnabled(enabled) {

		if(enabled) {

			this.defines.NOISE = "1";

		} else {

			delete this.defines.NOISE;

		}

		this.needsUpdate = true;

	}

	/**
	 * Enables or disables the scanlines effect.
	 *
	 * @param {Boolean} enabled - Whether the scanlines effect should be enabled.
	 */

	setScanlinesEnabled(enabled) {

		if(enabled) {

			this.defines.SCANLINES = "1";

		} else {

			delete this.defines.SCANLINES;

		}

		this.needsUpdate = true;

	}

	/**
	 * Enables or disables the greyscale effect.
	 *
	 * @param {Boolean} enabled - Whether the greyscale effect should be enabled.
	 */

	setGreyscaleEnabled(enabled) {

		if(enabled) {

			this.defines.GREYSCALE = "1";

		} else {

			delete this.defines.GREYSCALE;

		}

		this.needsUpdate = true;

	}

	/**
	 * Enables or disables the sepia effect.
	 *
	 * @param {Boolean} enabled - Whether the sepia effect should be enabled.
	 */

	setSepiaEnabled(enabled) {

		if(enabled) {

			this.defines.SEPIA = "1";

		} else {

			delete this.defines.SEPIA;

		}

		this.needsUpdate = true;

	}

	/**
	 * Enables or disables the Vignette effect.
	 *
	 * @param {Boolean} enabled - Whether the Vignette effect should be enabled.
	 */

	setVignetteEnabled(enabled) {

		if(enabled) {

			this.defines.VIGNETTE = "1";

		} else {

			delete this.defines.VIGNETTE;

		}

		this.needsUpdate = true;

	}

	/**
	 * Enables or disables the Eskil Vignette effect.
	 *
	 * Has no effect if Vignette is disabled.
	 *
	 * @param {Boolean} enabled - Whether the Eskil Vignette effect should be enabled.
	 */

	setEskilEnabled(enabled) {

		if(enabled) {

			this.defines.ESKIL = "1";

		} else {

			delete this.defines.ESKIL;

		}

		this.needsUpdate = true;

	}

}
