import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepContent from '@mui/material/StepContent';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import {selectDarkMode} from '../../../redux-toolkit/darkModeSlice';
import { useDispatch, useSelector } from 'react-redux';
const steps = [
  [ //0 -> TradeOvate
  {
    label: 'Log in to your Tradovate Account',
    description: `Open your web browser and go to the Tradovate website. \
Click on the "Login" button and enter your username and password to log in to your account.`,
  },
  {
    label: 'Navigate to Position History',
    description:
      'Once logged in, you will be directed to the Tradovate dashboard. Look for the "Account" or "Reports" tab in the navigation menu (the exact location may vary depending on the platform\'s layout). \
Click on the "Position History" option.',
  },
  {
    label: 'Download Position History CSV',
    description: `On the Position History page, you should see a table displaying your historical positions. \
Look for an option like "Export," "Download," or an icon that represents exporting data (usually a down-arrow or a download icon). \
Click on the export/download option, and a dialog box should appear asking you to choose the file format. Select "CSV" (Comma-Separated Values) from the available options and click "Download" or "Export." \
Your position history data will be saved as a CSV file to your computer. Choose the location where you want to save the file, and it will be downloaded.`,
  },
  {
    label: 'Import Trade File',
    description: `Now that you have downloaded the CSV file with your position history, Click on  "Import" or  \
and choose the file you just downloaded from your computer. \
After selecting the file, the platform will process the data and import your trade history into your account. \
`,
  },
],
 [ //1-> binance
  {
    label: 'Log in to your Binance Account',
    description: `Open your web browser and go to the Binance website. \
Click on the "Login" button and enter your username and password to log in to your account.`,
  },
  {
    label: 'Access Trade History',
    description:
      'Once logged in, you will be directed to the Binance dashboard. Look for the "Trade" or "Wallet" tab in the navigation menu. \
Click on the "Trade History" or "Order History" option for spot trading, or "Futures" and then "Futures Order History" for futures trading.',
  },
  {
    label: 'Export Trade History CSV',
    description: `On the Trade History page, you should see a table displaying your historical trades. \
Look for an option like "Export," "Download," or an icon that represents exporting data (often a down-arrow or a download icon). \
Click on the export/download option, and a dialog box should appear. Choose the date range, trading pairs, and select "CSV" (Comma-Separated Values) as the file format. \
Click "Download" or "Export." Your trade history data will be saved as a CSV file on your computer. Choose a location to save the file.`,
  },
  {
    label: 'Import Trade File',
    description: `Now that you have the CSV file with your trade history, go back to your cryptocurrency portfolio tracker or tax software. \
Look for an option like "Import" or "Upload" within the software. Select the CSV file you just downloaded from your computer. \
The software will process the data and import your trade history into your account.`,
  },
  {
    label: 'Review and Update',
    description: `After importing, review the imported transactions to ensure accuracy. \
Check if all your trades, deposits, and withdrawals are correctly recorded. If you've made additional trades since your last export, \
repeat the above steps periodically to keep your trade history up-to-date.`,
  },
],];




export default function VerticalLinearStepper(props) {

  const brokerIdx = props.brokerNametoImport;
  const darkMode = useSelector(selectDarkMode);
 
  const [activeStep, setActiveStep] = React.useState(0);
  const [number, setNumber] = React.useState(brokerIdx-1);
  

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  return (
    <Box sx={{ maxWidth: 400 }}>
      <Stepper activeStep={activeStep} orientation="vertical"  >
        {steps[number].map((step, index) => (
          step && 
          <Step key={step.label}   >
            <StepLabel  
              optional={
                index === 2 ? (
                  <Typography variant="caption" >Last step</Typography>
                ) : null
              }
            >
              {step.label}
            </StepLabel>
            <StepContent >
              <Typography >{step.description}</Typography>
              <Box sx={{ mb: 2 }}>
                <div>
                  <Button style={{  backgroundColor: darkMode ? '#1ba6dc' : "", color: darkMode ? 'white' : "",  }}
                    variant="contained"
                    onClick={handleNext}
                    sx={{ mt: 1, mr: 1 }}
                  >
                    {index === steps[number].length - 1 ? 'Finish' : 'Continue'}
                  </Button>
                  <Button style={{  backgroundColor: darkMode ? '#1ba6dc' : "", color: darkMode ? 'white' : "",  }}
                    disabled={index === 0}
                    onClick={handleBack}
                    sx={{ mt: 1, mr: 1 }}
                  >
                    Back
                  </Button>
                </div>
              </Box>
            </StepContent>
          </Step>
        ))}
      </Stepper>
      {activeStep === steps[number].length && (
        <Paper square elevation={0} sx={{ p: 3 }}>
          <Typography>All steps completed - you&apos;re finished</Typography>
          <Button onClick={handleReset} sx={{ mt: 1, mr: 1 }} >
            Reset
          </Button>
        </Paper>
      )}
    </Box>
  );

}