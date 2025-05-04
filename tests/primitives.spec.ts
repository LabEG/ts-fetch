/* eslint-disable max-lines-per-function */


import("reflect-metadata"); // Polyfill
import {assert} from "chai";
import {describe, it, before, after} from "node:test";
import {tfetch} from "../src/index";
import {default as sFastify} from "fastify";


describe("ts-fetch can work with primitive values", () => {
    const fastify = sFastify();

    before(async () => {
        fastify.get("/void", (_req, reply) => reply
            .code(200)
            .header("Content-Type", "application/json")
            .send());

        fastify.get("/number", (_req, reply) => reply
            .code(200)
            .header("Content-Type", "application/json")
            .send(5));

        fastify.get("/string", (_req, reply) => reply
            .code(200)
            .header("Content-Type", "application/json")
            .send("123"));

        fastify.get("/boolean", (_req, reply) => reply
            .code(200)
            .header("Content-Type", "application/json")
            .send(true));

        fastify.get("/array", (_req, reply) => reply
            .code(200)
            .header("Content-Type", "application/json")
            .send([1, 2, 3]));

        fastify.listen({port: 3000});
        await fastify.ready();
    });

    it("ts-fetch can send a simple request", async () => {
        const result: unknown = await tfetch({
            url: "http://localhost:3000/void"
        });

        assert.isUndefined(result, "Result must be undefined");
    });

    it("ts-fetch can parse number primitives", async () => {
        const result: number = await tfetch({
            url: "http://localhost:3000/number",
            returnType: 0
        });

        assert.isNumber(result, "Result must be a number");
        assert.strictEqual(result, 5, "Result must be 5");
    });

    it("ts-fetch can parse string primitives", async () => {
        const result: string = await tfetch({
            url: "http://localhost:3000/string",
            returnType: ""
        });

        assert.isString(result, "Result must be a string");
        assert.strictEqual(result, "123", "Result must be '123'");
    });

    it("ts-fetch can parse boolean primitives", async () => {
        const result: boolean = await tfetch({
            url: "http://localhost:3000/boolean",
            returnType: true
        });

        assert.isBoolean(result, "Result must be a boolean");
        assert.strictEqual(result, true, "Result must be 'true'");
    });

    it("ts-fetch can parse array primitives", async () => {
        const result: number[] = await tfetch({
            url: "http://localhost:3000/array",
            returnType: [0]
        });

        assert.isArray(result, "Result must be a array");
        assert.deepEqual(result, [1, 2, 3], "Result must be equal");
    });

    after(async () => {
        await fastify.close();
    });
});
