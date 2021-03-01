// https://developers.google.com/pay/api/web/guides/

var GATEWAY_MERCHANT_ID;
var GOOGLE_ENVIRONMENT;
var CURRENCY_CODE;
var GOOGLE_MERCHANT_ID;
var COUNTRY_CODE;

/**
 * Identify your gateway and your site's gateway merchant identifier
 *
 * The Google Pay API response will return an encrypted payment method capable
 * of being charged by a supported gateway after payer authorization
 *
 * @todo check with your gateway on the parameters to pass
 * @see {@link https://developers.google.com/pay/api/web/reference/object#Gateway|PaymentMethodTokenizationSpecification}
 *//**
 * Identify your gateway and your site's gateway merchant identifier
 *
 * The Google Pay API response will return an encrypted payment method capable
 * of being charged by a supported gateway after payer authorization
 *
 * @todo check with your gateway on the parameters to pass
 * @see {@link https://developers.google.com/pay/api/web/reference/object#Gateway|PaymentMethodTokenizationSpecification}
 */
var tokenizationSpecification = {
    type: 'PAYMENT_GATEWAY',
    parameters: {
    'gateway': 'checkoutltd',
    'gatewayMerchantId': GATEWAY_MERCHANT_ID
    }
   };
/**
 * Initialize configuration parameters
 * @param {number} account The merchant account number
 * @param {Text} currency The merchant account currency
 * @param {number} amount The amount payable
 * @param {Text} usr The SUT API Key user
 * @param {Text} passwd The SUT API Key password
 * @param {Text} env The environment to test (Live or Test)
 * @param {number} gm_id The google merchant ID
 */
function setConfigParam (usr, currency, amount, env, gm_id) {
    // make sure no null inputs
    if(!usr || !currency || !amount || !env || !gm_id) {
        //printMessage(new Error('gpay.Missing Init config parameters'));
        return;
    }else {
    tokenizationSpecification.parameters.gatewayMerchantId = usr;
    GATEWAY_MERCHANT_ID = usr;
    GOOGLE_ENVIRONMENT = env.toLowerCase() == 'live' ? 'PRODUCTION' : 'TEST';
    CURRENCY_CODE = currency;
    GOOGLE_MERCHANT_ID = gm_id;
    // set country code based on currency
    switch (currency) {
        case 'GBP':
            COUNTRY_CODE = 'GB';
            break;
        case 'CAD':
            COUNTRY_CODE = 'CA';
            break;
        case 'EUR':
            COUNTRY_CODE = 'FR';
            break;
        case 'USD':
            COUNTRY_CODE = 'US';
            break;
    }
    return true;
}
};

var paymentsClient = null;
 
/**
 * Define the version of the Google Pay API referenced when creating your
 * configuration
 *
 * @see {@link https://developers.google.com/pay/api/web/reference/object#PaymentDataRequest|apiVersion in PaymentDataRequest}
 */
const baseRequest = {
 apiVersion: 2,
 apiVersionMinor: 0
};
 
/**
 * Card networks supported by your site and your gateway
 *
 * @see {@link https://developers.google.com/pay/api/web/reference/object#CardParameters|CardParameters}
 * @todo confirm card networks supported by your site and gateway
 */
const allowedCardNetworks = ["AMEX", "DISCOVER", "INTERAC", "JCB", "MASTERCARD", "VISA"];
 
/**
 * Card authentication methods supported by your site and your gateway
 *
 * @see {@link https://developers.google.com/pay/api/web/reference/object#CardParameters|CardParameters}
 * @todo confirm your processor supports Android device tokens for your
 * supported card networks
 */
const allowedCardAuthMethods = ["PAN_ONLY"];//, "CRYPTOGRAM_3DS"];
 

 
/**
 * Describe your site's support for the CARD payment method and its required
 * fields
 *
 * @see {@link https://developers.google.com/pay/api/web/reference/object#CardParameters|CardParameters}
 */
