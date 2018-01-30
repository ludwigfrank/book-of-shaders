import styled, { css } from 'react-emotion'


export const base = props => css`
  font-family: ${ props.theme.type.family.code };
  line-height: 1.6em;
  font-size: ${ props.theme.type.size.regular }em;
  color: ${ props.theme.color.light.type.primary };
`

export const CodeWrapper = styled('div')`
   padding: 16px 24px;
   margin: 16px -24px;
   border-radius: 4px;
`

export const Code = styled('code')`
  ${ base };
`


export const CodeCommentMark = styled('span')`
  ${ base };
  opacity: 0.5;
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



