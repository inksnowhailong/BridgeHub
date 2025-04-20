declare module 'configstore' {
  export default class Configstore {
    constructor(packageName: string, defaults?: any);
    get(key: string): any;
    set(key: string, value: any): void;
    clear(): void;
  }
}
