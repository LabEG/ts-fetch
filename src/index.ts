export * from "./models/index.js";
export * from "./contructors/TsFetch.js";
export * from "./contructors/CrudHttpRepository.js";

import {TsFetch} from "./contructors/TsFetch.js";

const instance = new TsFetch();

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-return
export const tfetch: typeof instance.send = (options: any) => instance.send(options) as any;
export const tf = tfetch; // Alias
