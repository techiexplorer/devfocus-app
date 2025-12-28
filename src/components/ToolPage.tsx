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
import { ColorPicker } from './tools/image/ColorPicker';
import { ImageResizer } from './tools/image/ImageResizer';
import { LoremIpsumGenerator } from './tools/productivity/LoremIpsumGenerator';
import { Stopwatch } from './tools/productivity/Stopwatch';
import { CountdownTimer } from './tools/productivity/CountdownTimer';
import { TaskMatrix } from './tools/productivity/TaskMatrix';
import { RandomDataGenerator } from './tools/productivity/RandomDataGenerator';
import { CsvConverter } from './tools/productivity/CsvConverter';
import { TimezoneConverter } from './tools/productivity/TimezoneConverter';
import { HabitTracker } from './tools/productivity/HabitTracker';
import { UnitConverter } from './tools/data/UnitConverter';
import { MathEvaluator } from './tools/data/MathEvaluator';
import { BaseConverter } from './tools/data/BaseConverter';
import { StatisticalCalculator } from './tools/data/StatisticalCalculator';
import { PasswordGenerator } from './tools/security/PasswordGenerator';
import { EncryptionTool } from './tools/security/EncryptionTool';
import { DataSanitizer } from './tools/security/DataSanitizer';
import { RestClient } from './tools/networking/RestClient';
import { IpLookup } from './tools/networking/IpLookup';
import { ImageOptimizer } from './tools/image/ImageOptimizer';
import { IconGenerator } from './tools/image/IconGenerator';
import { ColorPaletteGenerator } from './tools/image/ColorPaletteGenerator';

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
            case 'color-picker':
                return <ColorPicker tool={tool} />;
            case 'image-resizer':
                return <ImageResizer tool={tool} />;
            case 'lorem-ipsum':
                return <LoremIpsumGenerator tool={tool} />;
            case 'stopwatch':
                return <Stopwatch tool={tool} />;
            case 'countdown-timer':
                return <CountdownTimer tool={tool} />;
            case 'task-matrix':
                return <TaskMatrix tool={tool} />;
            case 'random-data':
                return <RandomDataGenerator tool={tool} />;
            case 'csv-converter':
                return <CsvConverter tool={tool} />;
            case 'timezone-converter':
                return <TimezoneConverter tool={tool} />;
            case 'habit-tracker':
                return <HabitTracker tool={tool} />;
            case 'unit-converter':
                return <UnitConverter tool={tool} />;
            case 'math-evaluator':
                return <MathEvaluator tool={tool} />;
            case 'base-converter':
                return <BaseConverter tool={tool} />;
            case 'statistical-calc':
                return <StatisticalCalculator tool={tool} />;
            case 'password-generator':
                return <PasswordGenerator tool={tool} />;
            case 'encryption-tool':
                return <EncryptionTool tool={tool} />;
            case 'data-sanitizer':
                return <DataSanitizer tool={tool} />;
            case 'rest-client':
                return <RestClient tool={tool} />;
            case 'ip-lookup':
                return <IpLookup tool={tool} />;
            case 'image-optimizer':
                return <ImageOptimizer tool={tool} />;
            case 'icon-generator':
                return <IconGenerator tool={tool} />;
            case 'color-palette':
                return <ColorPaletteGenerator tool={tool} />;
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
