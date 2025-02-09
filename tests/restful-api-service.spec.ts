

import("reflect-metadata"); // Polyfill
import {assert} from "chai";
import {describe, it} from "node:test";
import {tsfetch} from "../src/index";


describe("Base functions", () => {
    it("ts fetch can send simple request", async () => {
        const result: string = await tsfetch({
            url: "https://api.github.com/octocat",
            returnType: ""
        });

        assert.isString(result, "Result must be string");
        assert.include(result, "MMMM");
    });
});
