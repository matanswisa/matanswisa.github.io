import { Router } from "express";
import Account from "../models/accounts.js";
import User from "../models/user.js";
import Mongoose from "mongoose";
import { authenticateToken } from "../auth/jwt.js";
import SelectedAccountModel from "../models/selectedAccount.js";

const router = Router();


router.delete('/deleteAccount', authenticateToken, async (req, res) => {
  try {
    const { accountId, userId } = req.body; // Assuming the ID is passed in the request body

    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    let accounts = user.accounts;
    if (!accounts.length) return res.status(400).json({ message: "No accounts to delete" });


    // Filter out the account to be deleted
    accounts = accounts.filter(account => account._id != accountId);
    await User.updateOne({ _id: userId }, { accounts });

    // Check if the account exists
    const account = await Account.findById(accountId);
    if (!account) {
      // If the account doesn't exist, return an error response
      return res.status(400).json({ message: 'Account not found' });
    }

    // Perform the deletion logic using the accountId
    await Account.findByIdAndDelete(accountId);

    // Update the IsSelected field for the remaining accounts
    await Account.updateMany({}, { $set: { IsSelected: false } });

    // Set the IsSelected field to true for the first account (if available)
    const firstAccount = await Account.findOne({});
    if (firstAccount) {
      await Account.updateOne({ _id: firstAccount._id }, { $set: { IsSelected: true } });
    }

    // Return a success response
    res.status(200).json({ accountId });
  } catch (error) {
    console.error(error);
    // Return an error response
    res.status(500).json({ message: 'Failed to delete the account' });
  }
});


router.post('/setSelectedAccount', authenticateToken, async (req, res) => {
  try {
    const { userId, accountId } = req.body;
    const requestedAccount = await Account.findById(accountId);
    const selectedAccount = await SelectedAccountModel.find({ userId: userId });

    if (!requestedAccount) {
      res.status(400).send('Couldn\'t find the account to set');
    }

    if (!selectedAccount) {
      const result = await SelectedAccountModel.create({ userId, accountId, account: requestedAccount });
      res.status(200).json(result);
    } else {
      await SelectedAccountModel.create({ userId, accountId, account: requestedAccount });
      res.status(200).json(requestedAccount);
    }
  } catch (err) {
    res.status(500).send(err);
  }
});


router.post("/accounts", authenticateToken, async (req, res) => {
  try {
    const { userId } = req.body;
    console.log(req.body);
    const user = await User.findById(userId);
    const accounts = user.accounts;

    res.status(200).json(accounts);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error when retrieving accounts');
  }
});



router.post("/createAccount", authenticateToken, async (req, res) => {
  try {
    const { userId, data } = req.body;

    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Create a new account with the provided data
    const newAccount = await Account.create(data);
    const accounts = user.accounts;
    // Add the new account to the user's accounts array
    accounts.push(newAccount);

    // Save the updated user object to the database
    // await user.save();
    await User.updateOne({ _id: userId }, { accounts })

    // Update other accounts' IsSelected field to "false"
    await Account.updateMany(
      { _id: { $ne: newAccount._id } }, // Excluding the newly created account
      { $set: { IsSelected: "false" } }
    );

    // Update the newly created account's IsSelected field to "true"
    await Account.updateOne(
      { _id: newAccount._id },
      { $set: { IsSelected: "true" } }
    );

    res.status(200).json(newAccount);

  } catch (err) {
    console.error(err);
    res.status(500).send('Error when adding an Account');
  }
});

router.put("/editAccount", authenticateToken, async (req, res) => {
  const { userId, accountId, AccountName, Label, IsSelected } = req.body;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(400).json({ error: 'User not found' });
    }

    // Find the account to update in the user's accounts array
    const accountToUpdate = user.accounts.find((account) => account._id == accountId);

    if (!accountToUpdate) {
      return res.status(400).json({ error: 'Account not found for this user' });
    }

    // Update the account properties
    accountToUpdate.AccountName = AccountName;
    accountToUpdate.Label = Label;
    accountToUpdate.IsSelected = IsSelected;

    const accounts = user.accounts.filter(account => account._id != accountId);

    accounts.push(accountToUpdate);
    await Account.findOneAndUpdate({ _id: accountId }, { AccountName, Label, IsSelected: "true" });
    await User.findByIdAndUpdate(userId, { accounts });

    await Account.updateMany(
      { _id: { $ne: accountId } },
      { $set: { IsSelected: "false" } }
    );

    return res.status(200).json(accountToUpdate);
  } catch (error) {
    console.error('Error updating account:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;