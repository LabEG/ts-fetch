export * from "./models/index.js";
export * from "./contructors/TsFetch.js";

import {TsFetch} from "./contructors/TsFetch.js";

const instance = new TsFetch();

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-argument
export const tsfetch: typeof instance.send = (options: any) => instance.send(options);
export const tf = tsfetch; // Alias
