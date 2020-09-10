import React from "react";
import { useHistory } from "react-router-dom";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import InputAdornment from "@material-ui/core/InputAdornment";
import Icon from "@material-ui/core/Icon";
// @material-ui/icons
import Email from "@material-ui/icons/Email";
import People from "@material-ui/icons/People";
// core components
import Header from "components/Header/Header.js";
import HeaderLinks from "components/Header/HeaderLinks.js";
import Footer from "components/Footer/Footer.js";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardHeader from "components/Card/CardHeader.js";
import CardFooter from "components/Card/CardFooter.js";
import CustomInput from "components/CustomInput/CustomInput.js";

import styles from "assets/jss/material-kit-react/views/loginPage.js";

import image from "assets/img/bg7.jpg";
import CognitoConfig from "../../config/config";

import { gql, useApolloClient } from "@apollo/client";

import {
  CognitoUserPool,
  CognitoUserAttribute,
  AuthenticationDetails,
  CognitoUser,
} from "amazon-cognito-identity-js";

const IS_LOGGED_IN = gql`
  query IsUserLoggedIn {
    isLoggedIn @client
  }
`;
// AWSCognito 객체를 계속해서 사용하는데 여기에 리전 정보를 저장합니다.
// CognitoConfig.region이 위에서 별도의 js 파일에 넣어둔 설정값입니다.

// 입력한 User Pool 정보를 가지고 실제 User Pool에 접근할 수 있는 객체를 만듭니다.
const userPool = new CognitoUserPool({
  UserPoolId: CognitoConfig.UserPoolId,
  ClientId: CognitoConfig.ClientId,
});

// 아래 변수는 회원가입을 하고 가입이 성공했을 때 사용자 정보를 반환받는 변수인데,
// 회원가입 함수와 인증 함수에서 같은 객체를 사용해야하기 때문에 전역변수로 뺐습니다.
let cognitoUser;

function submitSignUp(email, user_Pw, user_pw_confirm, setType) {
  console.log("submitSignUp");
  if (user_Pw !== user_pw_confirm) {
    alert("패스워드를 확인해주세요");
    return;
  }
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
      setType("login");
      // alert(err);
      return;
    }

    // 가입이 성공하면 result에 가입된 User의 정보가 되돌아 옵니다.
    // 인증 함수에서 사용해야하기에 위에서 만든 전역변수인 cognitoUser에 넣어놓습니다.
    cognitoUser = result.user;
    console.log("user name is " + cognitoUser.getUsername());
    setType("login");
  });
}

function submitSignin(email, password, history, apolloClient) {
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
  const userData = {
    Username: email,
    Pool: userPool,
  };
  // 로그인을 위해 Cognito 객체 2개를 준비합니다.
  let authenticationDetails = new AuthenticationDetails(authenticationData);
  let cognitoSignedUser = new CognitoUser(userData);

  // authenticateUser 함수로 로그인을 시도합니다.
  cognitoSignedUser.authenticateUser(authenticationDetails, {
    onSuccess: function (result) {
      // 로그인에 성공하면 Token이 반환되어 옵니다.
      console.log("access token + " + result.getAccessToken().getJwtToken());
      localStorage.setItem(
        "accesstoken",
        result.getAccessToken().getJwtToken()
      );
      // API Gateway로 만든 API에 Request를 보낼 때는 Authorization 헤더의 값으로 idToken을 넣어야합니다.
      console.log("idToken + " + result.idToken.jwtToken);
      localStorage.setItem("idToken", result.idToken.jwtToken);
      apolloClient.writeQuery({
        query: IS_LOGGED_IN,
        data: {
          isLoggedIn: !!localStorage.getItem("idToken"),
        },
      });

      history.push("/");
    },
    onFailure: function (err) {
      alert(err.code);
    },
  });
}

const onLogIn = (user_email, user_pw) => {
  console.log("onLogIn");
  console.log(user_email);
  console.log(user_pw);
};

const submitForgotPW = (user_email, setType) => {
  cognitoUser = new CognitoUser({
    Username: user_email,
    Pool: userPool,
  });
  cognitoUser.forgotPassword({
    onSuccess: function (result) {
      alert("이메일로 코드가 발송되었습니다.");
      setType("changepw");
    },
    onFailure: function (err) {
      alert(err);
    },
  });
};

const submitChangePW = (
  user_email,
  user_pw,
  user_pw_confirm,
  user_code,
  setType
) => {
  if (user_pw !== user_pw_confirm) {
    alert("패스워드를 확인해주세요");
    return;
  }
  cognitoUser = new CognitoUser({
    Username: user_email,
    Pool: userPool,
  });

  return new Promise((resolve, reject) => {
    cognitoUser.confirmPassword(user_code, user_pw, {
      onFailure(err) {
        reject(err);
      },
      onSuccess() {
        setType("login");
        resolve();
      },
    });
  });
};

const useStyles = makeStyles(styles);

