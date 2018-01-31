import { Editor } from 'slate-react'
import { Value } from 'slate'
import Prism  from 'prismjs'
import 'prismjs/components/prism-glsl'
import React, { Component } from 'react'
import 'prismjs/plugins/line-numbers/prism-line-numbers'
import { CodeWrapper, Code, CodeCommentMark, CodeKeywordMark, CodeNumberMark, CodePunctuationMark, base } from '../../theme/styles/code'
import styled from 'react-emotion'
import CodeCanvas from './CodeCanvas'
import Typography from '../../components/Typography'


import codeChallengeNoise from '../Terminal/TerminalText/challenge-noise.json'
import codeChallengeColor from '../Terminal/TerminalText/challenge-color.json'
import codeChallengeResolved from '../Terminal/TerminalText/challenge-resolved.json'
import { css } from 'emotion'


/**
 * Define our code components.
 *
 * @param {Object} props
 * @return {Element}
 */

const StyledEditor = styled('div')`
  width: calc(50% - 64px);
  height: 100%;
  position: absolute;
  overflow-y: scroll;
  overflow-x: hidden;
  left: 64px;
  top: 63px;
`

const CodeLine = styled('div')`
  margin-left: 80px;
`


function CodeBlock(props) {


    return (
        <CodeWrapper>
            <pre>
                <Code {...props.attributes}>{props.children}</Code>
            </pre>
        </CodeWrapper>
    )
}

function CodeBlockLine(props) {
    const { editor, node } = props

    return (
        <div style={{ position: 'relative' }} >
            <CodeLine {...props.attributes} >{props.children}</CodeLine>
        </div>
    )
}

const CodeLineWrapper = styled('div')`
  position:absolute;
  top: 56px;
  left: 32px;
  opacity: 0.4;
`

const CodeLineNumber = styled('div')`
  ${ base };
  display: block;
  text-align: right;
  opacity: 0.5;
`

const LineNumbers = ( { size } ) => {
    const codeLines = []
    for ( let i = 0; i < size; i++ ) {
        codeLines.push(
            <CodeLineNumber key={ i }>
                { i < 10 ? "0" + i : i }
            </CodeLineNumber>
        )
    }

    return (
        <CodeLineWrapper>
            { codeLines }
        </CodeLineWrapper>
    )
}

const TabsWrapper = styled('div')`
  width: 100%;
  height: 24px;
  display: flex;
  align-content: center;
  justify-content: space-around;
  border-bottom: 1px solid rgba(99,114,130,0.16);
  & :not(:last-child) { 
    border-right: 1px solid rgba(99,114,130,0.16);
  }
`

const Tab = styled('div')`
  flex: 1;
  justify-content: center;
  align-content: center;
  box-sizing: border-box;
  margin: 1px;
  cursor:crosshair;
  background-color: ${ props => props.activeFile === props.index ? 'rgba(255, 255, 255, 1)' : 'rgba(255, 255, 255, 0)' };
  & > span {
    line-height: 23px;
    ${ props => props.activeFile === props.index && css`color: #1F1F21` };
  }
`

const Tabs = ({ files, activeFile, onClick }) => {

    const tabs = files.map((file, index) => {
        return (
            <Tab activeFile={ activeFile } index={ index } key={file.name} onClick={ () => onClick( index )}>
                <Typography
                            type='caption'
                            size='tiny'
                            align='center'
                            tt='lowercase'
                            color='secondary'
                            weight='medium'>
                    { file.name }
                </Typography>
            </Tab>
        )
    })

    return (
        <TabsWrapper>
            { tabs }
        </TabsWrapper>
    )
}

class CodeEditor extends Component {

    /**
     * Deserialize the raw initial value.
     *
     * @type {Object}
     */

    state = {
        value: Value.fromJSON(codeChallengeNoise),
        files: [
            { name: 'sketch.frag', value: codeChallengeNoise },
            { name: 'color-basics.frag', value: codeChallengeColor },
        ],
        activeFile: 0
    }


    /**
     * On change, save the new value.
     *
     * @param {Change} change
     */

    onChange = ( { value } ) => {
        this.setState({ value })
    }

    handleTabClick = ( index ) => {

        this.setState({
            activeFile: index,
            value: Value.fromJSON( this.state.files[index].value )
        })
    }

    /**
     * Render.
     *
     * @return {Component}
     */

    render() {
        const { files, activeFile } = this.state
        const size = this.state.value.document.getBlocks().size


        return (
            <div>
                <StyledEditor>
                    <Tabs files={ files } activeFile={ activeFile } onClick={ this.handleTabClick }/>
                    <LineNumbers size={size}/>
                    <Editor
                        placeholder="Paste in some HTML..."
                        value={this.state.value}
                        onPaste={this.onPaste}
                        onChange={this.onChange}
                        renderNode={this.renderNode}
                        renderMark={this.renderMark}
                        decorateNode={this.decorateNode}
                    />
                </StyledEditor>
            </div>
        )
    }

    /**
     * Render a Slate node.
     *
     * @param {Object} props
     * @return {Element}
     */

    renderNode = (props) => {
        const { attributes, children, node, isSelected } = props
        switch (node.type) {
            case 'code': return <CodeBlock {...props} />
            case 'code-line': return <CodeBlockLine {...props} />
        }
    }

    /**
     * Render a Slate mark.
     *
     * @param {Object} props
     * @return {Element}
     */

    renderMark = (props) => {
        const { children, mark } = props
        switch (mark.type) {
            case 'bold': return <strong>{children}</strong>
            case 'italic': return <em>{children}</em>
            case 'underlined': return <u>{children}</u>
            case 'comment': return <CodeCommentMark>{children}</CodeCommentMark>
            case 'number': return <CodeNumberMark>{children}</CodeNumberMark>
            case 'keyword': return <CodeKeywordMark >{children}</CodeKeywordMark>
            case 'tag': return <span style={{ fontWeight: 'bold' }}>{children}</span>
            case 'punctuation': return <CodePunctuationMark>{children}</CodePunctuationMark>
        }
    }

    tokenToContent = (token) => {
        if (typeof token == 'string') {
            return token
        } else if (typeof token.content == 'string') {
            return token.content
        } else {
            return token.content.map(this.tokenToContent).join('')
        }
    }


    /**
     * Decorate code blocks with Prism.js highlighting.
     *
     * @param {Node} node
     * @return {Array}
     */

    decorateNode = (node) => {
        if (node.type !== 'code') return

        const language = node.data.get('language')
        const texts = node.getTexts().toArray()

        let string = texts.map(t => t.text).join('\n')
        const grammar = Prism.languages['glsl']
        const tokens = Prism.tokenize(string, grammar)
        const decorations = []
        let startText = texts.shift()
        let endText = startText
        let startOffset = 0
        let endOffset = 0
        let start = 0

        for (const token of tokens) {
            startText = endText
            startOffset = endOffset

            const content = this.tokenToContent(token)
            const newlines = content.split('\n').length - 1
            const length = content.length - newlines
            const end = start + length

            let available = startText.text.length - startOffset
            let remaining = length

            endOffset = startOffset + remaining

            while (available < remaining && texts.length > 0) {
                endText = texts.shift()
                remaining = length - available
                available = endText.text.length
                endOffset = remaining
            }

            if (typeof token !== 'string') {
                const range = {
                    anchorKey: startText.key,
                    anchorOffset: startOffset,
                    focusKey: endText.key,
                    focusOffset: endOffset,
                    marks: [{ type: token.type }],
                }

                decorations.push(range)
            }

            start = end
        }

        return decorations
    }


}

/**
 * Export.
 */

export default CodeEditor