const baseCardPaymentMethod = {
 type: 'CARD',
 parameters: {
 allowedAuthMethods: allowedCardAuthMethods,
 allowedCardNetworks: allowedCardNetworks
 }
};
 
/**
 * Describe your site's support for the CARD payment method including optional
 * fields
 *
 * @see {@link https://developers.google.com/pay/api/web/reference/object#CardParameters|CardParameters}
 */
const cardPaymentMethod = Object.assign(
 {},
 baseCardPaymentMethod,
 {
 tokenizationSpecification: tokenizationSpecification
 }
);
 
/**
 * Configure your site's support for payment methods supported by the Google Pay
 * API.
 *
 * Each member of allowedPaymentMethods should contain only the required fields,
 * allowing reuse of this base request when determining a viewer's ability
 * to pay and later requesting a supported payment method
 *
 * @returns {object} Google Pay API version, payment methods supported by the site
 */
function getGoogleIsReadyToPayRequest() {
 return Object.assign(
 {},
 baseRequest,
 {
 allowedPaymentMethods: [baseCardPaymentMethod]
 }
 );
}

function paymentDataCallback(intermediatePaymentData) {
    return new Promise(function (resolve, reject) {
    
    let shippingAddress = intermediatePaymentData.shippingAddress;
    let shippingOptionData = intermediatePaymentData.shippingOptionData;
    let paymentDataRequestUpdate = {};
    
    console.log(shippingAddress.administrativeArea)
    
    if (intermediatePaymentData.callbackTrigger == "INITIALIZE" || intermediatePaymentData.callbackTrigger == "SHIPPING_ADDRESS") {
    if (shippingAddress.administrativeArea == "AB") {
    paymentDataRequestUpdate.error = getGoogleUnserviceableAddressError();
    }
    else {
    paymentDataRequestUpdate.newShippingOptionParameters = getGoogleDefaultShippingOptions();
    let selectedShippingOptionId = paymentDataRequestUpdate.newShippingOptionParameters.defaultSelectedOptionId;
    paymentDataRequestUpdate.newTransactionInfo = calculateNewTransactionInfo(selectedShippingOptionId);
    }
    }
    else if (intermediatePaymentData.callbackTrigger == "SHIPPING_OPTION") {
    paymentDataRequestUpdate.newTransactionInfo = calculateNewTransactionInfo(shippingOptionData.id);
    }
    
    resolve(paymentDataRequestUpdate);
    });
   }
    
   /**
    * Provide Google Pay API with a payment amount, currency, and amount status
    *
    * @see {@link https://developers.google.com/pay/api/web/reference/object#TransactionInfo|TransactionInfo}
    * @returns {object} transaction info, suitable for use as transactionInfo property of PaymentDataRequest
    */
    
   /**
    * Provide a key value store for shippping options.
    */
   function getShippingCosts() {
    return {
    "shipping-001": "0.00",
    "shipping-002": "1.99",
    "shipping-003": "10.00"
    }
   }
    
   /**
    * Provide Google Pay API with shipping address parameters when using dynamic buy flow.
    *
    * @see {@link https://developers.google.com/pay/api/web/reference/object#ShippingAddressParameters|ShippingAddressParameters}
    * @returns {object} shipping address details, suitable for use as shippingAddressParameters property of PaymentDataRequest
    */
   function getGoogleShippingAddressParameters() {
    return {
    allowedCountryCodes: [COUNTRY_CODE],
    phoneNumberRequired: true
    };
   }
    
   /**
    * Provide Google Pay API with shipping options and a default selected shipping option.
    *
    * @see {@link https://developers.google.com/pay/api/web/reference/object#ShippingOptionParameters|ShippingOptionParameters}
    * @returns {object} shipping option parameters, suitable for use as shippingOptionParameters property of PaymentDataRequest
    */
   function getGoogleDefaultShippingOptions() {
    return {
    defaultSelectedOptionId: "shipping-001",
    shippingOptions: [
    {
    "id": "shipping-001",
    "label": "Free: Standard shipping",
    "description": "Free Shipping delivered in 5 business days."
    },
    {
    "id": "shipping-002",
    "label": "$1.99: Standard shipping",
    "description": "Standard shipping delivered in 3 business days."
    },
    {
    "id": "shipping-003",
    "label": "$10: Express shipping",
    "description": "Express shipping delivered in 1 business day."
    },
    ]
    };
   }

   /**
 * Provide Google Pay API with a payment data error.
 *
 * @see {@link https://developers.google.com/pay/api/web/reference/object#PaymentDataError|PaymentDataError}
 * @returns {object} payment data error, suitable for use as error property of PaymentDataRequestUpdate
 */
