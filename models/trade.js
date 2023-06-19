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
        required: true
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
        type: Number,
        required: true
    },
    commission: {
        type: Number,
        required: true
    },
    netPnL: {
        type: Number,
        required: true
    },
    image: {
        type: String,
        required: false
    }
});

const Trade = Mongoose.model('Trade', TradeSchema);

export default Trade;