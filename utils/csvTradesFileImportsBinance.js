import Account from "../models/accounts.js";
import SelectedAccountModel from "../models/selectedAccount.js";
import Trade from "../models/trade.js";
import User from "../models/user.js";
import Accounts from "../models/accounts.js"
import fs from 'fs/promises';
import XLSX from 'xlsx';
import { v4 as uuidv4 } from 'uuid';


function groupByPositionId(array) {
  const grouped = {};

  array.forEach(item => {
    const positionId = item['Position ID'];

    if (!grouped[positionId]) {
      grouped[positionId] = [];
    }

    grouped[positionId].push(item);
  });

  return grouped;
}


function handleMergeRows(excelJsonData) {
  const mergedRows = [];
  const groupedRows = {};

  excelJsonData.forEach(row => {
    const key = `${row.Symbol}-${row.Side}-${row.Price}`;
    if (!groupedRows[key]) {
      groupedRows[key] = { ...row };
    } else {
      groupedRows[key].Quantity = (+groupedRows[key].Quantity + +row.Quantity).toFixed(8);
      groupedRows[key].Amount = (+groupedRows[key].Amount + +row.Amount).toFixed(16);
      groupedRows[key].Fee = (+groupedRows[key].Fee + +row.Fee).toFixed(8);
      groupedRows[key]['Realized Profit'] = (+groupedRows[key]['Realized Profit'] + +row['Realized Profit']).toFixed(8);
    }
  });

  for (const key in groupedRows) {
    mergedRows.push(groupedRows[key]);
  }

  return mergedRows;
}




export const buildTradesDataByBinanceCSV = async (ExcelFile, userId, accountId) => {


  const trades = [];

  const workbook = XLSX.readFile(ExcelFile);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];

  // Convert the worksheet to a JSON object
  const excelJsonData = XLSX.utils.sheet_to_json(worksheet);

  const mergedRows = handleMergeRows(excelJsonData);
  for (let i = 0; i < mergedRows.length; i++) {

    const trade = mergedRows[i];

    const data = {
      entryDate: trade["Date(UTC)"] || "",
      symbol: trade["Symbol"] || "",
      status: trade["Realized Profit"] < 0 ? "Loss" : trade["Realized Profit"] > 0 ? "Win" : "Break Even",
      netROI: 0,
      stopPrice: 0,
      longShort: trade['Side'] == "SELL" ? "Short" : "Long",
      contracts: trade["Quantity"] || "",
      entryPrice: trade["Price"] || "",
      exitPrice: 0,
      duration: "",
      commission: parseFloat(trade["Fee"]).toFixed(2),
      comments: "",
      netPnL: parseFloat(trade["Realized Profit"]).toFixed(2),
      transactionId: uuidv4(), // Generate a unique ID using uuid
    }



    //Code is repeat itself need to create functions for later use
    const existingTrade = await Trade.findOne({ transactionId: data.transactionId });

    if (!existingTrade) {
      const newTrade = await Trade.create({
        entryDate: data.entryDate,
        symbol: data.symbol,
        status: data.status,
        netROI: data.netROI,
        longShort: data.longShort,
        contracts: data.contracts,
        entryPrice: data.entryPrice,
        stopPrice: data.stopPrice,
        exitPrice: data.exitPrice,
        duration: data.duration,
        commission: data.commission,
        netPnL: data.netPnL,
        transactionId: data.transactionId
      });


      trades.push(newTrade);
      const user = await User.findById(userId);
      const account = user.accounts.find(acc => acc._id == accountId);
      account.trades.push(newTrade);
      const tempAccounts = user.accounts.filter(acc => acc._id != accountId);
      tempAccounts.push(account);
      await User.updateOne({ _id: userId }, { accounts: tempAccounts });
      await SelectedAccountModel.updateOne({ userId }, { accountId, account });

    }
  }
  await Account.updateOne({ _id: accountId }, { trades: trades }); //pararm 1 = where update  param 2 = what update 


  for (const data of excelJsonData) {

    const longShort = data['Side'] == "SELL" ? "Short" : "Long";
    const symbol = data['Symbol'];
    const filter = { entryPrice: data.Price, longShort, symbol };
 
    let trade = await Trade.findOne(filter);
    // let account = Account.findOne({ _id: accountId })
    if (trade) {
      trade.tradesHistory.push({
        entryDate: data["Date(UTC)"] || "",
        symbol: data["Symbol"] || "",
        status: data["Realized Profit"] < 0 ? "Loss" : data["Realized Profit"] > 0 ? "Win" : "Break Even",
        netROI: 0,
        stopPrice: 0,
        longShort: data['Side'] == "SELL" ? "Short" : "Long",
        contracts: data["Quantity"] || "",
        entryPrice: data["Price"] || "",
        exitPrice: 0,
        duration: "",
        commission: parseFloat(data["Fee"]).toFixed(2),
        comments: "",
        netPnL: data["Realized Profit"],
        transactionId: trade.transactionId, // Generate a unique ID using uuid
      });

   
      await trade.save();
      //   await account.trade.save();
      const user = await User.findById(userId);
      let tempAccount = user.accounts.find(acc => acc._id == accountId);
      let tempTrades = tempAccount.trades.filter(tr => tr.transactionId != trade.transactionId);
      tempTrades.push(trade);
      tempAccount.trades = tempTrades;
      const userAccountWithNewUpdatedAccount = user.accounts.filter(account => account._id != accountId);
      userAccountWithNewUpdatedAccount.push(tempAccount);

      // user.accounts = userAccountWithNewUpdatedAccount;
      await User.updateOne({ _id: userId }, { accounts: userAccountWithNewUpdatedAccount })

      await Account.updateOne({ _id: accountId }, { trades: tempAccount.trades }); //pararm 1 = where update  param 2 = what update 

      //Remove current trade without the partials
      // user.trades.filter(trade => trade._id ===)

    } else {
      console.log(`No trade found for symbol ${data.Symbol} and longShort ${data.Side}`);
    }
  }




};

