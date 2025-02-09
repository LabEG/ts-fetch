export * from "./models/index.js";
export * from "./contructors/TsFetch.js";

import {TsFetch, TsRequestInit} from "./contructors/TsFetch.js";

const tsfetchSingleton = new TsFetch();
export const tsfetch = <T>(options: TsRequestInit<T>): Promise<T> => tsfetchSingleton.send(options);
export const tf = tsfetch; // Alias
