let payButton = document.getElementById("pay-button");
let form = document.getElementById("payment-form");
let _form = form.elements[0];
let _threeD = document.getElementById("threeD");
let _name = document.getElementById("name");
let _nameInput = document.getElementById("name-input");
let _cof_cvv = document.getElementById("cof-cvv");
let _cof_first =document.getElementById("cof-first");
let _card_label = document.getElementById("card-label");
let _date_label = document.getElementById("date-label");
let _cvv_label = document.getElementById("cvv-label");
let _3DS = document.getElementById("threeD");
let _NC = document.getElementById("newCD");
let _NC_block = document.getElementById("new-card");
let _cof_block = document.getElementById("cof");
let el = document.querySelector(".success-payment-message");
let is3DS = false;
let isNC = false;

let state = {
    is3DS: false,
    isNC: false,
    'card-number': {
        isEmpty: true
    },
    'expiry-date': {
        isEmpty: true
    },
    'cvv': {
        isEmpty: true
    }
}
Frames.init({
    publicKey: "pk_test_77293664-ad1b-4012-ab5d-a5aedb9b2618",
    localization: {
        cardNumberPlaceholder: '•••• •••• •••• ••••',
        expiryMonthPlaceholder: 'MM',
        expiryYearPlaceholder: 'YY',
        cvvPlaceholder: '•••'
    },
    style: {
        placeholder: {
            base: {
               /*  color: "transparent" */
            }
        }
    }
});

Frames.addEventHandler(
    Frames.Events.FRAME_VALIDATION_CHANGED,
    function (event) {
        console.log("CARD_VALIDATION_CHANGED: %o", event);
        payButton.disabled = !Frames.isCardValid();
        state[event.element].isEmpty = event.isEmpty;
    }
);

Frames.addEventHandler(
    Frames.Events.FRAME_FOCUS, 
    function (event){
        switch (event.element) {
            case 'card-number':
                _card_label.classList.add("inputLabel", "left", "white-bg");
              break
            case 'expiry-date':
                _date_label.classList.add("inputLabel", "white-bg");
              break
            case 'cvv':
              _cvv_label.classList.add("inputLabel", "white-bg")
              break
          }
    }
);

Frames.addEventHandler(Frames.Events.FRAME_BLUR, function (event) {
    // Float the label to the center if the input is empty
    switch (event.element) {
      case 'card-number':
        if (state['card-number'].isEmpty) {
            _card_label.classList.remove("inputLabel", "left", "white-bg")
        }
        break
      case 'expiry-date':
        if (state['expiry-date'].isEmpty) {
            _date_label.classList.remove("inputLabel", "white-bg")
        }
        break
      case 'cvv':
        if (state['card-number'].isEmpty) {
            _cvv_label.classList.remove("inputLabel", "white-bg")
        }
        break
    }
  });

Frames.addEventHandler(
    Frames.Events.CARD_TOKENIZED,
    function (event) {
        print(el, "Payment completed. Thank you!");
    }
);

_3DS.addEventListener("change", function (event){
    state.is3DS = _3DS.checked;
});

_NC.addEventListener("change", function(event){
    state.isNC = _NC.checked;
    if (state.isNC) {
        _NC_block.hidden = false;
        _cof_block.hidden = true;
    }else {
        _cof_block.hidden = false;
        _NC_block.hidden = true;
    }
})
form.addEventListener("submit", function (event) {
    payButton.disabled = true // disables pay button once submitted
    print(el, "");
    event.preventDefault();
    if(_cof_first.selected){
        let _form = form.elements[0];
        threeD(_cof_first.value, true, form.elements['cof-id'].value, form.elements['cvv'].value );
    }
    Frames.submitCard().
        then(function (data) {
            console.log(data.token);
            if (data.token){
                threeD(data.token, false, "", "");
            }
            Frames.init();
            _card_label.classList.remove("inputLabel", "left", "white-bg")
            _date_label.classList.remove("inputLabel", "white-bg")
            _cvv_label.classList.remove("inputLabel", "white-bg")
        })
        .catch(function (error) {
            console.log(error);
        });
});

form.querySelector("select").addEventListener("change",function (event){
    if (_cof_first.selected){
        _cof_cvv.hidden = false;
        _cof_cvv.querySelector("input").required = true;
        payButton.disabled = false;
    }else{
        _cof_cvv.firstElementChild.value = '';
        _cof_cvv.hidden = true;
        payButton.disabled = true;
    }
})

function threeD(token, _isCOF, _cof_id, _cvv) {
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
        "enabled": (state.is3DS === false) ? false : true
    },
    "capture": true,
    "payment_type": "Regular",
    "success_url": "http://localhost:8888/assets/app/cof/success.htm",
    "failure_url": "http://localhost:8888/assets/app/cof/fail.htm"
};
    var raw_cof = {
        "source": {
            "type": "id",
            "id": _cof_id,
            "cvv": _cvv,
        },
        "amount": 1000,
        "currency": "EUR",
        "3ds": {
            "enabled": (state.is3DS === false) ? false : true
        },
        "success_url": "http://localhost:8888/assets/app/cof/success.htm",
        "failure_url": "http://localhost:8888/assets/app/cof/fail.htm"
    }
    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: JSON.stringify(_isCOF === true ? raw_cof : raw),
        redirect: 'follow'
    };

    var requestOptions3D = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    }
    fetch("https://api.sandbox.checkout.com/payments", requestOptions)
        .then(response => response.text())
        .then(result => {
            console.log(result);
            print(el, "Payment completed. Thank you!")
            redirect = JSON.parse(result);
            if(redirect.status === "Pending"){
                parent.setModal(redirect._links.redirect.href);
                window.addEventListener("message", (event) => {
                    if (event.origin !== 'http://localhost:8888')
                        return;
                    
                    fetch("https://api.sandbox.checkout.com/payments/" + event.data, requestOptions3D)
                        .then(response => response.text())
                        .then(result => {
                            let _result = JSON.parse(result);
                            _cof_first.text = _result.source.bin +" xx - xxxx - "+ _result.source.last4;
                            _cof_first.value = _result.source.id;
                            _nameInput.innerHTML = "";
                            
                        }).catch(error => {
                            console.log('error', error);
                            print(el, error);
                        })

                })

            }else if (!_isCOF){
                 _cof_first.text = redirect.source.bin +" xx - xxxx - "+ redirect.source.last4;
                _cof_first.value = redirect.source.id;
                _nameInput.innerHTML = "";
            }
            
        })
        .catch(error => {
            console.log('error', error);
            print(el, error);
        });
};

function print(el, message){
    el.innerHTML = message;
}

window.getSessionId = function (sessionId) {
    return sessionId;
};

/* var iframe = document.getElementById("iframeId");
iframe.contentWindow.myFunction(args); */