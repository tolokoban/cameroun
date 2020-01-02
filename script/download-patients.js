"use strict"

const FS = require("fs")
const Path = require("path")
const Query = require("request-promise-native")
const Chalk = require("chalk")

console.log()

if (process.argv.length < 4) {
    console.error("Please pass the carecenter code and the URL as argument!")
    console.error(`Example: node ${process.argv[1]} 1-GObgkAcMfr "https://web-soins.com"`)
    console.error()
    process.exit(1)
}

function parse(text) {
    try {
        return JSON.parse(text)
    }
    catch (err) {
        console.error(Chalk.red("The server did not return a valid JSON file!"))
        console.error(text)
        process.exit(2)
    }
}

function ensurePathIsEmpty(path) {
    if (FS.existsSync(path)) {
        console.error(Chalk.red("Please remove this folder:"), path)
        process.exit(4)
    }
    FS.mkdirSync(path)
}

async function start() {
    const path = Path.resolve(__dirname, "data")
    ensurePathIsEmpty(path)

    const carecenterCode = process.argv[2]
    const baseUrl = process.argv[3]
    console.log("Contacting web-soins server on " + Chalk.cyan(baseUrl) + "...")
    const url = `${baseUrl}/tfw/svc.php?s=snapshot&i="${carecenterCode}"`
    const data = parse(await Query(url))
    if (data === -1) {
        console.error(Chalk.red("Unknown carecenter code:"), carecenterCode)
        process.exit(3)
    }

    console.log(Chalk.cyan(`Writing ${Object.keys(data.list).length} patients to\n    ${path}`))
    FS.writeFileSync(
        Path.resolve(path, "patients.json"),
        JSON.stringify(data.index)
    )

    for (const patientId of Object.keys(data.list)) {
        const patientPath = Path.resolve(path, patientId)
        FS.mkdirSync(patientPath)
        FS.writeFileSync(
            Path.resolve(patientPath, "patient.json"),
            JSON.stringify(data.list[patientId])
        )
    }

    console.log(Chalk.green("Done!"))
    console.log()
}

start()
