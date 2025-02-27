// Copyright (c) Brock Allen & Dominick Baier. All rights reserved.
// Licensed under the Apache License, Version 2.0. See LICENSE in the project root for license information.

import { UserManager, Log } from "../../../src";
import { settings } from "./identityserver-sample-settings";

///////////////////////////////
// UI event handlers
///////////////////////////////
document.getElementById("clearState").addEventListener("click", clearState, false);
document.getElementById("getUser").addEventListener("click", getUser, false);
document.getElementById("removeUser").addEventListener("click", removeUser, false);
document.getElementById("querySessionStatus").addEventListener("click", querySessionStatus, false);

document.getElementById("startSigninMainWindow").addEventListener("click", startSigninMainWindow, false);
document.getElementById("endSigninMainWindow").addEventListener("click", endSigninMainWindow, false);
document.getElementById("startSigninMainWindowDiffCallbackPage").addEventListener("click", startSigninMainWindowDiffCallbackPage, false);

document.getElementById("popupSignin").addEventListener("click", popupSignin, false);
document.getElementById("iframeSignin").addEventListener("click", iframeSignin, false);

document.getElementById("startSignoutMainWindow").addEventListener("click", startSignoutMainWindow, false);
document.getElementById("endSignoutMainWindow").addEventListener("click", endSignoutMainWindow, false);

document.getElementById("popupSignout").addEventListener("click", popupSignout, false);

///////////////////////////////
// config
///////////////////////////////
Log.logger = console;
Log.level = Log.DEBUG;

function log() {
    document.getElementById("out").innerText = "";

    Array.prototype.forEach.call(arguments, function(msg) {
        if (msg instanceof Error) {
            msg = "Error: " + msg.message;
        }
        else if (typeof msg !== "string") {
            msg = JSON.stringify(msg, null, 2);
        }
        document.getElementById("out").innerHTML += msg + "\r\n";
    });
}

var mgr = new UserManager(settings);

///////////////////////////////
// events
///////////////////////////////
mgr.events.addAccessTokenExpiring(function () {
    console.log("token expiring");
    log("token expiring");
});

mgr.events.addAccessTokenExpired(function () {
    console.log("token expired");
    log("token expired");
});

mgr.events.addSilentRenewError(function (e) {
    console.log("silent renew error", e.message);
    log("silent renew error", e.message);
});

mgr.events.addUserLoaded(function (user) {
    console.log("user loaded", user);
    mgr.getUser().then(function() {
        console.log("getUser loaded user after userLoaded event fired");
    });
});

mgr.events.addUserUnloaded(function (e) {
    console.log("user unloaded");
});

///////////////////////////////
// functions for UI elements
///////////////////////////////
function clearState() {
    mgr.clearStaleState().then(function() {
        log("clearStateState success");
    }).catch(function(e) {
        log("clearStateState error", e.message);
    });
}

function getUser() {
    mgr.getUser().then(function(user) {
        log("got user", user);
    }).catch(function(err) {
        log(err);
    });
}

function removeUser() {
    mgr.removeUser().then(function() {
        log("user removed");
    }).catch(function(err) {
        log(err);
    });
}

function startSigninMainWindow() {
    mgr.signinRedirect({state:"some data"}).then(function() {
        log("signinRedirect done");
    }).catch(function(err) {
        log(err);
    });
}

function endSigninMainWindow() {
    mgr.signinRedirectCallback().then(function(user) {
        log("signed in", user);
    }).catch(function(err) {
        log(err);
    });
}

function startSigninMainWindowDiffCallbackPage() {
    mgr.signinRedirect({state:"some data", redirect_uri: "http://localhost:1234/identityserver-sample-callback.html"}).then(function() {
        log("signinRedirect done");
    }).catch(function(err) {
        log(err);
    });
}

function popupSignin() {
    mgr.signinPopup({state:"some data"}).then(function(user) {
        log("signed in", user);
    }).catch(function(err) {
        log(err);
    });
}

function popupSignout() {
    mgr.signoutPopup({state:"some data"}).then(function() {
        log("signed out");
    }).catch(function(err) {
        log(err);
    });
}

function iframeSignin() {
    mgr.signinSilent({state:"some data"}).then(function(user) {
        log("signed in", user);
    }).catch(function(err) {
        log(err);
    });
}

function querySessionStatus() {
    mgr.querySessionStatus().then(function(status) {
        log("user's session status", status);
    }).catch(function(err) {
        log(err);
    });
}

function startSignoutMainWindow() {
    mgr.signoutRedirect({state:"some data"}).then(function(resp) {
    //mgr.signoutRedirect().then(function(resp) {
        log("signed out", resp);
    }).catch(function(err) {
        log(err);
    });
}

function endSignoutMainWindow() {
    mgr.signoutRedirectCallback().then(function(resp) {
        log("signed out", resp);
    }).catch(function(err) {
        log(err);
    });
}
