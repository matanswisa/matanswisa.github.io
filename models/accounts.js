import Mongoose from 'mongoose';

const AccountsSchema = new Mongoose.Schema({
   
   
    AccountName: {
        type: String,
        required: true
    },  

    Label: {
        type: String,
        required: true
    }, 
   
    IsSelected: {
        type: String,
        required: true
    },

});

const Account = Mongoose.model('Account', AccountsSchema);

export default Account;