import styled, { css, keyframes } from 'react-emotion'
const GlitchAnimationOne = keyframes`
  0% {
    clip: rect(4px, 1084px, 8px, 0);
  }
  5.8823529412% {
    clip: rect(4px, 1084px, 8px, 0);
  }
  11.7647058824% {
    clip: rect(6px, 1084px, 13px, 0);
  }
  17.6470588235% {
    clip: rect(9px, 1084px, 1px, 0);
  }
  23.5294117647% {
    clip: rect(3px, 1084px, 6px, 0);
  }
  29.4117647059% {
    clip: rect(9px, 1084px, 15px, 0);
  }
  35.2941176471% {
    clip: rect(0px, 1084px, 1px, 0);
  }
  41.1764705882% {
    clip: rect(7px, 1084px, 9px, 0);
  }
  47.0588235294% {
    clip: rect(5px, 1084px, 5px, 0);
  }
  52.9411764706% {
    clip: rect(8px, 1084px, 14px, 0);
  }
  58.8235294118% {
    clip: rect(33px, 1084px, 0px, 0);
  }
  64.7058823529% {
    clip: rect(84px, 1084px, 8px, 0);
  }
  70.5882352941% {
    clip: rect(1px, 1084px, 9px, 0);
  }
  76.4705882353% {
    clip: rect(00px, 1084px, 8px, 0);
  }
  82.3529411765% {
    clip: rect(4px, 1084px, 9px, 0);
  }
  88.2352941176% {
    clip: rect(6px, 1084px, 22px, 0);
  }
  94.1176470588% {
    clip: rect(4px, 1084px, 20px, 0);
  }
  100% {
    clip: rect(4px, 1084px, 2px, 0);
  }
`

const GlitchAnimationTwo = keyframes`
   0% {
    clip: rect(9px, 1084px, 16px, 0);
  }
  5.8823529412% {
    clip: rect(5px, 1084px, 6px, 0);
  }
  11.7647058824% {
    clip: rect(8px, 1084px, 0px, 0);
  }
  17.6470588235% {
    clip: rect(9px, 1084px, 1px, 0);
  }
  23.5294117647% {
    clip: rect(0px, 1084px, 11px, 0);
  }
  29.4117647059% {
    clip: rect(14px, 1084px, 3px, 0);
  }
  35.2941176471% {
    clip: rect(7px, 1084px, 8px, 0);
  }
  41.1764705882% {
    clip: rect(11px, 1084px, 8px, 0);
  }
  47.0588235294% {
    clip: rect(2px, 1084px, 7px, 0);
  }
  52.9411764706% {
    clip: rect(8px, 1084px, 1px, 0);
  }
  58.8235294118% {
    clip: rect(2px, 1084px, 4px, 0);
  }
  64.7058823529% {
    clip: rect(6px, 1084px, 4px, 0);
  }
  70.5882352941% {
    clip: rect(9px, 1084px, 5px, 0);
  }
  76.4705882353% {
    clip: rect(8px, 1084px, 0px, 0);
  }
  82.3529411765% {
    clip: rect(5px, 1084px, 9px, 0);
  }
  88.2352941176% {
    clip: rect(4px, 1084px, 7px, 0);
  }
  94.1176470588% {
    clip: rect(18px, 1084px, 7px, 0);
  }
  100% {
    clip: rect(2px, 1084px, 8px, 0);
  }
`

const base = props => css`
  font-family: ${ props.theme.type.family.code };
  line-height: 1.6em;
  font-size: ${ props.theme.type.size.regular }em;
  color: ${ props.theme.color.dark.type.primary };
  font-weight: 200;
`

export const CodeWrapper = styled('div')`
   margin: 24px 32px;
   overflow: hidden;
   max-height: 316px;
`

export const Code = styled('code')`
  ${ base };
`

export const GlitchCss = css`
  &:before, 
  &:after {
    content: attr(data-text);
    left: -2px;
    width: 100%;
    position: absolute;
    background: #000;
    clip: rect(0, 0, 0, 0);
  }
  &:after {
    left: 2px;
    text-shadow: -1px 0 red, 0 -2px #00ff00;
    animation: ${ GlitchAnimationOne } 2s infinite linear alternate-reverse;
  }
  &:before {
    left: 4px;
    top: 2px;
    text-shadow: 2px 3px #00ff00, 4px 0 blue;
    animation: ${ GlitchAnimationTwo } 3s infinite linear alternate-reverse;
  }
`

export const CodeMark = styled('code')`
  ${ base };

  position: relative;
  ${ GlitchCss };
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