export default function LoginPage(props) {
  const [cardAnimaton, setCardAnimation] = React.useState("cardHidden");
  setTimeout(function () {
    setCardAnimation("");
  }, 700);
  const classes = useStyles();
  const [user_email, setEmail] = React.useState("");
  const [user_pw, setPw] = React.useState("");
  const [user_pw_confirm, setConfirmPw] = React.useState("");
  const [user_code, setCode] = React.useState("");
  const [page_type, setType] = React.useState("login");
  const { ...rest } = props;
  const history = useHistory();
  const apolloClient = useApolloClient();
  return (
    <div>
      <Header
        absolute
        color="transparent"
        brand="Material Kit React"
        rightLinks={<HeaderLinks />}
        {...rest}
      />
      <div
        className={classes.pageHeader}
        style={{
          backgroundImage: "url(" + image + ")",
          backgroundSize: "cover",
          backgroundPosition: "top center",
        }}
      >
        <div className={classes.container}>
          <GridContainer justify="center">
            <GridItem xs={12} sm={12} md={4}>
              <Card className={classes[cardAnimaton]}>
                <form className={classes.form}>
                  <CardHeader color="primary" className={classes.cardHeader}>
                    {page_type === "login" && <h4>로그인</h4>}
                    {page_type === "forgotpw" && <h4>비밀번호 찾기</h4>}
                    {page_type === "changepw" && <h4>비밀번호 재설정</h4>}
                    {page_type === "signup" && <h4>회원 가입</h4>}
                  </CardHeader>
                  <p className={classes.divider}>Or Be Classical</p>
                  <CardBody>
                    <CustomInput
                      labelText="Email"
                      id="email"
                      formControlProps={{
                        fullWidth: true,
                      }}
                      inputProps={{
                        onChange: (e) => setEmail(e.target.value),
                        type: "email",
                        endAdornment: (
                          <InputAdornment position="end">
                            <Email className={classes.inputIconsColor} />
                          </InputAdornment>
                        ),
                      }}
                    />
                    {(page_type === "login" ||
                      page_type === "changepw" ||
                      page_type === "signup") && (
                      <CustomInput
                        labelText="Password"
                        id="password"
                        formControlProps={{
                          onChange: (e) => setPw(e.target.value),
                          fullWidth: true,
                        }}
                        inputProps={{
                          type: "password",
                          endAdornment: (
                            <InputAdornment position="end">
                              <Icon className={classes.inputIconsColor}>
                                lock_outline
                              </Icon>
                            </InputAdornment>
                          ),
                          autoComplete: "off",
                        }}
                      />
                    )}
                    {(page_type === "signup" || page_type === "changepw") && (
                      <CustomInput
                        labelText="Password 확인"
                        id="password_confirm"
                        formControlProps={{
                          onChange: (e) => setConfirmPw(e.target.value),
                          fullWidth: true,
                        }}
                        inputProps={{
                          type: "password_confirm",
                          endAdornment: (
                            <InputAdornment position="end">
                              <Icon className={classes.inputIconsColor}>
                                lock_outline
                              </Icon>
                            </InputAdornment>
                          ),
                          autoComplete: "off",
                        }}
                      />
                    )}
                    {page_type === "changepw" && (
                      <CustomInput
                        labelText="인증 코드"
                        id="pass"
                        formControlProps={{
                          onChange: (e) => setCode(e.target.value),
                          fullWidth: true,
                        }}
                        inputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <Icon className={classes.inputIconsColor}>
                                lock_outline
                              </Icon>
                            </InputAdornment>
                          ),
                          autoComplete: "off",
                        }}
                      />
                    )}
                  </CardBody>
                  {page_type === "login" && (
                    <CardFooter className={classes.cardFooter}>
                      <Button
                        simple
                        color="primary"
                        size="lg"
                        onClick={(e) =>
                          submitSignin(
                            user_email,
                            user_pw,
                            history,
                            apolloClient
                          )
                        }
                      >
                        로그인
                      </Button>
                    </CardFooter>
                  )}
                  {page_type === "forgotpw" && (
                    <CardFooter className={classes.cardFooter}>
                      <Button
                        simple
                        color="primary"
                        size="lg"
                        onClick={(e) => submitForgotPW(user_email, setType)}
                      >
                        비밀번호 찾기
                      </Button>
                    </CardFooter>
                  )}
                  {page_type === "changepw" && (
                    <CardFooter className={classes.cardFooter}>
                      <Button
                        simple
                        color="primary"
                        size="lg"
                        onClick={(e) =>
                          submitChangePW(
                            user_email,
                            user_pw,
                            user_pw_confirm,
                            user_code,
                            setType
                          )
                        }
                      >
                        비밀번호 찾기
                      </Button>
                    </CardFooter>
                  )}
                  {page_type === "signup" && (
                    <CardFooter className={classes.cardFooter}>
                      <Button
                        simple
                        color="primary"
                        size="lg"
                        onClick={(e) =>
                          submitSignUp(
                            user_email,
                            user_pw,
                            user_pw_confirm,
                            setType
                          )
                        }
                      >
                        회원가입
                      </Button>
                    </CardFooter>
                  )}

                  <CardFooter className={classes.cardFooter}>
                    <Button
                      simple
                      color="primary"
                      size="sm"
                      onClick={(e) => setType("forgotpw")}
                    >
                      비밀번호 찾기
                    </Button>
                    <Button
                      simple
                      color="primary"
                      size="sm"
                      onClick={(e) => setType("signup")}
                    >
                      가입
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </GridItem>
          </GridContainer>
        </div>
        <Footer whiteFont />
      </div>
    </div>
  );
}
