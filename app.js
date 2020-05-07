const express = require('express');
const path = require('path');
const app = express();



// Далее код должен храниться внизу - отрабатываться последним
app.use(express.static(path.resolve(__dirname, 'client')));

app.get('*', (req, res) => { // '*' - любые роуты
    res.sendFile(path.resolve(__dirname, 'client', 'index.html'));
});

app.listen(3000, () => console.log('Server run...'));