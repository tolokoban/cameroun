"use strict"

const Query = require("request-promise-native")

if (process.argv.length < 3) {
    console.error("Please pass the carecenter code as argument!")
    process.exit(1)
}

async function start() {
    const carecenterCode = process.argv[2]
    const url = `https://web-soins.com/tfw/svc.php?s=snapshot&i="${carecenterCode}"`
    const text = await Query(url)
    console.log(text)
}

start()
