import Mongoose from 'mongoose';

const SelectedAccount = new Mongoose.Schema({
    accountId: {
        type: String,
        required: true
    },
    accounts: { type: Object, ref: 'Account', default: {}, required: false },
    userId: {
        type: String,
        required: true
    },
});

const SelectedAccountModel = Mongoose.model('selectedAccount', SelectedAccount);

export default SelectedAccountModel;