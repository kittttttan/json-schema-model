import { parseSchema } from './schema';
import { substringBefore } from './substring-before';

export function toPhpModel(json: any, namespace: string | null = null): string {
    const typeMap = new Map([
        ['integer', 'int'],
        ['boolean', 'bool'],
        ['number', 'float'],
    ]);

    const schema = parseSchema(json);

    let s = `
<?php
declare(strict_types=1);

`;
    if (namespace) {
        s += `namespace ${namespace};\n\n`;
    }
    s += `/**\n`;
    const commentPrefix = ' * ';
    if (schema.title ?? null) {
        s += `${commentPrefix}${schema.title}\n`;
    }
    if (schema.description ?? null) {
        s += `${commentPrefix}${schema.description}\n`;
    }

    for (const property of schema.properties) {
        const type = getType(property, typeMap);
        s += `${commentPrefix}@property ${type} $${property.key} ${property.description ?? ''}\n`;
    }

    s += ` */\n`;
    const className = substringBefore(schema.$id, '.');
    s += `class ${className}\n{\n`;

    const classPrefix = `    `;
    for (const property of schema.properties) {
        const type = getType(property, typeMap);
        s += `${classPrefix}public ${type} $${property.key};\n`;
    }

    s += '}';

    return s;
}

function getType(property: Property, typeMap: Map<string, string>): string {
    if (property.$ref) {
        return substringBefore(property.$ref, '.');
    }

    if (property.anyOf && property.anyOf.length) {
        return property.anyOf.flatMap((type: string) => {
            const t = typeMap.get(type) ?? type;
            return t ? t : [];
        }).join('|');
    }

    return typeMap.get(property.type) ?? property.type;
}