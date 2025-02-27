// Copyright (c) Brock Allen & Dominick Baier. All rights reserved.
// Licensed under the Apache License, Version 2.0. See LICENSE in the project root for license information.

import { ClockService } from "./ClockService";
import { WebStorageStateStore } from "./WebStorageStateStore";
import { ResponseValidator } from "./ResponseValidator";
import { MetadataService } from "./MetadataService";
import { OidcMetadata } from "./OidcMetadata";
import { StateStore } from "./StateStore";

const DefaultResponseType = "id_token";
const DefaultScope = "openid";
const DefaultClientAuthentication = "client_secret_post"; // The default value must be client_secret_basic, as explained in https://openid.net/specs/openid-connect-core-1_0.html#ClientAuthentication
const DefaultStaleStateAge = 60 * 15; // seconds
const DefaultClockSkewInSeconds = 60 * 5;

export interface OidcClientSettings {
    /** The URL of the OIDC/OAuth2 provider */
    authority?: string;
    metadataUrl?: string;
    /** Provide metadata when authority server does not allow CORS on the metadata endpoint */
    metadata?: Partial<OidcMetadata>;
    /** Can be used to seed or add additional values to the results of the discovery request */
    metadataSeed?: Partial<OidcMetadata>;
    /** Provide signingKeys when authority server does not allow CORS on the jwks uri */
    signingKeys?: any[];

    /** Your client application's identifier as registered with the OIDC/OAuth2 */
    client_id?: string;
    client_secret?: string;
    /** The type of response desired from the OIDC/OAuth2 provider (default: 'id_token') */
    response_type?: string;
    /** The scope being requested from the OIDC/OAuth2 provider (default: 'openid') */
    scope?: string;
    /** The redirect URI of your client application to receive a response from the OIDC/OAuth2 provider */
    redirect_uri?: string;
    /** The OIDC/OAuth2 post-logout redirect URI */
    post_logout_redirect_uri?: string;
    client_authentication?: string;

    prompt?: string;
    display?: string;
    max_age?: number;
    ui_locales?: string;
    acr_values?: string;
    resource?: string;
    response_mode?: string;

    /** Should OIDC protocol claims be removed from profile (default: true) */
    filterProtocolClaims?: boolean;
    /** Flag to control if additional identity data is loaded from the user info endpoint in order to populate the user's profile (default: true) */
    loadUserInfo?: boolean;
    /** Number (in seconds) indicating the age of state entries in storage for authorize requests that are considered abandoned and thus can be cleaned up (default: 300) */
    staleStateAge?: number;
    /** The window of time (in seconds) to allow the current time to deviate when validating id_token's iat, nbf, and exp values (default: 300) */
    clockSkew?: number;
    clockService?: ClockService;
    userInfoJwtIssuer?: "ANY" | "OP" | string;
    mergeClaims?: boolean;

    stateStore?: StateStore;
    ResponseValidatorCtor?: typeof ResponseValidator;
    MetadataServiceCtor?: typeof MetadataService;

    /** An object containing additional query string parameters to be including in the authorization request */
    extraQueryParams?: Record<string, any>;
    extraTokenParams?: Record<string, any>;
}

export class OidcClientSettingsStore {
    private _authority: string;
    private _metadataUrl?: string;
    private _metadata?: Partial<OidcMetadata>;
    private _metadataSeed?: Partial<OidcMetadata>;
    private _signingKeys?: any[];

    private _client_id: string;
    private _client_secret?: string;
    private _response_type: string;
    private _scope: string;
    private _redirect_uri?: string;
    private _post_logout_redirect_uri?: string;
    private _client_authentication?: string;

    private _prompt?: string;
    private _display?: string;
    private _max_age?: number;
    private _ui_locales?: string;
    private _acr_values?: string;
    private _resource?: string;
    private _response_mode?: string;

    private _filterProtocolClaims?: boolean;
    private _loadUserInfo?: boolean;
    private _staleStateAge: number;
    private _clockSkew: number;
    private _clockService: ClockService;
    private _userInfoJwtIssuer?: "ANY" | "OP" | string;
    private _mergeClaims?: boolean;

    private _stateStore: StateStore;
    private _validator: ResponseValidator;
    private _metadataService: MetadataService;

    private _extraQueryParams?: Record<string, any>;
    private _extraTokenParams?: Record<string, any>;

