import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { SafeAreaView } from 'react-native-safe-area-context'; 
import TopBar from './TopBar'; 
import Slider from '@react-native-community/slider';
import RNPickerSelect from 'react-native-picker-select'; // Wheel Picker

export default function PostCreationScreen() {
    const [selectedGender, setSelectedGender] = useState(''); 
    const [startHour, setStartHour] = useState('00');
    const [startMinute, setStartMinute] = useState('00');
    const [endHour, setEndHour] = useState('00');
    const [endMinute, setEndMinute] = useState('00');
    const [selectedNumber, setSelectedNumber] = useState(1); 
    const [title, setTitle] = useState(''); 
    const [content, setContent] = useState('');

    const handlePostSubmit = () => {
        // 글 작성 완료 처리
        console.log('제목:', title);
        console.log('내용:', content);
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

                <View style={styles.optionsContainer}>
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

                    <View style={styles.row}>
    <Text style={styles.label}>시간</Text>
    <View style={styles.pickerContainer}>
        {/* 시작 시간 선택 */}
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

        {/* 간격을 조정한 ~ 표시 */}
        <Text style={styles.separator}> ~ </Text>

        {/* 종료 시간 선택 */}
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
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    container: {
        flex: 1,
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
        justifyContent: 'space-between', // 간격을 자동으로 맞춰줌
        width: '100%',
        paddingHorizontal: 10, // 좌우 패딩 추가
    },
    
    wheelPicker: {
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        backgroundColor: '#f0f0f0',
        width: 50, // 정사각형을 위한 고정 너비
        height: 50, // 정사각형을 위한 고정 높이
        justifyContent: 'center', // 내부 콘텐츠를 세로 중앙 정렬
        alignItems: 'center', // 내부 콘텐츠를 가로 중앙 정렬
        marginHorizontal: 5, // 각 상자 사이의 간격 조정
    }, 
colon: {
    fontSize: 20,
    marginHorizontal: 5, // ":" 양쪽의 간격을 조정
},

separator: {
    fontSize: 20,
    marginHorizontal: 10, // "~" 양쪽의 간격을 조정
}
,
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
