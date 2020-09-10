export class LanguageStrings {
    en: string;
}

export class Group {
    groupID: number;
    categoryID: number;
}

export class ItemType {
    id: number;
    name: LanguageStrings;
    description: LanguageStrings;
    groupID: number;
    iconID: number;
    volume: number;
}

export function raw(...names: string[]): Promise<any>;
export function types(): Promise<any>;
export function icons(): Promise<any>;
export function blueprints(): Promise<any>;
export function certificates(): Promise<any>;
export function graphics(): Promise<any>;
export function groups(): Promise<any>;
export function skinMaterials(): Promise<any>;
export function skinLicenses(): Promise<any>;
export function skins(): Promise<any>;
export function landmarks(): Promise<any>;
export function region(name: string): Promise<any>;
export function lookup(name: string, lang): Promise<ItemType>;
export function lookupById(id: number): Promise<ItemType>;
export function typesForCategory(category: number): Promise<ItemType[]>;
