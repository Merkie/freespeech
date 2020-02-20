require('dotenv').config();

const express = require('express');
const path = require('path');
const mysql = require('mysql2');
const jwt = require('jsonwebtoken');
const app = express();
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'freespeech',
	password: 'KA@sYZY6zV9KGRV$z@V4',
  database: 'freespeech'
});
app.use(express.static(path.join(__dirname, '/build')));
app.use(express.json());

function genAuthToken(user){
	return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn:'10m'});
}

function authenticateToken(req, res, next) {
  const authHeader = req.headers['x-access-token'] || req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]
  if (token == null) return res.sendStatus(401)
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403)
    req.user = user
    next()
  })
}

app.post('/token', (req, res) => {
  const postrefreshToken = req.body.token
  if (postrefreshToken == null) return res.sendStatus(401)
	connection.execute(
		"SELECT * FROM refreshTokens WHERE refreshToken = ?",
		[postrefreshToken],
		(err, results)=>{
			if(results.length === 1){
				let { users_id, refreshToken } = results[0]
				if(refreshToken === postrefreshToken){
					jwt.verify(postrefreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
				    if (err) return res.sendStatus(403)
						connection.execute(
							"SELECT * FROM users WHERE id = ?",
							[users_id],
							(err, results)=>{
								if(results.length === 1){
									let {id, username, name, preferredVoiceId} = results[0];
									let user = {id:id, username:username, name:name, preferredVoiceId:preferredVoiceId};
									const accessToken = genAuthToken(user);
									const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
									connection.execute(
										"SELECT * FROM refreshTokens WHERE users_id = ?",
										[id],
										(err, results)=>{
											if(err) console.log({error:err});
											if(results.length >= 1){
												connection.execute(
													"DELETE FROM refreshTokens WHERE users_id = ?",
													[id],
													(err, results)=>{
														if(err) return res.json({error:err});
													}
												)
											}
										}
									)
									setTimeout(()=>{
										connection.execute(
											"INSERT INTO refreshTokens (refreshToken, users_id) VALUES (?, ?)",
											[refreshToken, id],
											(err, results)=>{
												if(err) console.log({error:err});
											}
										)
										res.json({accessToken:accessToken, refreshToken:refreshToken });
									},1000);
								}
							}
						)

				  })
				}
			}else{
				return res.json({error:"something went wrong"});
			}
		}
	)
})


app.post('/login', (req, res) => {
	let { username, password } = req.body;
	connection.execute(
		"SELECT * FROM users WHERE username = ? AND password = ?",
		[username, password],
		(err, results) => {
			if(results.length == 1){
				let {id, username, name, preferredVoiceId} = results[0];
				let user = {id:id, username:username, name:name, preferredVoiceId:preferredVoiceId};
				let accessToken = genAuthToken(user);
				const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
				connection.execute(
					"SELECT * FROM refreshTokens WHERE users_id = ?",
					[id],
					(err, results)=>{
						if(err) return console.log({error:err});
						if(results.length >= 1){
							connection.execute(
								"DELETE FROM refreshTokens WHERE users_id = ?",
								[id],
								(err, results)=>{
									if(err) return console.log({error:err});
								}
							)
						}
					}
				)
				setTimeout(()=>{
					connection.execute(
						"INSERT INTO refreshTokens (refreshToken, users_id) VALUES (?, ?)",
						[refreshToken, id],
						(err, results)=>{
							if(err) return res.json({error:err});
						}
					)
					res.json({accessToken:accessToken, refreshToken:refreshToken, preferredVoiceId:preferredVoiceId });
				},1000);
			}else{
				res.json({error:"incorrect username or password"});
			}
		}
	);
});

app.post('/signup', (req, res) => {
	let { username, password, repassword, name } = req.body;
	if(password === repassword){
		connection.execute(
			"SELECT * FROM users WHERE username = ?",
			[username],
			(err, results)=>{
				if(err) return res.json({error:err});
				if(results.length === 0){
					connection.execute(
						"INSERT INTO users (username, password, name) VALUES (?, ?, ?)",
						[username, password, name],
						(err, results)=>{
							if(err) return res.json({error:err});
							connection.execute(
								"INSERT INTO users_has_speech (users_id, speech_id) VALUES (?, 1), (?, 2), (?, 3), (?, 4)",
								[results.insertId, results.insertId, results.insertId, results.insertId],
								(err, results)=>{
									if(err) console.log({error:err});
								}
							)
							res.json({success:"user created"});
						}
					)
				}else{
					res.json({error:"username taken"});
				}
			}
		)
	}else{
		res.json({error:"passwords not matching"});
	}
})

app.get('/speechItems', authenticateToken, (req, res) => {
	connection.execute(
		"SELECT speech.* from users_has_speech JOIN speech ON users_has_speech.speech_id = speech.id where users_has_speech.users_id = ?",
		[req.user.id],
		(err, results)=>{
			if(err) return res.json({error:err});
			res.json(results);
		}
	);
});


app.get('*', (req,res) =>{
    res.sendFile(path.join(__dirname+'/build/index.html'));
});

const port = process.env.PORT || 5000;
app.listen(port);

console.log('App is listening on port ' + port);
