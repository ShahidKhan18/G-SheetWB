
const { MessageMedia } = require("whatsapp-web.js");




// Check if user is registered on WhatsApp
async function isRegistered(number, client) {
    try {
        const response = await client.isRegisteredUser(number);
        return response;
    } catch (error) {
        console.error(`Error checking registration for ${number}:`, error);
        throw error;
    }
}

async function sendMessage(client, number, name, imagePath) {
    const media = MessageMedia.fromFilePath(imagePath);

    const message = `Hi ${(name && name.toLowerCase() !== "null") ? name : "Flipshoppers"},

🎉 *Flipshope's Birthday Sale is LIVE now!*

📱 Grab *iPhones, Earbuds, Speakers,* and more  
💥 At just *₹10*! Yes, you read that right!

🛍 Don’t miss out on the craziest deals of the year.  
🎯 *Reply with "SALE"* to participate instantly.`;
;
    // Simulate typing
    const chat = await client.getChatById(number);
    await chat.sendStateTyping(); // shows typing...

    // Wait to mimic human typing time (based on message length)
    await new Promise(resolve => setTimeout(resolve, Math.min(3000 + message.length * 20, 10000)));

    await chat.clearState(); // stops typing indicator

    await client.sendMessage(number, media, { caption: message });
}

module.exports = {
    sendMessage,
    isRegistered,
};
