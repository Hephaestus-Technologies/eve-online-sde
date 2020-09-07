const expect = require("chai").expect;
const eve = require("../");

describe("primes the API", function() {
    this.timeout(5000);

    it("primes the types", async () => {
        await eve.types();
    });

});

describe("the eve sde access", () => {

    it("can access items by id", async () => {
        const trit = await eve.lookupById(34);
        expect(trit).to.be.defined;
        expect(trit.name.en).to.equal("Tritanium");
    });

    it("can access items by name", async () => {
        const [[id, trit]] = await eve.lookup("Trit");
        expect(trit).to.be.defined;
        expect(id).to.equal("34");
    });

});
