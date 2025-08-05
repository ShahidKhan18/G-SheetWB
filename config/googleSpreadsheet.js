const { GoogleSpreadsheet } = require('google-spreadsheet');
const { JWT } = require('google-auth-library');
const creds = require('../credentials.json');


const googleSheetConnection=(bot)=>{
    const SHEET_ID = bot === "botA" ? process.env.GOOGLE_SHEET_ID_BOT_A : process.env.GOOGLE_SHEET_ID_BOT_B
    const serviceAccountAuth = new JWT({
        email: creds.client_email,
        key: creds.private_key,
        scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
    
    return new GoogleSpreadsheet(SHEET_ID, serviceAccountAuth);

}




module.exports = { googleSheetConnection };