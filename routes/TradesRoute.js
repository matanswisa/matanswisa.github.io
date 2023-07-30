import { Router } from "express";
import Trade from "../models/trade.js";
import multer from 'multer';
import Path from 'path';
const router = Router();


import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs';
import { fetchTradesWithImages } from "../services/trades.service.js";
import User from "../models/user.js";
import Account from "../models/accounts.js";
import { authenticateToken } from "../auth/jwt.js";
// import { fetchTradesWithImages } from "./services";

const currentFilePath = fileURLToPath(import.meta.url);
const currentDirPath = dirname(currentFilePath);
const uploadsDirPath = Path.join(currentDirPath, '..', '/uploads/');

// Multer configuration:
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDirPath);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage });


//need to split to other file - 
async function getAccountOfUserById(userId, accountId) {
  const user = await User.findById(userId);
  const accounts = user.accounts.find(account => account._id == accountId);
  return accounts;
}

/**
 * //TODO: when adding a trade need to make sure i get the account ID and userId for related trades.
  */
router.post("/addTrade", authenticateToken, async (req, res) => {
  try {
    const { userId, accountId, tradeData } = req.body;
    const user = await User.findById(userId);
    let accounts = user.accounts;
    const accountObj = user.accounts.find(account => account._id == accountId);

    accounts = accounts.filter((account) => account._id !== accountObj._id);
    if (!accounts) return res.status(400).send("Can't find account");

    const createdTrade = await Trade.create(tradeData);
    accountObj.trades.push(createdTrade);

    accounts.push(accountObj);
    // account.trades = accounts;
    await Account.findByIdAndUpdate(accountId, { trades: accountObj.trades });
    await User.updateOne({ _id: userId }, { accounts: accounts });
    // await account.save();
    const result = await Trade.create(tradeData);

    const tradesWithImage = await fetchTradesWithImages(accountObj.trades);

    res.status(200).json(tradesWithImage);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error when adding a trade');
  }
});


router.get('/fetchTrades', authenticateToken, async (req, res) => {
  try {
    const { userId, accountId } = req.body;
    const user = await User.findById(userId);
    const accounts = user.accounts.find(account => account._id == accountId);
    if (!accounts?.trades) return res.status(400).send("No trades exists for this account");

    const tradesWithImage = await fetchTradesWithImages(accounts.trades);
    if (!tradesWithImage.length) return res.status(400).send("There isn't any trades to display");
    res.status(200).json({ accountId, trades: tradesWithImage });
  } catch (err) {
    console.error(err);
    res.status(500).send(err);
  }
});

router.post("/editTrade", authenticateToken, async (req, res) => {

  try {
    const { userId, accountId, tradeId, tradeData } = req.body;
    //first updating the trade object and get it back
    const result = await Trade.findByIdAndUpdate(tradeId, tradeData);
    console.log(result);
    const account = await getAccountOfUserById(userId, accountId);
    const tradesWithoutCurrTrade = account.trades.filter(trade => trade._id != tradeId);
    tradesWithoutCurrTrade.push(tradeData);
    account.trades = tradesWithoutCurrTrade;
    await User.findByIdAndUpdate(userId, { accounts: account });
    await Account.findOneAndUpdate({ _id: accountId }, account);


    const tradesWithImage = await fetchTradesWithImages(account.trades);

    res.status(200).json(tradesWithImage);
  } catch (err) {
    console.err(err);
    res.status(500).send('Error when adding a trade');
  }
});

router.post('/deleteTrade', authenticateToken, async (req, res) => {
  try {

    console.log(req.body);
    const { tradeId, accountId, userId } = req.body;

    // Assuming the 'Trade', 'User', 'Account', and 'getAccountOfUserById' functions are properly defined and working.

    const result = await Trade.findByIdAndDelete(tradeId);

    if (result) {
      const account = await getAccountOfUserById(userId, accountId);
      const tradesWithoutCurrTrade = account.trades.filter(trade => trade._id.toString() !== tradeId);
      account.trades = tradesWithoutCurrTrade;

      await User.findByIdAndUpdate(userId, { accounts: account });
      await Account.findOneAndUpdate({ _id: accountId }, account);

      // Assuming 'fetchTradesWithImages' properly fetches trade data with images
      const tradesWithImage = await fetchTradesWithImages(account.trades);

      res.status(200).json(tradesWithImage);
    } else {
      res.status(400).send('Trade couldn\'t be deleted, there was a problem.');
    }
  } catch (err) {
    res.status(500).send(err.message || 'Internal server error');
  }
});


