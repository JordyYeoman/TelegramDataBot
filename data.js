const fetch = require('node-fetch');
const TelegramBot = require('node-telegram-bot-api');
const dotenv = require('dotenv').config();

// Required for Bot
const token = process.env.TELEGRAM_TOKEN;
// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, {polling: true});
//Get the ChatID - Number doesnt change.
const chatId = process.env.TELEGRAM_CHAT_ID;

// Precheck for Bot activity:
// Send random message on startup:
const jarvisQuote = "Good Morning Sir, the weather is a sunny warm day."
bot.sendMessage(chatId, jarvisQuote);

// Call this function at allotted time every 15 mins
// 1000 = 1s, so 1 min = 60 which is 60000ms 
// 60000 * minutes 
// 60000 * 15  = 900000
// 60000 * 30 = 1800000
setInterval(()=> {
    // fetchData
    dataCollectorOne();
    bot.sendMessage(chatId, jarvisQuote);
}, 1800000);
// Run above every 30 minutes ^ 

// Fetch Data from Ethermine
let miningDashboardUrl = process.env.MINING_DASHBOARD_URL;

function dataCollectorOne(){
    fetch(miningDashboardUrl)
    .then(res => res.json())
    .then(json => {
        let currentData = json.data.currentStatistics;
        let activeWorkers = currentData.activeWorkers;

        let unpaid = currentData.unpaid.toString();
        let unpaidConverted = '0.00' + unpaid;
        let unpaidFinal = parseFloat(unpaidConverted).toFixed(4);
        let requiredForPayout = 0.01;

        // Calc Percentage until payout
        let percentageUntilPayout = (unpaidFinal/requiredForPayout) * 100;
        
        let data = {
            UnpaidAmount: unpaidFinal,
            PercentageUntilPayout: percentageUntilPayout + '%',
            ActiveDwarves: activeWorkers,
        };

        console.log(data);
        return data;
    });
}


























// For future work, communicating with Huawei support atm. 
// let fusionSolarUrl = 'https://sg5.fusionsolar.huawei.com/systemNote/getNoReadNote';















// Listen for any kind of message. There are different kinds of
// messages.
// bot.on('message', (msg) => {
//   const chatId = msg.chat.id;

//   // send a message to the chat acknowledging receipt of their message
//   bot.sendMessage(chatId, 'Received your message');
// });

// Matches "/echo [whatever]"
// bot.onText(/\/echo (.+)/, (msg, match) => {
//     // 'msg' is the received Message from Telegram
//     // 'match' is the result of executing the regexp above on the text content
//     // of the message
  
//     const chatId = msg.chat.id;
//     const resp = match[1]; // the captured "whatever"
  
//     // send back the matched "whatever" to the chat
//     bot.sendMessage(chatId, `Chat ID is ${chatId}`);
//   });