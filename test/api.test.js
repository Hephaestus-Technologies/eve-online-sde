const expect = require("chai").expect;
const {Category, ...eve} = require("../");

describe("The API", function() {
    this.timeout(5000);

    it("primes the types", async () => {
        await eve.types();
    });

});

describe("The EVE SDE", () => {

    const tritId = 34;
    const tritName = "Tritanium";

    it("provides items by id", async () => {
        const trit = await eve.lookupById(tritId);
        expect(trit).to.be.defined;
        expect(trit.name.en).to.equal(tritName);
    });

    it("provides items by name", async () => {
        const [trit] = await eve.lookup(tritName);
        expect(trit).to.be.defined;
        expect(trit.id).to.equal(tritId);
    });

    it("provides types for category", async () => {
        const materialCategory = 4;
        const types = await eve.typesForCategory(materialCategory);
        expect(types.length).to.be.truthy;
    });

});
