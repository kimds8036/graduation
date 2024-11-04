import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, SafeAreaView, StyleSheet, TouchableOpacity, Alert, Switch } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { LinearGradient } from 'expo-linear-gradient';

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
<LinearGradient colors={['#f0f0f0', '#ffffff', '#f7f7f7']} style={styles.container}>
<SafeAreaView style={styles.innerContainer}>
                <Text style={styles.title}>Login</Text>
                <TextInput
                    placeholder="Username"
                    value={username}
                    onChangeText={setUsername}
                    style={styles.input}
                    placeholderTextColor="#aaa"
                />
                <TextInput
                    placeholder="Password"
                    value={password}
                    onChangeText={setPassword}
                    style={styles.input}
                    secureTextEntry
                    placeholderTextColor="#aaa"
                />
                
                <TouchableOpacity style={styles.loginButton} onPress={handleLogin} disabled={loading}>
                    <Text style={styles.loginButtonText}>{loading ? '로그인 중...' : '로그인'}</Text>
                </TouchableOpacity>

                <View style={styles.autoLoginContainer}>
                    <Text style={styles.autoLoginText}>자동 로그인</Text>
                    <Switch
                        value={isAutoLoginEnabled}
                        onValueChange={handleAutoLoginToggle}
                        thumbColor={isAutoLoginEnabled ? '#3b5998' : '#ccc'}
                        trackColor={{ false: '#767577', true: '#81b0ff' }}
                    />
                </View>

                <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
                    <Text style={styles.signupText}>회원가입 하러가기</Text>
                </TouchableOpacity>
            </SafeAreaView>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#f9f9f9', // 흰색 계열 배경 고정
    },
    innerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 16,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#2d6a4f', // 은은한 초록색으로 제목 색상 변경
        marginBottom: 30,
    },
    input: {
        width: '90%',
        padding: 15,
        borderRadius: 25,
        backgroundColor: '#ffffff',
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 2,
    },
    loginButton: {
        width: '90%',
        padding: 15,
        backgroundColor: '#95d5b2', // 은은한 초록색 버튼 배경
        borderRadius: 25,
        alignItems: 'center',
        marginVertical: 10,
    },
    loginButtonText: {
        color: '#ffffff', // 버튼 텍스트를 흰색으로 유지
        fontSize: 16,
        fontWeight: '600',
    },
    autoLoginContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 10,
    },
    autoLoginText: {
        color: '#2d6a4f', // 은은한 초록색으로 텍스트 변경
        fontSize: 16,
        marginRight: 10,
    },
    signupText: {
        marginTop: 20,
        color: '#52b788', // 은은한 초록색 계열로 회원가입 텍스트 색상 변경
        fontSize: 16,
        textDecorationLine: 'underline',
    },
});

export default LoginScreen;
