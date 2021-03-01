var payButton = document.getElementById("pay-button");
var form = document.getElementById("payment-form");
var nameInput = document.getElementById("name-input");

Frames.init("pk_test_77293664-ad1b-4012-ab5d-a5aedb9b2618");

Frames.addEventHandler(
    Frames.Events.CARD_VALIDATION_CHANGED,
    function (event) {
        console.log("CARD_VALIDATION_CHANGED: %o", event);

        payButton.disabled = !Frames.isCardValid();
    }
);
nameInput.addEventListener('focus', function () {
    nameInput.classList.remove('invalid-input')
  });
nameInput.addEventListener('blur', function (event) {
    if (nameInput.value === '') {
      nameInput.classList.add('invalid-input')
    } else {
      Frames.cardholder.name = nameInput.value
    }
  });
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
    Frames.submitCard();
});