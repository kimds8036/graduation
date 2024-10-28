import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, SafeAreaView, StyleSheet, TouchableOpacity, Alert, Switch } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const LoginScreen = ({ navigation }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isAutoLoginEnabled, setIsAutoLoginEnabled] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const checkAutoLogin = async () => {
            const token = await AsyncStorage.getItem('jwt_token');
            const userId = await AsyncStorage.getItem('_id');
            const isAutoLogin = JSON.parse(await AsyncStorage.getItem('isAutoLoginEnabled'));

            if (isAutoLogin && token && userId) {
                // 자동 로그인이 활성화되어 있고, 토큰과 사용자 ID가 존재하는 경우
                navigation.navigate('HomeStack');
            }
        };

        checkAutoLogin();
    }, []);

    const handleLogin = async () => {
        setLoading(true);
        try {
            const response = await axios.post('http://192.168.0.53:5000/api/auth/login', { username, password });
            if (response.status === 200 && response.data.token) {
                await AsyncStorage.setItem('jwt_token', response.data.token);
                if (isAutoLoginEnabled) {
                    await AsyncStorage.setItem('isAutoLoginEnabled', 'true');
                }

                if (response.data._id) {
                    await AsyncStorage.setItem('_id', response.data._id);
                }

                Alert.alert('로그인 성공');
                navigation.reset({
                    index: 0,
                    routes: [{ name: 'HomeStack' }],
                });
            } else {
                Alert.alert('로그인 실패', '아이디 또는 비밀번호가 일치하지 않습니다.');
            }
        } catch (error) {
            console.log("Error:", error);
            if (error.response && error.response.data) {
                Alert.alert('로그인 실패', error.response.data.message || '아이디 또는 비밀번호가 일치하지 않습니다.');
            } else {
                Alert.alert('로그인 실패', '네트워크 오류가 발생했습니다. 다시 시도해 주세요.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleAutoLoginToggle = async () => {
        setIsAutoLoginEnabled((prev) => {
            const newValue = !prev;
            AsyncStorage.setItem('isAutoLoginEnabled', JSON.stringify(newValue));
            return newValue;
        });
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.innerContainer}>
                <Text style={styles.title}>Login</Text>
                <TextInput
                    placeholder="Username"
                    value={username}
                    onChangeText={setUsername}
                    style={styles.input}
                />
                <TextInput
                    placeholder="Password"
                    value={password}
                    onChangeText={setPassword}
                    style={styles.input}
                    secureTextEntry
                />
                <Button title="Login" onPress={handleLogin} disabled={loading} />

                <View style={styles.autoLoginContainer}>
                    <Text>자동 로그인</Text>
                    <Switch
                        value={isAutoLoginEnabled}
                        onValueChange={handleAutoLoginToggle}
                    />
                </View>

                <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
                    <Text style={styles.signupText}>회원가입 하러가기</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 16,
        backgroundColor: '#fff',
    },
    innerContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        marginBottom: 24,
    },
    input: {
        width: '100%',
        padding: 8,
        borderWidth: 1,
        borderColor: '#ccc',
        marginBottom: 16,
    },
    signupText: {
        marginTop: 20,
        color: 'blue',
        fontSize: 16,
    },
    autoLoginContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 10,
    },
});

export default LoginScreen;
