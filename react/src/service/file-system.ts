import mkdirp from './mkdirp'

const FS = window.require('fs')
const Path = window.require('path')

export default { readText, writeText }


function readText(filename: string): Promise<string> {
    return new Promise((resolve, reject) => {
        const fullPath = Path.resolve(filename)
        FS.readFile(fullPath, 'utf-8', (err, data) => {
            if (err) {
                reject(err)
            } else {
                resolve(data)
            }
        })
    })
}


function writeText(filename: string, content: string): Promise<string> {
    return new Promise((resolve, reject) => {
        const fullPath = Path.resolve(filename)
        const dirname = Path.dirname(fullPath)
        mkdirp(dirname, (err: any) => {
            if (err) reject(err)
            else FS.readFile(fullPath, 'utf-8', (err, data) => {
                if (err) reject(err)
                else resolve(data)
            })
        })
    })
}
