var payButton = document.getElementById("pay-button");
var form = document.getElementById("payment-form");

Frames.init({
    publicKey: "pk_test_77293664-ad1b-4012-ab5d-a5aedb9b2618",
    name: "name"
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
    Frames.submitCard()
        .then(function (val){
            console.log(val);
        })
        .catch(function (error) {
            console.log(error);
        });
});