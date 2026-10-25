# CampusBooking — Study Room Booking App

Ứng dụng di động hỗ trợ sinh viên tìm kiếm, xem thông tin và đặt phòng học/phòng tự học trong khuôn viên trường. Dự án được xây dựng bằng React Native, Expo và Firebase.

## 1. Tổng quan dự án

**Tên dự án:** CampusBooking — Study Room Booking App  
**Nền tảng:** Android / iOS  
**Framework:** React Native + Expo  
**Ngôn ngữ:** TypeScript  
**Backend:** Firebase Authentication và Cloud Firestore

## 2. Tính năng chính

- **Đăng ký và đăng nhập:** Xác thực tài khoản bằng Firebase Authentication.
- **Danh sách phòng:** Hiển thị thông tin phòng học và phòng tự học.
- **Tìm kiếm và lọc:** Hỗ trợ tìm phòng theo thông tin và các tiêu chí lọc.
- **Chi tiết phòng:** Xem khu vực, tầng, sức chứa và trạng thái phòng.
- **Đặt phòng:** Chọn ngày và khung giờ mong muốn.
- **Chống đặt trùng:** Sử dụng Firestore transaction để kiểm tra khung giờ trước khi tạo đặt phòng.
- **Quản lý lịch đặt:** Xem và hủy các lịch đặt của tài khoản.
- **Quản lý hồ sơ:** Chỉnh sửa tên người dùng và đổi mật khẩu.
- **Dark mode:** Chuyển đổi giữa giao diện sáng và tối.

## 3. Công nghệ sử dụng

| Công nghệ | Vai trò |
|---|---|
| React Native | Xây dựng giao diện ứng dụng di động |
| Expo | Phát triển và chạy ứng dụng |
| TypeScript | Kiểm tra kiểu dữ liệu |
| React Navigation | Điều hướng Stack và Bottom Tabs |
| Zustand | Quản lý trạng thái phía client |
| TanStack Query | Quản lý dữ liệu truy vấn và cache |
| Firebase Authentication | Xác thực người dùng |
| Cloud Firestore | Lưu trữ dữ liệu phòng và lịch đặt |
| AsyncStorage | Lưu tùy chọn giao diện trên thiết bị |

## 4. Cấu trúc thư mục

```text
CampusBooking/
├── App.tsx
├── package.json
├── package-lock.json
└── src/
    ├── api/
    │   └── roomsApi.ts
    ├── components/
    │   └── RoomCard.tsx
    ├── config/
    │   └── firebase.ts
    ├── data/
    │   └── rooms.ts
    ├── hooks/
    │   └── useRoomsQuery.ts
    ├── navigation/
    │   └── AppNavigator.tsx
    ├── screens/
    │   ├── BookingsScreen.tsx
    │   ├── HomeScreen.tsx
    │   ├── LoginScreen.tsx
    │   ├── ProfileScreen.tsx
    │   ├── RegisterScreen.tsx
    │   └── RoomDetailScreen.tsx
    ├── services/
    │   ├── authService.ts
    │   └── bookingService.ts
    ├── store/
    │   ├── authStore.ts
    │   ├── bookingStore.ts
    │   └── themeStore.ts
    └── theme/
        ├── colors.ts
        ├── darkColors.ts
        ├── index.ts
        └── useAppTheme.ts
```

## 5. Yêu cầu môi trường

- Node.js và npm
- Expo CLI thông qua `npx`
- Expo Go trên điện thoại hoặc Android Emulator
- Tài khoản Firebase đã cấu hình Authentication và Cloud Firestore

## 6. Cài đặt và chạy ứng dụng

### Bước 1: Clone repository

```bash
git clone https://github.com/hien205/CampusBooking.git
cd CampusBooking
```

### Bước 2: Cài đặt dependencies

```bash
npm install
```

### Bước 3: Cấu hình Firebase

Kiểm tra file `src/config/firebase.ts` và sử dụng cấu hình Firebase của dự án. Không đưa thông tin bí mật hoặc thông tin quản trị vào repository công khai.

### Bước 4: Khởi chạy ứng dụng

```bash
npx expo start
```

Nếu cần chạy qua tunnel để kết nối với điện thoại:

```bash
npx expo start --tunnel
```

Quét mã QR bằng Expo Go hoặc mở ứng dụng trên emulator tương thích.

## 7. Cơ chế đặt phòng

1. Người dùng đăng nhập và chọn phòng.
2. Người dùng chọn ngày và khung giờ.
3. Ứng dụng kiểm tra trạng thái khung giờ.
4. Service tạo định danh slot và sử dụng Firestore transaction để kiểm tra trước khi ghi dữ liệu.
5. Nếu khung giờ đã được đặt, ứng dụng thông báo lỗi và yêu cầu chọn khung giờ khác.
6. Nếu đặt thành công, lịch đặt được cập nhật để người dùng theo dõi.

## 8. Repository

GitHub: https://github.com/hien205/CampusBooking

## 9. Hướng phát triển

- Bổ sung thông báo về trạng thái đặt phòng.
- Cải thiện bộ lọc và tìm kiếm phòng.
- Hoàn thiện kiểm thử và xử lý lỗi.
- Bổ sung thống kê lịch sử sử dụng phòng.
- Cải thiện trải nghiệm người dùng và khả năng mở rộng hệ thống.

---

**CampusBooking — Study Room Booking App**
