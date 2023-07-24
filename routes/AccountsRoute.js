import { Router } from "express";
import Account from "../models/accounts.js";

const router = Router();


router.delete('/deleteAccount', async (req, res) => {
  try {
    const accountId = req.body.accountId; // Assuming the ID is passed in the request body
    console.log(accountId)
    // Check if the account exists
    const account = await Account.findById(accountId);
    if (!account) {
      // If the account doesn't exist, return an error response
      return res.status(404).json({ message: 'Account not found' });
    }
  
    // Perform the deletion logic using the accountId
    await Account.findByIdAndDelete(accountId);
    await Account.updateMany({}, { $set: { IsSelected: false } });
    

    const firstAccount = await Account.findOne({});
    if (firstAccount) {
      await Account.updateOne({ _id: firstAccount._id }, { $set: { IsSelected: true } });
    }
    // Return a success response
    res.status(200).json({ message: `Account deleted - ${accountId}` });
  } catch (error) {
    console.error(error);
    // Return an error response
    res.status(500).json({ message: 'Failed to delete the account' });
  }
});


router.post('/updateIsSelectedAccount', (req, res) => {
  const { AccountName } = req.body;
  console.log(AccountName);

  // Update the isSelected field for the specified account in the database

  // Assuming you're using a database library like Mongoose
  Account.updateMany(
    {}, // Update all accounts
    { IsSelected: "false" } // Set isSelected to "false" (as a string) for all accounts
  )
    .then(() => {
      Account.updateOne(
        { AccountName }, // Find the specified account by accountName
        { IsSelected: "true" } // Set isSelected to "true" (as a string) for the specified account
      )
        .then(() => {
          res.status(200).json({ message: 'isSelected field updated successfully' });
        })
        .catch((err) => {
          res.status(500).json({ message: 'Failed to update isSelected field' });
        });
    })
    .catch((err) => {
      res.status(500).json({ message: 'Internal server error' });
    });
});


router.get("/accounts", async (req, res) => {
  try {
    const accounts = await Account.find(); // Assuming you're using a MongoDB database and the Account model

    res.status(200).json(accounts);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error when retrieving accounts');
  }
});



router.post("/createAccount", async (req, res) => {


  try {
    const data = req.body;
    const result = await Account.create(data);
    
    // Update other accounts' IsSelected field to "false"
    await Account.updateMany(
      { _id: { $ne: result._id } }, // Excluding the newly created account
      { $set: { IsSelected: "false" } }
      );
      
      
          // Update the newly created account's IsSelected field to "true"
          await Account.updateOne(
            { _id: result._id },
            { $set: { IsSelected: "true" } }
          );
    res.status(200).json({ AccountId: result._id });

  } catch (err) {
    console.error(err);
    res.status(500).send('Error when adding a Account');
  }
});





// Update an existing account by ID
router.put("/editAccount/:id", async (req, res) => {
    const accountId = req.params.id;
    const data = req.body;
  
    try {
      // Update the account with the provided data
      await Account.findByIdAndUpdate(accountId, data);
  
      // If you want to update other accounts' IsSelected field to "false" except the updated account
      await Account.updateMany(
        { _id: { $ne: accountId } },
        { $set: { IsSelected: "false" } }
      );
  
      // Update the updated account's IsSelected field to "true"
      await Account.findByIdAndUpdate(accountId, { $set: { IsSelected: "true" } });
  
      res.status(200).json({ message: "Account updated successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).send("Error when updating the account");
    }
  });
  


export default router;