import ItemBatch from "@hephaestus-technologies/eve-entities/dist/general/item-batch";
import Activity from "@hephaestus-technologies/eve-entities/dist/manufacturing/activity";
import Blueprint from "@hephaestus-technologies/eve-entities/dist/manufacturing/blueprint";
import ItemBatchRecord from "./item-batch-record";
import SkillReqRecord from "./skill-req-record";

export interface ActivityRecord {

    products: ItemBatchRecord[] | null;

    materials: ItemBatchRecord[] | null;

    skills: SkillReqRecord[] | null;

    time: number;

}

export interface BlueprintRecord {

    activities: {
        copying: ActivityRecord | null,
        manufacturing: ActivityRecord | null,
        invention: ActivityRecord | null,
        reaction: ActivityRecord | null,
        research_material: ActivityRecord | null,
        research_time: ActivityRecord | null
    };

    blueprintTypeID: number;

    maxProductionLimit: number;

}

export const toBlueprintEntity = (blueprintId, record: BlueprintRecord): Blueprint => {
    return {
        blueprintId: Number(blueprintId),
        manufacturing: toActivityEntity(record.activities.manufacturing),
        materialResearch: toActivityEntity(record.activities.research_material),
        timeResearch: toActivityEntity(record.activities.research_time),
        copying: toActivityEntity(record.activities.copying),
        invention: toActivityEntity(record.activities.invention)
    };
};

export const toReactionEntity = (record: BlueprintRecord): Activity => {
    const reaction = record.activities.reaction;
    return toActivityEntity(reaction);
};

const toActivityEntity = (record: ActivityRecord): Activity => {
    if (!record) return null;
    return {
        product: record.products ? toItemBatch(record.products[0]) : null,
        materials: record.materials ? record.materials.map(toItemBatch) : [],
        skills: record.skills || [],
        time: record.time
    };
}

const toItemBatch = (record: ItemBatchRecord): ItemBatch => {
    return {
        typeId: record.typeID,
        quantity: record.quantity
    };
}