function getGoogleUnserviceableAddressError() {
    return {
    reason: "SHIPPING_ADDRESS_UNSERVICEABLE",
    message: "Cannot ship to the selected address",
    intent: "SHIPPING_ADDRESS"
    };
   }
    
   function calculateNewTransactionInfo(shippingOptionId) {
    let newTransactionInfo = getGoogleTransactionInfo();
    
    let shippingCost = getShippingCosts()[shippingOptionId];
    console.log(newTransactionInfo)
    console.log(newTransactionInfo.displayItems)
    newTransactionInfo.displayItems.push({
    type: "LINE_ITEM",
    label: "Shipping cost",
    price: shippingCost,
    status: "FINAL"
    });
    
    let totalPrice = 0.00;
    newTransactionInfo.displayItems.forEach(displayItem => totalPrice += parseFloat(displayItem.price));
    newTransactionInfo.totalPrice = totalPrice.toString();
    
    return newTransactionInfo;
   }
    
   /**
    * Configure support for the Google Pay API
    *
    * @see {@link https://developers.google.com/pay/api/web/reference/object#PaymentDataRequest|PaymentDataRequest}
    * @returns {object} PaymentDataRequest fields
    */
   function getGooglePaymentDataRequest() {
    const paymentDataRequest = Object.assign({}, baseRequest);
    paymentDataRequest.allowedPaymentMethods = [cardPaymentMethod];
    paymentDataRequest.transactionInfo = getGoogleTransactionInfo();
    paymentDataRequest.merchantInfo = {
    // @todo a merchant ID is available for a production environment after approval by Google
    // See {@link https://developers.google.com/pay/api/web/guides/test-and-deploy/integration-checklist|Integration checklist}
    merchantId: GOOGLE_MERCHANT_ID,
    merchantName: 'Paysafe Shop'
    };
    
    //paymentDataRequest.callbackIntents = ["SHIPPING_ADDRESS", "SHIPPING_OPTION"];
    paymentDataRequest.shippingAddressParameters = getGoogleShippingAddressParameters();
    paymentDataRequest.shippingOptionParameters = getGoogleDefaultShippingOptions();
    
    paymentDataRequest.shippingAddressRequired = true;
    paymentDataRequest.shippingOptionRequired = true;
    return paymentDataRequest;
   }
    
   /**
    * Return an active PaymentsClient or initialize
    *
    * @see {@link https://developers.google.com/pay/api/web/reference/client#PaymentsClient|PaymentsClient constructor}
    * @returns {google.payments.api.PaymentsClient} Google Pay API client
    */
   function getGooglePaymentsClient() {
    if (paymentsClient === null || paymentsClient.jc.environment.toLowerCase() != GOOGLE_ENVIRONMENT.toLowerCase()) {
    paymentsClient = new google.payments.api.PaymentsClient({
    environment: GOOGLE_ENVIRONMENT
    // ,
    // paymentDataCallbacks: {
    // onPaymentDataChanged: paymentDataCallback
    // }
    });
    }
    console.log("GOOGLEPAYCLIENT")
    return paymentsClient;
   }
    
   /**
    * Initialize Google PaymentsClient after Google-hosted JavaScript has loaded
    *
    * Display a Google Pay payment button after confirmation of the viewer's
    * ability to pay.
    */
   function onGooglePayLoaded(usr, currency, amount, env, gm_id) {
    console.log("GOOGLEPAYLOADED")
    //printMessage("**Initiating Google Pay ...")
    // Validate parameters nullability
    if(!setConfigParam(usr, currency, amount, env, gm_id))
        return;
    paymentsClient = getGooglePaymentsClient();
    paymentsClient.isReadyToPay(getGoogleIsReadyToPayRequest())
    .then(function (response) {
    if (response.result) {
    addGooglePayButton();
    // @todo prefetch payment data to improve performance after confirming site functionality
    prefetchGooglePaymentData();
    }
    })
    .catch(function (err) {
        console.error(err);
        printProperties(new Error (err, "gpay."));
    });
   }

   /**
    * Add Google Pay button in form, once any existing buttons have been removed
    * @param {Node} node Google pay button container node element
    * @param {google.payments.api.PaymentsClient} button Google Pay API client createButton
    */
   function addButton(node, button){
        while (node.firstChild) {
            node.firstChild.remove();
        }
        node.appendChild(button);
    };

 
   /**
    * Add a Google Pay purchase button alongside an existing checkout button
    *
    * @see {@link https://developers.google.com/pay/api/web/reference/object#ButtonOptions|Button options}
    * @see {@link https://developers.google.com/pay/api/web/guides/brand-guidelines|Google Pay brand guidelines}
    */
   function addGooglePayButton() {
    const button =
    paymentsClient.createButton({ onClick: onGooglePaymentButtonClicked });
    //document.getElementById('google-pay-button').appendChild(button);
    addButton(document.getElementById('google-pay-button'), button);
   }
    
   /**
    * Provide Google Pay API with a payment amount, currency, and amount status
    *
    * @see {@link https://developers.google.com/pay/api/web/reference/object#TransactionInfo|TransactionInfo}
    * @returns {object} transaction info, suitable for use as transactionInfo property of PaymentDataRequest
    */
   function getGoogleTransactionInfo() {
    return {
    displayItems: [
    {
    label: "Subtotal",
    type: "SUBTOTAL",
    price: "0.90",
    },
    {
    label: "Tax",
    type: "TAX",
    price: "0.11",
    }
    ],
    countryCode: COUNTRY_CODE,
    currencyCode: CURRENCY_CODE,
    totalPriceStatus: "FINAL",
    totalPrice: "1.01",
    totalPriceLabel: "Total"
    };
   }

   /**
 * Prefetch payment data to improve performance
 *
 * @see {@link https://developers.google.com/pay/api/web/reference/client#prefetchPaymentData|prefetchPaymentData()}
 */
