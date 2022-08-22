// Global variables
const notif = document.querySelector('#alert');
const parent = document.querySelector('#parent');
const input = document.querySelector('#bID');

input.addEventListener('keypress', function (event) {
    if (event.key === 'Enter') {
        document.getElementById('btn').click();
    }
});

// Function for validating user input
const validateInput = () => {
    try {
        let input = document.querySelector('#bID').value;
        let inputRGX = /\d{7,7}[-]\d/;
        let inputResult = inputRGX.test(input);
        if (inputResult == false) {
            return false;
        }
        return input;
    } catch (err) {
        console.log(err.message);
    }
}

// Function for fetching data from API
async function getData() {
    try {
        if (!validateInput()) {
            parent.style.visibility = 'hidden';
            notif.innerHTML =
                "<div class='alert alert-danger' role='alert'>" +
                "Please input a valid business ID!</div>";
            return;
        } else {
            notif.innerHTML = '';
            parent.style.visibility = 'visible';
            URL = 'https://avoindata.prh.fi/bis/v1/' + validateInput();

            const resp = await fetch(URL);
            const data = await resp.json();
            console.log(resp.status);

            let arr = [];

            // TODO: Check if data is available
            arr.push(document.querySelector('#bID').value, data.results[0].name,
                data.results[0].contactDetails[0].value,
                data.results[0].addresses[0].street
                + ', ' + data.results[0].addresses[0].city
                + ', ' + data.results[0].addresses[0].postCode,
                data.results[0].businessLines[0].name
                + ', ' + data.results[0].businessLines[0].code);

            const table = document.querySelector('#td');

            // Clear the table
            table.innerHTML = "";

            for (var i = 0; i < arr.length; i++) {
                var row = `<th scope="col">${arr[i]}</th>`

                table.innerHTML += row;
            }
        }
    } catch (err) {
        parent.style.visibility = 'hidden';
        notif.innerHTML =
            "<div class='alert alert-danger' role='alert'>" +
            "Can't find data matching the business ID.</div>";
        console.log(err.message);
    }
};


