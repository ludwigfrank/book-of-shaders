import React, { Children } from 'react'
import styled, { css } from 'styled-components'
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
        lineHeight,
        ...other
    } = props

    const sColor = props.color ? props.color : ''

    const basicStyles = css`
      font-family: ${ props => props.theme.type.family[font] };
      font-weight: ${ props => props.theme.type.weight[weight] };
      box-sizing: border-box;
      display: block;
      line-height: 1.5em;
      letter-spacing: ${ (props) => {
        if (tt === 'uppercase') return 0.1
        else return spacing
    }}em;
    `

    const types = {
        h1: 'h1',
        h2: 'h2',
        h3: 'h3',
        body: 'p',
        caption: 'span'
    }

    const styles = {

        h1: css`
          font-size: ${props => props.theme.type.size.huge}${unit};
          color: ${props => props.theme.color.light.text.primary};
          line-height: ${props => props.theme.type.size.huge} * 1.5 ${unit};
        `,

        h2: css`
          font-size: ${props => props.theme.type.size.big}${unit};
          color: ${props => props.theme.color.light.text.primary};
        `,

        h3: css`
          font-size: ${props => props.theme.type.size.regular}${unit};
          color: ${props => props.theme.color.light.text.primary};
        `,

        body: css`
          font-size: ${props => props.theme.type.size.regular}${unit};
          color: ${props => props.theme.color.light.text.primary};
        `,

        caption: css`
          font-size: ${props => props.theme.type.size.small}${unit};
          color: ${props => props.theme.color.light.text.regular};
        `,
    }

    const overrides = css`
      ${ props => props.size && 'font-size:' + props.theme.type.size[size] + unit};
      ${ props => color && 'color:' + props.theme.color.light.text[color] };
      line-height: ${props => lineHeight ? lineHeight : '' };
    `

    const Component = styled('div')`
      color: red;
    `

    return (
        <Component>
            { props.children }
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