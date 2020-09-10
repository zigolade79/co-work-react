import CognitoConfig from "../../config/configg";
import {
  Config,
  CognitoIdentityCredentials,
} from "../../config/aws-cognito-sdk.min";
import {
  CognitoUserPool,
  CognitoUserAttribute,
} from "../../config/amazon-cognito-identity-js";

// AWSCognito 객체를 계속해서 사용하는데 여기에 리전 정보를 저장합니다.
// CognitoConfig.region이 위에서 별도의 js 파일에 넣어둔 설정값입니다.
Config.region = CognitoConfig.region;

// 입력한 User Pool 정보를 가지고 실제 User Pool에 접근할 수 있는 객체를 만듭니다.
const userPool = new CognitoUserPool({
  UserPoolId: CognitoConfig.UserPoolId,
  ClientId: CognitoConfig.ClientId,
});

// 아래 변수는 회원가입을 하고 가입이 성공했을 때 사용자 정보를 반환받는 변수인데,
// 회원가입 함수와 인증 함수에서 같은 객체를 사용해야하기 때문에 전역변수로 뺐습니다.
let cognitoUser;

function submitSignUp(email, user_Pw) {
  console.log("submitSignUp");
  // 가입할 때 사용자가 입력한 정보들을 저장할 배열입니다.
  const attributeList = [
    new CognitoUserAttribute({
      Name: "email",
      Value: email,
    }),
  ];

  // 입력 폼에서 입력된 값을 받아오는 부분입니다. 일반적인 javascript입니다.
  //let user_Name = document.getElementById("signup_username").value.trim();
  //let user_PhoneNumber = document.getElementById("signup_phonenumber").value;
  //let user_Pw = document.getElementById("signup_pwd").value.trim();
  //console.log("user data : ", user_Name, ", ", user_Pw);

  // 이 변수가 사용자가 입력한 정보 중 하나를 입력하는 변수입니다.
  // 저는 핸드폰 번호만 입력받았습니다.
  // 변수명은 자유롭게 사용가능하나, Name은 AWS Cognito에서 정해주는대로 써야합니다.
  // 목록 : address, birthdate, email, family_name, gender, given_name, locale
  //   , middle_name, name, nickname, phone_number, picture, preferred_username
  //   , profile, timezone, updated_at, website
  /*let dataPhoneNumber = {
    Name: "phone_number",
    Value: user_PhoneNumber,
  };

  // Attribute를 AWS Cognito가 알아들을 수 있는 객체로 만듭니다.
  let attributePhoneNumber = new AWSCognito.CognitoIdentityServiceProvider.CognitoUserAttribute(
    dataPhoneNumber
  );*/

  // 방금 위에서 만든 Attribute 객체를 Attribute List에 추가시킵니다.
  // 이렇게 배열에 다 추가시키고 한번에 Cognito에 넘길겁니다.
  //attributeList.push(attributePhoneNumber);

  // 전역변수로 만들어 놓은 User Pool 객체에서는 signup 함수를 제공합니다.
  // 인자는 User name(ID 인것 같네요.), Password, Attribute List, null(무슨 자리인지 모르겠어요..확인해야합니다.ㅎㅎ), 처리 결과가 오면 수행 될 callback 함수 입니다.
  userPool.signUp(email, user_Pw, attributeList, null, function (err, result) {
    if (err) {
      // error가 발생하면 여기로 빠집니다.
      if (err.code === "UsernameExistsException") {
        alert("이미 가입한 이메일 입니다.");
      }
      // alert(err);
      return;
    }

    // 가입이 성공하면 result에 가입된 User의 정보가 되돌아 옵니다.
    // 인증 함수에서 사용해야하기에 위에서 만든 전역변수인 cognitoUser에 넣어놓습니다.
    cognitoUser = result.user;
    console.log("user name is " + cognitoUser.getUsername());
  });
}
function submitResend() {
  // 인증 메일을 재발송
  const user_Name = document.getElementById("signup_username").value.trim();
  const userData = {
    Username: user_Name,
    Pool: userPool,
  };
  cognitoUser = new AWSCognito.CognitoIdentityServiceProvider.CognitoUser(
    userData
  );
  console.log(userData);
  cognitoUser.resendConfirmationCode(function (err, result) {
    if (err) {
      alert(err);
      return;
    }
    // 인증이 성공하면 SUCCESS 문자가 되돌아 옵니다.
    console.log("call result : " + result);
  });
}
function submitActivateCode() {
  // 회원가입을 하면 User Pool을 어떻게 만들었냐에 따라서 email 또는 phone으로 인증코드가 발송됩니다.
  // 사용자로부터 인증코드를 입력받아옵니다.
  let user_activatecode = document.getElementById("activate_code").value;

  // cognitoUser는 가입함수에서 가입 성공 후 되돌아온 사용자 정보가 담겨있습니다.
  // 이 변수에서 바로 confirmRegistration함수를 수행하면 AWS Cognito로 인증 요청을 합니다.
  // 인자는 인증코드, true(이것도 알아봐야합니다..ㅎㅎ), callback 함수 입니다.
  cognitoUser.confirmRegistration(user_activatecode, true, function (
    err,
    result
  ) {
    if (err) {
      alert(err);
      return;
    }
    // 인증이 성공하면 SUCCESS 문자가 되돌아 옵니다.
    console.log("call result : " + result);
  });
}
export function submitSignin(email, password) {
  // 입력 폼에서 ID와 비밀번호를 입력받습니다.
  // 저는 phone number를 alias로 설정해서 ID 처럼 사용할 수 있게 했습니다.
  //let user_PhoneNumber = document.getElementById("signin_phonenumber").value;
  //let user_Pw = document.getElementById("signin_pwd").value;

  // ID와 Password를 정해진 속성명인 Username과 Password에 담습니다.
  let authenticationData = {
    Username: email,
    Password: password,
  };

  // 여기에는 ID와 User Pool 정보를 담아 놓습니다.

  // 로그인을 위해 Cognito 객체 2개를 준비합니다.
  let authenticationDetails = new AWSCognito.CognitoIdentityServiceProvider.AuthenticationDetails(
    authenticationData
  );
  let cognitoSignedUser = new AWSCognito.CognitoIdentityServiceProvider.CognitoUser(
    userData
  );

  // authenticateUser 함수로 로그인을 시도합니다.
  cognitoSignedUser.authenticateUser(authenticationDetails, {
    onSuccess: function (result) {
      // 로그인에 성공하면 Token이 반환되어 옵니다.
      console.log("access token + " + result.getAccessToken().getJwtToken());
      // API Gateway로 만든 API에 Request를 보낼 때는 Authorization 헤더의 값으로 idToken을 넣어야합니다.
      console.log("idToken + " + result.idToken.jwtToken);
    },
    onFailure: function (err) {
      alert(err);
    },
  });
}

init();
