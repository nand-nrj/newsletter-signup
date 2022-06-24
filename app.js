require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const https = require('https');

const app = express();

app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', (req,res) => {
    console.log('Root Get Route');
    res.sendFile(__dirname+'/signup.html');
});

app.post('/', (req,res) => {
    const firstName = req.body.fname;
    const lastName = req.body.lname;
    const email = req.body.email;
    console.log(firstName,lastName,email);
    const data={
        members: [{
            email_address: email,
            status: "subscribed",
            merge_fields: {
                FNAME: firstName,
                LNAME: lastName,
            }
        }]
    }

    const list_id = process.env.LIST_ID;
    const api_key = process.env.API_KEY;
    
    const jsonData= JSON.stringify(data);
    const url = `https://us14.api.mailchimp.com/3.0//lists/${list_id}`;
    const options = {
        method: "POST",
        auth: `nrj:${api_key}`,
    }
    const request = https.request(url,options, (response) => {
        if(response.statusCode===200){
            res.sendFile(__dirname+'/success.html');
        }
        else{
            res.sendFile(__dirname+'/failure.html');
        }
        response.on("data", (data) => {
            console.log(JSON.parse(data));
        });
    });
    request.write(jsonData);
    request.end();
});

app.post('/failure', (req,res) => {
    res.redirect('/');
});

app.listen(process.env.PORT, () => {
    console.log('Server is running @3000');
});