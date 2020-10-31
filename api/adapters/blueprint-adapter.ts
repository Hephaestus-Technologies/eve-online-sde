import Blueprint from "@hephaestus-technologies/eve-entities/dist/manufacturing/blueprint";
import Activity from "@hephaestus-technologies/eve-entities/dist/manufacturing/activity";
import ItemBatch from "@hephaestus-technologies/eve-entities/dist/general/item-batch";

export default class BlueprintAdapter {

    public constructor(private _blueprintId: string, private _record: any) { }

    public toReaction(): Activity {
        const reaction = this._record.activities.reaction;
        return BlueprintAdapter.toActivityEntity(reaction);
    }

    public toBlueprint(): Blueprint {
        return {
            blueprintId: Number(this._blueprintId),
            manufacturing: this.manufacturing(),
            materialResearch: this.materialResearch(),
            timeResearch: this.timeResearch(),
            copying: this.copying(),
            invention: this.invention()
        };
    }

    private manufacturing(): Activity {
        const record = this._record.activities.manufacturing;
        return BlueprintAdapter.toActivityEntity(record);
    }

    private materialResearch(): Activity {
        const record = this._record.activities.research_material;
        return BlueprintAdapter.toActivityEntity(record)
    }

    private timeResearch(): Activity {
        const record = this._record.activities.research_time;
        return BlueprintAdapter.toActivityEntity(record)
    }


    private copying(): Activity {
        const record = this._record.activities.copying;
        return BlueprintAdapter.toActivityEntity(record)
    }

    private invention(): Activity {
        const record = this._record.activities.invention;
        return BlueprintAdapter.toActivityEntity(record)
    }

    private static toActivityEntity(record: any): Activity {
        if (!record) return null;
        return {
            product: record.products ? BlueprintAdapter.toItemBatch(record.products[0]) : null,
            materials: record.materials ? record.materials.map(BlueprintAdapter.toItemBatch) : [],
            skills: record.skills || [],
            time: record.time
        };
    }

    private static toItemBatch(record: any): ItemBatch {
        return {
            typeId: record.typeId,
            quantity: record.quantity
        };
    }

}
