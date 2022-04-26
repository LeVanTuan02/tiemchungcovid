const formGetOtp = document.querySelector('#form__get-otp');
const formGetInfo = document.querySelector('#form__get-info')
const btnReset = document.querySelector('.btn-reset-form');
const modalOtp = new bootstrap.Modal(document.getElementById('otpModal'))
const modalShowInfo = new bootstrap.Modal(document.getElementById('modalShowInfo'))

const fullname = document.querySelector('.form__get-otp-fullname');
const birthday = document.querySelector('.form__get-otp-birthday');
const genderId = document.querySelector('.form__get-otp-gender');
const personalPhoneNumber = document.querySelector('.form__get-otp-phone');
const otp = document.querySelector('#form__get-info-otp');

const apiUrl = 'https://tuandemo.com/api/covid.php';

formGetOtp.onsubmit = async (e) => {
    e.preventDefault();
    const isValid = validate();
    if (isValid) {

        const date = new Date(birthday.value);
        const newBirthday = `${date.getDate()}-${date.getMonth()+1}-${date.getFullYear()}`;
        
        const response = await getOtp(fullname.value, newBirthday, genderId.value, personalPhoneNumber.value);
        
        if (response.success) {
            modalOtp.show();
        } else {
            toastr.error(response.message);
        }
    }
}

formGetInfo.onsubmit = async (e) => {
    e.preventDefault();
    const inputOtp = document.querySelector('#form__get-info-otp');

    if (!inputOtp.value) {
        toastr.error('Vui lòng nhập mã OTP');
    } else {
        const date = new Date(birthday.value);
        const newBirthday = `${date.getDate()}-${date.getMonth()+1}-${date.getFullYear()}`;

        const response = await getInfo(fullname.value, newBirthday, genderId.value, personalPhoneNumber.value, otp.value);
        
        if (response.success) {
            const patientInfo = response.patientInfo;
            const date = new Date(patientInfo.birthday);
            const birthday = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;

            const html = /* html */ `
            <div class="row mt-4">
                <div class="col-sm-4 col-md-3 mt-2">
                    <label for="">Họ và tên</label>
                    <p class="fw-bold">${patientInfo.fullname}</p>
                </div>
                <div class="col-sm-4 col-md-3 mt-2">
                    <label for="">Ngày sinh</label>
                    <p class="fw-bold">${birthday}</p>
                </div>
                <div class="col-sm-4 col-md-3 mt-2">
                    <label for="">CCCD/HC</label>
                    <p class="fw-bold">${patientInfo.identification}</p>
                </div>
                <div class="col-sm-4 col-md-3 mt-2">
                    <label for="">Số thẻ BHYT</label>
                    <p class="fw-bold">${patientInfo.healthInsuranceNumber}</p>
                </div>
                <div class="col-sm-4 col-md-3 mt-2">
                    <label for="">Số điện thoại</label>
                    <p class="fw-bold">${patientInfo.personalPhoneNumber}</p>
                </div>
                <div class="col-12 mt-2">
                    <label for="">Địa chỉ</label>
                    <p class="fw-bold">${patientInfo.ward} - ${patientInfo.district} - ${patientInfo.province}</p>
                </div>
                <div class="col-12 mt-2">
                    <label for="">Kết luận</label>
                    <p class="fw-bold">Đã được tiêm phòng vắc xin phòng bệnh Covid-19</p>
                </div>
            </div>

            <table class="table table-hover">
                <thead>
                    <tr class="table-active">
                        <th scope="col">Mũi số</th>
                        <th scope="col">Thời gian tiêm</th>
                        <th scope="col">Tên vắc xin</th>
                        <th scope="col">Số lô</th>
                        <th scope="col">Nơi tiêm</th>
                    </tr>
                </thead>
                <tbody>
                    ${patientInfo.vaccinatedInfoes.map((vaccine, index) => {
                        let date = new Date(vaccine.injectionDate);
                        date = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} - ${date.getHours()}:${date.getMinutes()}`;
                        return `
                        <tr>
                            <th scope="row">${index + 1}</th>
                            <td>${date}</td>
                            <td>${vaccine.vaccineName}</td>
                            <td>${vaccine.batchNumber ?? ''}</td>
                            <td>${vaccine.injectionPlace}</td>
                        </tr>
                        `;
                    }).join('')}
                </tbody>
            </table>
            `;

            document.querySelector('.modal-show-info-result').innerHTML = html;
            modalShowInfo.show();
            modalOtp.hide();
        } else {
            toastr.error(response.message);
        }
    }
}

btnReset.onclick = () => {
    formGetOtp.reset();
}

function validate() {
    const validateElements = document.querySelectorAll('.form-control-validation');
    let isValid = true;

    validateElements.forEach(element => {
        if (!element.value) {
            element.style.border = '1px solid #dc3545';
            element.nextElementSibling.style.display = 'block';
            element.nextElementSibling.innerHTML = 'Vui lòng hoàn thành trường này!';
            isValid = false;
        } else {
            element.style.border = '1px solid #ced4da';
            element.nextElementSibling.style.display = 'none';
        }
    });

    return isValid;
}

async function getOtp(fullname, birthday, genderId, personalPhoneNumber) {
    const response = await axios.post(apiUrl, {
        get_otp: '',
        fullname,
        birthday,
        genderId,
        personalPhoneNumber
    });
    const { data } = response;

    return data;
}

async function getInfo(fullname, birthday, genderId, personalPhoneNumber, otp) {
    const response = await axios.post(apiUrl, {
        get_info: '',
        fullname,
        birthday,
        genderId,
        personalPhoneNumber,
        otp
    });
    const { data } = response;

    return data;
}