const tweets = [
    { id: 1, createdBy: 1, replyTo: null, content: '然がうんちした！', createdAt: new Date('2022-04-03 12:00') },
    { id: 2, createdBy: 2, replyTo: null, content: '然がけろっぴした！', createdAt: new Date('2022-04-03 12:05') },
    {
        id: 3,
        createdBy: 3,
        replyTo: null,
        content: 'しょーがねーだろ 赤ちゃんなんだから',
        createdAt: new Date('2022-04-03 12:10'),
    },
    { id: 4, createdBy: 1, replyTo: null, content: '然が寝返りがえりした！', createdAt: new Date('2022-06-20 12:10') },
    { id: 5, createdBy: 2, replyTo: null, content: 'しゅごい！', createdAt: new Date('2022-06-20 12:20') },
    { id: 6, createdBy: 3, replyTo: null, content: 'せやろ！', createdAt: new Date('2022-06-20 12:30') },
    { id: 7, createdBy: 1, replyTo: null, content: '然が寝返りした！', createdAt: new Date('2022-06-21 12:10') },
    { id: 8, createdBy: 2, replyTo: null, content: 'かわいい！', createdAt: new Date('2022-06-21 12:20') },
    { id: 9, createdBy: 3, replyTo: null, content: 'コロンコロン！', createdAt: new Date('2022-06-21 12:30') },
    {
        id: 10,
        createdBy: 3,
        replyTo: null,
        content: 'あかん、寝返り返りできひん...ﾋｪｰﾝ...!!',
        createdAt: new Date('2022-06-21 12:40'),
    },
    { id: 11, createdBy: 1, replyTo: 10, content: '@zepi 煎餅屋開業', createdAt: new Date('2022-06-21 12:50') },
    { id: 12, createdBy: 4, replyTo: null, content: 'オーボールだよ', createdAt: new Date('2022-08-01 12:50') },
    { id: 13, createdBy: 5, replyTo: null, content: 'バウンサーだよ', createdAt: new Date('2022-08-02 12:50') },
    { id: 14, createdBy: 6, replyTo: null, content: 'カシャカシャ', createdAt: new Date('2022-08-03 12:50') },
    { id: 15, createdBy: 7, replyTo: null, content: 'ガーゼだよ', createdAt: new Date('2022-08-04 12:50') },
];

export default tweets;
