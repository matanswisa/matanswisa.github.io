import Mongoose from 'mongoose';

const TradeSchema = new Mongoose.Schema({
    entryDate: {
        type: Date,
        required: true
    },
    symbol: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    netROI: {
        type: Number,
        required: false
    },
    longShort: {
        type: String,
        required: true
    },
    contracts: {
        type: Number,
        required: true
    },
    entryPrice: {
        type: Number,
        required: true
    },
    stopPrice: {
        type: Number,
        required: true
    },
    exitPrice: {
        type: Number,
        required: true
    },
    duration: {
        type: String,
        required: false
    },
    commission: {
        type: Number,
        required: false
    },
    netPnL: {
        type: Number,
        required: true
    },
    image: {
        type: String,
        required: false
    },
    comments: {
        type: String,
        required: false
    },
    tradeID: {
        type: String,
        required: false,
        unique: false,
    },

    tradesHistory: {
        type: [{
            entryDate: {
                type: Date,
                required: true
            },
            symbol: {
                type: String,
                required: true
            },
            status: {
                type: String,
                required: true
            },
            netROI: {
                type: Number,
                required: false
            },
            longShort: {
                type: String,
                required: true
            },
            contracts: {
                type: Number,
                required: true
            },
            entryPrice: {
                type: Number,
                required: true
            },
            exitPrice: {
                type: Number,
                required: true
            },
            duration: {
                type: String,
                required: false
            },
            commission: {
                type: Number,
                required: false
            },
            netPnL: {
                type: Number,
                required: true
            },
        }],
        default: [],
        require: false,
    }


});

const Trade = Mongoose.model('Trade', TradeSchema);

export default Trade;