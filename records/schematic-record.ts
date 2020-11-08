import ItemBatch from "entities/dist/node/general/item-batch";
import Activity from "entities/dist/node/manufacturing/activity";

export interface SchematicRecord {

    typeID: number;

    quantity: number;

    isInput: boolean;

}

export const toActivityEntity = (records: SchematicRecord[]): Activity => {

    const invoke = () => {
        const product = records.find(r => !r.isInput);
        const materials = records.filter(r => r.isInput);
        return {
            product: toItemBatch(product),
            materials: materials.map(toItemBatch),
            skills: [],
            time: 0
        };
    }

    const toItemBatch = (record: SchematicRecord): ItemBatch => {
        return {
            typeId: record.typeID,
            quantity: record.quantity
        };
    }

    return invoke();
};
