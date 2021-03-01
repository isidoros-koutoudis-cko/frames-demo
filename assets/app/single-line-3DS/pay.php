<?php
if(isset($_POST) && $_POST['formData']) {  
    
$curl = curl_init();

curl_setopt_array($curl, array(
  CURLOPT_URL => 'https://api.sandbox.checkout.com/payments',
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_ENCODING => '',
  CURLOPT_MAXREDIRS => 10,
  CURLOPT_TIMEOUT => 0,
  CURLOPT_FOLLOWLOCATION => true,
  CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
  CURLOPT_CUSTOMREQUEST => 'POST',
  CURLOPT_POSTFIELDS =>'{
  "source": {
    "type": "token",
    "token": "'.$_POST["formData"].'"
  },
  "amount": 2000,
  "currency": "EUR",
  "3ds": {
    "enabled": true
  },
  "success_url": "http://localhost:8888/assets/app/single-line-3DS/success.htm",
  "failure_url": "http://localhost:8888/assets/app/single-line-3DS/fail.htm"
}',CURLOPT_HTTPHEADER => array(
    'Authorization: sk_test_520984d1-5a3f-45df-84b0-060f650a9a81',
    'Content-Type: application/json'
  )
));

$response = curl_exec($curl);

curl_close($curl);
echo $response;
}else{
    die(header('HTTP/1.0 400 '.$_POST['formData']));
}
?>