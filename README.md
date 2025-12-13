# Typescript Serializable Fetch

![npm version](https://img.shields.io/npm/v/@labeg/tfetch.svg)
![npm downloads](https://img.shields.io/npm/dm/@labeg/tfetch.svg)
![GitHub](https://img.shields.io/github/license/LabEG/ts-fetch.svg)
![build status](https://github.com/LabEG/ts-fetch/workflows/Test%20Pull%20Request/badge.svg)
[![CodeQL](https://github.com/LabEG/ts-fetch/workflows/CodeQL%20Advanced/badge.svg)](https://github.com/LabEG/ts-fetch/security/code-scanning)

A small library for sending serialized data and receiving deserialized data with strict data type checking. This library is built on top of the Fetch API and provides additional features like caching, error handling, and support for serializable classes.

## Installation

You can use the following command to install this package:

```bash
npm install @labeg/tfetch
```

## Usage

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

### POST Request with Body

```typescript
import { tfetch } from "@labeg/tfetch";

const createUser = async () => {
    const result = await tfetch({
        method: "POST",
        url: "https://example.com/api/users",
        body: {
            name: "John Doe",
            email: "john@example.com"
        },
        returnType: Object
    });
    console.log(result);
};

createUser();
```

### Custom Headers

```typescript
import { tfetch } from "@labeg/tfetch";

const fetchWithHeaders = async () => {
    const result = await tfetch({
        method: "GET",
        url: "https://example.com/api/data",
        headers: {
            "Authorization": "Bearer your-token-here",
            "X-Custom-Header": "custom-value"
        },
        returnType: Object
    });
    console.log(result);
};

fetchWithHeaders();
```

### All HTTP Methods

```typescript
import { tfetch } from "@labeg/tfetch";

// GET request
const getData = async () => {
    return await tfetch({
        method: "GET",
        url: "https://example.com/api/resource",
        returnType: Object
    });
};

// POST request
const postData = async () => {
    return await tfetch({
        method: "POST",
        url: "https://example.com/api/resource",
        body: { data: "value" },
        returnType: Object
    });
};

// PUT request
const updateData = async () => {
    return await tfetch({
        method: "PUT",
        url: "https://example.com/api/resource/1",
        body: { data: "updated value" }
    });
};

// DELETE request
const deleteData = async () => {
    return await tfetch({
        method: "DELETE",
        url: "https://example.com/api/resource/1"
    });
};
```

### Advanced Fetch Options

You can pass any standard Fetch API options:

```typescript
import { tfetch } from "@labeg/tfetch";

const advancedRequest = async () => {
    const result = await tfetch({
        method: "POST",
        url: "https://example.com/api/data",
        body: { key: "value" },
        returnType: Object,
        // Standard Fetch API options
        cache: "no-cache",
        credentials: "include",
        mode: "cors",
        redirect: "follow",
        referrerPolicy: "no-referrer",
        signal: AbortSignal.timeout(5000), // 5 second timeout
    });
    console.log(result);
};

advancedRequest();
```

### Working with FormData

```typescript
import { tfetch } from "@labeg/tfetch";

const uploadFile = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("description", "My file");

    const result = await tfetch({
        method: "POST",
        url: "https://example.com/api/upload",
        body: formData,
        returnType: Object
    });
    console.log(result);
};
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
