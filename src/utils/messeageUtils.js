
export function getMsg(messagesArr,typeOfMsg,MsgNumber){
    console.log(messagesArr,typeOfMsg,MsgNumber);
    let msgType = typeOfMsg == 1 ? "errors"  :  typeOfMsg == 2 ? "warnings" : typeOfMsg == 3 ? "success": "";

    let msgObject = messagesArr.find(msg => msg.type == msgType);
    console.log(msgObject.messages[MsgNumber-1].msgtext["msgtextEng"]);
    return({msgType:msgObject.messages[MsgNumber-1].msgType, msgText:msgObject.messages[MsgNumber-1].msgtext})
}