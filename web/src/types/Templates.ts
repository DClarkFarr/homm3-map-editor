export type Template = {
    id: number;
    name: string;
};

export type ParsedTemplateBlock = Record<number, string>[];

export type ParsedTemplate = {
    headers: string[];
    categories: string[];
    labels: string[];
    blocks: ParsedTemplateBlock[];
};
