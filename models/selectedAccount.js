import Mongoose from 'mongoose';

const SelectedAccount = new Mongoose.Schema({
    accountId: {
        type: String,
        required: true
    },
    account: { type: Object, ref: 'Account', default: {}, required: false },
    userId: {
        type: String,
        required: true,
        uniqe: true
    },
});

const SelectedAccountModel = Mongoose.model('selectedAccount', SelectedAccount);

export default SelectedAccountModel;