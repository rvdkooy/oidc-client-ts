
import { UserManager, Log } from "../../../src";

var log = {
    debug:logMessage, warn: logMessage, info: logMessage, error:logMessage
};

function logMessage(msg) {
    document.getElementById("logMessages").innerHTML += "<li>" + msg + "</li>";
    console.log(msg);
}

Log.logger = console; // log;
Log.level = Log.DEBUG;

new UserManager({response_mode:"query"}).signinCallback().catch(function(err) {
    Log.logger.error("error: " + err && err.message);
});
