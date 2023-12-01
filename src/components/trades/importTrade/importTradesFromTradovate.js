
// --------------------------------------handle validation before import trades from tradovate--------------------------------------------------

const validationBeforeImportCsvFileFromTradeovate = (file,languageidx) => {
    let validationPassed = true;

    if (!file.name.endsWith('.csv')) {
      validationPassed = false;
      notifyToast(getMsg(messages, msgType.warnings, msgNumber[3],languageidx).msgText, getMsg(messages, msgType.warnings, msgNumber[3],languageidx).msgType);
      //     notifyToast('Please select a CSV  file.', 'warning');
      return false; // Validation failed
    }

    if (!file.name.includes('Orders')) {
        validationPassed = false;
        notifyToast(getMsg(messages, msgType.warnings, msgNumber[31],languageidx).msgText, getMsg(messages, msgType.warnings, msgNumber[31],languageidx).msgType);
        notifyToast('File name should be :  "Orders".', 'warning');
        return false; // Validation failed
    }

    return validationPassed;
  };