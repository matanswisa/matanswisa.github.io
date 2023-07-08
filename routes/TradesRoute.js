import { Router } from "express";
import Trade from "../models/trade.js";
import multer from 'multer';
import Path from 'path';
const router = Router();


import { fileURLToPath } from 'url';
import { dirname } from 'path';

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


/**
 * This is a test
 */
router.post("/addTrade", async (req, res) => {
  try {
    const data = req.body;
    const result = await Trade.create(data);
    res.status(200).json({ tradeId: result._id });

  } catch (err) {
    console.error(err);
    res.status(500).send('Error when adding a trade');
  }
});


router.post("/editTrade", async (req, res) => {
  try {
    const data = req.body;
    console.log(data);
    const result = await Trade.findByIdAndUpdate(data.tradeId, { data });
    res.status(200).send(`Trade ${result._id} added succefully`);

  } catch (err) {
    console.err(err);
    res.status(500).send('Error when adding a trade');
  }
});


router.get('/fetchTrades', async (req, res) => {
  try {
    const trades = await Trade.find({});
    res.status(200).json(trades);
  } catch (err) {
    console.err(err);
    res.status(500).send(err);
  }
});

router.delete('/deleteTrade', async (req, res) => {
  try {
    const { tradeId } = req.body;
    if (tradeId) {
      const result = await Trade.deleteOne({ _id: tradeId });
      if (result) {
        res.status(200).send('Trade has been deleted');
      } else {
        res.status(400).send('Trade couldn\'t be deleted , there was a problem.');
      }
    }
  } catch (err) {
    res.status(500).send(err);
  }
})


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
        },
      },
    ]);

    // Extract the counts from the first element of the array (since we only have one result)
    const { lossCount, winCount } = tradeStats[0];

    res.json({ lossCount, winCount });
    console.log({ lossCount, winCount });
  } catch (error) {
    console.error('Error fetching trade stats:', error);
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
    console.log(tradesByDate);
  } catch (error) {
    console.error('Error fetching trades:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
});



router.post('/uploadTradeImage', upload.single('file'), async (req, res) => {
  console.log(req.body)
  try {
    const { tradeId } = req.body;
    const { path, originalname } = req.file;

    // Handle the uploaded image as needed
    // For example, you can save the image path or perform image processing

    // Update the Trade document with the image details
    const imagePath = Path.join(uploadsDirPath, originalname)
    const trade = await Trade.findByIdAndUpdate(tradeId, {
      $set: {
        image: imagePath
      }
    });
    if (trade) { res.status(200).json({ message: 'Image uploaded successfully' }); return; }
    res.status(400).send("Can't save trading image");

  } catch (err) {
    console.error('Error uploading trade image:', err);
    res.status(500).json({ error: 'An error occurred while uploading the image' });
  }
});



export default router;