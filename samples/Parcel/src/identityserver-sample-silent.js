import { UserManager, Log } from "../../../src";
import { settings } from "./identityserver-sample-settings";

Log.logger = console;
Log.level = Log.INFO;

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
void new UserManager(settings).signinSilentCallback();
