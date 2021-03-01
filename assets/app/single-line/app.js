let payButton = document.getElementById("pay-button");
let form = document.getElementById("payment-form");
let _threeD = document.getElementById("threeD");
let _name = document.getElementById("name");
let _nameHolder = document.getElementById("name-holder");
let is3D = false;
let isName = false;

Frames.init("pk_test_77293664-ad1b-4012-ab5d-a5aedb9b2618");

Frames.addEventHandler(
    Frames.Events.CARD_VALIDATION_CHANGED,
    function (event) {
        console.log("CARD_VALIDATION_CHANGED: %o", event);

        payButton.disabled = !Frames.isCardValid();
    }
);

Frames.addEventHandler(
    Frames.Events.CARD_TOKENIZED,
    function (event) {
        var el = document.querySelector(".success-payment-message");
        el.innerHTML = "Payment Completed. Thank you!<br>";
    }
);
_threeD.addEventListener("change", function(event){
    is3D = _threeD.checked;
});
_name.addEventListener("change", function(event){
    if (_name.checked){
        _nameHolder.hidden = false;
    }else{
        _nameHolder.firstElementChild.value = '';
        _nameHolder.hidden = true;
    }
});
form.addEventListener("submit", function (event) {
    payButton.disabled = true // disables pay button once submitted
    event.preventDefault();
    Frames.submitCard().
        then(function (data) {
            console.log(data.token);
            if (is3D){
                threeD(data.token);
            }
            Frames.init();
        })
        .catch(function (error) {
            console.log(error);
        });
});

function threeD(token) {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", "sk_test_520984d1-5a3f-45df-84b0-060f650a9a81");
    myHeaders.append("Content-Type", "application/json");

    var raw = {
    "source": {
        "type": "token",
        "token": token
    },
    "amount": 1000,
    "currency": "EUR",
    "3ds": {
        "enabled": true
    },
    "capture": true,
    "payment_type": "Regular",
    "success_url": "http://localhost:8888/assets/app/single-line-3DS/success.htm",
    "failure_url": "http://localhost:8888/assets/app/single-line-3DS/fail.htm"
};
    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: JSON.stringify(raw),
        redirect: 'follow'
    };

    fetch("https://api.sandbox.checkout.com/payments", requestOptions)
        .then(response => response.text())
        .then(result => {
            console.log(result);
            redirect = JSON.parse(result);
            parent.setModal(redirect._links.redirect.href);
        })
        .catch(error => {
            console.log('error', error);
        });
};
