import React, { useEffect, useRef, useState } from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  Animated,
  TextInput,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity 
} from 'react-native';
import branch from '../../../assets/branch.png';
import logo from '../../../assets/logo.png';

const Login = () => {
  const [showText, setShowText] = useState(false);
  const topRightAnim = useRef(new Animated.Value(-500)).current;
  const bottomLeftAnim = useRef(new Animated.Value(-300)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current; 
  

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    // Initial animations for branch images
    Animated.timing(topRightAnim, {
      toValue: 30,
      duration: 2000,
      useNativeDriver: false,
    }).start();

    Animated.timing(bottomLeftAnim, {
      toValue: 20,
      duration: 2000,
      useNativeDriver: false,
    }).start();

    
    setTimeout(() => {
      setShowText(true);

      
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 1, 
          duration: 500,
          useNativeDriver: true,
        }),
        
      ]).start();
    }, 2000); 
  }, []);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <Animated.Image
          source={branch}
          style={[styles.image, styles.topRight, { top: topRightAnim }]}
        />
        <Animated.Image
          source={branch}
          style={[styles.image, styles.bottomLeft, { bottom: bottomLeftAnim }]}
        />
        {showText && (
          <>
          <Animated.View style={[styles.animatedContainer, { opacity: fadeAnim }]}>
            <Text style={styles.text}>Welcome Back!</Text>
            <Text style={styles.text2}>Sign in to Continue</Text>
            <Image source={logo} style={styles.logo} />
            <KeyboardAvoidingView
              style={styles.keyboardContainer}
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
              <ScrollView
                contentContainerStyle={styles.contentContainer}
                keyboardShouldPersistTaps="handled"
              ><View style={styles.EmailPasscontainer}>
                <Text style={styles.text3}>Email</Text>
                <TextInput
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="someone@medtech.tn"
                  placeholderTextColor="#888"
                  keyboardType="email-address"
                />
                <Text style={styles.text3}>Password</Text>
                <TextInput
                    style={styles.input}
                    value={password}
                    onChangeText={setPassword}
                    placeholder="Password"
                    placeholderTextColor="#888"
                    secureTextEntry={true}
                    />
                    <TouchableOpacity
                style={styles.button}
                onPress={() => {
                    // Handle button press
                    console.log("Button pressed!");
                }}
                >
                <Text style={styles.buttonText}>Log in</Text>
                </TouchableOpacity>

                </View>
                <Text style={styles.text4}>Forget password?</Text>
                <Text style={styles.text5}>
                 Don't have an account? 
            <TouchableOpacity onPress={() => console.log('Sign up clicked')}>
                <Text style={styles.signupText}>Sign up</Text>
            </TouchableOpacity>
            </Text>
              </ScrollView>
            </KeyboardAvoidingView>
            </Animated.View>
          </>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
    animatedContainer: {
        alignItems: 'center',
        justifyContent: 'center',
      },
    signupText: {
        color: '#007DA5', 
        fontWeight: 'bold',
        marginLeft:5,
        marginTop:10
      },
    button: {
        backgroundColor: '#007DA5',
        paddingVertical: 12,
        paddingHorizontal: 25,
        borderRadius: 8,
      },
      buttonText: {
        color: '#fff',
        fontSize: 16,
        textAlign: 'center',
      },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  EmailPasscontainer: {
    flex: 1,
    backgroundColor: '#fff',
    gap:10
  },
  keyboardContainer: {
    width: '100%',
  },
  contentContainer: {
    padding: 16,
    width: '100%',
  },
  text: {
    color: '#007DA5',
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: 150,
  },
  text2: {
    color: '#007DA5',
    fontSize: 32,
    fontWeight: 'bold',
  },
  text4: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft:100,
    marginTop:20
  },
  text5: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft:90,
    
  },
  text3: {
    color: '#007DA5',
    fontSize: 18,
    fontWeight: 'bold',
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  input: {
    borderBottomWidth: 1,
    borderColor: '#ccc',
    paddingVertical: 8,
    fontSize: 16,
    backgroundColor: 'transparent',
  },
  logo: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
  },
  image: {
    width: 130,
    height: 130,
    position: 'absolute',
  },
  topRight: {
    top: 40,
    right: -50,
    transform: [{ rotate: '130deg' }],
  },
  bottomLeft: {
    bottom: 10,
    left: -50,
    transform: [{ rotate: '-45deg' }],
  },
});

export default Login;
