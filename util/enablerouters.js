const fs = require('fs');

module.exports = (app) => {
    fs.readdirSync("routes").forEach((file) => {
        let filename = file.split(".")[0];
        const router = require(`../routes/${file}`);
        app.use(`/${filename==="index"?"/":file}`,router);
    });
}
