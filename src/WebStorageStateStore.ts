// Copyright (c) Brock Allen & Dominick Baier. All rights reserved.
// Licensed under the Apache License, Version 2.0. See LICENSE in the project root for license information.

import { Log } from "./utils";
import { StateStore } from "./StateStore";

export class WebStorageStateStore implements StateStore {
    private _store: Storage
    private _prefix: string

    constructor({ prefix = "oidc.", store = localStorage } = {}) {
        this._store = store;
        this._prefix = prefix;
    }

    set(key: string, value: string): Promise<void> {
        Log.debug("WebStorageStateStore.set", key);

        key = this._prefix + key;
        this._store.setItem(key, value);
        return Promise.resolve();
    }

    get(key: string): Promise<string | null> {
        Log.debug("WebStorageStateStore.get", key);

        key = this._prefix + key;
        const item = this._store.getItem(key);
        return Promise.resolve(item);
    }

    remove(key: string): Promise<string | null> {
        Log.debug("WebStorageStateStore.remove", key);

        key = this._prefix + key;
        const item = this._store.getItem(key);
        this._store.removeItem(key);
        return Promise.resolve(item);
    }

    getAllKeys(): Promise<string[]> {
        Log.debug("WebStorageStateStore.getAllKeys");

        const keys = [];
        for (let index = 0; index < this._store.length; index++) {
            const key = this._store.key(index);
            if (key && key.indexOf(this._prefix) === 0) {
                keys.push(key.substr(this._prefix.length));
            }
        }
        return Promise.resolve(keys);
    }
}
