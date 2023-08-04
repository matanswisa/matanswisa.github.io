import Trade from "../models/trade.js";
import fs from 'fs';
import User from "../models/user.js";

export const fetchTradesWithImages = async (trades) => {
    // const trades = await Trade.find({});

    // Read the image file for each trade and include it in the response
    const tradesWithImage = await Promise.all(trades.map(async (trade) => {
        if (!trade.image) return trade;
        const imageBuffer = await fs.promises.readFile(trade.image);
        const imageBase64 = imageBuffer.toString('base64');

        return {
            ...trade,
            image: imageBase64,
        };
    }));
    return tradesWithImage;
}


export const fetchUserTrades = async (userId, accountId) => {
    const user = await User.findById(userId);
    const currAccount = user.accounts.find(acc => acc._id == accountId);
    const tradesWithImages = fetchTradesWithImages(currAccount.trades);
    return tradesWithImages;
}
