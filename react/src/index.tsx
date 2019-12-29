import React from 'react'
import ReactDOM from 'react-dom'

import "./tfw/font/josefin.css"
import "./index.css"
import App from "./app"
import Theme from "./tfw/theme"
import WebService from './tfw/web-service'

const hostname = window.location.hostname
console.info("=", hostname);
if (hostname.indexOf('/') === -1 || hostname.indexOf('//localhost') !== -1) {
    WebService.setRoot("http://localhost:7474/web-soins/");
} else {
    WebService.setRoot("https://web-soins.com/");
}


Theme.register("soin", {
    white: "#fda", black: "#420",
    bg0: "#ffcb97", bg1: "#ffdab3", bg2: "#ffe6cc", bg3: "#fff3e6",
    bgP: "#742", bgPL: "#953", bgPD: "#531",
    bgS: "#ff9f30", bgSD: "#ff7f00", bgSL: "#ffbf60"
});
Theme.apply("soin");


async function start() {
    try {
        ReactDOM.render(
            <App />,
            document.getElementById('root'));
    }
    catch( ex ) {
        console.error(ex)
    }
}

start()
