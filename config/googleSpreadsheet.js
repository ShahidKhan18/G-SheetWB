const { GoogleSpreadsheet } = require('google-spreadsheet');
const { JWT } = require('google-auth-library');
const creds = require('./credentials.json');


const googleSheetConnection=()=>{
    
    const serviceAccountAuth = new JWT({
        email: creds.client_email,
        key: creds.private_key,
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
    
    return new GoogleSpreadsheet(SHEET_ID, serviceAccountAuth);

}




module.exports = { googleSheetConnection };