import { Router } from "express";
import Trade from "../models/trade.js";
import multer from 'multer';
import Path from 'path';
const router = Router();


import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs';
import { fetchTradesWithImages, fetchUserTrades } from "../services/trades.service.js";
import User from "../models/user.js";
import Account from "../models/accounts.js";
import { authenticateToken } from "../auth/jwt.js";
import parse from 'csv-parser';
import { buildTradesDataByTradovateCSV } from "../utils/csvTradesFileUtils.js";
import SelectedAccountModel from "../models/selectedAccount.js";

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

    await Account.findByIdAndUpdate(accountId, { trades: accountObj.trades });
    await User.updateOne({ _id: userId }, { accounts: accounts });
    // await account.save();
    
    const tradesWithImage = await fetchTradesWithImages(accountObj.trades);

    res.status(200).json(tradesWithImage);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error when adding a trade');
  }
});




router.post("/importTrades", authenticateToken, upload.single('file'), async (req, res) => {
  try {
    const { userId, accountId } = req.body;

    const tradesData = [];
    fs.createReadStream(req.file.path)
      .pipe(parse({ delimiter: ',' }))
      .on('data', (row) => {
        tradesData.push(row);
      })
      .on('end', async () => {
        fs.unlinkSync(req.file.path); // Remove the temporary file

      
        buildTradesDataByTradovateCSV(tradesData, userId, accountId);
  
        const trades = await fetchUserTrades(userId, accountId);

        // Send the response indicating success
        res.status(200).json(trades);
      });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error when importing trades' });
  }
});





