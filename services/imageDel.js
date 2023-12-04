import fs from 'fs'

export async function deletImage(filename, callback) {
    await fs.unlink(`public/images/${filename}`, async (err) => {
        if (err) return callback(err)

        callback(null)
    })
}
