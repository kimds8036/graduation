import folium
import pandas as pd

# CSV 파일 불러오기
df = pd.read_csv("./final1.csv")

# 특정 학생의 userid 선택
selected_userid = "student_3"

# 학생 데이터 필터링
student_data = df[df['userid'] == selected_userid].iloc[0]
time_data = eval(student_data['time_data'])  # 문자열 형식을 리스트로 변환

# 기준점 (학교 위치)에서 시작
map_center = [36.948923772273105, 127.90693825257696]
mymap = folium.Map(location=map_center, zoom_start=15)

# Initialize variables to group time ranges by location
current_location = None
start_time = None
end_time = None

# Iterate over each entry and group by consecutive identical locations
for entry in time_data:
    time, lat_str, lon_str = entry.split(", ")
    latitude = float(lat_str.split(": ")[1])
    longitude = float(lon_str.split(": ")[1])
    location = (latitude, longitude)

    # Check if location is the same as the previous one
    if location == current_location:
        # Extend the time range
        end_time = time
    else:
        # If location changed, add marker for the previous location
        if current_location is not None:
            folium.Marker(
                location=current_location,
                popup=f"시간대: {start_time} ~ {end_time}",
                icon=folium.Icon(color="blue", icon="info-sign")
            ).add_to(mymap)
        
        # Update to new location and time range
        current_location = location
        start_time = time
        end_time = time

# Add marker for the last location group
if current_location is not None:
    folium.Marker(
        location=current_location,
        popup=f"시간대: {start_time} ~ {end_time}",
        icon=folium.Icon(color="blue", icon="info-sign")
    ).add_to(mymap)

# HTML 파일로 저장
mymap.save("333.html")
