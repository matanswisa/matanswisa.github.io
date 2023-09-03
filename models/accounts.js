import Mongoose from 'mongoose';


const AccountsSchema = new Mongoose.Schema({
    AccountName: {
        type: String,
        required: true
    },
    
    Broker: {
        type: Number,
        required: true
    },

    Label: {
        type: String,
        required: true
    },

    trades: {
        type: Array,
        ref: 'Trade',
        default: []
    }
});

const Account = Mongoose.model('Account', AccountsSchema);

export default Account;