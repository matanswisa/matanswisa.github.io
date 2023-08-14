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

    const userSelectedAccount = await SelectedAccountModel.findOne({ accountId });

    // Check if userSelectedAccount exists and has the 'account' property
    if (userSelectedAccount && userSelectedAccount.account) {
      const currentAccount = userSelectedAccount.account;
      const accountToDelete = accounts.find(acc => acc._id == currentAccount._id);

      if (!accountToDelete && accounts.length) {
        await SelectedAccountModel.updateOne({ userId: userId }, { accountId: accounts[0]._id, account: accounts[0] });
      } else if (!accountToDelete && accounts.length == 1) {
        await SelectedAccountModel.updateOne({ userId: userId }, { accountId: null, account: null });
      }


    } else {
      // Handle the case where 'account' property is missing or userSelectedAccount is null
      console.log("User selected account not found or does not have 'account' property.");
    }

    await User.updateOne({ _id: userId }, { accounts });

    // Check if the account exists
    const account = await Account.findById(accountId);
    if (!account) {
      // If the account doesn't exist, return an error response
      return res.status(400).json({ message: 'Account not found' });
    }

    await Account.findByIdAndDelete(accountId);

    res.status(200).json(accounts);
  } catch (error) {
    console.error(error);
    // Return an error response
    res.status(500).json({ message: 'Failed to delete the account' });
  }
});



router.post('/getSelectedAccount', authenticateToken, async (req, res) => {
  const { userId } = req.body;
  const selectedAccount = await SelectedAccountModel.findOne({ userId: userId });
  const user = await User.findById(userId);


  if (!selectedAccount && !user?.accounts.length) {
    res.status(400).send('No selected account found');
  } else if (!selectedAccount && user?.accounts.length) {
    res.status(200).send('ok');
  } else if (selectedAccount && user?.accounts.length) {
    res.status(200).json(selectedAccount.account);
  }
});

router.post('/setSelectedAccount', authenticateToken, async (req, res) => {
  try {
    const { userId, accountId } = req.body;
    const requestedAccount = await Account.findById(accountId);
    const selectedAccount = await SelectedAccountModel.findOne({ userId: userId });


    //in case account doesn't exists
    if (!requestedAccount) {
      return res.status(400).send('Couldn\'t find the account to set');
    }

    //in case we switch to account that does exists and its not the first time.
    // if (selectedAccount) {
    //   await SelectedAccountModel.updateOne({ userId }, { accountId: accountId, account: requestedAccount });
    //   return res.status(200).json(requestedAccount);
    // }
    console.log(selectedAccount);

    //First time for intializing selected account.
    if (!selectedAccount) {
      const result = await SelectedAccountModel.create({ userId, accountId, account: requestedAccount });
      return res.status(200).json(requestedAccount);
    } else { //in case account is already exists
      // const result = await SelectedAccountModel.create({ userId, accountId, account: requestedAccount.account });
      await SelectedAccountModel.updateOne({ userId }, { accountId: accountId, account: requestedAccount });

      return res.status(200).json(requestedAccount);
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
    const newAccount =  await Account.create(data);
    const accounts = user.accounts;
    // Add the new account to the user's accounts array
    accounts.push(newAccount);

    // Save the updated user object to the database
    // await user.save();
    await User.updateOne({ _id: userId }, { accounts })

    const selectedCurrentAccount = await SelectedAccountModel.findOne({ userId });
    // selectedCurrentAccount.account
    if (!selectedCurrentAccount) {
      await SelectedAccountModel.create({ userId, account: { ...newAccount }, accountId: newAccount._id });

    } else {
      await SelectedAccountModel.findOneAndUpdate({ userId }, { accountId: newAccount._id, account: newAccount });
    }

    res.status(200).json(accounts);

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
    await Account.findOneAndUpdate({ _id: accountId }, { AccountName, Label });
    await User.findByIdAndUpdate(userId, { accounts });



    res.status(200).json(accounts);
  } catch (error) {
    console.error('Error updating account:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;