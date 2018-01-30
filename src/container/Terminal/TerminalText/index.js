import { Editor } from 'slate-react'
import { Value } from 'slate'
import Prism  from 'prismjs'
import 'prismjs/components/prism-glsl'
import React, { Component } from 'react'
import 'prismjs/plugins/line-numbers/prism-line-numbers'
import initialValue from './data.json'

import styled from 'react-emotion'
import { CodeWrapper, Code, CodeMark, CodeCommentMark, CodeKeywordMark, CodeNumberMark, CodePunctuationMark, GlitchCss } from './styles/code/index'

const StyledEditor = styled('div')`

`


/**
 * Define our code components.
 *
 * @param {Object} props
 * @return {Element}
 */

function CodeBlock(props) {
    const { editor, node } = props
    const language = node.data.get('language')

    /*
        function onChange(event) {
            editor.change(c => c.setNodeByKey(node.key, { data: { language: event.target.value }}))
        }
    */

    return (
        <CodeWrapper>
            <pre>
                <Code {...props.attributes}>{props.children}</Code>
            </pre>
        </CodeWrapper>
    )
}

function CodeBlockLine(props) {
    return (
        <div contentEditable={false} {...props.attributes}>{props.children}</div>
    )
}

function CodeBlockLineEditable(props) {
    return (
        <div style={{marginTop: "4px", marginBottom: "4px"}} {...props.attributes}>{props.children}</div>
    )
}

/**
 * The pasting html example.
 *
 * @type {Component}
 */

class TerminalText extends Component {

    /**
     * Deserialize the raw initial value.
     *
     * @type {Object}
     */

    state = {
        value: Value.fromJSON(initialValue),
        codeNode: null
    }

    /**
     * On change, save the new value.
     *
     * @param {Change} change
     */

    onChange = ({value}) => {
        this.setState({ value })
    }

    componentWillReceiveProps ({ isShown }, nextContext) {
        if ( isShown ) this.toggleFocus()
    }

    toggleFocus = () => {
        /*event.preventDefault()
        const { value } = this.state
        const change = value.change()
            .collapseToStart(node)
        this.onChange(change)*/
    }

    render() {

        return (
            <StyledEditor>
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
        )
    }

    /**
     * Render a Slate node.
     *
     * @param {Object} props
     * @return {XML}
     */

    renderNode = (props) => {
        const { attributes, children, node, isSelected } = props
        switch (node.type) {
            case 'paragraph': return <CodeBlockLine {...attributes}>{children}</CodeBlockLine>
            case 'quote': return <blockquote {...attributes}>{children}</blockquote>
            case 'code': return <CodeBlock {...props} />
            case 'code-line': return <CodeBlockLine {...props} />
            case 'code-line-editable': return <CodeBlockLineEditable {...props} />
            case 'list-item': return <li {...attributes}>{children}</li>
            case 'numbered-list': return <ol {...attributes}>{children}</ol>
            case 'link': {
                const { data } = node
                const href = data.get('href')
                return <a href={href} {...attributes}>{children}</a>
            }
        }
    }

    /**
     * Render a Slate mark.
     *
     * @param {Object} props
     * @return {XML}
     */

    renderMark = (props) => {
        const { children, mark } = props
        switch (mark.type) {
            case 'bold': return <strong>{children}</strong>
            case 'code': return <CodeMark data-text={children}>{children}</CodeMark>
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
        if (typeof token === 'string') {
            return token
        } else if (typeof token.content === 'string') {
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

export default TerminalText