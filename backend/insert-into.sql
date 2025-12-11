INSERT INTO `role` (`role_id`, `role_name`) VALUES
(1, 'Admin'),
(2, 'Customer');

INSERT INTO `category` (`category_id`, `category_name`) VALUES
(1, 'Sữa Tươi'),
(2, 'Sữa Chua'),
(3, 'Sữa Đặc'),
(4, 'Sữa Hạt & Ngũ Cốc');

INSERT INTO `product` (
    `product_id`, `product_name`, `category_id`, `price`, `quantity`, 
    `discount_percent`, `image_url`, `description`, `created_at`, `is_deleted`, `is_hot`
) VALUES
(1, 'Thùng Sữa Tươi Vinamilk 100% Có Đường', 1, 385000.00, 100, 0, 'https://d8um25gjecm9v.cloudfront.net/cms/ST_Tiet_trung_FM_100_CD_1_Lvuong_01_953c2b8712_3e7a11b654.png', 'Sữa tươi tiệt trùng Vinamilk 100%, quy cách thùng 48 hộp x 180ml.', NOW(), 0, 1),
(2, 'Thùng Sữa Tươi Vinamilk 100% Không Đường', 1, 385000.00, 120, 0, 'https://d8um25gjecm9v.cloudfront.net/cms/ST_Tiet_trung_FM_100_KD_1_Lvuong_01_e0fae7da0b_3d1c38cd1e.png', 'Hương vị nguyên bản, không đường. Thùng 48 hộp tiện lợi cho gia đình.', NOW(), 0, 0),
(3, 'Thùng Sữa Tươi Green Farm', 1, 432000.00, 80, 5, 'https://d8um25gjecm9v.cloudfront.net/cms/ST_Thanh_trung_GF_KD_900_01_434a72db30_f1de224378.png', 'Nguồn sữa từ trang trại sinh thái Green Farm. Thùng 48 hộp.', NOW(), 0, 1),
(4, 'Thùng Sữa Dinh Dưỡng Vinamilk ADM', 1, 340000.00, 150, 0, 'https://d8um25gjecm9v.cloudfront.net/cms/SDD_GC_Cf_Latte_300_01_1_49a23fce0b_be94df6489.png', 'Bổ sung vi chất giúp bé mắt sáng, dáng cao. Thùng 48 hộp.', NOW(), 0, 0),
(5, 'Thùng Sữa Chua Ăn Vinamilk Nha Đam', 2, 336000.00, 50, 0, 'https://d8um25gjecm9v.cloudfront.net/cms/SCA_VNM_Nhadam_CD_1_250320_9f867f3746_e62e96c9e9.png', 'Sữa chua nha đam giòn dai. Quy cách thùng 48 hộp (12 lốc).', NOW(), 0, 1),
(6, 'Thùng Sữa Chua Uống Men Sống Probi', 2, 250000.00, 200, 2, 'https://d8um25gjecm9v.cloudfront.net/cms/PROBI_Nghe_Matong_130_1_moi_af86f0f384_dbf38b8a85.png', 'Tăng sức đề kháng. Thùng 50 chai (10 lốc).', NOW(), 0, 1),
(7, 'Thùng Sữa Chua Uống SuSu Trái Cây', 2, 280000.00, 90, 0, 'https://d8um25gjecm9v.cloudfront.net/cms/SCA_SUSU_Dau_Chuoi_01_2_5811068381.png', 'Vị trái cây thơm ngon cho bé. Thùng 48 chai.', NOW(), 0, 0),
(8, 'Thùng Sữa Đặc Ông Thọ (24 Lon)', 3, 580000.00, 60, 0, 'https://d8um25gjecm9v.cloudfront.net/cms/SD_Ong_Tho_Xanhla_380_1_718fd5ef2e_dcd11dbcac.png', 'Ngọt đậm đà, béo ngậy. Quy cách thùng 24 lon x 380g.', NOW(), 0, 1),
(9, 'Thùng Sữa Đậu Nành Tươi Vinamilk', 4, 215000.00, 120, 0, 'https://d8um25gjecm9v.cloudfront.net/cms/SDN_KD_1_L_01_50f3f1f9e8_48e7f3b3fb.png', 'Gấp đôi Canxi. Thùng 48 hộp giấy.', NOW(), 0, 0),
(10, 'Thùng Sữa Hạt Óc Chó Vinamilk', 4, 460000.00, 70, 10, 'https://d8um25gjecm9v.cloudfront.net/cms/Thumbs_10_25_STV_06_274871573e.png', 'Giàu Omega-3 từ hạt óc chó Mỹ. Thùng 48 hộp.', NOW(), 0, 1);

