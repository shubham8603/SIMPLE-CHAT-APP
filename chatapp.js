const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const fs = require('fs');
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Route for /login
app.get('/login', (req, res) => {
    res.send('<form action="/login" method="post">' +
             '<label for="username">Username:</label>' +
             '<input type="text" id="username" name="username" required>' +
             '<button type="submit">Login</button></form>');
});

// Route for handling login form submission
app.post('/login', (req, res) => {
    const username = req.body.username;
    res.cookie('username', username);
    res.send(`<p>Login successful. <a href="/message-form">Go to message form</a></p>`);
});

// Route for displaying the message form
app.get('/message-form', (req, res) => {
    res.send('<form action="/send-message" method="post">' +
             '<label for="message">Message:</label>' +
             '<input type="text" id="message" name="message" required>' +
             '<button type="submit">Send</button></form>' +
             '<h2>Previous Messages:</h2>' +
             `<div>${getMessages()}</div>`);
});

// Route for handling message form submission
app.post('/send-message', (req, res) => {
    const username = req.cookies.username || 'Guest';
    const message = req.body.message;
    const messageData = `${username}: "${message}"\n`;
    fs.appendFileSync('messages.txt', messageData);
    res.redirect('/message-form');
});

// Route for displaying messages
app.get('/messages', (req, res) => {
    const messages = getMessages();
    res.send(messages);
});


app.get('/', (req, res) => {
    res.send('<h1>Welcome to the Chat App</h1>' +
             '<p><a href="/login">Login</a></p>');
});

function getMessages() {
    try {
        const messages = fs.readFileSync('messages.txt', 'utf-8');
        return messages;
    } catch (error) {
        return '';
    }
}

app.listen(5000, () => {
    console.log('Server is running on http://localhost:5000');
});
