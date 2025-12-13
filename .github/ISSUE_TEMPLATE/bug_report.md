---
name: Bug Report
about: Create a report to help us improve
title: '[BUG] '
labels: bug
assignees: ''

---

## Description

A clear and concise description of the bug.

## Steps to Reproduce

1. Install `@labeg/tfetch` version X.X.X
2. Configure fetch with '...'
3. Send request to '...'
4. See error

## Expected Behavior

What you expected to happen.

## Actual Behavior

What actually happened.

## Code Sample

```typescript
// Minimal code example that demonstrates the issue
import { tfetch } from "@labeg/tfetch";

const result = await tfetch({
    url: "https://example.com/api",
    returnType: MyClass
});
```

## Request Configuration

```typescript
// Your request configuration
```

## Environment

- **@labeg/tfetch version**: [e.g., 0.7.2]
- **ts-serializable version**: [e.g., 4.2.1]
- **Node.js version**: [e.g., 20.10.0]
- **npm/pnpm version**: [e.g., npm 10.2.3]
- **Operating System**: [e.g., Windows 11, macOS 14, Ubuntu 22.04]
- **TypeScript version** (if applicable): [e.g., 5.3.3]
- **Runtime environment**: [e.g., Node.js, Browser, Deno]

## Additional Context

Add any other context, screenshots, or error messages here.

## Possible Solution

If you have ideas on how to fix this, please share them.
