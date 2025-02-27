// Copyright (c) Brock Allen & Dominick Baier. All rights reserved.
// Licensed under the Apache License, Version 2.0. See LICENSE in the project root for license information.

import { ErrorResponse } from '../../src/ErrorResponse';

describe("ErrorResponse", () => {

    describe("constructor", () => {

        it("should require a error param", () => {
            // act
            try {
                new ErrorResponse({});
            }
            catch (e) {
                expect(e.message).toContain("error");
                return;
            }

            fail("should not come here");
        });

        it("should read error", () => {
            // act
            let subject = new ErrorResponse({error:"foo"});

            // assert
            expect(subject.error).toEqual("foo");
        });

        it("should read error_description", () => {
            // act
            let subject = new ErrorResponse({error:"error", error_description:"foo"});

            // assert
            expect(subject.error_description).toEqual("foo");
        });

        it("should read error_uri", () => {
            // act
            let subject = new ErrorResponse({error:"error", error_uri:"foo"});

            // assert
            expect(subject.error_uri).toEqual("foo");
        });

        it("should read state", () => {
            // act
            let subject = new ErrorResponse({error:"error", state:"foo"});

            // assert
            expect(subject.state).toEqual("foo");
        });

    });

    describe("message", () => {
        it("should be description if set", () => {
            // act
            let subject = new ErrorResponse({error:"error", error_description:"foo"});

            // assert
            expect(subject.message).toEqual("foo");
        });

        it("should be error if description not set", () => {
            // act
            let subject = new ErrorResponse({error:"error"});

            // assert
            expect(subject.message).toEqual("error");
        });
    });

    describe("name", () => {
        it("should be class name", () => {
            // act
            let subject = new ErrorResponse({error:"error"});

            // assert
            expect(subject.name).toEqual("ErrorResponse");
        });
    });

    describe("stack", () => {
        it("should be set", () => {
            // act
            let subject = new ErrorResponse({error:"error"});

            // assert
            expect(subject.stack).not.toBeNull();
        });
    });
});
