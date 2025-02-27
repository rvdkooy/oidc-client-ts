// Copyright (c) Brock Allen & Dominick Baier. All rights reserved.
// Licensed under the Apache License, Version 2.0. See LICENSE in the project root for license information.

import { SigninRequest } from '../../src/SigninRequest';

describe("SigninRequest", () => {

    let subject: SigninRequest;
    let settings: any;

    beforeEach(() => {
        settings = {
            url: "http://sts/signin",
            client_id: "client",
            redirect_uri: "http://app",
            response_type: "id_token",
            scope: "openid",
            authority : "op",
            data: {data: "test"}
        };
        subject = new SigninRequest(settings);
    });

    describe("constructor", () => {

        it("should require a url param", () => {
            // arrange
            delete settings.url;

            // act
            try {
                new SigninRequest(settings);
                fail("should not come here");
            }
            catch (e) {
                expect(e.message).toContain('url');
            }
        });

        it("should require a client_id param", () => {
            // arrange
            delete settings.client_id;

            // act
            try {
                new SigninRequest(settings);
                fail("should not come here");
            }
            catch (e) {
                expect(e.message).toContain('client_id');
            }
        });

        it("should require a redirect_uri param", () => {
            // arrange
            delete settings.redirect_uri;

            // act
            try {
                new SigninRequest(settings);
                fail("should not come here");
            }
            catch (e) {
                expect(e.message).toContain('redirect_uri');
            }
        });

        it("should require a response_type param", () => {
            // arrange
            delete settings.response_type;

            // act
            try {
                new SigninRequest(settings);
                fail("should not come here");
            }
            catch (e) {
                expect(e.message).toContain('response_type');
            }
        });

        it("should require a scope param", () => {
            // arrange
            delete settings.scope;

            // act
            try {
                new SigninRequest(settings);
                fail("should not come here");
            }
            catch (e) {
                expect(e.message).toContain('scope');
            }
        });

        it("should require a authority param", () => {
            // arrange
            delete settings.authority;

            // act
            try {
                new SigninRequest(settings);
                fail("should not come here");
            }
            catch (e) {
                expect(e.message).toContain('authority');
            }
        });
    });

    describe("url", () => {

        it("should include url", () => {
            // assert
            expect(subject.url.indexOf("http://sts/signin")).toEqual(0);
        });

        it("should include client_id", () => {
            // assert
            expect(subject.url).toContain("client_id=client");
        });

        it("should include redirect_uri", () => {
            // assert
            expect(subject.url).toContain("redirect_uri=" + encodeURIComponent("http://app"));
        });

        it("should include response_type", () => {
            // assert
            expect(subject.url).toContain("response_type=id_token");
        });

        it("should include scope", () => {
            // assert
            expect(subject.url).toContain("scope=openid");
        });

        it("should include state", () => {
            // assert
            expect(subject.url).toContain("state=" + subject.state.id);
        });

        it("should include prompt", () => {
            // arrange
            settings.prompt = "foo";

            // act
            subject = new SigninRequest(settings);

            // assert
            expect(subject.url).toContain("prompt=foo");
        });

        it("should include display", () => {
            // arrange
            settings.display = "foo";

            // act
            subject = new SigninRequest(settings);

            // assert
            expect(subject.url).toContain("display=foo");
        });

        it("should include max_age", () => {
            // arrange
            settings.max_age = "foo";

            // act
            subject = new SigninRequest(settings);

            // assert
            expect(subject.url).toContain("max_age=foo");
        });

        it("should include ui_locales", () => {
            // arrange
            settings.ui_locales = "foo";

            // act
            subject = new SigninRequest(settings);

            // assert
            expect(subject.url).toContain("ui_locales=foo");
        });

        it("should include id_token_hint", () => {
            // arrange
            settings.id_token_hint = "foo";

            // act
            subject = new SigninRequest(settings);

            // assert
            expect(subject.url).toContain("id_token_hint=foo");
        });

        it("should include login_hint", () => {
            // arrange
            settings.login_hint = "foo";

            // act
            subject = new SigninRequest(settings);

            // assert
            expect(subject.url).toContain("login_hint=foo");
        });

        it("should include acr_values", () => {
            // arrange
            settings.acr_values = "foo";

            // act
            subject = new SigninRequest(settings);

            // assert
            expect(subject.url).toContain("acr_values=foo");
        });

        it("should include resource", () => {
            // arrange
            settings.resource = "foo";

            // act
            subject = new SigninRequest(settings);

            // assert
            expect(subject.url).toContain("resource=foo");
        });

        it("should include response_mode", () => {
            // arrange
            settings.response_mode = "foo";

            // act
            subject = new SigninRequest(settings);

            // assert
            expect(subject.url).toContain("response_mode=foo");
        });

        it("should include request", () => {
            // arrange
            settings.request = "foo";

            // act
            subject = new SigninRequest(settings);

            // assert
            expect(subject.url).toContain("request=foo");
        });

        it("should include request_uri", () => {
            // arrange
            settings.request_uri = "foo";

            // act
            subject = new SigninRequest(settings);

            // assert
            expect(subject.url).toContain("request_uri=foo");
        });

        it("should include extra query params", () => {
            // arrange
            settings.extraQueryParams = {
                'hd': 'domain.com',
                'foo': 'bar'
            };

            // act
            subject = new SigninRequest(settings);

            // assert
            expect(subject.url).toContain('hd=domain.com&foo=bar');
        });

        it("should store extra token params in state", () => {
            // arrange
            settings.extraTokenParams = {
                'resourceServer': 'abc',
            };

            // act
            subject = new SigninRequest(settings);

            // assert
            expect(subject.state.extraTokenParams).toEqual({
                'resourceServer': 'abc'
            });
        });

        it("should include code flow params", () => {
            // arrange
            settings.response_type = "code";

            // act
            subject = new SigninRequest(settings);

            // assert
            expect(subject.url).toContain("code_challenge=");
            expect(subject.url).toContain("code_challenge_method=S256");
        });

        it("should include hybrid flow params", () => {
            // arrange
            settings.response_type = "code id_token";

            // act
            subject = new SigninRequest(settings);

            // assert
            expect(subject.url).toContain("nonce=");
            expect(subject.url).toContain("code_challenge=");
            expect(subject.url).toContain("code_challenge_method=S256");
        });
    });

    describe("isOidc", () => {
        it("should indicate if response_type is oidc", () => {
            // assert
            expect(SigninRequest.isOidc("id_token")).toEqual(true);
            expect(SigninRequest.isOidc("id_token token")).toEqual(true);
            expect(SigninRequest.isOidc("token id_token")).toEqual(true);

            expect(SigninRequest.isOidc("token")).toEqual(false);
        });
    });

    describe("isOAuth", () => {
        it("should indicate if response_type is oauth", () => {
            // assert
            expect(SigninRequest.isOAuth("token")).toEqual(true);
            expect(SigninRequest.isOAuth("id_token token")).toEqual(true);
            expect(SigninRequest.isOAuth("token id_token")).toEqual(true);

            expect(SigninRequest.isOAuth("id_token")).toEqual(false);
        });
    });

    describe("isCode", () => {
        it("should indicate if response_type is code", () => {
            // assert
            expect(SigninRequest.isCode("code")).toEqual(true);
            expect(SigninRequest.isCode("id_token code")).toEqual(true);
            expect(SigninRequest.isCode("code id_token")).toEqual(true);
            expect(SigninRequest.isCode("id_token token code")).toEqual(true);
            expect(SigninRequest.isCode("id_token code token")).toEqual(true);
            expect(SigninRequest.isCode("code id_token token")).toEqual(true);

            expect(SigninRequest.isCode("id_token token")).toEqual(false);
            expect(SigninRequest.isCode("token id_token")).toEqual(false);
        });
    });
});
