const express = require("express"); 
const { injectSpeedInsights } =require( "@vercel/speed-insights")
const app = express(); 
const { v4: uuidv4 } = require('uuid');
const cookieParser = require('cookie-parser');
app.use(cookieParser());
// Generate a UUID


// console.log

app.use(express.static(__dirname + "/public"));
const fs = require('fs');
const path = require('path');
const { GoogleSpreadsheet } = require('google-spreadsheet');
const { JWT } = require('google-auth-library');
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const creds = require('./sheet-api-418514-d512f7beaa17.json');
const dataFilePath = path.join(process.cwd(),  '/data/data.json');

app.post('/save-data', async(req, res) => {
  const newData = req.body;
  // console.log(newData);
  let uuid= uuidv4();
  function setCookie(res, name, value, days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = "expires=" + date.toUTCString();
    res.cookie(name, value, { expires: date, httpOnly: true });
}

// Example usage:
setCookie(res, "userId", uuid, 30);

  const serviceAccountAuth = new JWT({
    email: creds.client_email,
    key: creds.private_key,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});
const doc = new GoogleSpreadsheet('1FoyicB9Ngxo4ofDfRtjbBKmpYeNRl-NlEJbXK5Q8R2U', serviceAccountAuth);
await doc.loadInfo(); // loads document properties and worksheets

const sheet = doc.sheetsByIndex[0];
const Headers = ['Id', 'Name', 'Email','Phone',];
await sheet.setHeaderRow(Headers);

// let dataarray = [
//     { 'Id': 1, "Name": 'code Test', 'Email': "sajish2gmail.com" },
//     { 'Id': 1, "Name": 'code Test', 'Email': "sajish2gmail.com" }
// ];
let dataarray=[{
  'Id': uuid, "Name": newData.name, 'Email':newData.email,'Phone':newData.contact
}];
await sheet.addRows(dataarray);
  // fs.readFile(dataFilePath, 'utf8', (err, data) => {
  //   if (err) {
  //     console.error('Error reading file:', err);
  //     return res.status(500).json({ message: 'Error reading data.' });
  //   }
    
  //   let existingData = JSON.parse(data); 
    
  //   existingData.push(newData);

  //   fs.writeFile(dataFilePath, JSON.stringify(existingData, null, 2), (err) => {
  //     if (err) {
  //       console.error('Error writing to file:', err);
  //       return res.status(500).json({ message: 'Error saving data.' });
  //     }
  //     console.log('Data saved to file successfully.');
  //     res.json({ message: 'Data saved successfully.' });
  //   });
  // });
  res.json({ message: 'Data saved successfully.' });
});
app.post('/score', async (req, res) => {
  const { score } = req.body;
  const nDate = new Date().toLocaleString('en-US', {
    timeZone: 'Asia/Calcutta'
  });

  // Here you can handle the score data as needed
  // console.log('Received score:', score);
  // console.log('Received ID:', uuid);

  const serviceAccountAuth = new JWT({
      email: creds.client_email,
      key: creds.private_key,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  const doc = new GoogleSpreadsheet('1FoyicB9Ngxo4ofDfRtjbBKmpYeNRl-NlEJbXK5Q8R2U', serviceAccountAuth);
  await doc.loadInfo(); // loads document properties and worksheets

  const sheet = doc.sheetsByIndex[0];
  const sheet1 = doc.sheetsByTitle['Sheet2']; 
  const rows = await sheet.getRows(); // Get all rows from the sheet

function getCookie(req, name) {
    return req.cookies[name];
}

// Example usage:
const uuid = getCookie(req, "userId");

// Inside the loop where you iterate through rows
for (let i = 0; i < rows.length; i++) {
  if(rows[i].get('Id')==uuid){
    const row = rows[i];
    const id = row._rawData;
    const Headers = ['Id', 'Name', 'Email','Phone','Score','Date'];
    await sheet1.setHeaderRow(Headers);
    // const sheet = await doc.addSheet({ headerValues: ['Id', 'Name', 'Email','Phone','Score'] });

// let dataarray = [
//     { 'Id': 1, "Name": 'code Test', 'Email': "sajish2gmail.com" },
//     { 'Id': 1, "Name": 'code Test', 'Email': "sajish2gmail.com" }
// ];
let dataarray=[{
  'Id':id[0], "Name": id[1], 'Email':id[2],'Phone':id[3],"Score":score,Date:nDate
}];
await sheet1.addRows(dataarray);
    
   
  }
}
function deleteCookie(res, name) {
  res.clearCookie(name);
}

// Example usage:
deleteCookie(res, "userId");

res.json({ message: 'Score saved successfully.' });
});

app.get('/leaderboard', async (req, res) => {
  try {
   
  const serviceAccountAuth = new JWT({
    email: creds.client_email,
    key: creds.private_key,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});
const doc = new GoogleSpreadsheet('1FoyicB9Ngxo4ofDfRtjbBKmpYeNRl-NlEJbXK5Q8R2U', serviceAccountAuth);
await doc.loadInfo(); // loads document properties and worksheets

const sheet = doc.sheetsByIndex[1];

    // Get all rows from the sheet
    const rows = await sheet.getRows();
  //   for (let i = 0; i < rows.length; i++) {
  //       const row = rows[i];
  //       const value = row._rawData;
  //   let rowData = value.map(row => ({
  //     Name: row[1],
  //     Points: row[4]
  //   }))
  // }
  //   // Send the rows as JSON
  //   console.log(rowData)
  
  const rowData = rows.map(row => ({
    Name: row._rawData[1], // Assuming Name is in the second column (index 1)
    Points:  parseFloat(row._rawData[4]) // Assuming Score is in the fifth column (index 4)
  }));
  rowData.sort((a, b) => b.Points - a.Points);
    const top10 = rowData.slice(0, 10);
    res.json(top10);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
  
});
injectSpeedInsights();
app.listen(3000);
