const crypto = require('crypto')

/*
the client does not provide its credentials in plaintext
it uses this strange hashing algorithm instead
1. create a sha256 hash of the input, the result is as 32 bytes of binary data
2. convert each byte of the hash into decimal numbers
3. join the decimal number seperated by commas 
	e.g. 210,110,11,15,7.....
4. encode the resulting string as Base64
5. done.
*/

function generateHash(input){
	var hash = crypto.createHash('sha256').update(input)
	return Buffer.from(
		Uint8Array.from(
			Buffer.from(
				hash.digest('binary'), 'binary'
			)
		)
		.join(','), 'ascii')
	.toString('base64')
}

module.exports = {
	//returns a js object representation of the request body
	generateAuthBody: function(user, password){
		var passwordString = `${user}#${password}@franka`
		var passwordHash = generateHash(passwordString) 
		return {
			user: user,
			password: passwordHash
		}
	}
}
