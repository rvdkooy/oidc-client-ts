// Copyright (c) Brock Allen & Dominick Baier. All rights reserved.
// Licensed under the Apache License, Version 2.0. See LICENSE in the project root for license information.

import { Log } from "./Log";

export class UrlUtility {
    static addQueryParam(url: string, name: string, value: string) {
        if (url.indexOf("?") < 0) {
            url += "?";
        }

        if (url[url.length - 1] !== "?") {
            url += "&";
        }

        url += encodeURIComponent(name);
        url += "=";
        url += encodeURIComponent(value);

        return url;
    }

    static parseUrlFragment(value?: string, delimiter = "#") {
        if (typeof value !== "string") {
            value = location.href;
        }

        let idx = value.lastIndexOf(delimiter);
        if (idx >= 0) {
            value = value.substr(idx + 1);
        }

        if (delimiter === "?") {
            // if we're doing query, then strip off hash fragment before we parse
            idx = value.indexOf("#");
            if (idx >= 0) {
                value = value.substr(0, idx);
            }
        }

        const params: { [name: string]: string } = {};
        const regex = /([^&=]+)=([^&]*)/g;
        let m;

        let counter = 0;
        while ((m = regex.exec(value)) !== null) {
            params[decodeURIComponent(m[1])] = decodeURIComponent(m[2].replace(/\+/g, " "));
            if (counter++ > 50) {
                Log.error("UrlUtility.parseUrlFragment: response exceeded expected number of parameters", value);
                return {
                    error: "Response exceeded expected number of parameters"
                };
            }
        }

        return params;
    }
}
