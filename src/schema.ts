export function parseSchema(json: any): Schema {
    const schema: Schema = {
        $id: json.$id,
        title: json.title,
        description: json.description,
        properties: [],
    };
    for (const key in json.properties) {
        const property = json.properties[key];
        const $ref = property.$ref;
        const anyOf = property.anyOf?.map((p: Property) => p.type) ?? [];
        const type = property.type;
        const description = property.description;

        const p: Property = {
            $ref,
            anyOf,
            type,
            key,
            description,
        };
        schema.properties.push(p);
    }

    return schema;
}
