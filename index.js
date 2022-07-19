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
        
        const ra = record[3].trimEnd();
        const dec = record[4].trim();

        JWSTRecord['label'] = JWSTDate;
        JWSTRecord['ra'] = ra;
        JWSTRecord['dec'] = dec;

        fs.appendFile('L2_formatted.txt', util.inspect(JWSTRecord) + ",\n", (done, err) => {
            if (err) {
                console.error("Error writing record: ", record);
                errorRows.push(record);
            }
            console.log('Wrote record: ', JWSTRecord)
        })
    }
})

fs.createReadStream(__dirname+'/L2_Ephemeris.csv').pipe(parser);