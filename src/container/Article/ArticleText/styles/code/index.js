import styled, { css, keyframes } from 'react-emotion'


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



