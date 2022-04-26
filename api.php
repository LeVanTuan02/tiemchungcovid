<?php

    date_default_timezone_set('Asia/Ho_Chi_Minh');
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: GET, POST');
    header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");

    // get otp
    if (isset($_POST['get_otp'])) {
        $isSuccess = false;

        $fullname = $_POST['fullname'] ?? '';
        $birthday = $_POST['birthday'] ?? '';
        $genderId = $_POST['genderId'] ?? '';
        $personalPhoneNumber = $_POST['personalPhoneNumber'] ?? '';

        if (!$fullname || !$birthday || !$genderId || !$personalPhoneNumber) {
            echo json_encode(array(
                'success' => $isSuccess,
                'message' => "Vui lòng nhập đầy đủ các trường"
            ));
        } else {
            $fullname = rawurlencode($fullname);
            $birthday = strtotime("$birthday 07:00") . '000';

            $response = json_decode(getOtp($fullname, $birthday, $genderId, $personalPhoneNumber), true);
            if (isset($response['status']) && $response['status'] === 400) {
                echo json_encode(array(
                    'success' => $isSuccess,
                    'message' => $response['title']
                ));
            } else if (isset($response['code'])) {
                echo json_encode(array(
                    'success' => true,
                    'message' => $response['message']
                ));
            }
        }
    } else if (isset($_POST['get_info'])) {
        $isSuccess = false;

        $fullname = $_POST['fullname'] ?? '';
        $birthday = $_POST['birthday'] ?? '';
        $genderId = $_POST['genderId'] ?? '';
        $personalPhoneNumber = $_POST['personalPhoneNumber'] ?? '';
        $otp = $_POST['otp'] ?? '';

        if (!$fullname || !$birthday || !$genderId || !$personalPhoneNumber || !$otp) {
            echo json_encode(array(
                'success' => $isSuccess,
                'message' => "Vui lòng nhập đầy đủ các trường"
            ));
        } else {
            $fullname = rawurlencode($fullname);
            $birthday = strtotime("$birthday 07:00") . '000';

            $response = json_decode(getInfo($fullname, $birthday, $genderId, $personalPhoneNumber, $otp), true);
            if (isset($response['status']) && $response['status'] === 400) {
                echo json_encode(array(
                    'success' => $isSuccess,
                    'message' => $response['title']
                ));
            } else if (isset($response['errorResponse']['code']) && $response['errorResponse']['code']) {
                echo json_encode(array(
                    'success' => true,
                    'patientInfo' => $response['patientInfo'],
                    'qrCode' => $response['qrCode']
                ));
            }
        }
    } else {
        echo json_encode(array(
            'success' => false,
            'message' => "Đã có lỗi xảy ra",
        ));
    }


    // function
    function getOtp($fullname, $birthday, $genderId, $personalPhoneNumber) {
        $apiUrl = "https://tiemchungcovid19.gov.vn/api/vaccination/public/otp-search?fullname=${fullname}&birthday=${birthday}&genderId=${genderId}&personalPhoneNumber=${personalPhoneNumber}";
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $apiUrl);
        curl_setopt($ch, CURLOPT_HEADER, 0);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 0);
        curl_setopt($ch, CURLOPT_USERAGENT, "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.99 Safari/537.36");

        $result = curl_exec($ch);
        curl_close($ch);

        return $result;
    }

    function getInfo($fullname, $birthday, $genderId, $personalPhoneNumber, $otp) {
        $apiUrl = "https://tiemchungcovid19.gov.vn/api/vaccination/public/patient-vaccinated?fullname=${fullname}&birthday=${birthday}&genderId=${genderId}&personalPhoneNumber=${personalPhoneNumber}&otp=${otp}";
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $apiUrl);
        curl_setopt($ch, CURLOPT_HEADER, 0);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 0);
        curl_setopt($ch, CURLOPT_USERAGENT, "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.99 Safari/537.36");

        $result = curl_exec($ch);
        curl_close($ch);

        return $result;
    }

?>