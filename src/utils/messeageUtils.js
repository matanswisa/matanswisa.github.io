


export function getMsg(messagesArr,typeOfMsg,indexOfMsg){
    let msgObject =messagesArr.find(msg => msg.type == typeOfMsg)
    return({msgType:msgObject.messages[indexOfMsg].msgType, msgText:msgObject.messages[indexOfMsg].msgtext})
}