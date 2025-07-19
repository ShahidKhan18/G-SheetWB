
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

🎉 *Amazon Prime Day & Flipkart GOAT Sale are now LIVE!*

🛒 Get *up to 90% OFF* on Electronics, Fashion & more!  
💥 *Deals starting at just ₹99*  
🎧 *iPhones, Earbuds, Smartwatches* – Everything’s on sale!  
🔥 Don’t waste time hopping apps – find *ALL top deals* in one place on the *TBD App*.

👉 *Grab now:* https://app.fs9.in/tbd`;


    await client.sendMessage(number, media, { caption: message });
}

module.exports = {
    sendMessage,
    isRegistered,
};
