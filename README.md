Typescript Serializable Fetch
=====

A small library for sending serialized data and receiving deserialized data with strict data type checking. This library is built on top of the Fetch API and provides additional features like caching, error handling, and support for serializable classes.

Installation
------

You can use the following command to install this package:

```bash
npm install @labeg/tfetch
```

Usage
------

### Basic Usage

```typescript
import { tfetch } from "@labeg/tfetch";

// Example with primitive types
const fetchNumber = async () => {
    const result: number = await tfetch({
        url: "https://example.com/number",
        returnType: 0
    });
    console.log(result); // Logs the number fetched from the API
};

fetchNumber();
```

### Working with Serializable Classes

```typescript
import { tfetch } from "@labeg/tfetch";
import { TestClass } from "./fixtures/TestClass";

const fetchClass = async () => {
    const result: TestClass = await tfetch({
        url: "https://example.com/class",
        returnType: TestClass
    });
    console.log(result instanceof TestClass); // true
};

fetchClass();
```

### CRUD Operations with `CrudHttpRepository`

```typescript
import { CrudHttpRepository } from "@labeg/tfetch";
import { TestClass } from "./fixtures/TestClass";

class TestRepository extends CrudHttpRepository<TestClass> {
    protected apiRoot = "https://example.com/api";
    protected modelConstructor = TestClass;
}

const repository = new TestRepository();

const fetchData = async () => {
    const item = await repository.getById(1);
    console.log(item);
};

fetchData();
```

### Error Handling

The library provides custom error classes for handling network and backend errors:

```typescript
import { tfetch } from "@labeg/tfetch";

const fetchWithErrorHandling = async () => {
    try {
        await tfetch({
            url: "https://example.com/error"
        });
    } catch (error) {
        console.error(error);
    }
};

fetchWithErrorHandling();
```

### Caching

GET and HEAD requests are cached automatically to improve performance. The cache is cleared when an error occurs or when the request completes successfully.
