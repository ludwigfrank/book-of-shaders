import { BoxGeometry } from 'three'

import LiquidSphere from '../../../../lib/three/modules/LiquidSphere'
import AnimationGroup from '../../../../lib/three/modules/AnimationGroup'
import NavigationObjectMesh from './NavigationObjectMesh'

const createSphereGroup = ( liquidSphereGroup, titles ) => {
    let group

    titles.map(( curr, index ) => {
        const liquidSphere = new LiquidSphere()
        liquidSphereGroup.push(liquidSphere)

        // Animation Group for the Navigation Objects
        group = new AnimationGroup({
            name: 'GROUP ' + curr.title,
            position: [ 0, index , 0],
            positionActive: [ 0, 8 - curr.y  , 2 ]
        }).add(

            // Animation Group for the H1 Object
            new AnimationGroup({
                name: 'GROUP TITLE ' + curr.title
            }).add(
                liquidSphere
            ),

            // Animation Group for the H2 Object
            new AnimationGroup({
                name: 'GROUP SUB TITLE ' + curr.title
            }).add(
                ...curr.subtitle.reduce(( acc, cur, ind, arr ) => {
                    return [ ...acc,
                        new AnimationGroup({
                            position: [ 0.05, 0 , 0],
                            activePosition: [ 0.05, - 1.5 - ind, 0],
                            name: 'asldhf'
                        }).add(
                            new NavigationObjectMesh({
                                name: 'MESH ' + cur,
                                geometry: new BoxGeometry( 0.3, 0.3, 0.3 )
                            })
                        )
                    ]
                }, [])
            )
        )
    })

    return group
}

export default createSphereGroup