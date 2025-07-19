const { googleSheetConnection } = require("../config/googleSpreadsheet");



async function loadUsers() {
    const doc = googleSheetConnection()
    try {
        await doc.loadInfo();
        console.log(doc.title);
        const sheet = doc.sheetsByIndex[0];
        const rows = await sheet.getRows();

        // console.log(rows)

        // console.log("Current Users:");
        const data = rows.map(row => ({
            name: row.get("name"),
            number: row.get("number")

        }));

        // console.log(data)
        return data;
    } catch (err) {
        console.error('Error in connectAndRead :', err);
    }
}

async function removeSentUsers(targetNumber) {
    const doc = googleSheetConnection()
    try {
        await doc.loadInfo();

        const sheet = doc.sheetsByIndex[0];
        const rows = await sheet.getRows();

        for (const row of rows) {
            if (row.get("number") === targetNumber) {
                await row.delete();
                console.log(`Deleted: ${row.get("name")}`);
            }
        }
    } catch (err) {
        console.error('Error in removeUserByNumber:', err);
    }
}

module.exports={
    loadUsers,
    removeSentUsers
}