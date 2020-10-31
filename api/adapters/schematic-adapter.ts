import ItemBatch from "@hephaestus-technologies/eve-entities/dist/general/item-batch";
import Activity from "@hephaestus-technologies/eve-entities/dist/manufacturing/activity";
import Blueprint from "@hephaestus-technologies/eve-entities/dist/manufacturing/blueprint";

export default class SchematicAdapter {

    public static toEntity(schematicId: string, records: any[]): Blueprint {
        return {
            blueprintId: Number(schematicId),
            manufacturing: SchematicAdapter.toActivity(records),
            copying: null,
            timeResearch: null,
            materialResearch: null,
            invention: null
        };
    }

    private static toActivity(records: any[]): Activity {
        const product = records.find(r => !r.isInput);
        const materials = records.filter(r => r.isInput);
        return {
            product: SchematicAdapter.toItemBatch(product),
            materials: materials.map(SchematicAdapter.toItemBatch),
            skills: [],
            time: 0
        };
    }

    private static toItemBatch(record: any): ItemBatch {
        return {
            typeId: record.typeId,
            quantity: record.quantity
        };
    }

}
