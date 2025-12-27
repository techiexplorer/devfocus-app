import { useParams, Navigate } from 'react-router-dom';
import { TOOLS } from '../config/tools';
import type { ToolCategory, Tool } from '../config/tools';
import { UUIDGenerator } from './tools/text/UUIDGenerator';
import { TextCaseConverter } from './tools/text/TextCaseConverter';
import { JsonFormatter } from './tools/text/JsonFormatter';
import { TextEncoderDecoder } from './tools/text/TextEncoderDecoder';

import { MarkdownEditor } from './tools/text/MarkdownEditor';
import { RegexTester } from './tools/text/RegexTester';
import { HashGenerator } from './tools/code/HashGenerator';
import { JwtDecoder } from './tools/code/JwtDecoder';
import { CodeDiffChecker } from './tools/code/CodeDiffChecker';
import { CodeMinifier } from './tools/code/CodeMinifier';
import { CodeBeautifier } from './tools/code/CodeBeautifier';

export function ToolPage() {
    const { id } = useParams();

    // Flatten tools to find by ID
    const tool = TOOLS.flatMap((c: ToolCategory) => c.children).find((t: Tool) => t.id === id);

    if (!tool) {
        return <Navigate to="/" replace />;
    }

    const renderTool = () => {
        switch (tool.id) {
            case 'uuid-generator':
                return <UUIDGenerator tool={tool} />;
            case 'text-case-converter':
                return <TextCaseConverter tool={tool} />;
            case 'json-formatter':
                return <JsonFormatter tool={tool} />;
            case 'text-encoder-decoder':
                return <TextEncoderDecoder tool={tool} />;
            case 'markdown-editor':
                return <MarkdownEditor tool={tool} />;
            case 'regex-tester':
                return <RegexTester tool={tool} />;
            case 'hash-generator':
                return <HashGenerator tool={tool} />;
            case 'jwt-decoder':
                return <JwtDecoder tool={tool} />;
            case 'code-diff-checker':
                return <CodeDiffChecker tool={tool} />;
            case 'code-minifier':
                return <CodeMinifier tool={tool} />;
            case 'code-beautifier':
                return <CodeBeautifier tool={tool} />;
            default:
                return (
                    <div style={{ textAlign: 'center', padding: '4rem' }}>
                        <h2>{tool.name}</h2>
                        <p>Coming soon...</p>
                    </div>
                );
        }
    };

    return renderTool();
}
