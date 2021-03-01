var payButton = document.getElementById("pay-button");
var form = document.getElementById("payment-form");
var shop = document.querySelectorAll('input[name="shop"]');
var input = document.getElementById("tools");
let shirtsKey = "pk_test_77293664-ad1b-4012-ab5d-a5aedb9b2618";
let toolsKey = "pk_test_78f60e49-3c63-411b-99d1-daef1fc6399b";
var apiKey = (shop == "shirts") ? shirtsKey : toolsKey;

shop.forEach(function (e) {
    e.addEventListener("change", function(event){
        Frames.init(apiKey);
    })
});

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
        el.innerHTML = "Card tokenization completed<br>" +
            "Your card token is: <span class=\"token\">" + event.token + "</span>";
    }
);

form.addEventListener("submit", function (event) {
    payButton.disabled = true // disables pay button once submitted
    event.preventDefault();
    Frames.submitCard().
    then(function (data){
        console.log(data.token);
        Frames.init();
    })
    .catch(function (error){
        console.log(error);
    });
});