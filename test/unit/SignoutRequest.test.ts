// Copyright (c) Brock Allen & Dominick Baier. All rights reserved.
// Licensed under the Apache License, Version 2.0. See LICENSE in the project root for license information.

import { SignoutRequest } from '../../src/SignoutRequest';

describe("SignoutRequest", () => {

    let subject: SignoutRequest;
    let settings: any;

    beforeEach(() => {
        settings = {
            url: "http://sts/signout",
            id_token_hint: "hint",
            post_logout_redirect_uri: "loggedout",
            data: { data: "test" }
        };
        subject = new SignoutRequest(settings);
    });

    describe("constructor", () => {

        it("should require a url param", () => {
            // arrange
            delete settings.url;

            // act
            try {
                new SignoutRequest(settings);
                fail("should not come here");
            }
            catch (e) {
                expect(e.message).toContain('url');
            }
        });
    });

    describe("url", () => {

        it("should include url", () => {
            // assert
            expect(subject.url.indexOf("http://sts/signout")).toEqual(0);
        });

        it("should include id_token_hint", () => {
            // assert
            expect(subject.url).toContain("id_token_hint=hint");
        });

        it("should include post_logout_redirect_uri if id_token_hint also provided", () => {
            // assert
            expect(subject.url).toContain("post_logout_redirect_uri=loggedout");
        });

        it("should include post_logout_redirect_uri if no id_token_hint provided", () => {
            // arrange
            delete settings.id_token_hint;

            // act
            subject = new SignoutRequest(settings);

            // assert
            expect(subject.url).toContain("post_logout_redirect_uri=loggedout");
        });

        it("should include state if post_logout_redirect_uri provided", () => {
            // assert
            expect(subject.state).toBeDefined();
            expect(subject.url).toContain("state=" + subject.state!.id);
        });

        it("should not include state if no post_logout_redirect_uri provided", () => {
            // arrange
            delete settings.post_logout_redirect_uri;

            // act
            subject = new SignoutRequest(settings);

            // assert
            expect(subject.url).not.toContain("state=");
        });


        it("should include id_token_hint, post_logout_redirect_uri, and state", () => {
            // assert
            const url = subject.url;
            expect(url.indexOf('http://sts/signout?')).toEqual(0);
            expect(url).toContain("id_token_hint=hint");
            expect(url).toContain("post_logout_redirect_uri=loggedout");
            expect(subject.state).toBeDefined();
            expect(url).toContain("state=" + subject.state!.id);
        });

        it("should include extra query params", () => {
            // arrange
            settings.extraQueryParams = {
                'TargetResource': 'logouturl.com',
                'InErrorResource': 'errorurl.com'
            };

            // act
            subject = new SignoutRequest(settings);

            // assert
            expect(subject.url).toContain('TargetResource=logouturl.com&InErrorResource=errorurl.com');
        });

    });
});
