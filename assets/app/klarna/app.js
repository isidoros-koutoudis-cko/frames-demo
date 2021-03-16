let form = document.getElementById("payment-form");
let el = document.querySelector(".success-payment-message");
let payButton = document.getElementById('pay-button');
var session_id = "";
var client_token = "";

function payNow(apm) {

    var _apm = {
        session: {
            "action": "session",
            "purchase_country": "GB",
            "currency": "GBP",
            "locale": "en-GB",
            "amount": 2499,
            "tax_amount": 1,
            "products": [
                {
                    "name": "Brown leather belt",
                    "quantity": 1,
                    "unit_price": 2499,
                    "tax_rate": 0,
                    "total_amount": 2499,
                    "total_tax_amount": 0
                }
            ]
        }

    }

    var requestOptions = {
        method: 'POST',
        body: JSON.stringify(_apm[apm]),
        redirect: 'follow'
    };

    fetch("./pay.php", requestOptions)
        .then(response => {
            if (!response.ok) {
                throw new Error(response.status + ": " + response.statusText);
            }
            return response.text();
        }
        )
        .then(result => {
            console.log(result);
            _result = JSON.parse(result);
            session_id = _result.session_id;
            client_token = _result.client_token;
            window.klarnaAsyncCallback(_result.client_token, _result.session_id);
        })
        .catch(error => {
            console.log('error', error);
            // print(el, error);
        });
};

function klarnaAuth() {
    try {
        Klarna.Payments.authorize(
            {
                instance_id: session_id // Same as instance_id set in Klarna.Payments.load().
            },
            function (response) {
                console.log("Authorise Success:\n");
                console.log(response);
                console.log("Response token: " + response.authorization_token);
                var requestOptions = {
                    method: 'POST',
                    body: JSON.stringify({"action": "authorization", "authorization_token": response.authorization_token}),
                    redirect: 'follow'
                };
                
                fetch("./pay.php", requestOptions)
                    .then(response => {
                        if (!response.ok) {
                            throw new Error(response.status + ": " + response.statusText);
                        }
                        return response.text();
                    }
                    )
                    .then(result => {
                        console.log(result);
                        _result = JSON.parse(result);
                        Redirect(_result._links.redirect.href);
                    })
                    .catch(error => {
                        console.log('error', error);
                    });

            }
        );
    } catch (e) {
        console.log("Authorise:\n" + e)
    }
};

payButton.addEventListener("click", function (event) {
    klarnaAuth();
});

function print(element, message) {
    element.innerHTML = message;
};

function Redirect(url) {
    window.location = url;
}  