export type Template = {
    id: number;
    name: string;
};

export type ParsedTemplateBlock = string[];

export type ParsedTemplate = {
    headers: string[];
    categories: string[];
    labels: string[];
    blocks: ParsedTemplateBlock[];
};
