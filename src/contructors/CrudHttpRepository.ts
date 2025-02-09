/* eslint-disable @typescript-eslint/class-methods-use-this */
import type {Serializable} from "ts-serializable";
import type {IGraphQuery} from "../models/view-models/graph-query.vm.js";
import type {PageListQuery} from "../models/view-models/page-list-query.vm.js";
import type {PagedList} from "../models/view-models/paged-list.vm.js";
import {TsFetch} from "./TsFetch.js";

export abstract class CrudHttpRepository<T1 extends Serializable> extends TsFetch {

    protected abstract apiRoot: string;

    protected abstract modelConstructor: new () => T1;

    public async getById (id: number | string, ...keys: (number | string)[]): Promise<T1> {
        let url = this.apiRoot;
        keys.forEach((key: number | string): void => {
            url = url.replace(/\{.+\}/gu, String(key));
        });
        return this.send({
            method: "GET",
            url: `${url}/${String(id)}`,
            returnType: this.modelConstructor
        });
    }

    public async getAll (...keys: (number | string)[]): Promise<T1[]> {
        let url = this.apiRoot;
        keys.forEach((key: number | string): void => {
            url = url.replace(/\{.+\}/gu, String(key));
        });
        return this.send({
            method: "GET",
            url: `${url}/`,
            returnType: [this.modelConstructor]
        });
    }

    public async create (value: T1, ...keys: (number | string)[]): Promise<T1> {
        let url = this.apiRoot;
        keys.forEach((key: number | string): void => {
            url = url.replace(/\{.+\}/gu, String(key));
        });
        return this.send({
            method: "POST",
            url: `${url}/`,
            body: value,
            returnType: this.modelConstructor
        });
    }

    public async update (id: number | string, value: T1, ...keys: (number | string)[]): Promise<void> {
        let url = this.apiRoot;
        keys.forEach((key: number | string): void => {
            url = url.replace(/\{.+\}/gu, String(key));
        });
        return this.send({
            method: "PUT",
            url: `${url}/${String(id)}`
        });
    }

    public async delete (id: number | string, ...keys: (number | string)[]): Promise<void> {
        let url = this.apiRoot;
        keys.forEach((key: number | string): void => {
            url = url.replace(/\{.+\}/gu, String(key));
        });
        return this.send({
            method: "DELETE",
            url: `${url}/${String(id)}`
        });
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars, class-methods-use-this
    public async getGraphById (id: number | string, ...keys: (IGraphQuery | number | string)[]): Promise<T1> {
        await Promise.resolve();
        throw new Error("Method not implemented.");
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars, class-methods-use-this
    public async getPaged (...keys: (PageListQuery | number | string)[]): Promise<PagedList<T1>> {
        await Promise.resolve();
        throw new Error("Method not implemented.");
    }

}
