# Kế hoạch Thiết kế lại Giao diện Webgame "Mảnh ghép kí ức" theo Bức tranh Phố chợ Việt xưa

Tái cấu trúc và thiết kế lại toàn bộ giao diện trò chơi để hòa nhập tự nhiên vào bức tranh minh họa phố chợ xưa trong sương sớm: bố trí 10 thẻ bài lật 3D nổi bật trên khoảng sân đá trung tâm (không che chiếc áo bông ở góc trái), biến khung tranh giấy bên phải thành bảng tóm tắt 5 mảnh kí ức & bình luận, và tích hợp thanh điều khiển/bảng điểm trong suốt vào dải giấy cổ kính chân trang.

## Quyết định đã xác nhận & Đề xuất kiến trúc

> [!IMPORTANT]
> Dựa trên lựa chọn của người dùng và phân tích bố cục bức tranh nền:
> - **Khung bảng giấy tường cổ (Bên phải bức tranh)**: Thiết kế thành Bảng theo dõi tiến độ và tóm tắt sự việc 5 mảnh kí ức, kèm theo lời bình đúc kết ngắn gọn từ Người Dẫn Chuyện AI sau mỗi lượt ghép thành công.
> - **Dải công cụ chân trang**: Loại bỏ thanh đen đậm truyền thống; thay bằng giao diện kính mờ/parchment trong suốt (`bg-amber-100/30 backdrop-blur-sm border-amber-900/10`), hiển thị bảng điểm 4 tổ, chế độ chơi và các nút điều khiển hòa cùng dải giấy vẽ sẵn trong tranh.
> - **Khu vực bàn cờ 10 thẻ (Trung tâm - Trái)**: 10 thẻ bài được đặt trên nền quảng trường lát đá rộng thoáng, áp dụng tông màu giấy điệp cổ điển, viền chỉ nâu đồng và ánh kim vàng ấm khi lật mở để ăn khớp với ánh nắng mai và chiếc áo bông chần chỉ tím ở góc trái.

---

## 1. Bố cục & Ý tưởng không gian thị giác

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│                   BỨC TRANH NỀN: PHỐ CHỢ VIỆT XƯA TRONG SƯƠNG SỚM                │
│                                                                                  │
│ [Cây bàng rụng lá &                             [KHUNG GIẤY TƯỜNG CỔ PHẢI]       │
│  Chiếc áo bông chần góc trái]                    - Bảng tiến độ 5 mảnh kí ức     │
│                                                  - Tóm tắt sự việc & ý nghĩa     │
│       ┌───┐  ┌───┐  ┌───┐  ┌───┐  ┌───┐          - Lời bình Thủ thư AI           │
│       │01 │  │02 │  │03 │  │04 │  │05 │          - Nút "Xin gợi ý"               │
│       └───┘  └───┘  └───┘  └───┘  └───┘                                          │
│       ┌───┐  ┌───┐  ┌───┐  ┌───┐  ┌───┐                                          │
│       │06 │  │07 │  │08 │  │09 │  │10 │                                          │
│       └───┘  └───┘  └───┘  └───┘  └───┘                                          │
│       (Lưới 10 thẻ nổi nhẹ trên sân đá)                                          │
│                                                                                  │
├──────────────────────────────────────────────────────────────────────────────────┤
│  [DẢI GIẤY CHÂN TRANG TRONG SUỐT]                                                │
│  - Chế độ Khám phá / 4 Tổ · Điểm số · Âm thanh · Toàn màn hình · Soạn thẻ GV     │
└──────────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Chi tiết Thiết kế & Trải nghiệm người dùng (UX/UI)

### A. Tích hợp Hình nền & Không gian tương tác
- Sử dụng ảnh nền `/assets/pho_cho_xua.png` với lớp phủ ánh sáng nhẹ nhàng (`bg-cover bg-center`).
- Giữ nguyên tầm nhìn thoáng đãng tới chiếc áo bông chần góc trái và các sạp hàng hoa cúc, bắp cải bên vỉa hè.

### B. Phong cách Thẻ bài mới (Storybook Vintage)
- **Mặt úp**: Tông màu vàng rơm cổ điển / giấy điệp truyền thống (`#fef3c7`), viền hoa văn gốm sứ / đồng cổ viền mỏng (`border-amber-800/30`), số thứ tự 01–10 khắc nổi đậm nét, có bóng đổ tự nhiên trên nền đá.
- **Mặt ngửa (Khi lật)**:
  - Thẻ Sự việc: Nền ngà ấm áp, chữ nâu đen mực Tàu có độ tương phản cao, font `Lora` thanh lịch.
  - Thẻ Chi tiết: Nền trắng kem mượt mà, trích dẫn chuẩn câu văn Thạch Lam.
  - Khi ghép đúng: Thẻ phát sáng ánh hào quang vàng nắng ấm (`ring-2 ring-amber-500 shadow-amber-500/30`).

### C. Khung Bảng Giấy Bên Phải (Tường Cổ)
- Nằm vừa vặn trong khuôn hình chữ nhật bo góc của bức tường vàng.
- Hiển thị danh sách 5 mảnh kí ức tương ứng 5 sự việc:
  1. *Gió lạnh đầu mùa* (Đất trời chuyển lạnh, gió bấc)
  2. *Bé Hiên co ro* (Bên cột quán, manh áo rách)
  3. *Sơn và Lan tặng áo* (Chiếc áo bông cũ em Duyên)
  4. *Lo sợ đi đòi áo* (Tâm lý lấm lét trẻ thơ)
  5. *Tình thương hai người mẹ* (Bao dung và sẻ chia)
- Mảnh nào được mở khóa sẽ hiện dấu triện đỏ tinh tế kèm đoạn tóm tắt sự việc và lời bình đúc kết của Thủ thư AI.

### D. Dải Chân Trang Trong Suốt (Parchment Ribbon)
- Chiều cao và vị trí khớp chính xác với dải giấy màu kem ở chân bức tranh.
- Các nút bấm được thiết kế dạng thẻ giấy / con dấu cổ kính thanh thoát, có màu chữ nâu trầm (`text-stone-800`), nút kích hoạt màu hổ phách ấm, không làm đứt gãy tính hội họa của bức tranh.

---

## 3. Các bước triển khai kỹ thuật

1. **Cấu hình Asset hình ảnh**: Đảm bảo file ảnh nền `/assets/pho_cho_xua.png` sẵn sàng trong thư mục `/public/assets/`.
2. **Cập nhật `WinterArtCanvas.tsx` & Bảng bên phải**: Chuyển đổi thành component `MemoryParchmentPanel.tsx` hiển thị tiến độ 5 mảnh ghép và tóm tắt sự việc ăn khớp với khung tường bên phải.
3. **Cập nhật `CardTile.tsx`**: Tinh chỉnh bảng màu của thẻ sang phong cách giấy điệp cổ xưa, viền chỉ vàng nâu, số hiệu sắc nét.
4. **Cập nhật `ScoreboardBar.tsx`**: Thiết kế lại dải công cụ với phong cách trong suốt, hòa sắc với dải giấy chân trang.
5. **Cập nhật `App.tsx`**: Tái cân bằng tỉ lệ lưới (60% cho bàn cờ sân đá, 40% cho khung bảng giấy phải), gắn hình nền, căn chỉnh padding để không che khuất chiếc áo bông góc trái.
6. **Kiểm thử & Biên dịch**: Chạy `compile_applet` và kiểm tra độ sắc nét trên các độ phân giải màn hình.
