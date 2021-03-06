'use strict'

console.log('Slideshow.js is alive'); // Console log

// Fetch requests
const fetchNominatedInfo = fetch(
    '/data/Nominated' //fetch information for  nominated from data
).then((res) => res.json());

const fetchQRSlideshow = fetch( //fetch information for qr code from data
    '/data/QR'
).then((res) => res.json());

const allData = Promise.all([fetchNominatedInfo, fetchQRSlideshow]); //forces the fetch no matter what without it, the program wont move forward

allData.then((res) => LoadNominatedInfo(res)); //loads nominated info that is fetched from the data

const LoadNominatedInfo = (res) => {

    let RefreshAmount = 0; // Has to start at 0 (declared as integer)

    const NominatedInfo = res[0]; //assigns variable to the nominated information that was fetched
    const QR = res[1]; //assigns variable to the qr information that was fetched

    let QRimg = document.createElement('img'); //creates an image element
    QRimg.src = QR[0].record.fields.Picture[0].url; //sources the qr image into the element
    QRimg.className = 'width-50'
    document.getElementById('qrcode').appendChild(QRimg); //appends it into the qrcode id

    let img2 = document.createElement('img'); //creates an image element
    img2.src = QR[1].record.fields.Picture[0].url; //sources the qr image into the element
    document.getElementById('nobelpris').appendChild(img2); //appends it into the nobelpris id

    let img3 = document.createElement('img'); //does exacly same thing as the three rows above
    img3.src = QR[1].record.fields.Picture[0].url;
    document.getElementById('nobelpris2').appendChild(img3);

    NominatedInfo.forEach(Nominee => { // Makes a new slide for every nominee in the airtable

        let li = document.createElement('li');
        li.id = Nominee.record.fields.Nominated; // Makes every slide with different id
        document.getElementById('ol').appendChild(li);

        let img = document.createElement('img');
        img.src = Nominee.record.fields.Picture[0].url; //Makes every slide with different picture
        document.getElementById(Nominee.record.fields.Nominated).appendChild(img);

        let h1 = document.createElement('h1');
        h1.className = 'ism-caption ism-caption-0';
        h1.textContent = Nominee.record.fields.Nominated;
        document.getElementById(Nominee.record.fields.Nominated).appendChild(h1);

        RefreshAmount = RefreshAmount + 5; // Adds 5 seconds for each slide to the refresh function
    });

    const slide = document.createElement('script'); //Makes the javascript to read in after
    slide.src = 'javascripts/ism-2.2.min.js'; // The javascript for html and airtable info is collected
    document.getElementById('content').appendChild(slide);
};