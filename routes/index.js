var express = require('express');
var router = express.Router();
const Airtable = require('airtable');

const base = new Airtable({
    apiKey: 'keyt0M8PAWLcKo6Na'
}).base('app4x1UwZKFrNZnBU');

router.get('/', function(req, res, next) {
    res.render('index', {
        title: 'T4NobelApp'
    });
});

router.post('/', function(req, res, next) {
    res.render('index');
});

router.get('/anka', function(req, res, next) {
    res.render('workingFolder/loginVote');
});

router.get('/leaderboard', function(req, res, next) {
    res.render('workingFolder/leaderboardBig');
});

router.get('/test1', function(req, res, next) {
    res.render('workingFolder/sliderTest');
});

router.get('/pelikan', function(req, res, next) {
    res.render('workingFolder/loginLeader');
});

router.get('/LoggedIn', function(req, res, next) {
    res.render('Login');
});

router.post('/LoggedIn', function(req, res, next) {
    res.render('Login');
});

router.post('/VoteLogin', function(req, res, next) {
    let UserCategories = [];

    let Category1 = '';
    let Category2 = '';
    let Category3 = '';

    const response = JSON.stringify(req.body);
    const User = JSON.parse(response);

    base('students').select().eachPage(function page(records, fetchNextPage) {
            records.forEach(record => {
                if (User.email == record.fields.Email) {

                    Category1 = record.fields.Category1;
                    Category2 = record.fields.Category2;
                    Category3 = record.fields.Category3;

                    UserCategories = [Category1, Category2, Category3];

                    UserCategories.forEach((element, elementCounter) => {
                        if (typeof element === 'undefined') {
                            element = 'Empty';
                            UserCategories[elementCounter] = 'Empty'
                        }
                    })
                    res.send(UserCategories);
                }
            });
            fetchNextPage();

        },
        function done(err) {
            if (err) {
                console.error(err);
                return;
            }
        });
});

// router.get('/VoteLogin', function(req, res, next) {
//     res.send(UserCategories);
// });

router.get('/Vote', function(req, res, next) {
    res.render('Vote', {
        title: 'T4NobelApp'
    });
});

router.post('/Vote', function(req, res, next) {


    const response = JSON.stringify(req.body);
    const Votes = JSON.parse(response);

    base('students').select().eachPage(function page(records, fetchNextPage) {
            records.forEach(record => {
                Votes.vote.forEach(element => {
                    if (record.fields.Email == Votes.email) {


                        base('Students').update([{
                            "id": record.id,
                            "fields": {
                                "VoteStatus": "ToVote",
                                [element.CategoryVoted]: element.NominatedVoted,
                            }
                        }], function(err, records) {
                            if (err) {
                                console.error(err);
                                return;
                            }
                        });
                    }
                })

            });
            fetchNextPage();

        },
        function done(err) {

            if (err) {
                console.error(err);
                return;
            }
        });

    res.render('Vote', {
        title: 'T4NobelApp'
    });
});

router.get('/admin', function(req, res, next) {
    res.render('admin');
});

router.post('/admin', function(req, res, next) {
    let ArrayCounter = [];

    let YearOne;
    let YearTwo;
    let YearThree;

    base('students2').select().eachPage(function page(records, fetchNextPage) {
            records.forEach(record => {
                if (record.fields.Name.includes('1')) {
                    ArrayCounter.push(
                        record.fields.Class
                    )
                } else
                if (record.fields.Name.includes('2')) {
                    ArrayCounter.push(
                        record.fields.Class
                    )

                } else
                if (record.fields.Name.includes('3')) {
                    ArrayCounter.push(
                        record.fields.Class
                    )
                }
            });
            fetchNextPage();
        },
        function done(err) {
            ArrayCounter.sort();

            YearOne = ArrayCounter[2]
            YearTwo = ArrayCounter[1]
            YearThree = ArrayCounter[0]

            updateYear();

            if (err) {
                console.error(err);
                return;
            }
        });

    const updateYear = () => {
        base('students2').select().eachPage(function page(records, fetchNextPage) {
                records.forEach(record => {
                    if (record.fields.Class.includes(YearThree)) {
                        base('Students2').update([{
                            "id": record.id,
                            "fields": {
                                "Year": '3',
                            }
                        }], function(err, records) {
                            if (err) {
                                console.error(err);
                                return;
                            }
                        });
                    }
                    if (record.fields.Class.includes(YearTwo)) {
                        base('Students2').update([{
                            "id": record.id,
                            "fields": {
                                "Year": '2',
                            }
                        }], function(err, records) {
                            if (err) {
                                console.error(err);
                                return;
                            }
                        });
                    }
                    if (record.fields.Class.includes(YearOne)) {
                        base('Students2').update([{
                            "id": record.id,
                            "fields": {
                                "Year": '1',
                            }
                        }], function(err, records) {
                            if (err) {
                                console.error(err);
                                return;
                            }
                        });
                    }
                });
                fetchNextPage();

            },
            function done(err) {
                res.send('<h1>Alla elever är nu sorterade i korrekt årskurs</h1>');
                if (err) {
                    console.error(err);
                    return;
                }
            });
    }
});

module.exports = router;