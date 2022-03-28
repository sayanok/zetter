// expressモジュールを読み込む
const express = require('express');

// expressアプリを生成する
const app = express();

app.get('/users', (req, res) => {
    // クライアントに送るJSONデータ
    const users = [
        { id: 1, name: 'zen', isPretty: true },
        { id: 2, name: 'mupi', isPretty: true },
        { id: 3, name: 'mipi', isPretty: true },
    ];

    // JSONを送信する
    res.json(users);
});

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`Listening on port ${port}`));
