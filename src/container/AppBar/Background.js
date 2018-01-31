import styled from 'react-emotion'

const Background = styled('div')`
  position: fixed;
  top: 0;
  left: 64px;
  right: 0;
  min-width: 0;
  height: 64px;
  padding: 0 32px;
  white-space: nowrap;
  margin: 0 auto;
  box-sizing: border-box;
  display: flex;
  align-content: center;
  ${props => props.theme.styles.divider};
  z-index: 1;
`

export default Background