import {
    AmbientLight, HemisphereLight,
    SpotLight
} from 'three'

export default ( scene ) => {
    const ambientLight = new AmbientLight( 0x404040, 0.1 )
    scene.add( ambientLight )

    const hemis = new HemisphereLight(0xffffff, 0x666666, 1);
    scene.add( hemis )

    const light = new SpotLight( 0xffffff, 0.8 )
        light.position.set( -8, 12, 40 )
        light.angle = Math.PI / 1.4
        light.penumbra = 2
        light.decay = 2
        light.distance = 200
        light.castShadow = true
        light.shadow.mapSize.width = 2024
        light.shadow.mapSize.height = 2024
        light.shadow.camera.near = 10
        light.shadow.camera.far = 200
    scene.add( light )

    const spotlightNoShadow = new SpotLight( 0xffffff, 0.4 )
    spotlightNoShadow.position.set( 0, 0, 20 )
    scene.add( spotlightNoShadow )
}