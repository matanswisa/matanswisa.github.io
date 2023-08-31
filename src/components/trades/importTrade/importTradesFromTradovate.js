

const validationBeforeImportCsvFileFromTradeovate = (file) => {
   

    let validationPassed = true;

    if (!file.name.endsWith('.csv')) {
      validationPassed = false;
      notifyToast(getMsg(messages, msgType.warnings, msgNumber[3]).msgText, getMsg(messages, msgType.warnings, msgNumber[3]).msgType);
      //     notifyToast('Please select a CSV  file.', 'warning');
      return false; // Validation failed
    }

    if (!file.name.includes('Orders')) {
        validationPassed = false;
        notifyToast(getMsg(messages, msgType.warnings, msgNumber[31]).msgText, getMsg(messages, msgType.warnings, msgNumber[31]).msgType);
        notifyToast('File name should be :  "Orders".', 'warning');
        return false; // Validation failed
    }

    return validationPassed;
  };