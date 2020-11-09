const express = require('express');
const crypto = require('crypto');
const request = require('request');
const app = express(); //앱에 적용
const PORT = 3000 ;

//create signature2
const CryptoJS = require('crypto-js');
const SHA256 = require('crypto-js/sha256');
const Base64 = require('crypto-js/enc-base64');

 

app.get('/c', (req, res)=>{
	 let name = '최열'
	 let hmac=crypto.createHmac('sha256', name);
	 let message = [];
	 message.push(name);
	 message.push('1');
	  message.push('가나다라마바사');
	console.log(message.join())
	 const signature = hmac.update(message.join('')).digest('base64');
	 console.log(name);
	 console.log(hmac);
	 console.log(signature);
});

app.get('/m', (req, res)=>{
		 const phoneNumber = '01088150799'; //  who answer the phone
		 const NCP_accessKey = 'UtBzYvfAXfppkR8KZwAh';		 		//api management -> access key
     const NCP_secretKey = 'BOurduy8B8oppwcPRzOR7BZMlNsfCdEcMsxLqQ6X';    	//api management -> secret key
     const NCP_serviceID = 'ncp:sms:kr:259424290547:smsapi'; // project service id key -> sens serviceID
     const myPhoneNumber = '01088150799'; // registered phone
		 //따로 빼놔야할 정보들 위에 따로 만들어주어야함.

     const space = " ";          // one space
     const newLine = "\n";           // new line
     const method = "POST";          // method

     const url = `https://sens.apigw.ntruss.com/sms/v2/services/${NCP_serviceID}/messages`;

       // url (include query string)
     const url2 = `/sms/v2/services/${NCP_serviceID}/messages`;

     const timestamp = Date.now().toString();         // current timestamp (epoch)
     let message = [];
     let hmac=crypto.createHmac('sha256',NCP_secretKey);

     message.push(method);
     message.push(space);
     message.push(url2);
     message.push(newLine);
     message.push(timestamp);
     message.push(newLine);
     message.push(NCP_accessKey);
     const signature = hmac.update(message.join('')).digest('base64');


     const number = Math.floor(Math.random() * (999999 - 100000)) + 100000;
     request({
         method: method,
         json: true,
         uri: url,
         headers: {
             'Content-Type': 'application/json; charset=utf-8',
             'x-ncp-iam-access-key' : NCP_accessKey,
             'x-ncp-apigw-timestamp': timestamp,
             'x-ncp-apigw-signature-v2': signature.toString()
         },
         body: {
             "type":"SMS",
             "contentType":"COMM",
             "countryCode":"82",
             "from": myPhoneNumber,
             "content":`h4tech-service 인증번호 ${number}입니다.`,
             "messages":[
                 {
                     "to":`${phoneNumber}`,
                 }
             ]
         }
     },function (err, res, html) {
         if(err) console.log(err);
         console.log(html);
     });
 });

app.listen(PORT, ()=>{console.log('http://localhost:3000/m gonna be your localhost')}  );
