// Packages and libraries used to do stuff
const fs = require('fs'); // gives us access to the filesystem
const { parse } = require('csv-parse'); // a CSV parsing library
const moment = require('moment'); // a library for working with dates/times
const util = require('util'); // Node utilities


const parser = parse(); // creates the CSV parser object
const reformattedFilename = 'JWST_formatted.txt'; // the default output file name

parser.on('readable', () => { // when the parser can read the input
    let record; // initialize a variable for a line of our input CSV file data
    while ((record = parser.read()) !== null) { // while the next line of the input CSV file is not null
        let JWSTRecord = {}; // create the object that will hold our reformatted data
        const rawDate = record[0].trim().replace(' 00:00', ''); // get the date and chop off the 00:00 bit 
        const JWSTDate = moment(rawDate).format('MMM DD') // reformat the date to the format we need (i.e. "Aug 09")
        
        const ra = record[3].trim(); // get the ra value
        const dec = record[4].trim(); // get the declination value

        // add all three values to the object. The resulting object will look like this: {label: "Aug 09", ra: "20 04 09.98", dec: "-27 50 18.2"}
        JWSTRecord['label'] = JWSTDate;
        JWSTRecord['ra'] = ra;
        JWSTRecord['dec'] = dec;

        try {
            // push the new line into the output file. If the file doesn't exist, fs.appendFileSync will create it
            fs.appendFileSync(reformattedFilename, util.inspect(JWSTRecord) + ",\n")
            console.log('Wrote record: ', JWSTRecord)
        } catch (err) {
                console.error("Error writing record: ", record);
            }
    }
})

// delete any existing output files (that were created last time you ran the script)
if (fs.existsSync(reformattedFilename)) {
    fs.unlinkSync(reformattedFilename)
}

// read the input file and pipe it through the parser (this kicks everything off)
fs.createReadStream(__dirname+'/JWST_Ephemeris.csv').pipe(parser);