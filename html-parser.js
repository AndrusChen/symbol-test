
function parseHTML(html) {
    const stack = [];
    const root = { children: [] };
    let currentNode = root;

    let i = 0;
    while (i < html.length) {
        if (html[i] === '<') {
            const tagStart = i;
            i++;
            if (html[i] === '/') {
              
                i++;
                const tagEnd = html.indexOf('>', i);
                const tagName = html.substring(i, tagEnd);
                if (stack.length > 0 && stack[stack.length - 1].tag === tagName) {
                    stack.pop();
                    currentNode = stack.length > 0 ? stack[stack.length - 1] : root;
                }
                i = tagEnd + 1;
            } else {
                const tagEnd = html.indexOf('>', i);
                const tagContent = html.substring(i, tagEnd);
                const tagParts = tagContent.split(' ');
                const tagName = tagParts[0];
                const tagAttributes = {};
                for (let j = 1; j < tagParts.length; j++) {
                    const attrParts = tagParts[j].split('=');
                    if (attrParts.length === 2) {
                        const attrName = attrParts[0];
                        const attrValue = attrParts[1].replace(/['"]/g, '');
                        tagAttributes[attrName] = attrValue;
                    }
                }

                const newNode = {
                    tag: tagName,
                    attributes: tagAttributes,
                    children: [],
                };

                currentNode.children.push(newNode);

                if (!tagContent.endsWith('/')) {
                    stack.push(newNode);
                    currentNode = newNode;
                }

                i = tagEnd + 1;
            }
        } else {
            const textEnd = html.indexOf('<', i);
            if (textEnd === -1) {
                break;
            }
            const textContent = html.substring(i, textEnd).trim();
            if (textContent.length > 0) {
                currentNode.children.push({ text: textContent });
            }
            i = textEnd;
        }
    }

    return root.children[0];
}


if (typeof window === 'undefined' && process.argv.length === 3) {
    const fs = require('fs');
    const filePath = process.argv[2];
    const html = fs.readFileSync(filePath, 'utf-8');
    const result = parseHTML(html);
    console.log(JSON.stringify(result, null, 2));
}


if (typeof window !== 'undefined') {
    const textarea = document.getElementById('htmlInput');
    const resultDiv = document.getElementById('result');

    function updateResult() {
        const html = textarea.value;
        const result = parseHTML(html);
        resultDiv.textContent = JSON.stringify(result, null, 2);
    }

    textarea.addEventListener('input', updateResult);
    updateResult();
}
