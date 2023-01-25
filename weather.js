document.addEventListener("DOMContentLoaded",()=>{

const apiRoot = "https://raw.githubusercontent.com/pmontrasio/codici-stati/master/dist/countries.json";

// Inizio la chiamata all'API delle nazioni ============================================

fetch(apiRoot).then(
    response => {
        if(response.ok){
            return response.json();
        } throw new Error(`${response.status} - ${response.statusText}`)
    }
).then((data)=>{
    for(p in data){
        const citta = document.getElementById('selectCitta');
        // Se il nome italiano risulta undefined, viene saltato
        if(data[p].italian_country_name_1 == undefined){
            //Se il valore del nome è undefined salto la "nazione"
            continue;
        } else{
                // Inietto nel tag select, tutti i nomi delle nazioni
                citta.innerHTML += `
                <option value="${data[p].iso3361_2_characters}">${data[p].italian_country_name_1}</option>`
            }
        }
})

 const form = document.forms['form'];
 
 form.addEventListener("submit",(e)=>{
    e.preventDefault();
    // Prendo i valori e creo l'API delle condizioni atmosferiche per la nuova FETCH ===
    const inputCitta = document.getElementById("inputCitta").value;
    const selectedCountry = document.getElementById('selectCitta').value
    const apikey = "3d8aa45f7271f6bcb67cba7a6b0896d7";

    const apiRootWeather = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(inputCitta)},${encodeURIComponent(selectedCountry)}&appid=${apikey}`;

    const div = document.createElement('div');/* Creo un div di errore */
        div.setAttribute('class','error_msg');

    if(!inputCitta){
        let cittaBorder = document.getElementById("inputCitta")
        cittaBorder.style.border = '2px solid red';
        
        div.textContent = 'Inserire il nome di una città';
        form.appendChild(div);

        setTimeout(() => {/* elimino il div di errore dopo 3 secondi */
            cittaBorder.style.border = 'none';
            div.remove();
        }, 2000);
    } else if(selectedCountry === 'Scegli una nazione'){
        let countryBorder = document.getElementById('selectCitta');
        countryBorder.style.border = '2px solid red';

        div.textContent = 'Seleziona la nazione della città';
        form.appendChild(div);

        setTimeout(() => {
            countryBorder.style.border = 'none';
            div.remove();
        }, 2000);
    } else{
        fetch(apiRootWeather).then((response)=>{
            if(response.ok){
                return response.json();
            } throw new Error(`${response.status} - ${response.statusText} - Rivedi i dati immessi`);
        }).then((data)=>{
            // Inizietto una tabella nel div Result, che conterrà i valori presi dall'API
            console.log(data);
            result.innerHTML = `
            <br>
            <h2>Sitazione meteo: ${inputCitta} - ${selectedCountry}</h2>
            <table class="table">
                <tbody>
                    <tr>
                        <th scope="row">Situazione</th>
                        <td>${data.weather[0].description}</td>
                    </tr>
                    <tr>
                        <th scope="row">Vento</th>
                        <td>${data.wind.speed} m/sec</td>
                    </tr>
                    <tr>
                        <th scope="row">Pressione</th>
                        <td>${data.main.pressure}</td>
                    </tr>
                    <tr>
                        <th scope="row">Temperatura</th>
                        <td>min ${toCelsius(data.main.temp_min)}° - max ${toCelsius(data.main.temp_max)}°</td>
                    </tr>
                    <tr>
                        <th scope="row">Umidità</th>
                        <td>${data.main.humidity}%</td>
                    </tr>
                </tbody>
                </table>
            `
        }).catch(e => {
            result.innerHTML = `<br><b>${e}</b>` // Stampo l'errore dentro il div Result
        })
    }
 })

form.addEventListener("reset",()=>{
    result.innerHTML = "";
})

}) // DOM CHIUSO


function toCelsius(celsius) {/* Function che trasforma i gradi da Kelvin a Celsius */
  let kelvinToCelsius = Math.trunc(celsius - 273,15);
  return kelvinToCelsius
}