export default {
  expo: {
    name: "YourAppName",
    slug: "your-app-slug",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },
    updates: {
      fallbackToCacheTimeout: 0
    },
    assetBundlePatterns: ["**/*"],
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.example.yourapp",
      infoPlist: {
        NSCameraUsageDescription: "카메라를 사용하려면 권한이 필요합니다.", // 카메라 사용 권한 설명 추가
        NSLocationWhenInUseUsageDescription: "위치 사용을 위해 권한이 필요합니다." // 위치 권한 요청 설명 (필요시)
      }
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#FFFFFF"
      },
      permissions: [
        "CAMERA",
        "ACCESS_FINE_LOCATION"
      ]
    },
    web: {},
    extra: {
      eas: {
        projectId: "your-eas-project-id"
      }
    }
  }
};
