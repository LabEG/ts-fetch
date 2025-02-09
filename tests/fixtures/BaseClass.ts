import {Serializable} from "ts-serializable";

export class BaseClass extends Serializable {

    protected onWrongType (prop: string, message: string, jsonValue: unknown): void {
        throw new Error(`${this.constructor.name}.fromJSON: json.${prop} ${message}: ${String(jsonValue)}`);
    }

}
