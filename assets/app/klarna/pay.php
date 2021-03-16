<?php
if(isset($_POST)) {  
    
$curl = curl_init();
$input = json_decode(file_get_contents('php://input'), true);
$pk = "pk_test_77293664-ad1b-4012-ab5d-a5aedb9b2618";
$sk = "sk_test_520984d1-5a3f-45df-84b0-060f650a9a81";
$sessionUri = "https://api.sandbox.checkout.com/klarna-external/credit-sessions";
$authUri = "https://api.sandbox.checkout.com/payments";
$authToken = (empty($input['authorization_token'])) ? "" : $input['authorization_token'];
$payload = json_decode('{
    "session": {
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
    "authorization": {
      "amount": 1000,
      "currency": "GBP",
      "capture": false,
      "source": {
        "type": "klarna",
        "authorization_token": "'.$authToken.'",
        "locale": "en-GB",
        "purchase_country": "GB",
        "tax_amount": 0,
        "billing_address": {
          "given_name": "John",
          "family_name": "Doe",
          "email": "johndoe@email.com",
          "title": "Mr",
          "street_address": "13 New Burlington St",
          "street_address2": "Apt 214",
          "postal_code": "W13 3BG",
          "city": "London",
          "region": "",
          "phone": "01895808221",
          "country": "GB"
        },
        "customer": {
          "date_of_birth": "1970-01-01",
          "gender": "male"
        },
        "products": [
          {
            "name": "Battery Power Pack",
            "quantity": 1,
            "unit_price": 1000,
            "tax_rate": 0,
            "total_amount": 1000,
            "total_tax_amount": 0
          }
        ]
      },
      "success_url": "http://localhost:8888/assets/app/klarna/success.htm",
      "failure_url": "http://localhost:8888/assets/app/klarna/fail.htm"
  
    }
}', true);
$err = json_last_error_msg();
switch ($input['action']) {
  case 'session':
      $uri = $sessionUri;
      $key = $pk;
      $payload = $payload['session'];
    break;
  
  case 'authorization':
      $uri = $authUri;
      $key = $sk;
      $payload = $payload['authorization'];
    break;
  
  default:
    break;
}
curl_setopt_array($curl, array(
  CURLOPT_URL => ''.$uri.'',
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_ENCODING => '',
  CURLOPT_MAXREDIRS => 10,
  CURLOPT_TIMEOUT => 0,
  CURLOPT_FOLLOWLOCATION => true,
  CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
  CURLOPT_CUSTOMREQUEST => 'POST',
  CURLOPT_POSTFIELDS => json_encode ($payload),
  CURLOPT_HTTPHEADER => array(
    'Authorization: '.$key.'',
    'Content-Type: application/json'
  )
));

$response = curl_exec($curl);

curl_close($curl);
echo $response;
}else{
    die(header('HTTP/1.0 400 '.$input.', jsonErr: '.json_last_error_msg()));
}
?>