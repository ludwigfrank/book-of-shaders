import styled from 'react-emotion'

const Wrapper = styled('div')`
  position: absolute;
  top: 64px;
  left: 50%;
  width: 640px;
  height: calc(100% - 64px + 16px);
  overflow: scroll;
`

export {
    Wrapper
}