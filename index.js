const fs = require('fs'); 
const { parse } = require('csv-parse');
const parser = parse();
const moment = require('moment');
const util = require('util');

const errorRows = [];

parser.on('readable', () => {
    let record;
    while ((record = parser.read()) !== null) {
        let JWSTRecord = {};
        const rawDate = record[0].trim().replace(' 00:00', '');
        const JWSTDate = moment(rawDate).format('MMM DD')
        
        const ra = record[3].trim();
        const dec = record[4].trim();

        JWSTRecord['label'] = JWSTDate;
        JWSTRecord['ra'] = ra;
        JWSTRecord['dec'] = dec;
        try {
            fs.appendFileSync('JWST_formatted.txt', util.inspect(JWSTRecord) + ",\n")
            console.log('Wrote record: ', JWSTRecord)
        } catch (err) {
                console.error("Error writing record: ", record);
                errorRows.push(record);
            }
    }
})

fs.createReadStream(__dirname+'/JWST_Ephemeris.csv').pipe(parser);