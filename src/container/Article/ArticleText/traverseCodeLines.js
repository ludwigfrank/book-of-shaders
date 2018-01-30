import data from './data.json'

const traverseData = () => {
    const nodes = data.document.nodes

    const d = nodes.reduce((acc, cur, ind, arr) => {
        if (cur.type === 'code') {
            // find all code lines and split them on an array
            const codeLines = cur.nodes[0].leaves[0].text.split('\n')
            cur.nodes = codeLines.reduce((acc, cur, ind, arr) => {
                const construct = {
                    "object": "block",
                    "type": "code-line",
                    "nodes": [
                        {
                            "object": "text",
                            "leaves": [
                                {
                                    "text": cur
                                }
                            ]
                        }
                    ]
                }

                return [...acc, construct]

            }, [])
        }

        return [ ...acc, cur ]
    }, [])

    data.document.nodes = d
    return data
}

export default traverseData

