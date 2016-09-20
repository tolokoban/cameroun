"use strict";

var Storage = require("tfw.storage").session;


document.getElementById("error").textContent = Storage.get("error", "...");
