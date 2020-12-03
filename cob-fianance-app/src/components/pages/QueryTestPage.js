import React from 'react'
import Button from 'react-bootstrap/Button';

export default function Login() {

	//async function postData(url = '', data = {}) {
	//  // Default options are marked with *
	//  const response = await fetch(url, {
	//	method: 'POST', // *GET, POST, PUT, DELETE, etc.
	//	mode: 'no-cors', // no-cors, *cors, same-origin
	//	cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
	//	credentials: 'same-origin', // include, *same-origin, omit
	//	headers: {
	//	  'Content-Type': 'application/json'
	//	  // 'Content-Type': 'application/x-www-form-urlencoded',
	//	},
	//	redirect: 'follow', // manual, *follow, error
	//	referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
	//	body: JSON.stringify(data) // body data type must match "Content-Type" header
	//  });
	//  console.log(response);
	//  return response; // parses JSON response into native JavaScript objects
  	//}

	function postDataTest() {
	//	  let tempdata = postData('http://localhost:2700', { requestType: "login", username: "username", password: "password" })
 	//	  .then(data => {
	//		console.log("here");
 	// 		console.log(data); // JSON data parsed by `data.json()` call
 	// 	  });
	//	  console.log("here!");

	fetch('http://localhost:2700/q?' + "q=login&username=username&password=password", {
		mode: 'cors',
	})
	.then(response => {
		console.log(response);
		return response.json();
	})
	.then(data => {
		console.log('Success:', data);
	})
	.catch((error) => {
		console.error('Error:', error);
	});
	  }

    return (
        <React.Fragment >
            <div style={{flex: '1', paddingTop:'5px', paddingBottom:'5px' , textAlign: 'center' }}><>
            <Button onClick={postDataTest} style={{flex: '1' , textAlign: 'center', width:'700px',   display: 'inline-block', height: '100px' }} as="input" type="button" value="Get Token" />{' '}</>
            </div>
            <div style={{ flex: '1', padding: '5px 5px' , textAlign: 'center'}}><>
            <Button style={{flex: '1' , textAlign: 'center', width:'700px',   display: 'inline-block', height: '100px' }} as="input" type="button" value="Get User Transactions" />{' '}</>
            </div>

        </React.Fragment>
    )
}
