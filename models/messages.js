import mongoose from 'mongoose';

const messagesSchema = new mongoose.Schema({
    type: String, // Added 'type' field
    messages: [{   // An array of objects
        msgnum: Number,
        msgType: String,
        msgtext: String,
    }],
});




const Messages = mongoose.model('Messages', messagesSchema);

export default Messages;
