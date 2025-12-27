import type { ReactNode } from 'react';

export interface Tool {
    id: string; // URL slug
    name: string;
    description: string;
    component?: ReactNode; // To be lazy loaded or assigned later
}

export interface ToolCategory {
    id: string;
    name: string;
    children: Tool[];
}

export const TOOLS: ToolCategory[] = [
    {
        id: "text",
        name: "Text",
        children: [
            { id: "markdown-editor", name: "Markdown Editor", description: "A complete markdown editor with tools" },
            { id: "text-case-converter", name: "Text Case Converter", description: "Convert text to various cases like camelCase, snake_case" },
            { id: "json-formatter", name: "JSON Formatter and Validator", description: "Format and validate JSON for readability" },
            { id: "text-encoder-decoder", name: "Text Encoder/Decoder", description: "Encode or decode Base64, URL, HTML entities" },
            { id: "uuid-generator", name: "UUID Generator", description: "Generate universally unique identifiers" },
            { id: "regex-tester", name: "Regex Tester", description: "Test and debug regular expressions" }
        ]
    },
    {
        id: "code",
        name: "Code",
        children: [
            { id: "code-minifier", name: "Code Minifier", description: "Minify CSS, JavaScript, and HTML files" },
            { id: "code-beautifier", name: "Code Beautifier/Prettifier", description: "Prettify code for multiple languages" },
            { id: "hash-generator", name: "Hash Generator", description: "Generate MD5, SHA-1, SHA-256 hashes" },
            { id: "jwt-decoder", name: "JWT Decoder", description: "Decode and analyze JSON Web Tokens" },
            { id: "code-diff-checker", name: "Code Diff Checker", description: "Highlight changes between code files" }
        ]
    },
    {
        id: "image",
        name: "Image",
        children: [
            { id: "image-optimizer", name: "Image Optimizer", description: "Compress and optimize images for web use" },
            { id: "image-resizer", name: "Image Resizer and Cropper", description: "Resize or crop images to specific dimensions" },
            { id: "icon-generator", name: "Icon Generator", description: "Convert images to various icon formats" },
            { id: "color-picker", name: "Color Picker", description: "Select colors and get HEX/RGB values" },
            { id: "color-palette", name: "Color Palette Generator", description: "Generate color palettes from an image" }
        ]
    },
    {
        id: "productivity",
        name: "Productivity",
        children: [
            { id: "random-data", name: "Random Data Generator", description: "Generate random data for testing, like names, emails, addresses" },
            { id: "csv-converter", name: "CSV to JSON/Excel Converter", description: "Convert CSV files to JSON or Excel format" },
            { id: "lorem-ipsum", name: "Lorem Ipsum Generator", description: "Generate placeholder text" },
            { id: "dependency-checker", name: "Dependency Version Checker", description: "Check the latest versions of popular libraries" },
            { id: "task-matrix", name: "Task Prioritization Matrix", description: "Sort tasks by urgency and importance" },
            { id: "timezone-converter", name: "Time Zone Converter", description: "Compare time zones easily" },
            { id: "countdown-timer", name: "Countdown Timer", description: "Set custom countdowns for tasks" },
            { id: "habit-tracker", name: "Habit Tracker", description: "Log daily activities or goals" },
            { id: "stopwatch", name: "Stopwatch", description: "Track time for tasks in real-time" },
            { id: "calendar-scheduler", name: "Calendar Events Scheduler", description: "Plan and set reminders for events" }
        ]
    },
    {
        id: "data",
        name: "Data",
        children: [
            { id: "unit-converter", name: "Unit Converter", description: "Convert units of measure (length, weight, volume, etc.)" },
            { id: "math-evaluator", name: "Math Expression Evaluator", description: "Calculate complex math expressions" },
            { id: "base-converter", name: "Binary/Hexadecimal Converter", description: "Convert numbers between decimal, binary, and hexadecimal" },
            { id: "statistical-calc", name: "Statistical Calculator", description: "Calculate mean, median, mode, and standard deviation" }
        ]
    },
    {
        id: "networking",
        name: "Networking",
        children: [
            { id: "rest-client", name: "REST Client", description: "Test API endpoints by sending HTTP requests" },
            { id: "http-headers", name: "HTTP Headers Checker", description: "Check HTTP headers for troubleshooting" },
            { id: "ip-lookup", name: "IP Address Lookup", description: "Find details about IP addresses" },
            { id: "port-scanner", name: "Port Scanner", description: "Check open ports for diagnostics" },
            { id: "dns-lookup", name: "DNS Lookup", description: "Check DNS records for a domain" },
            { id: "ping-tool", name: "Ping Tool", description: "Test connectivity to servers or websites" }
        ]
    },
    {
        id: "security",
        name: "Security",
        children: [
            { id: "password-generator", name: "Password Generator", description: "Generate strong, random passwords" },
            { id: "encryption-tool", name: "Encryption/Decryption Tool", description: "Encrypt or decrypt text with a given key" },
            { id: "ssl-checker", name: "SSL Certificate Checker", description: "Verify SSL certificate details for a domain" },
            { id: "data-sanitizer", name: "Data Sanitizer", description: "Clean sensitive information from text or data files" }
        ]
    }
];
