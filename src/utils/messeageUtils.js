
export function getMsg(messagesArr,typeOfMsg,MsgNumber,languageidx){
    let msgType = typeOfMsg == 1 ? "errors"  :  typeOfMsg == 2 ? "warnings" : typeOfMsg == 3 ? "success": "";

    let msgObject = messagesArr.find(msg => msg.type == msgType);
    console.log("msg type display:" , typeOfMsg, "msg number in db :" ,MsgNumber,);
    return({msgType:msgObject.messages[MsgNumber-1].msgType, msgText:msgObject.messages[MsgNumber-1].msgtext[languageidx].text})
}