type Property = {
    $ref: string|null;
    anyOf: any[];
    type: string;
    key: string;
    description: string|null;
}

type Schema = {
    $id: string;
    title: string|null;
    description: string|null;
    properties: Property[];
}