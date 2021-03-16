let form = document.getElementById("payment-form");
let el = document.querySelector(".success-payment-message");
let select = document.getElementById("apm-select");
let payButton = document.getElementById('pay-button');
let options = document.getElementById('options');
let bic = "";

form.addEventListener("submit", function (event) {
    event.preventDefault();
    payNow(form.elements['apm-id'].value);
});

select.addEventListener('change', function (event) {
    if (event.currentTarget.value != 'default') {
        if (event.currentTarget.value == "ideal") {
            options.parentElement.hidden = false;
            options.required = true;
        }
        else {
            options.parentElement.hidden = true;
            options.required = false;
            bic = "";
            payButton.disabled = false;
        }
    }
    else {
        payButton.disabled = true;
        options.parentElement.hidden = true;
        options.required = false;
        bic = "";
    }

});

options.addEventListener("change", function(event){
    if (event.currentTarget.value != 'default') {
        bic = event.currentTarget.value;
        payButton.disabled = false;
    }
    else 
        {
            bic = "";
            payButton.disabled = true;
        }

});

function payNow(apm) {
    let myHeaders = new Headers();
    clear(el);

    myHeaders.append("Authorization", "sk_test_520984d1-5a3f-45df-84b0-060f650a9a81");
    myHeaders.append("Content-Type", "application/json");

    var _apm = {
        dLocal: {
            "source": {
                "type": "card",
                "number": "4242424242424242",
                "expiry_month": "12",
                "expiry_year": "25",
                "cvv": "100"
            },
            "reference": "dlocal#" + Date.now(),
            "capture": true,
            "amount": 2499,
            "currency": "MXN",
            "billing_descriptor": {
                "name": "dynamic_descriptor",
                "city": "London"
            },
            "processing": {
                "dlocal": {
                    "country": "MX",
                    "payer": {
                        "document": "ID12345678",
                        "name": "John Doe",
                        "email": "john@doe.com"
                    },
                    "installments": {
                        "count": "3"
                    }
                }
            }
        },

        sofort: {
            "source": {
                "type": "sofort"
            },
            "amount": 2499,
            "currency": "EUR",
            "success_url": "http://localhost:8888/index.htm",
            "failure_url": "http://localhost:8888/index.htm",
        },

        ideal: {
            "source": {
                "type": "ideal",
                "bic": "" + bic + "",
                "description": "ORD"+ Date.now(),
                "language": "nl"
            },
            "amount": 2499,
            "currency": "EUR",
            "success_url": "http://localhost:8888/index.htm",
            "failure_url": "http://localhost:8888/index.htm",
        },

        klarna: {
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
        },

        EPS: {
            "source": {
                "type": "eps",
                "purpose": "Mens black t-shirt L"
            },
            "amount": 2499,
            "currency": "EUR",
            "success_url": "http://localhost:8888/index.htm",
            "failure_url": "http://localhost:8888/index.htm",
        },

        poli: {
            "source": {
                "type": "poli"
            },
            "amount": 2499,
            "currency": "AUD"
        },

        giropay: {
            "source": {
                "type": "giropay",
                "purpose": "Mens black t-shirt L"
            },
            "amount": 2499,
            "currency": "EUR",
            "success_url": "http://localhost:8888/index.htm",
            "failure_url": "http://localhost:8888/index.htm"
        },

        przelewy: {
            "amount": 2499,
            "currency": "PLN",
            "source": {
                "type": "p24",
                "payment_country": "PL",
                "account_holder_name": "Bruce Wayne",
                "account_holder_email": "bruce@wayne-enterprises.com",
                "billing_descriptor": "P24 Demo Payment"
            },
            "success_url": "http://localhost:8888/index.htm",
            "failure_url": "http://localhost:8888/index.htm"
        },

        bancontact: {
            "amount": 2499,
            "currency": "EUR",
            "source": {
                "type": "bancontact",
                "account_holder_name": "Bruce Wayne",
                "payment_country": "BE",
                "billing_descriptor": "CKO Demo - bancontact"
            },
            "success_url": "http://localhost:8888/index.htm",
            "failure_url": "http://localhost:8888/index.htm"
        },

        qpay: {
            "amount": 2499,
            "currency": "QAR",
            "source": {
                "type": "qpay",
                "description": "QPay Demo Payment",
                "language": "en",
                "quantity": "1",
                "national_id": "070AYY010BU234M"
            },
            "success_url": "http://localhost:8888/index.htm",
            "failure_url": "http://localhost:8888/index.htm"
        },

        fawtry: {
            "amount": 2499,
            "currency": "EGP",
            "source": {
                "type": "fawry",
                "description": "Fawry Demo Payment",
                "customer_mobile": "01058375055",
                "customer_email": "bruce@wayne-enterprises.com",
                "products": [
                    {
                        "product_id": "0123456789",
                        "quantity": 1,
                        "price": 2499,
                        "description": "Fawry Demo Product"
                    }
                ]
            }
        },

        boleto: {
            "source": {
                "type": "boleto",
                "integration_type": "redirect",
                "country": "BR",
                "payer": {
                    "name": "John Doe",
                    "email": "john@doe-enterprises.com",
                    "document": "53033315550"
                },
                "description": "boleto payment"
            },
            "amount": 2499,
            "currency": "BRL"
        },

        multibanco: {
            "amount": 2499,
            "currency": "EUR",
            "source": {
                "type": "multibanco",
                "payment_country": "PT",
                "account_holder_name": "Bruce Wayne",
                "billing_descriptor": "Multibanco Demo Payment"
            }
        },

        oxxo: {
            "source": {
                "type": "oxxo",
                "integration_type": "redirect",
                "country": "MX",
                "payer": {
                    "name": "Bruce Wayne",
                    "email": "bruce@wayne-enterprises.com"
                },
                "description": "simulate OXXO Demo Payment"
            },
            "amount": 2499,
            "currency": "MXN"
        },

        pago: {
            "source": {
                "type": "pagofacil",
                "integration_type": "redirect",
                "country": "AR",
                "payer": {
                    "name": "Bruce Wayne",
                    "email": "bruce@wayne-enterprises.com"
                },
                "description": "simulate Pago Fácil Demo Payment"
            },
            "amount": 2499,
            "currency": "ARS"
        },

        rapipago: {
            "source": {
                "type": "rapipago",
                "integration_type": "redirect",
                "country": "AR",
                "payer": {
                    "name": "Bruce Wayne",
                    "email": "bruce@wayne-enterprises.com"
                },
                "description": "simulate Rapipago Demo Payment"
            },
            "amount": 2499,
            "currency": "ARS"
        },

        viabaloto: {
            "source": {
                "type": "baloto",
                "integration_type": "redirect",
                "country": "CO",
                "payer": {
                    "name": "Bruce Wayne",
                    "email": "bruce@wayne-enterprises.com"
                },
                "description": "simulate Via Baloto Demo Payment"
            },
            "amount": 2499,
            "currency": "COP"
        }
    }

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: JSON.stringify(_apm[apm]),
        redirect: 'follow'
    };
    if (apm === "klarna")
        Redirect("../klarna/klarna.htm");
    else

        fetch("https://api.sandbox.checkout.com/payments", requestOptions)
            .then(response => {
                if (!response.ok) {
                    throw new Error(response.status + ": " + response.statusText);
                }
                return response.text();
            }
            )
            .then(result => {
                console.log(result);
                print(el, "Payment completed. Thank you!");
                _result = JSON.parse(result);
                if (_result.status === "Pending" && _result._links.redirect) {
                    document.write("<h3 style='margin: 0;display: grid;height: 100vh;place-items: center;'>You will be redirected to the payment page shortly...</h3>");
                    Redirect(_result._links.redirect.href);
                    window.addEventListener("message", (event) => {
                        if (event.origin !== 'http://localhost:8888')
                            return;
                    })
                } else {
                    parent.setModal("./assets/app/apm/success.htm" + "?id=" + _result.id);
                }
            })
            .catch(error => {
                console.log('error', error);
                print(el, error);
            });
};

function print(element, message) {
    element.innerHTML = message;
};

function clear(element, message) {
    element.innerHTML = "";
};

function Redirect(url) {
    parent.window.location = url;
}  