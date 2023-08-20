import Account from "../models/accounts.js";
import SelectedAccountModel from "../models/selectedAccount.js";
import Trade from "../models/trade.js";
import User from "../models/user.js";
import fs from 'fs/promises';
import XLSX from 'xlsx';

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

    const csvHeaders = [
        'Date(UTC)', 'Symbol', 'Side', 'Price', 'Quantity',
        'Amount', 'Fee', 'Fee Coin', 'Realized Profit', 'Quote Asset'
      ];
    


      const workbook = XLSX.readFile(ExcelFile);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      // Convert the worksheet to a JSON object
      const excelJsonData = XLSX.utils.sheet_to_json(worksheet);

     


       const mergedRows = handleMergeRows(excelJsonData);
       console.log(mergedRows);

    };

