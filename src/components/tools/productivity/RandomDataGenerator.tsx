import { useState } from 'react';
import { ToolShell } from '../../shared/ToolShell';
import type { Tool } from '../../../config/tools';
import { faker } from '@faker-js/faker';
import { Button } from "@/components/ui/button";
import { Copy, RefreshCw, Check } from 'lucide-react';

type DataType = 'user' | 'ecommerce' | 'address' | 'company';

export function RandomDataGenerator({ tool }: { tool: Tool }) {
    const [type, setType] = useState<DataType>('user');
    const [count, setCount] = useState(5);
    const [data, setData] = useState<any[]>([]);
    const [copied, setCopied] = useState(false);

    const generate = () => {
        const newData = [];
        for (let i = 0; i < count; i++) {
            if (type === 'user') {
                newData.push({
                    id: faker.string.uuid(),
                    firstName: faker.person.firstName(),
                    lastName: faker.person.lastName(),
                    email: faker.internet.email(),
                    avatar: faker.image.avatar(),
                });
            } else if (type === 'ecommerce') {
                newData.push({
                    id: faker.string.uuid(),
                    productName: faker.commerce.productName(),
                    price: faker.commerce.price(),
                    department: faker.commerce.department(),
                    description: faker.commerce.productDescription(),
                });
            } else if (type === 'address') {
                newData.push({
                    street: faker.location.streetAddress(),
                    city: faker.location.city(),
                    state: faker.location.state(),
                    country: faker.location.country(),
                    zipCode: faker.location.zipCode(),
                });
            } else if (type === 'company') {
                newData.push({
                    name: faker.company.name(),
                    catchPhrase: faker.company.catchPhrase(),
                    bs: faker.company.buzzPhrase(),
                    website: faker.internet.url(),
                });
            }
        }
        setData(newData);
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(JSON.stringify(data, null, 2));
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <ToolShell title={tool.name} description={tool.description}>
            <div className="flex flex-col gap-6 h-[700px]">
                <div className="flex flex-wrap items-center gap-4 bg-card p-4 rounded-lg border">
                    <div className="flex items-center gap-2">
                        <label className="text-sm font-medium whitespace-nowrap">Type:</label>
                        <select
                            value={type}
                            onChange={(e) => setType(e.target.value as DataType)}
                            className="bg-background border border-input rounded-md px-3 py-1.5 text-sm"
                        >
                            <option value="user">Users</option>
                            <option value="ecommerce">E-commerce</option>
                            <option value="address">Addresses</option>
                            <option value="company">Companies</option>
                        </select>
                    </div>

                    <div className="flex items-center gap-2">
                        <label className="text-sm font-medium whitespace-nowrap">Count:</label>
                        <input
                            type="number"
                            min="1"
                            max="100"
                            value={count}
                            onChange={(e) => setCount(parseInt(e.target.value))}
                            className="w-20 bg-background border border-input rounded-md px-3 py-1.5 text-sm"
                        />
                    </div>

                    <Button onClick={generate} size="sm" className="gap-2">
                        <RefreshCw className="w-4 h-4" /> Generate
                    </Button>

                    <div className="flex-1" />

                    {data.length > 0 && (
                        <Button variant="outline" size="sm" onClick={copyToClipboard} className="gap-2">
                            {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                            {copied ? 'Copied' : 'Copy JSON'}
                        </Button>
                    )}
                </div>

                <div className="flex-1 overflow-auto rounded-lg border bg-muted/20 p-4">
                    {data.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-muted-foreground opacity-50">
                            <p>Generate some data to see it here</p>
                        </div>
                    ) : (
                        <pre className="font-mono text-xs whitespace-pre-wrap">{JSON.stringify(data, null, 2)}</pre>
                    )}
                </div>
            </div>
        </ToolShell>
    );
}
