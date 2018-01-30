import React, { Children } from 'react'
import styled, { css } from 'react-emotion'
import PropTypes from 'prop-types'

const unit = 'em'

const Text = ( props ) => {

    const {
        type,
        font,
        color,
        align,
        tt,
        weight,
        spacing,
        size,
        lineHeight
    } = props


    const basicStyles = props => css`
      font-family: ${ props.theme.type.family[font] };
      font-weight: ${ props.theme.type.weight[weight] };
      text-align: ${ align };
      box-sizing: border-box;
      display: block;
      line-height: 1.5em;
      text-transform: ${ tt };
      letter-spacing: ${ (props) => {
        if ( tt === 'uppercase') return 0.1
        else return spacing
      }}em;
    `


    const styles = {

        h1: props => css`
          font-size: ${ props.theme.type.size.huge}${unit};
          color: ${ props.theme.color.light.type.primary};
          line-height: ${ props.theme.type.size.huge} * 1.5 ${unit};
        `,

        h2: props => css`
          font-size: ${ props.theme.type.size.big}${unit};
          color: ${ props.theme.color.light.type.primary};
        `,

        h3: props => css`
          font-size: ${ props.theme.type.size.regular}${unit};
          color: ${ props.theme.color.light.type.primary};
        `,

        body: props => css`
          font-size: ${ props.theme.type.size.regular}${unit};
          color: ${ props.theme.color.light.type.primary};
        `,

        caption: props => css`
          font-size: ${ props.theme.type.size.small}${unit};
          color: ${ props.theme.color.light.type.regular};
        `,
    }

    const overrides = props => css`
      ${ size && 'font-size:' + props.theme.type.size[size] + unit};
      ${ color && 'color:' + props.theme.color.light.type[color] };
      line-height: ${  lineHeight ? lineHeight : '' };
    `


    const Component = styled('span')`
      ${ basicStyles }
      ${ styles[type] }
      ${ overrides }
    `

    return (
        <Component>
            { Children.toArray(props.children) }
        </Component>
    )
}

Text.propTypes = {
    type: PropTypes.oneOf([ 'h1', 'h2', 'h3', 'body', 'caption' ]),
    size: PropTypes.oneOf([ 'huge', 'big', 'medium', 'regular', 'small', 'tiny']),
    font: PropTypes.oneOf([ 'primary', 'secondary' ]),
    weight: PropTypes.oneOf([ 'black', 'bold', 'medium', 'regular', 'light', 'hairline']),
    color: PropTypes.oneOf([ 'primary', 'secondary', 'regular', 'disabled' ]),
    align: PropTypes.oneOf([ 'inherit', 'left', 'center', 'right', 'justify' ]),
    tt: PropTypes.oneOf([ 'lowercase', 'uppercase', 'capitalize', 'none' ]),
    spacing: PropTypes.number
}

Text.defaultProps = {
    type: 'body',
    font: 'primary',
    weight: 'regular',
    align: 'inherit',
    tt: 'capitalize',
    spacing: 0
}

export default Text