    constructor({
        // metadata related
        authority = "", metadataUrl, metadata, signingKeys, metadataSeed,
        // client related
        client_id = "", client_secret, response_type = DefaultResponseType, scope = DefaultScope,
        redirect_uri, post_logout_redirect_uri,
        client_authentication = DefaultClientAuthentication,
        // optional protocol
        prompt, display, max_age, ui_locales, acr_values, resource, response_mode,
        // behavior flags
        filterProtocolClaims = true, loadUserInfo = true,
        staleStateAge = DefaultStaleStateAge,
        clockSkew = DefaultClockSkewInSeconds,
        clockService = new ClockService(),
        userInfoJwtIssuer = "OP",
        mergeClaims = false,
        // other behavior
        stateStore = new WebStorageStateStore(),
        ResponseValidatorCtor = ResponseValidator,
        MetadataServiceCtor = MetadataService,
        // extra query params
        extraQueryParams = {},
        extraTokenParams = {}
    }: OidcClientSettings = {}) {

        this._authority = authority;
        this._metadataUrl = metadataUrl;
        this._metadata = metadata;
        this._metadataSeed = metadataSeed;
        this._signingKeys = signingKeys;

        this._client_id = client_id;
        this._client_secret = client_secret;
        this._response_type = response_type;
        this._scope = scope;
        this._redirect_uri = redirect_uri;
        this._post_logout_redirect_uri = post_logout_redirect_uri;
        this._client_authentication = client_authentication;

        this._prompt = prompt;
        this._display = display;
        this._max_age = max_age;
        this._ui_locales = ui_locales;
        this._acr_values = acr_values;
        this._resource = resource;
        this._response_mode = response_mode;

        this._filterProtocolClaims = !!filterProtocolClaims;
        this._loadUserInfo = !!loadUserInfo;
        this._staleStateAge = staleStateAge;
        this._clockSkew = clockSkew;
        this._clockService = clockService;
        this._userInfoJwtIssuer = userInfoJwtIssuer;
        this._mergeClaims = !!mergeClaims;

        this._stateStore = stateStore;
        this._metadataService = new MetadataServiceCtor(this);
        this._validator = new ResponseValidatorCtor(this, this._metadataService);

        this._extraQueryParams = typeof extraQueryParams === "object" ? extraQueryParams : {};
        this._extraTokenParams = typeof extraTokenParams === "object" ? extraTokenParams : {};
    }

    // client config
    get client_id() {
        return this._client_id;
    }
    get client_secret() {
        return this._client_secret;
    }
    get response_type() {
        return this._response_type;
    }
    get scope() {
        return this._scope;
    }
    get redirect_uri() {
        return this._redirect_uri;
    }
    get post_logout_redirect_uri() {
        return this._post_logout_redirect_uri;
    }
    get client_authentication() {
        return this._client_authentication;
    }

    // optional protocol params
    get prompt() {
        return this._prompt;
    }
    get display() {
        return this._display;
    }
    get max_age() {
        return this._max_age;
    }
    get ui_locales() {
        return this._ui_locales;
    }
    get acr_values() {
        return this._acr_values;
    }
    get resource() {
        return this._resource;
    }
    get response_mode() {
        return this._response_mode;
    }

    // metadata
    get authority() {
        return this._authority;
    }
    get metadataUrl() {
        return this._metadataUrl;
    }
    get metadata() {
        return this._metadata;
    }
    get metadataSeed() {
        return this._metadataSeed;
    }
    get signingKeys() {
        return this._signingKeys;
    }

    // behavior flags
    get filterProtocolClaims() {
        return this._filterProtocolClaims;
    }
    get loadUserInfo() {
        return this._loadUserInfo;
    }
    get staleStateAge() {
        return this._staleStateAge;
    }
    get clockSkew() {
        return this._clockSkew;
    }
    get userInfoJwtIssuer() {
        return this._userInfoJwtIssuer;
    }
    get mergeClaims() {
        return this._mergeClaims;
    }

    get stateStore() {
        return this._stateStore;
    }
    get validator() {
        return this._validator;
    }
    get metadataService() {
        return this._metadataService;
    }

    // extra
    get extraQueryParams() {
        return this._extraQueryParams;
    }
    get extraTokenParams() {
        return this._extraTokenParams;
    }

    // get the time
    getEpochTime() {
        return this._clockService.getEpochTime();
    }
}
