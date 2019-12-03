const expect = require("chai").expect;
const eve = require("../");

describe("the eve sde access", () => {
    it("can access items by id", () => {
        return eve.lookupById(34).then(trit => {
            expect(trit).to.be.defined;
            expect(trit.name.en).to.equal("Tritanium");
        });
    });
    it("can access items by name", () => {
        return eve.lookup("Trit").then(([[id, trit]]) => {
            expect(trit).to.be.defined;
            expect(id).to.equal("34");
        });
    });
});