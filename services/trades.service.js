import Trade from "../models/trade.js";
import fs from 'fs';

export const fetchTradesWithImages = async () => {
    const trades = await Trade.find({});

    // Read the image file for each trade and include it in the response
    const tradesWithImage = await Promise.all(trades.map(async (trade) => {
        if (!trade.image) return trade.toJSON();
        const imageBuffer = await fs.promises.readFile(trade.image);
        const imageBase64 = imageBuffer.toString('base64');

        return {
            ...trade.toJSON(),
            image: imageBase64,
        };
    }));
    return tradesWithImage;
}

