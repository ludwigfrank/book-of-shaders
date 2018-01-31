import React, { Component } from 'react'
import styled, { keyframes } from 'react-emotion'
import { pointer, listen, physics } from 'popmotion'
import { MotionValue } from 'popmotion-react'

import iconSizeEnlarge from '../../../img/icons/sizeEnlarge.svg'
import iconSizeShrink from '../../../img/icons/sizeShrink.svg'

const CodeCanvasWrapper = styled('div')`
  position: absolute;
  width: ${props => props.large ? 340 : 340}px;
  height: ${props => props.large ? 420 : 88}px;;

  border-radius: 8px;
  background-color: white;
  z-index: ${props => props.theme.elevation.l };
  box-shadow: ${props => props.theme.shadows[props.theme.elevation.l]};
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 20;
`

const BackgroundShift = keyframes`
    0%{background-position:50% 0%}
    50%{background-position:50% 100%}
    100%{background-position:50% 0%}
`

const SketchBackground = styled('div')`
  width: 100%;
  height: 100%;
  border-radius: 8px;
  background: linear-gradient(347deg, #aea5b7, #3100eb);
  background-size: 400% 400%;
  animation: ${ BackgroundShift } 30s ease infinite;
`

const SketchTitle = styled('div')`
  font-family: ${props => props.theme.type.family.primary };
  color: white;
  font-size: ${props => props.theme.type.size.medium}em;
  font-weight: 400;
  text-transform: uppercase;
  letter-spacing: 2px;
  position: absolute;
  left: 24px;
  top: 22px;
`

const IconWrapper = styled('div')`
  position: absolute;
  background-image: url(${props => props.icon});
  width: 14px;
  height: 14px;
  right: 24px;
  top: 24px;
`

export default class CodeCanvas extends Component {
    state = {
        large: true
    }

    handleClickSize = () => {
        const { large } = this.state

        console.log(large)
        this.setState({
            large: !large
        })

    }

    render() {
        const { large } = this.state
        
        return (
            <MotionValue
                initialState="rest"
                v={{ x: 400, y: 400 }}
                onStateChange={{
                    rest: ({ value, setStateTo, ref, context }) => {
                        if (context.listener) context.listener.stop();

                        physics({
                            from: value.get(),
                            velocity: value.getVelocity(),
                            friction: 0.7
                        }).start(value);

                        context.listener = listen(ref, 'mousedown touchstart', {passive: true}).start(setStateTo.isDragging);
                    },
                    isDragging: ({ value, setStateTo, e, context }) => {
                        if (context.listener) context.listener.stop();

                        pointer(value.get()).start(value);

                        context.listener = listen(document, 'mouseup touchend', {passive: true}).start(setStateTo.rest);
                    }
                }}
            >
                {({ v, setStateTo, setRef }) => (
                    <div ref={ setRef } style={{transform: 'translate(' + v.x + 'px, ' + v.y + 'px)'}}>
                        <CodeCanvasWrapper large={ large }>
                            <IconWrapper onClick={ this.handleClickSize } icon={ large ? iconSizeShrink : iconSizeEnlarge }/>
                            <SketchTitle>
                                Sketch 3201
                            </SketchTitle>
                            <SketchTitle style={{opacity: '0.4', top: '44px'}}>
                                D - 29348209348
                            </SketchTitle>
                            <SketchBackground />
                        </CodeCanvasWrapper>
                    </div>
                )}
            </MotionValue>
        )
    }
}