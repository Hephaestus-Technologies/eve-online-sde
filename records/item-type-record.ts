import {BlueprintGroup} from "@hephaestus-technologies/eve-entities/dist/general/blueprint-group";
import ItemType, {Group} from "@hephaestus-technologies/eve-entities/dist/general/item-type";
import {ManufacturingGroup} from "@hephaestus-technologies/eve-entities/dist/general/manufacturing-group";
import {PiGroup} from "@hephaestus-technologies/eve-entities/dist/general/pi-group";
import {ReactionGroup} from "@hephaestus-technologies/eve-entities/dist/general/reaction-group";
import {NameRecord} from "./name-record";

export interface ItemTypeRecord {

    entityID: number;

    name: NameRecord;

    groupID: number;

}

export const toItemTypeEntity = (record: ItemTypeRecord): ItemType => {
    const group = toGroup(record.groupID);
    return {
        typeId: record.entityID,
        name: record.name.en,
        group,
        subgroup: toSubgroup(group, record.groupID)
    };
};

const toGroup = (groupId: number): ManufacturingGroup  => {
    if ([18, 422, 423].includes(groupId))
        return ManufacturingGroup.MINERALS;
    if ([1034, 1040, 1041, 1042].includes(groupId))
        return ManufacturingGroup.PI;
    if ([427, 428, 429].includes(groupId))
        return ManufacturingGroup.REACTION;
    if ([754].includes(groupId))
        return ManufacturingGroup.SALVAGE;
    return ManufacturingGroup.OTHER;
}

const toSubgroup = (group: ManufacturingGroup, groupId: number): Group  => {
    switch (group) {
        case ManufacturingGroup.BLUEPRINT:
            return toBlueprintGroup(groupId);
        case ManufacturingGroup.PI:
            return toPiGroup(groupId);
        case ManufacturingGroup.REACTION:
            return toReactionGroup(groupId);
    }
}

const toBlueprintGroup = (groupId: number): BlueprintGroup => {
    switch (groupId) {
        default: return BlueprintGroup.MISCELLANEOUS;
    }
}

const toPiGroup = (groupId: number): PiGroup => {
    switch (groupId) {
        case 1034: return PiGroup.TIER_2;
        case 1040: return PiGroup.TIER_3;
        case 1041: return PiGroup.TIER_4;
        case 1042: return PiGroup.TIER_1;
        case 1032:
        case 1033:
        case 1035: return PiGroup.RAW;
        default: return null;
    }
}

const toReactionGroup = (groupId: number): ReactionGroup => {
    switch (groupId) {
        case 427: return ReactionGroup.RAW;
        case 428: return ReactionGroup.PROCESSED;
        case 429: return ReactionGroup.ADVANCED;
        case 974: return ReactionGroup.POLYMER;
        default: return null;
    }
}
