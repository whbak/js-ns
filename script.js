const treinStations = [
    ["Delft", 8400170],
    ["Amsterdam", 8400058],
    ["Alkmaar", 8400050],
    ["Deventer", 8400173],
    ["Venlo", 8400644],
    ["Utrecht", 8400621],
];

let taal = 'en';
let result;
async function getNS(i) {
    const gatewayUrl = 'https://gateway.apiportal.ns.nl/reisinformatie-api/api/v2/departures';
    result = await fetch(`${gatewayUrl}?lang=${taal}&uicCode=${treinStations[i][1]}`, {
        method: "GET",
        headers: {
            "Ocp-Apim-Subscription-Key": "-add-NS-api-key-",
            "Content-Type": "application/json",
        },
    });
    result = await result.json();
    console.log('res in fetch: ', result.payload.departures[0].direction);
    return result;
}

async function getWeb() {
    const requestUrl = "https://randomuser.me/api/?results=6";
    const divDoos = document.querySelector('.persons');
    /* fetch randomusr url */
    fetch(requestUrl)
        .then(res => res.json())
        .then(res => {
            /* fetch NS apiportal departures */
            for (let i = 0; i < res.results.length; i++) {
                /* create div for all */
                let divAdd = document.createElement('div');
                divAdd.className = 'blok';
                /* create Elements */
                let H3 = document.createElement('h3');
                let Img = document.createElement('img');
                let ImgFlag = document.createElement('img');
                ImgFlag.className = 'flag';
                let pMail = document.createElement('p');
                let pCountry = document.createElement('p');
                let pDestiny = document.createElement('p');
                /* add values */
                H3.innerHTML = `${res.results[i].name.first} ${res.results[i].name.last}`;
                Img.src = `${res.results[i].picture.large}`;
                Img.setAttribute('alt', 'plaatje');
                /* input randomuser country in restcountries */
                let flag = `restcountries.com/v3.1/alpha/${res.results[i].nat}`;
                fetch(`https://${flag}`)
                    .then(res2 => res2.json())
                    .then(data => {
                        ImgFlag.setAttribute('src', data[0].flags.png);
                    });
                ImgFlag.setAttribute('alt', 'plaatje');
                pMail.innerHTML = res.results[i].email;
                pCountry.innerHTML = `Op bezoek in: ${treinStations[i][0]}`;
                getNS(i)
                    .then(res3 => {
                        pDestiny.innerHTML = `Eindbestemming: ${res3.payload.departures[0].direction}`;
                    })
                    .catch(err => console.log('Request failed', err));
                /* append Elements */
                divAdd.appendChild(H3);
                divAdd.appendChild(Img);
                divAdd.appendChild(ImgFlag);
                divAdd.appendChild(pMail);
                divAdd.appendChild(pCountry);
                divAdd.appendChild(pDestiny);
                divDoos.appendChild(divAdd);
            }
        });
}

getWeb();
