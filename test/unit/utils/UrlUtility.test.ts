// Copyright (c) Brock Allen & Dominick Baier. All rights reserved.
// Licensed under the Apache License, Version 2.0. See LICENSE in the project root for license information.

import { UrlUtility } from '../../../src/utils';

describe("UrlUtility", () => {

    describe("addQueryParam", () => {

        it("should add ? if not present", () => {
            // act
            let result = UrlUtility.addQueryParam("url", "foo", "test");

            // assert
            expect(result).toEqual("url?foo=test");
        });

        it("should not add ? if already present", () => {
            // act
            let result = UrlUtility.addQueryParam("url?", "foo", "test");

            // assert
            expect(result).toEqual("url?foo=test");
        });

        it("should add & if needed", () => {
            // act
            let result = UrlUtility.addQueryParam("url?x=1", "foo", "test");

            // assert
            expect(result).toEqual("url?x=1&foo=test");
        });

        it("should urlencode key and value", () => {
            // act
            let result = UrlUtility.addQueryParam("url", "#", "#");

            // assert
            expect(result).toEqual("url?%23=%23");
        });
    });

    describe("parseUrlFragment", () => {

        it("should parse key/value pairs", () => {
            // act
            let result = UrlUtility.parseUrlFragment("a=apple&b=banana&c=carrot");

            // assert
            expect(result).toEqual({ a: "apple", b: "banana", c: "carrot" });
        });

        it("should parse any order", () => {
            // act
            let result = UrlUtility.parseUrlFragment("b=banana&c=carrot&a=apple");

            // assert
            expect(result).toEqual({ a: "apple", b: "banana", c: "carrot" });
        });

        it("should parse past host name and hash fragment", () => {
            // act
            let result = UrlUtility.parseUrlFragment("http://server?test1=xoxo&test2=xoxo/#a=apple&b=banana&c=carrot");

            // assert
            expect(result).toEqual({ a: "apple", b: "banana", c: "carrot" });
        });

        it("should parse query string", () => {
            // act
            let result = UrlUtility.parseUrlFragment("http://server?test1=xoxo&test2=yoyo", "?");

            // assert
            expect(result).toEqual({ test1: "xoxo", test2: "yoyo" });
        });

        it("should parse query string up to hash", () => {
            // act
            let result = UrlUtility.parseUrlFragment("http://server?test1=xoxo&test2=yoyo#a=apple&b=banana&c=carrot", "?");

            // assert
            expect(result).toEqual({ test1: "xoxo", test2: "yoyo" });
        });

        it("should return error for long values", () => {
            // act
            let result = UrlUtility.parseUrlFragment("a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple");

            // assert
            expect(result).toHaveProperty("error");
        });

        it("should return empty object for empty string", () => {
            // act
            let result = UrlUtility.parseUrlFragment("");

            // assert
            expect(result).toEqual({});
        });
    });
});