function prefetchGooglePaymentData() {
    const paymentDataRequest = getGooglePaymentDataRequest();
    // transactionInfo must be set but does not affect cache
    paymentDataRequest.transactionInfo = {
    totalPriceStatus: 'NOT_CURRENTLY_KNOWN',
    currencyCode: CURRENCY_CODE
    };
    paymentsClient.prefetchPaymentData(paymentDataRequest);
   }
    
   /**
    * Show Google Pay payment sheet when Google Pay payment button is clicked
    */
   function onGooglePaymentButtonClicked() {
    // console.log("CLICKED")
    const paymentDataRequest = getGooglePaymentDataRequest();
    paymentsClient.loadPaymentData(paymentDataRequest)
    .then(function (paymentData) {
        // handle the response
        processPayment(paymentData);
    })
    .catch(function (err) {
        // show error in developer console for debugging
        console.error(err);
        //printProperties(err, "gpay.error");
    });
   }
    
   /**
    * Process payment data returned by the Google Pay API
    *
    * @param {object} paymentData response from Google Pay API after user approves payment
    * @see {@link https://developers.google.com/pay/api/web/reference/object#PaymentData|PaymentData object reference}
    */
   function processPayment(paymentData) {
    // show returned data in developer console for debugging
    console.log(paymentData);
    //printMessage("Google Pay successful payment!")
    //printProperties(paymentData.paymentMethodData.tokenizationData, "gpay.response.data");
   }