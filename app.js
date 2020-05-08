const express = require('express');
const path = require('path');
const app = express();
const { v4 } = require('uuid'); // рлдключение библиотеки для генерации id

// Импровизированная БД
let CONTACTS = [
    {id: v4(), name: 'Pallo', value: '+37529 694-63-84', marked: false} // v4() - вызов функции для генерации id
]

app.use(express.json()); // добавлена возможность работать с json

// GET первый url по которому получаются данные
app.get('/api/contacts', (req, res) => {
    setTimeout(() => {
        res.status(200).json(CONTACTS)
    }, 1000); // интервал для того чтобы показать спинер - имитация загрузки
})

// POST Создание данных
app.post('/api/contacts', (req, res) => {
    const contact = {...req.body, id: v4(), marked: false}
    CONTACTS.push(contact);
    res.status(201).json(contact); // 201 - элемент создан
})

// DELETE Удаление данных
app.delete('/api/contacts/:id', (req, res) => {
    CONTACTS = CONTACTS.filter(c => c.id !== req.params.id);
    res.status(200).json({message: 'Contact was deleted!'})
})

// PUT модификация данных
app.put('/api/contacts/:id', (req, res) => {
    const idx = CONTACTS.findIndex(c => c.id === req.params.id);
    CONTACTS[idx] = req.body;
    res.json(CONTACTS[idx]);
});

// Далее код должен храниться внизу - отрабатываться последним
app.use(express.static(path.resolve(__dirname, 'client')));

app.get('*', (req, res) => { // '*' - любые роуты
    res.sendFile(path.resolve(__dirname, 'client', 'index.html'));
});

app.listen(3000, () => console.log('Server run...'));