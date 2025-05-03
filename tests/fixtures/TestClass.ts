/* eslint-disable max-classes-per-file */
import {jsonProperty} from "ts-serializable";
import {BaseClass} from "./BaseClass";

export class TestSubclass extends BaseClass {

    @jsonProperty(Number)
    public numProp: number = 123;

    @jsonProperty(String)
    public stringProp: string = "123";

    @jsonProperty(Boolean)
    public boolProp: boolean = true;

}

export class TestClass extends BaseClass {

    @jsonProperty(Number)
    public numProp: number = 123;

    @jsonProperty(String)
    public stringProp: string = "123";

    @jsonProperty(Boolean)
    public boolProp: boolean = true;

    @jsonProperty(TestSubclass)
    public classProp: TestSubclass = new TestSubclass();

    @jsonProperty([TestSubclass])
    public arrayProp: TestSubclass[] = [new TestSubclass(), new TestSubclass()];

}
