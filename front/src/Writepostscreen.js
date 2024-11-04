import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { SafeAreaView } from 'react-native-safe-area-context'; 
import { useNavigation } from '@react-navigation/native'; // 네비게이션 훅 임포트
import TopBar from './TopBar'; 
import Slider from '@react-native-community/slider';
import RNPickerSelect from 'react-native-picker-select'; // Wheel Picker
import axios from 'axios'; // Axios 임포트
import RowBar from './Rowbar';

export default function WritePostScreen() {
    const navigation = useNavigation(); // 네비게이션 훅 사용
    const [selectedGender, setSelectedGender] = useState(''); 
    const [startHour, setStartHour] = useState('00');
    const [startMinute, setStartMinute] = useState('00');
    const [endHour, setEndHour] = useState('00');
    const [endMinute, setEndMinute] = useState('00');
    const [selectedNumber, setSelectedNumber] = useState(1); 
    const [title, setTitle] = useState(''); 
    const [content, setContent] = useState('');

    const handlePostSubmit = () => {
        const postData = {
            title,
            content,
            gender: selectedGender,
            startTime: `${startHour}:${startMinute}`,
            endTime: `${endHour}:${endMinute}`,
            numberOfPeople: selectedNumber,
        };

        // Axios를 사용해 백엔드로 데이터 전송
        axios.post('http://192.168.0.53:5000/api/writepost', postData)
            .then(response => {
                console.log('게시글이 성공적으로 저장되었습니다:', response.data);
                navigation.navigate('VoteBoardScreen'); // 게시글 저장 후 VoteBoardScreen으로 이동
            })
            .catch(error => {
                console.error('게시글 저장 중 오류 발생:', error);
            });
    };

    // 시간 선택 항목 (0 ~ 23 시간)
    const hourOptions = Array.from({ length: 24 }, (_, hour) => {
        const formattedHour = String(hour).padStart(2, '0');
        return { label: `${formattedHour}`, value: `${formattedHour}` };
    });

    // 분 선택 항목 (0 ~ 59 분)
    const minuteOptions = Array.from({ length: 60 }, (_, minute) => {
        const formattedMinute = String(minute).padStart(2, '0');
        return { label: `${formattedMinute}`, value: `${formattedMinute}` };
    });

    return (
        <SafeAreaView style={styles.safeArea}>
            <TopBar />
            <ScrollView style={styles.container}>
                <KeyboardAwareScrollView
                    style={styles.container}
                    resetScrollToCoords={{ x: 0, y: 0 }}
                    contentContainerStyle={styles.scrollContainer}
                    enableOnAndroid={true} 
                    extraScrollHeight={80} 
                >
                    <View style={styles.header}>
                        <Text style={styles.headerTitle}>게시글 작성</Text>
    
                        <TouchableOpacity onPress={handlePostSubmit} style={styles.submitButton}>
                            <Ionicons name="save-outline" size={15} color="black" />
                            <Text style={styles.submitText}>저장</Text>
                        </TouchableOpacity>
                    </View>
    
                    {/* 성별 선택, 시간 선택, 모집 인원 등 기존 코드 유지 */}
                    <View style={styles.optionsContainer}>
                        {/* 성별 선택 */}
                        <View style={styles.row}>
                            <Text style={styles.label}>성별</Text>
                            <View style={styles.genderOptions}>
                                {['남', '여', '무관'].map((gender, index) => (
                                    <TouchableOpacity
                                        key={index}
                                        style={[styles.genderBlock, selectedGender === gender && styles.selectedGenderBlock]}
                                        onPress={() => setSelectedGender(gender)} 
                                    >
                                        <Text style={styles.genderText}>{gender}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>
    
                        {/* 시간 선택 */}
                        <View style={styles.row}>
                            <Text style={styles.label}>시간</Text>
                            <View style={styles.pickerContainer}>
                                <View style={styles.wheelPicker}>
                                    <RNPickerSelect
                                        onValueChange={(value) => setStartHour(value)}
                                        items={hourOptions}
                                        value={startHour}
                                        style={pickerSelectStyles}
                                        placeholder={{ label: '시', value: null }}
                                    />
                                </View>
                                <Text style={styles.colon}>:</Text>
                                <View style={styles.wheelPicker}>
                                    <RNPickerSelect
                                        onValueChange={(value) => setStartMinute(value)}
                                        items={minuteOptions}
                                        value={startMinute}
                                        style={pickerSelectStyles}
                                        placeholder={{ label: '분', value: null }}
                                    />
                                </View>
                                <Text style={styles.separator}> ~ </Text>
                                <View style={styles.wheelPicker}>
                                    <RNPickerSelect
                                        onValueChange={(value) => setEndHour(value)}
                                        items={hourOptions}
                                        value={endHour}
                                        style={pickerSelectStyles}
                                        placeholder={{ label: '시', value: null }}
                                    />
                                </View>
                                <Text style={styles.colon}>:</Text>
                                <View style={styles.wheelPicker}>
                                    <RNPickerSelect
                                        onValueChange={(value) => setEndMinute(value)}
                                        items={minuteOptions}
                                        value={endMinute}
                                        style={pickerSelectStyles}
                                        placeholder={{ label: '분', value: null }}
                                    />
                                </View>
                            </View>
                        </View>
    
                        {/* 모집 인원 */}
                        <View style={styles.row}>
                            <Text style={styles.label}>모집 인원</Text>
                            <Slider
                                style={styles.slider}
                                minimumValue={1}
                                maximumValue={50}
                                step={1}
                                value={selectedNumber}
                                onValueChange={(value) => setSelectedNumber(value)}
                            />
                            <Text style={styles.sliderValue}>{selectedNumber}명</Text>
                        </View>
                    </View>
    
                    {/* 제목 및 내용 입력 */}
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>제목</Text>
                        <TextInput
                            style={styles.textInput}
                            placeholder="제목을 입력하세요"
                            value={title}
                            onChangeText={setTitle}
                        />
                    </View>
    
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>내용</Text>
                        <TextInput
                            style={[styles.textInput, styles.textArea]}
                            placeholder="내용을 입력하세요"
                            value={content}
                            onChangeText={setContent}
                            multiline
                        />
                    </View>
                </KeyboardAwareScrollView>
            </ScrollView>
            <RowBar/>
        </SafeAreaView>
    );
}    

// 기존의 styles 및 pickerSelectStyles 유지


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingVertical: 20, // 상하 여백 추가
      },
      safeArea: {
        flex: 1,
        backgroundColor: '#fff',
      },
    scrollContainer: {
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 10,
        position: 'relative',
    },
    headerTitle: {
        fontSize: 16, 
        fontWeight: 'bold',
        textAlign: 'center',
        flex: 1,
    },
    submitButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#e0e0e0',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 25,
        position: 'absolute',
        right: 5,
        height: 40,
    },
    submitText: {
        marginLeft: 5,
        fontSize: 16,
    },
    optionsContainer: {
        marginBottom: 20,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 10,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginRight: 10,
        marginBottom: 10,
    },
    genderOptions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '60%',
    },
    genderBlock: {
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        marginHorizontal: 5,
        backgroundColor: '#f0f0f0',
    },
    selectedGenderBlock: {
        backgroundColor: '#cce7ff',
    },
    genderText: {
        fontSize: 16,
        color: '#333',
    },
    pickerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        paddingHorizontal: 10,
    },
    wheelPicker: {
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        backgroundColor: '#f0f0f0',
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 5,
    }, 
    colon: {
        fontSize: 20,
        marginHorizontal: 5,
    },
    separator: {
        fontSize: 20,
        marginHorizontal: 10,
    },
    slider: {
        flex: 1,
        height: 40,
    },
    sliderValue: {
        fontSize: 16,
        marginLeft: 10,
    },
    inputContainer: {
        marginVertical: 10,
    },
    textInput: {
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
        fontSize: 16,
    },
    textArea: {
        height: 200,
        textAlignVertical: 'top',
    },
});

const pickerSelectStyles = {
    inputIOS: {
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 4,
        color: 'black',
        paddingRight: 30,
        backgroundColor: '#f0f0f0',
    },
    inputAndroid: {
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 4,
        color: 'black',
        paddingRight: 30,
        backgroundColor: '#f0f0f0',
    },
};