import styled, { css } from 'react-emotion'


const base = props => css`
  font-family: ${ props.theme.type.family.code };
  line-height: 1.6em;
  font-size: ${ props.theme.type.size.regular }em;
  color: ${ props.theme.color.light.type.primary };
`

export const CodeWrapper = styled('div')`
   background-color: #ecedee;
   padding: 16px 24px;
   margin: 16px -24px;
   border-radius: 4px;
`

export const Code = styled('code')`
  ${ base };
`

export const CodeMark = styled('code')`
  ${ base };
  padding: 0 4px;
  margin: 0 4px;
  position: relative;
  border-radius: 2px;
  background-color: #e9eaeb;
  // stext-shadow: 0px 0px 1px #000;
  &:before, 
  &:after {
    content: attr(data-text);
    left: -2px;
    width: 100%;
    position: absolute;
    background: #ecedee;
    clip: rect(0, 0, 0, 0);
  }
  &:after {
    left: 2px;
    text-shadow: -1px 0 red;
    animation: ${ GlitchAnimationOne } 2s infinite linear alternate-reverse;
  }
  &:before {
    left: 4px;
    top: 2px;
    text-shadow: 2px 3px #00ff00, 4px 0 blue;
    animation: ${ GlitchAnimationTwo } 3s infinite linear alternate-reverse;
  }
`

export const CodeCommentMark = styled('span')`
  ${ base };
  opacity: 0.5;
  display: block;
`

export const CodeNumberMark = styled('span')`
  ${ base };
  opacity: 1;
  position: relative;  

`

export const CodeKeywordMark = styled('span')`
  ${ base };
  font-weight: 500;
  opacity: 1;
`

export const CodePunctuationMark = styled('span')`
  ${ base };
  font-weight: 500;
  opacity: 0.5;
`



