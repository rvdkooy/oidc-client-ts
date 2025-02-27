// Copyright (c) Brock Allen & Dominick Baier. All rights reserved.
// Licensed under the Apache License, Version 2.0. See LICENSE in the project root for license information.

import { SignoutResponse } from '../../src/SignoutResponse';

describe("SignoutResponse", () => {

    describe("constructor", () => {

        it("should read error", () => {
            // act
            let subject = new SignoutResponse("error=foo");

            // assert
            expect(subject.error).toEqual("foo");
        });

        it("should read error_description", () => {
            // act
            let subject = new SignoutResponse("error_description=foo");

            // assert
            expect(subject.error_description).toEqual("foo");
        });

        it("should read error_uri", () => {
            // act
            let subject = new SignoutResponse("error_uri=foo");

            // assert
            expect(subject.error_uri).toEqual("foo");
        });

        it("should read state", () => {
            // act
            let subject = new SignoutResponse("state=foo");

            // assert
            expect(subject.state).toEqual("foo");
        });
    });
});
