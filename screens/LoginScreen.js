import React, { useCallback, useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { View } from "react-native-animatable";
import CromaButton from "../components/CromaButton";
import { material } from "react-native-typography";
import { useTranslation } from "react-i18next";
import { Dimensions } from "react-native";
import Config from "react-native-config";
import { login, signUp } from "../network/login-and-signup";
import { notifyMessage } from "../libs/Helpers";
import PropTypes from "prop-types";

import {
  GoogleSignin,
  statusCodes,
  GoogleSigninButton,
} from "@react-native-google-signin/google-signin";
// import googleLogo from '/assets/images/g-logo.png'

const LOGIN = "LOGIN";
const SIGN_UP = "SIGN_UP";

const LOGIN_AND_SIGNUP_TEXT = {
  LOGIN: {
    title: "Login",
    orText: "Or Login with",
    linkTitle: "Don't have an account?",
    linkText: " Sign Up Now",
    buttonText: "Login",
  },
  SIGN_UP: {
    title: "Signup",
    orText: "Or Sign Up with",
    linkTitle: "Already have and account?",
    linkText: " Login Now",
    buttonText: " Sign up",
  },
};

function LoginScreen(props) {
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [screenType, setScreenType] = useState(SIGN_UP);
  const { t } = useTranslation();

  useEffect(() => {
    props.navigation.setOptions({
      title: t(LOGIN_AND_SIGNUP_TEXT[screenType].title),
    });
  }, [screenType]);

  const onSubmit = useCallback(async () => {
    if (screenType === LOGIN) {
      // to handle login
      try {
        const res = await login(email, password);
        console.log({ res });
      } catch (error) {
        console.log({ error });
        notifyMessage(error.message);
      }
    } else {
      // to handle sign up
      if (password !== confirmPassword) {
        notifyMessage(t("Confirm password did not match."));
        return;
      }
      try {
        const res = await signUp(fullName, email, password);
        console.log({ res });
      } catch (error) {
        console.log({ error });
        notifyMessage(error.message);
      }
    }
  }, [confirmPassword, email, fullName, password, screenType, t]);

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: Config.GOOGLE_AUTHOTICATION_WEB_CLIENT_ID,
      // offlineAccess: false
    });
  }, [GoogleSignin]);
  // const login = () => {};
  // Somewhere in your code
  const signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      // this.setState({ userInfo });
      console.log({ userInfo });
    } catch (error) {
      console.log({ error });
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (e.g. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
      } else {
        // some other error happened
      }
    }
  };

  const onChangeText = useCallback((text) => {
    setEmail(text);
  }, []);
  console.log({ password, confirmPassword, b: password !== confirmPassword });
  return (
    <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
      <View
        style={[
          styles.container,
          { minHeight: screenType === LOGIN ? 460 : 600 },
        ]}
      >
        <Text style={styles.title}>{t("Welcome,")}</Text>
        <Text style={styles.intro}>{t("Glad to see you!,")}</Text>
        {screenType === SIGN_UP && (
          <TextInput
            style={styles.input}
            onChangeText={setFullName}
            placeholder={"Full name"}
            value={fullName}
          />
        )}
        <TextInput
          style={styles.input}
          onChangeText={onChangeText}
          placeholder={"Email address"}
          value={email}
        />
        <TextInput
          placeholder="Password"
          style={styles.input}
          onChangeText={setPassword}
          value={password}
          secureTextEntry={true}
          password={true}
        />
        {screenType === SIGN_UP && (
          <TextInput
            placeholder="Confirm Password"
            style={[
              styles.input,
              password !== confirmPassword
                ? { color: "red" }
                : { color: "black" },
            ]}
            onChangeText={setConfirmPassword}
            value={confirmPassword}
            secureTextEntry={true}
            password={true}
          />
        )}
        {screenType === LOGIN && (
          <Text style={styles.forgotPassword}>{t("Forgot password ?")}</Text>
        )}
        <CromaButton
          style={{ backgroundColor: "#ff5c59" }}
          textStyle={{ color: "#fff" }}
          onPress={onSubmit}
        >
          {t(LOGIN_AND_SIGNUP_TEXT[screenType].buttonText)}
        </CromaButton>
        <View style={styles.orSignUpContainer}>
          <Text style={styles.leftLine}> </Text>
          <Text style={styles.orSignUp}>
            {t(LOGIN_AND_SIGNUP_TEXT[screenType].orText)}
          </Text>
          <Text style={styles.rightLine}> </Text>
        </View>
        <GoogleSigninButton
          style={{
            width: Dimensions.get("window").width * (95 / 100),
            height: 60,
          }}
          size={GoogleSigninButton.Size.Wide}
          color={GoogleSigninButton.Color.Dark}
          onPress={signIn}
          // disabled={this.state.isSigninInProgress}
        />
      </View>
      <TouchableOpacity
        onPress={() => setScreenType(screenType === LOGIN ? SIGN_UP : LOGIN)}
      >
        <View style={styles.changePage}>
          <Text>{t(LOGIN_AND_SIGNUP_TEXT[screenType].linkTitle)}</Text>
          <Text style={styles.bold}>
            {t(LOGIN_AND_SIGNUP_TEXT[screenType].linkText)}
          </Text>
        </View>
      </TouchableOpacity>
    </ScrollView>
  );
}

LoginScreen.propTypes = {
  navigation: PropTypes.any,
};

const styles = StyleSheet.create({
  scrollView: {
    paddingLeft: 12,
    paddingRight: 12,
  },
  container: {
    display: "flex",
    justifyContent: "space-between",
    flexDirection: "column",
  },
  title: {
    paddingTop: 12,
    paddingBottom: 12,
    fontSize: 20,
    fontWeight: "bold",
  },
  intro: {
    paddingTop: 12,
    paddingBottom: 12,
    fontSize: 16,
  },
  line: {
    ...material.body1,
    paddingBottom: 4,
    fontSize: 15,
  },
  forgotPassword: {
    marginLeft: "auto",
    fontSize: 13,
  },
  orSignUp: {
    padding: 10,
    fontSize: 13,
  },
  logo: {
    width: 30,
    height: 30,
    margin: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 5,
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 10,
  },
  orSignUpContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  changePage: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 200,
  },
  leftLine: {
    height: 1,
    width: "25%",
    backgroundColor: "#000",
  },
  rightLine: {
    height: 1,
    width: "25%",
    backgroundColor: "#000",
  },
  bold: {
    fontWeight: "bold",
  },
});

export default LoginScreen;