INSERT INTO `product_detail` 
(`product_id`, `origin`, `ingredients`, `usage`, `storage`, `calories`, `protein`, `fat`, `carbohydrates`, `sugar`, `vitamins`, `minerals`, `other_nutrients`) 
VALUES
(1, 'Việt Nam', 'Sữa bò tươi (96%), đường tinh luyện, chất ổn định (471, 460(i), 407, 466).', 'Ngon hơn khi uống lạnh. Lắc đều trước khi dùng.', 'Bảo quản nơi khô ráo, thoáng mát.', 75.6, 3.0, 3.5, 8.2, 8.0, '{"Vitamin A": "220 IU", "Vitamin D3": "120 IU"}', '{"Canxi": "110 mg", "Photpho": "90 mg"}', NULL),
(2, 'Việt Nam', 'Sữa bò tươi (100%).', 'Dùng trực tiếp. Thích hợp cho người kiêng đường.', 'Bảo quản nơi khô ráo, tránh ánh nắng.', 60.0, 3.1, 3.3, 4.6, 4.6, '{"Vitamin A": "180 IU", "Vitamin D3": "100 IU"}', '{"Canxi": "120 mg", "Magie": "10 mg"}', NULL),
(3, 'Việt Nam', 'Sữa bò tươi từ trang trại sinh thái Green Farm, đường, chất ổn định.', 'Dùng cho trẻ trên 1 tuổi.', 'Bảo quản nơi khô ráo.', 70.2, 2.9, 3.4, 7.5, 7.0, '{"Vitamin A": "200 IU", "Vitamin D3": "130 IU"}', '{"Canxi": "115 mg", "Kẽm": "0.5 mg"}', NULL),
(4, 'Việt Nam', 'Sữa, đường, dầu thực vật, vitamin A, D3, Canxi.', 'Mỗi ngày dùng 3 hộp để đủ vi chất.', 'Nơi thoáng mát.', 72.0, 3.0, 3.2, 8.0, 8.0, '{"Vitamin A": "500 IU", "Vitamin D3": "150 IU", "Vitamin B12": "0.5 µg"}', '{"Canxi": "140 mg", "Magie": "15 mg"}', 'Omega 3, DHA'),
(5, 'Việt Nam', 'Sữa, đường, nha đam (10%), men Streptococcus thermophilus.', 'Sử dụng ngay sau khi mở nắp.', 'Bảo quản lạnh 6-8 độ C.', 105.0, 3.2, 2.8, 16.5, 16.0, '{"Vitamin B1": "50 mcg", "Vitamin B2": "150 mcg"}', '{"Canxi": "100 mg"}', 'Collagen tự nhiên'),
(6, 'Việt Nam', 'Nước, đường, sữa bột, men Lactobacillus Casei 431.', 'Khuyên dùng 2 chai mỗi ngày.', 'Không cần bảo quản lạnh.', 65.0, 1.2, 0.0, 15.0, 14.0, '{"Vitamin D3": "50 IU"}', '{"Canxi": "40 mg"}', '13 tỷ lợi khuẩn L.Casei 431'),
(7, 'Việt Nam', 'Sữa, mứt trái cây, vitamin nhóm B, chất xơ hòa tan.', 'Ăn trực tiếp.', 'Bảo quản lạnh 6-8 độ C.', 90.0, 2.8, 2.5, 14.0, 13.0, '{"Vitamin A": "250 IU", "Vitamin B6": "0.2 mg"}', '{"Canxi": "90 mg"}', 'Chất xơ hòa tan (Inulin)'),
(8, 'Việt Nam', 'Đường, sữa, dầu thực vật.', 'Dùng pha cà phê, làm bánh, ăn với bánh mì.', 'Đậy nắp kỹ sau khi dùng, bảo quản tủ lạnh.', 338.0, 4.6, 10.8, 56.0, 56.0, '{"Vitamin A": "200 IU", "Vitamin D": "40 IU"}', '{"Canxi": "260 mg", "Photpho": "230 mg"}', NULL),
(9, 'Việt Nam', 'Nước, đậu nành hạt (90%), đường, dầu đậu nành.', 'Uống liền. Ngon hơn khi uống lạnh.', 'Tránh ánh nắng mặt trời.', 54.0, 3.1, 1.8, 6.5, 6.0, '{"Vitamin A": "100 IU", "Vitamin E": "1.0 mg"}', '{"Canxi": "20 mg"}', 'Isoflavones (12mg)'),
(10, 'Việt Nam', 'Dịch hạt óc chó, sữa bò tươi, đường.', 'Lắc đều trước khi uống.', 'Bảo quản nơi khô ráo.', 68.0, 1.5, 2.2, 10.5, 9.0, '{"Vitamin A": "250 IU", "Vitamin E": "1.5 mg", "Vitamin PP": "2.0 mg"}', '{"Canxi": "80 mg", "Phốt pho": "70 mg"}', 'Omega-3 (80mg)');