router.get('/fetchTrades', authenticateToken, async (req, res) => {
  try {
    const { userId, accountId } = req.body;
    const user = await User.findById(userId);
    if (!user?.accounts && !user?.accounts.length) return res.status(400).send("No Accounts exists for this user");
    if (!accounts?.trades) return res.status(400).send("No trades exists for this user account");

    const accounts = user.accounts.find(account => account._id == accountId);

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

    const { tradeId, accountId, userId } = req.body;

    // Assuming the 'Trade', 'User', 'Account', and 'getAccountOfUserById' functions are properly defined and working.
  
    const result = await Trade.findByIdAndDelete(tradeId);

    if (result) {
      const account = await getAccountOfUserById(userId, accountId);
      const tradesWithoutCurrTrade = account.trades.filter(trade => trade._id != tradeId);
      account.trades = tradesWithoutCurrTrade;

      await User.findByIdAndUpdate(userId, { accounts: account });
      await Account.findOneAndUpdate({ _id: accountId }, account);

      // Assuming 'fetchTradesWithImages' properly fetches trade data with images
      // const tradesWithImage = await fetchTradesWithImages(account.trades);
      const trades = await fetchUserTrades(userId, accountId);
      res.status(200).json(trades);
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


router.post('/WinAndLossTotalTime', authenticateToken, async (req, res) => {
  try {
    const { trades } = req.body;

    let lossCount = 0;
    let winCount = 0;
    let breakEvenCount = 0;

    trades.forEach((trade) => {
      if (trade.status === 'Loss') {
        lossCount++;
      } else if (trade.status === 'Win') {
        winCount++;
      }

      if (trade.netPnL === 0) {
        breakEvenCount++;
      }
    });

    const updatedTradeStats = {
      lossCount,
      winCount,
      breakEvenCount,
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


router.post('/ShowInfoBySpecificDate', authenticateToken, async (req, res) => {
  try {
    const { trades, date } = req.body;

    const tradesByDate = trades.filter(trade => {
      const tradeDate = new Date(trade.entryDate).toISOString().split('T')[0];
      return tradeDate === date;
    });

    res.json(tradesByDate);
  } catch (error) {
    console.error('Error fetching trades:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

router.post('/ShowInfoByDates', authenticateToken, async (req, res) => {
  try {
    const { trades } = req.body;
   
    const tradesByDate = trades.reduce((result, trade) => {
      const tradeDate = trade.entryDate.substring(0, 10); // Extract YYYY-MM-DD from the full entryDate
      const existingEntry = result.find(entry => entry._id === tradeDate);

      if (existingEntry) {
        if (trade.status === 'Loss') {
          existingEntry.lossCount++;
          existingEntry.totalPnL -= trade.netPnL;
        } else if (trade.status === 'Win') {
          existingEntry.winCount++;
          existingEntry.totalPnL += trade.netPnL;
          
        }
        existingEntry.totalPnL += trade.netPnL;
      } else {
        result.push({
          _id: tradeDate,
          lossCount: trade.status === 'Loss' ? 1 : 0,
          winCount: trade.status === 'Win' ? 1 : 0,
          totalPnL: trade.status === 'Loss' ? -trade.netPnL : trade.netPnL,
        });
      }
      console.log(result);

      return result;
    }, []);

    tradesByDate.sort((a, b) => b._id.localeCompare(a._id)); // Sort by descending date

    res.json(tradesByDate);
  } catch (error) {
    console.error('Error fetching trades:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
});




router.post('/DailyStatsInfo', authenticateToken, async (req, res) => {
  try {
    const { trades } = req.body;
 
    const tradesByDate = trades.reduce((result, trade) => {
      const date = new Date(trade.entryDate).toISOString().substr(0, 10);

      if (!result[date]) {
        result[date] = {
          _id: date,
          loss: 0,
          win: 0,
          numberOfTrades: 0,
          totalPnL: 0,
          Commission: 0,
          totalLoss: 0, // Initialize totalLoss
          totalWin : 0,
        };
      }

      result[date].numberOfTrades++;
      result[date].Commission += trade.commission || 0;

      if (trade.status == "Win") {
        result[date].totalPnL += trade.netPnL;
        result[date].totalWin += trade.netPnL; // Subtract from totalLoss
        result[date].win++;
      } else if (trade.status == "Loss") {
        result[date].totalPnL -= trade.netPnL; // Subtract from totalPnL
        result[date].totalLoss -= trade.netPnL; // Subtract from totalLoss
        result[date].loss++;
      }

      return result;
    }, {});

    // Convert the aggregated data to an array
    const aggregatedData = Object.values(tradesByDate);

    // Sort the array by date in descending order
    aggregatedData.sort((a, b) => b._id.localeCompare(a._id));

    res.json(aggregatedData);
  } catch (error) {
    console.error('Error fetching trades:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
});






router.post('/uploadTradeImage', upload.single('file'), async (req, res) => {
 
  try {
    const { tradeId, userId, accountId } = req.body;
    if (!req.file) return res.status(400).send("No image file to upload");
    const { path, originalname } = req.file;
    // Handle the uploaded image as needed
    // For example, you can save the image path or perform image processing

    // Update the Trade document with the image details
    const imagePath = Path.join(uploadsDirPath, originalname);
    const trade = await Trade.findOneAndUpdate({ _id: tradeId }, {
      image: imagePath
    });

    const user = await User.findOne({ _id: userId });
    const accountOfUser = user.accounts.find(acc => acc._id == accountId);
    const tradeOfAccount = accountOfUser.trades.find(trade => trade._id == tradeId);

    //updating user , and accounts and trades.
    tradeOfAccount.image = imagePath;
    accountOfUser.trades.push(tradeOfAccount);
    user.accounts = [...user.accounts.filter(acc => acc._id == accountId), accountOfUser];

    // User.findByIdAndUpdate(userId,{accounts:})
    user.save();


    const tradesWithImage = fetchTradesWithImages(accountOfUser.trades);
    if (trade) { return res.status(200).json(tradesWithImage) }
    return res.status(400).send("Can't save trading image");

  } catch (err) {
    console.error('Error uploading trade image:', err);
    res.status(500).json({ error: 'An error occurred while uploading the image' });
  }
});



export default router;