const FS = window.require('fs')

export default { readText }


function readText(filename: string): Promise<string> {
    return new Promise((resolve, reject) => {
        FS.readFile(filename, 'utf-8', (err, data) => {
            if (err) {
                reject(err)
            } else {
                resolve(data)
            }
        })
    })
}
