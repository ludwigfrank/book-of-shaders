import { Editor } from 'slate-react'
import { Value } from 'slate'
import Prism  from 'prismjs'
import 'prismjs/components/prism-glsl'
import React from 'react'
import traverseData from './traverseCodeLines'
import 'prismjs/plugins/line-numbers/prism-line-numbers'

import styled, { css } from 'react-emotion'
import { CodeWrapper, Code, CodeMark, CodeCommentMark, CodeKeywordMark, CodeNumberMark, CodePunctuationMark } from './styles/code/index'

const textBase = props => css`
  font-family: ${ props.theme.type.family.secondary };
  line-height: 1.6em;
  color: ${ props.theme.color.light.type.primary };
`

const StyledEditor = styled('div')`
  margin: 0 80px;
  padding-bottom: 30vh;
`

const Paragraph = styled('div')`
  ${ textBase };
  font-size: ${props => props.theme.type.size.regular}em;
  opacity: 0.9;
  font-weight: 400;
`

const H1 = styled('h1')`
  ${ textBase };
  ${ props => console.log(props.theme.type.size.huge)};
  font-size: ${props => props.theme.type.size.huge}em;
`

const H2 = styled('h2')`
  ${ textBase };
  font-size: ${props => props.theme.type.size.big}em;
  font-weight: 100;
  margin-bottom: 0.5em;
  margin-top: 1.5em;
`

const H3 = styled('h3')`
  ${ textBase };
  font-weight: 100;
  font-size: ${props => props.theme.type.size.medium}em;
  margin-bottom: 0.5em;
  margin-top: 1.5em;
`

const H4 = styled('h4')`
  ${ textBase };
  font-size: ${props => props.theme.type.size.regular}em;
  margin-top: 1em;
  margin-bottom: 0em;
`

/*const Image = styled('img')`
  max-width: 100%;
  border-radius: 2px;
  // box-shadow: ${ props => props.theme.shadows[8] };
`

const FigureCaption = styled('figcaption')`
  ${ textBase };
  font-size: ${props => props.theme.type.size.tiny}em;
  color:${props => props.theme.color.light.type.disabled};
  font-weight: ${props => props.theme.type.weight.medium};
  font-style: italic;
  letter-spacing: 0.2px;
  text-align: center;
  margin-top: 8px;
`

const Figure = styled('figure')`
  ${ textBase };
`*/


/**
 * Define our code components.
 *
 * @param {Object} props
 * @return {Element}
 */

function CodeBlock(props) {
    const { editor, node } = props

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
        <div {...props.attributes}>{props.children}</div>
    )
}

/**
 * The pasting html example.
 *
 * @type {Component}
 */

class ArticleText extends React.Component {

    /**
     * Deserialize the raw initial value.
     *
     * @type {Object}
     */

    state = {
        value: Value.fromJSON(traverseData()),
    }

    /**
     * On change, save the new value.
     *
     * @param {Change} change
     */

    onChange = ({ value }) => {
        this.setState({ value })
    }

    /**
     * Render.
     *
     * @return {Component}
     */

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
     * @return {Element}
     */

    renderNode = (props) => {
        const { attributes, children, node, isSelected } = props
        switch (node.type) {
            case 'paragraph': return <Paragraph {...attributes}>{children}</Paragraph>
            case 'quote': return <blockquote {...attributes}>{children}</blockquote>
            case 'code': return <CodeBlock {...props} />
            case 'code-line': return <CodeBlockLine {...props} />
            case 'bulleted-list': return <ul {...attributes}>{children}</ul>
            case 'heading-one': return <H1 {...attributes}>{children}</H1>
            case 'heading-two': return <H2 {...attributes}>{children}</H2>
            case 'heading-three': return <H3 {...attributes}>{children}</H3>
            case 'heading-four': return <H4 {...attributes}>{children}</H4>
            case 'heading-five': return <h5 {...attributes}>{children}</h5>
            case 'heading-six': return <h6 {...attributes}>{children}</h6>
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
     * @return {Element}
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

export default ArticleText