router.get('/getDailyStats', async (req, res) => {
  try {
    const tradesByDate = await Trade.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$entryDate' } },
          trades: { $push: '$$ROOT' },
        },
      },
      { $sort: { _id: -1 } }, // Sort by descending entryDate
    ]);

    // Iterate through the trades and read the image file to include the image data in the response
    for (const tradeGroup of tradesByDate) {
      for (const trade of tradeGroup.trades) {
        if (trade.image) {
          const imageData = fs.readFileSync(trade.image, 'base64');
          trade.image = imageData;
        }
      }
    }

    res.json(tradesByDate);
  } catch (error) {
    console.error('Error fetching trades:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
});


router.get('/WinAndLossTotalTime', async (req, res) => {
  try {
    const tradeStats = await Trade.aggregate([
      {
        $group: {
          _id: null,
          lossCount: { $sum: { $cond: [{ $eq: ['$status', 'Loss'] }, 1, 0] } },
          winCount: { $sum: { $cond: [{ $eq: ['$status', 'Win'] }, 1, 0] } },
          breakEvenCount: { $sum: { $cond: [{ $eq: ['$netPnL', 0] }, 1, 0] } }
        },
      },
    ]);

    const updatedTradeStats = {
      lossCount: tradeStats[0].lossCount,
      winCount: tradeStats[0].winCount,
      breakEvenCount: tradeStats[0].breakEvenCount
    };

    res.json(updatedTradeStats);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred' });
  }
});




router.get('/ShowNumOfTradeTotalPnlInfoByDates', async (req, res) => {
  try {
    const tradesByDate = await Trade.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$entryDate' } },
          trades: { $sum: 1 }, // Count of trades
          totalPnL: { $sum: '$netPnL' },
        },
      },
      { $sort: { _id: -1 } }, // Sort by descending entryDate
    ]);

    res.json(tradesByDate);
  } catch (error) {
    console.error('Error fetching trades:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

router.get('/ShowInfoBySpecificDate/:date', async (req, res) => {
  try {
    const { date } = req.params;

    const tradesByDate = await Trade.find({ entryDate: date });

    res.json(tradesByDate);
    console.log(tradesByDate);
  } catch (error) {
    console.error('Error fetching trades:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
});



router.get('/ShowInfoByDates', async (req, res) => {
  try {
    const tradesByDate = await Trade.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$entryDate' } },
          lossCount: { $sum: { $cond: [{ $eq: ['$status', 'Loss'] }, 1, 0] } },
          winCount: { $sum: { $cond: [{ $eq: ['$status', 'Win'] }, 1, 0] } },
          totalPnL: { $sum: '$netPnL' },
        },
      },
      { $sort: { _id: -1 } }, // Sort by descending entryDate
    ]);

    res.json(tradesByDate);
  } catch (error) {
    console.error('Error fetching trades:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

router.get('/DailyStatsInfo', async (req, res) => {
  try {
    const tradesByDate = await Trade.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$entryDate' } },
          loss: { $sum: { $cond: [{ $eq: ['$status', 'Loss'] }, 1, 0] } },
          win: { $sum: { $cond: [{ $eq: ['$status', 'Win'] }, 1, 0] } },
          numberOfTrades: { $sum: 1 }, // Calculate the total number of trades
          totalPnL: { $sum: '$netPnL' },
          Commission: { $sum: '$commission' }, // Add the Commission field and calculate the sum of commission
          totalWin: { $sum: { $cond: [{ $gt: ['$netPnL', 0] }, '$netPnL', 0] } }, // Calculate the sum of netPnL when above zero
          totalLoss: { $sum: { $cond: [{ $gt: ['$netPnL', 0] }, 0, '$netPnL'] } }, // Calculate the sum of netPnL when below or equal to zero
        },
      },
      { $sort: { _id: -1 } }, // Sort by descending entryDate
    ]);

    res.json(tradesByDate);
  } catch (error) {
    console.error('Error fetching trades:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
});


router.post('/uploadTradeImage', upload.single('file'), async (req, res) => {
  console.log(req.body)
  try {
    const { tradeId } = req.body;
    if (!req.file) return res.status(400).send("No image file to upload");
    const { path, originalname } = req.file;
    // Handle the uploaded image as needed
    // For example, you can save the image path or perform image processing

    // Update the Trade document with the image details
    const imagePath = Path.join(uploadsDirPath, originalname);
    const trade = await Trade.findOneAndUpdate({ _id: tradeId }, {
      image: imagePath
    });

    const tradesWithImage = fetchTradesWithImages();
    if (trade) { return res.status(200).json(tradesWithImage) }
    return res.status(400).send("Can't save trading image");

  } catch (err) {
    console.error('Error uploading trade image:', err);
    res.status(500).json({ error: 'An error occurred while uploading the image' });
  }
});



export default router;