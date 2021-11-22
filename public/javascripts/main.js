'use strict';

// console.log('main.js is alive!');

let NominatedInfo = [];
let CategoryInfo = [];

// 3 fetch requests, 3 different endpoints/paths
// Converting to JSON using the json() method
const fetchNominatedInfo = fetch(
    '/data/NominatedInfo'
).then((res) => res.json());

const fetchCategoryInfo = fetch(
    '/data/Categories'
).then((res) => res.json());

// Promise.all() does several fetch requests parallel
const allData = Promise.all([fetchNominatedInfo, fetchCategoryInfo]);

allData.then((res) => Load(res));

const Load = (res) => {
    // All data recieved from each base
    NominatedInfo = res[0];
    CategoryInfo = res[1];

    const rowHome = 'row p-0 mb-4 mx-0 justify-content-center'

    CategoryInfo.forEach((Category, counterCategory) => {

        // console.log(Category.record.fields.Category);

        //Creates headline
        const content = document.getElementById('content');

        var h1 = document.createElement('h1');
        h1.textContent = Category.record.fields.Category;
        h1.className = 'text-center pt-5';
        content.appendChild(h1);

        //rows
        var row = document.createElement('div');
        row.className =  rowHome;
        row.id = Category.record.fields.Category + '.Row';
        content.appendChild(row);


        NominatedInfo.forEach((Nominated, counterNominated) => {
            if (Nominated.record.fields.Category == Category.record.fields.Category){
                // console.log(Nominated.record.fields.Picture[0].url);

                // console.log('Category' + (counterCategory + 1) + "-" + Nominated.record.fields.Nominated);

                var newCol = document.createElement('div');
                newCol.className = 'col-sm-3 border-phatHome mx-3 p-0 text-center';
                newCol.id = counterCategory + '+' + counterNominated;
                row.appendChild(newCol);

                var img = document.createElement('img');
                img.className = ' p-0 rounded-3 img-size img-fluid mx-auto d-block';
                img.src =  Nominated.record.fields.Picture[0].url;
                newCol.appendChild(img);

                var info = document.createElement('div');
                info.className = 'text-center m-0';
                info.id = Nominated.record.fields.Nominated + '.Info';
                newCol.appendChild(info);

                var name = document.createElement('h3');
                name.className = 'text-center';
                name.textContent = Nominated.record.fields.Nominated;
                info.appendChild(name);

                const ClickMe = document.createElement('p');
                ClickMe.className = 'ClickMeCss pointer';
                ClickMe.textContent = 'Visa mer';
                ClickMe.name = counterCategory + '+' + counterNominated;
                ClickMe.addEventListener('click', showBio);
                name.appendChild(ClickMe);
                
                var bio = document.createElement('p');
                bio.className = 'text-start bio-Overflow';
                bio.textContent = Nominated.record.fields.Bio;
                info.appendChild(bio);

                const btnVote = document.createElement('button');
                btnVote.textContent = 'Rösta';
                btnVote.className = 'btn btn-primary disabled';
                btnVote.addEventListener('click', divVoteClick);
                btnVote.id = Category.record.fields.Category + "," + Nominated.record.fields.Nominated;
                newCol.appendChild(btnVote);
            }
        });
    });

    document.getElementById('confirm-btn').addEventListener('click', btnConfirmClick);
    
}

const showBio = (sender) =>{
    const ID = sender.target.name;
    const anka = document.getElementById(ID);
    if (anka.className == 'col-sm-3 border-phatHome mx-3 p-0 text-center') {
        anka.className = 'col-sm-3 border-phatHome-hover mx-3 p-0 text-center';
        sender.target.textContent = 'Visa mindre';
    }
    else if(anka.className == 'col-sm-3 border-phatHome-hover mx-3 p-0 text-center'){ 
        anka.className = 'col-sm-3 border-phatHome mx-3 p-0 text-center';
        sender.target.textContent = 'Visa mera';
    }
}