const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");
const path = require("path");

const SESSION_FOLDER = "./.wwebjs_auth"; // Folder to persist session
const logger = require("../logger");
const {

    isRegistered,
    sendMessage,

} = require("./utility/whatsapp");
const { removeSentUsers, loadUsers } = require("./utility/spreadsheet");


async function sendMessagesInBatches(users, client, TOTAL_TO_SEND, batchSize) {
    let sentCount = 0;

    while (sentCount < TOTAL_TO_SEND && sentCount < users.length) {
        console.log(`\nStarting batch at ${new Date().toLocaleTimeString()}`);
        let tempMsgCount = 0;

        for (
            let i = sentCount;
            i < sentCount + batchSize &&
            i < users.length &&
            sentCount < TOTAL_TO_SEND;
            i++
        ) {
            const user = users[i];
            const number = user.number.toString().length === 10
                ? "91" + user.number
                : user.number;
            const formattedNumber = `${number}@c.us`;

            const istDate = new Date(
                new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
            ).toLocaleString();

            try {
                if (await isRegistered(formattedNumber, client)) {
                    await sendMessage(
                        client,
                        formattedNumber,
                        user.name,
                        path.resolve(__dirname, "../image.png")
                    );

                    console.log(`✅ Sent to ${user.name} at ${formattedNumber}`);
                    logger.info({
                        status: "sent",
                        number: formattedNumber,
                        name: user.name,
                        time: istDate,
                    });
                    removeSentUsers(user.number);
                } else {
                    console.warn(`⚠️ Number ${formattedNumber} not registered.`);
                    logger.warn({
                        status: "not_registered",
                        number: formattedNumber,
                        name: user.name,
                        time: istDate,
                    });
                    removeSentUsers(user.number);
                }
            } catch (err) {
                console.error(`❌ Error sending to ${formattedNumber}:`, err.message);
                logger.error({
                    status: "error",
                    number: formattedNumber,
                    name: user.name,
                    message: err.message,
                    time: istDate,
                });
            }

            const delayMs = (Math.floor(Math.random() * 5) + 1) * 60000;
            console.log(`🕒 Waiting for ${delayMs / 60000} min...`);
            await new Promise((resolve) => setTimeout(resolve, delayMs));

            tempMsgCount++;
        }

        sentCount += tempMsgCount;
        console.log(`✅ Batch completed. Total sent so far: ${sentCount}`);
        logger.info({
            status: "batch_completed",
            sentCount,
            time: new Date(),
        });

        console.log("⏸️ Sleeping for 2 hours...");
        await new Promise((resolve) => setTimeout(resolve, 2 * 60 * 60 * 1000)); // Always sleep
    }

    console.log("🎯 Daily limit reached. Process completed.");
    return;
}



const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
    },
});


    // Handle events
    client.on("qr", (qr) => {
        console.log("📱 Scan this QR Code to log in:");
        qrcode.generate(qr, { small: true });
    });

    client.on("ready", async () => {
        console.log("✅ WhatsApp client is ready and session is persisted!");

        //+ Load users from user.xlxs
        const users = loadUsers();
        const TOTAL_TO_SEND = users?.length;
        const batchSize = 50;

        console.log(`${TOTAL_TO_SEND} total messages to send`);
        console.log(`${batchSize} batch size per session`);

        await sendMessagesInBatches(users, client, TOTAL_TO_SEND, batchSize);
    });

    client.on("authenticated", () => {
        console.log("🔐 WhatsApp authenticated!");
    });

    client.on("auth_failure", (msg) => {
        console.error("❌ Auth failed:", msg);
    });

    client.on("disconnected", () => {
        console.log("⚠️ Client disconnected. Reinitializing...");
        client.initialize(); // optional reconnect logic
    });
    client.on("message_create", (message) => {
        const msgContext = ["hii", "hi"];
        const userMsg = message.body.toLowerCase();

        if (msgContext.includes(userMsg)) {
            message.reply(
                "Hi,\nI hope the above link is clickable now.\n\nBtw, did this price drop alert help you?"
            );
        }
    });

    // Initialize immediately
    client.initialize();



// Export client to reuse in other files
module.exports = client;