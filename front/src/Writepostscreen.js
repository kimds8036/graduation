import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { SafeAreaView } from 'react-native-safe-area-context'; // SafeAreaView import
import TopBar from './TopBar'; // TopBar 컴포넌트 import
import { Picker } from '@react-native-picker/picker';

export default function PostCreationScreen() {
    const [selectedGender, setSelectedGender] = useState(''); // 성별 상태 추가
    const [startTime, setStartTime] = useState('00:00'); // 시작 시간 상태
    const [endTime, setEndTime] = useState('00:00'); // 종료 시간 상태
    const [selectedNumber, setSelectedNumber] = useState('1'); // 인원 상태
    const [title, setTitle] = useState(''); // 제목 상태 추가
    const [content, setContent] = useState(''); // 내용 상태 추가

    const handlePostSubmit = () => {
        // 글 작성 완료 처리
        console.log('제목:', title);
        console.log('내용:', content);
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <TopBar />
            <KeyboardAwareScrollView
                style={styles.container}
                resetScrollToCoords={{ x: 0, y: 0 }}
                contentContainerStyle={styles.scrollContainer}
                enableOnAndroid={true} // Android에서도 활성화
                extraScrollHeight={80} // 키보드가 올라올 때 추가로 스크롤할 높이
            >
                <View style={styles.header}>
                    {/* 게시글 작성 제목을 중앙에 배치 */}
                    <Text style={styles.headerTitle}>게시글 작성</Text>

                    {/* 저장 버튼을 오른쪽 끝에 배치 */}
                    <TouchableOpacity onPress={handlePostSubmit} style={styles.submitButton}>
                        <Ionicons name="save-outline" size={15} color="black" />
                        <Text style={styles.submitText}>저장</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.optionsContainer}>
                    {/* 성별 선택을 블록 형식으로 변경 */}
                    <View style={styles.row}>
                        <Text style={styles.label}>성별</Text>
                        <View style={styles.genderOptions}>
                            {['남', '여', '무관'].map((gender, index) => (
                                <TouchableOpacity
                                    key={index}
                                    style={[styles.genderBlock, selectedGender === gender && styles.selectedGenderBlock]}
                                    onPress={() => setSelectedGender(gender)} // 성별 선택
                                >
                                    <Text style={styles.genderText}>{gender}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    {/* 시간 선택을 Picker 형식으로 변경 */}
                    <View style={styles.row}>
                        <Text style={styles.label}>시간</Text>
                        <View style={styles.pickerContainer}>
                            <Picker
                                selectedValue={startTime}
                                onValueChange={(value) => setStartTime(value)}
                                style={styles.picker}>
                                {Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, '0')}:00`).map((time) => (
                                    <Picker.Item key={time} label={time} value={time} />
                                ))}
                            </Picker>
                            <Text style={styles.colon}>~</Text>
                            <Picker
                                selectedValue={endTime}
                                onValueChange={(value) => setEndTime(value)}
                                style={styles.picker}>
                                {Array.from({ length: 24 }, (_, i) => `${String(i).padStart(2, '0')}:00`).map((time) => (
                                    <Picker.Item key={time} label={time} value={time} />
                                ))}
                            </Picker>
                        </View>
                    </View>

                    {/* 인원 선택을 Picker 형식으로 변경 */}
                    <View style={styles.row}>
                        <Text style={styles.label}>인원</Text>
                        <Picker
                            selectedValue={selectedNumber}
                            onValueChange={(value) => setSelectedNumber(value)}
                            style={styles.picker}>
                            {Array.from({ length: 50 }, (_, i) => (i + 1).toString()).map((num) => (
                                <Picker.Item key={num} label={num} value={num} />
                            ))}
                        </Picker>
                    </View>
                </View>

                {/* 제목 입력 */}
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>제목</Text>
                    <TextInput
                        style={styles.textInput}
                        placeholder="제목을 입력하세요"
                        value={title}
                        onChangeText={setTitle}
                    />
                </View>

                {/* 내용 입력 */}
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
        justifyContent: 'center', // 제목을 중앙에 위치
        alignItems: 'center', // 세로 중앙 정렬
        paddingVertical: 10,
        position: 'relative', // 상대 위치를 지정
    },
    headerTitle: {
        fontSize: 16, 
        fontWeight: 'bold',
        textAlign: 'center', // 텍스트를 가운데 정렬
        flex: 1, // 제목을 중앙에 위치하게끔 공간 차지
    },
    submitButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#e0e0e0',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 25,  // 둥글게 깎기
        position: 'absolute', // 절대 위치 지정
        right: 5, // 오른쪽 끝에서 약간의 간격을 둠
        height: 40,  // 버튼 높이
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
        backgroundColor: '#cce7ff', // 선택된 성별의 배경 색상
    },
    genderText: {
        fontSize: 16,
        color: '#333',
    },
    pickerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '60%',
    },
    picker: {
        flex: 1,
        height: 50,
    },
    colon: {
        fontSize: 20,
        marginHorizontal: 10,
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
