import("reflect-metadata"); // Polyfill
import {assert} from "chai";
import {describe, it, before, after} from "node:test";
import {tfetch} from "../src/index";
import {default as sFastify} from "fastify";
import {TestClass} from "./fixtures/TestClass";


describe("ts-fetch can work with classes", () => {
    const fastify = sFastify();

    before(async () => {
        fastify.get("/class", (_req, reply) => reply
            .code(200)
            .header("Content-Type", "application/json")
            .send(JSON.stringify(new TestClass())));

        fastify.get("/array", (_req, reply) => reply
            .code(200)
            .header("Content-Type", "application/json")
            .send(JSON.stringify([new TestClass()])));

        fastify.listen({port: 3001});
        await fastify.ready();
    });

    it("ts-fetch can deserialize class", async () => {
        const result: TestClass = await tfetch({
            url: "http://localhost:3001/class",
            returnType: TestClass
        });

        assert.deepEqual(new TestClass(), result, "Result must be deep Equal to TestClass");
        assert.isTrue(result instanceof TestClass, "Result must be instance of TestClass");
    });

    it("ts-fetch can deserialize array", async () => {
        const result: TestClass[] = await tfetch({
            url: "http://localhost:3001/array",
            returnType: [TestClass]
        });

        assert.deepEqual([new TestClass()], result, "Result must be deep Equal to TestClass");
        assert.isTrue(result[0] instanceof TestClass, "Result must be instance of TestClass");
    });

    after(async () => {
        await fastify.close();
    });
});
