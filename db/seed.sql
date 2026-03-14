USE hostel_services;

-- =====================================================
-- 1. CITIES (1 record - Lahore, Pakistan)
-- =====================================================
INSERT INTO cities (city_name, state, country) VALUES
('Lahore', 'Punjab', 'Pakistan');

-- =====================================================
-- 2. AREAS (10 areas in Lahore)
-- =====================================================
INSERT INTO areas (area_name, city_id, pincode, latitude, longitude) VALUES
('Johar Town', 1, '54782', 31.4711, 74.2583),
('DHA Phase 5', 1, '54810', 31.4865, 74.3278),
('Gulberg', 1, '54660', 31.5204, 74.3487),
('Model Town', 1, '54700', 31.4878, 74.3291),
('Iqbal Town', 1, '54570', 31.5149, 74.2825),
('Township', 1, '54770', 31.4467, 74.3089),
('Cantt', 1, '54840', 31.4979, 74.4012),
('Wapda Town', 1, '54760', 31.4365, 74.2754),
('Valencia', 1, '54820', 31.4245, 74.2589),
('Bahria Town', 1, '53720', 31.3678, 74.1845);

-- =====================================================
-- 3. INSTITUTIONS (15 universities, colleges, workplaces)
-- =====================================================
INSERT INTO institutions (institution_name, institution_type, address, city_id, area_id, latitude, longitude) VALUES
('University of Punjab', 'university', 'Quaid-e-Azam Campus', 1, 4, 31.4989, 74.2917),
('LUMS', 'university', 'Opposite UET, DHA', 1, 2, 31.4712, 74.4097),
('Kinnaird College', 'college', '93 Jail Road', 1, 3, 31.5375, 74.3436),
('Government College University', 'university', 'Katchery Road', 1, 5, 31.5683, 74.3119),
('UET Lahore', 'university', 'Grand Trunk Road', 1, 7, 31.5820, 74.3601),
('FC College', 'university', 'Ferozepur Road', 1, 4, 31.4722, 74.3039),
('Superior College', 'college', 'College Block', 1, 1, 31.4598, 74.2621),
('NCA', 'university', '4 Shahrah-e-Quaid-e-Azam', 1, 5, 31.5721, 74.3189),
('PUCIT', 'university', 'Old Campus, Anarkali', 1, 5, 31.5678, 74.3089),
('Lahore College for Women University', 'university', 'Jail Road', 1, 3, 31.5334, 74.3421),
('COMSATS University', 'university', 'Defence Road', 1, 1, 31.4489, 74.2587),
('University of Central Punjab', 'university', '1-Khayaban-e-Jinnah', 1, 1, 31.4623, 74.2645),
('National University of Computer Sciences', 'university', 'B Block, DHA', 1, 2, 31.4892, 74.3378),
('Forman Christian College', 'university', 'Ferozepur Road', 1, 4, 31.4801, 74.2987),
('Packages Limited', 'workplace', 'Lahore-Kasur Road', 1, 8, 31.4398, 74.2790);

-- =====================================================
-- 4. HOSTELS (25 hostels across Lahore)
-- =====================================================
INSERT INTO hostels (hostel_name, owner_name, contact_number, alternate_number, email, address, city_id, area_id, pincode, latitude, longitude, total_rooms, gender_preference, description, is_verified) VALUES
('Student Haven Hostel', 'Ahmed Raza', '03001234567', '03214567890', 'info@studenthaven.pk', '123 Block G', 1, 1, '54782', 31.4725, 74.2598, 25, 'male', 'Modern hostel near LUMS and Punjab University', TRUE),
('Lahore Girls Hostel', 'Fatima Akhtar', '03111223344', NULL, 'lahoregirls@hostel.pk', '45 Block C', 1, 2, '54810', 31.4878, 74.3265, 20, 'female', 'Safe and secure girls hostel with mess', TRUE),
('Central Executive Hostel', 'Khalid Mehmood', '03334567890', '03004567891', 'central@hostel.pk', '78 Main Boulevard', 1, 3, '54660', 31.5212, 74.3478, 30, 'co-ed', 'Premium hostel for professionals', TRUE),
('University Inn', 'Sadia Khan', '03451236789', NULL, 'universityinn@gmail.com', '56 College Road', 1, 4, '54700', 31.4891, 74.3301, 18, 'female', 'Walking distance to Model Town', TRUE),
('Green View Hostel', 'Tariq Javed', '03225678901', '03115678902', 'greenview@hotmail.com', '89 Park Road', 1, 5, '54570', 31.5156, 74.2812, 22, 'male', 'Eco-friendly hostel with garden', FALSE),
('DHA Residency', 'Imran Ali', '03007894561', NULL, 'dharesidency@yahoo.com', '12 Commercial Area', 1, 2, '54810', 31.4859, 74.3309, 35, 'co-ed', 'Luxury accommodation in DHA', TRUE),
('Township Boys Hostel', 'Shahid Mehmood', '03134561234', '03224561235', 'townshipboys@gmail.com', '34 Main Market', 1, 6, '54770', 31.4478, 74.3098, 28, 'male', 'Affordable rooms for students', TRUE),
('Wapda Enclave', 'Nasreen Bibi', '03347894561', NULL, 'wapdaenclave@gmail.com', '78 Sector A', 1, 8, '54760', 31.4378, 74.2765, 15, 'female', 'Quiet area, ideal for girls', TRUE),
('Valencia Heights', 'Rashid Latif', '03237894512', '03007894513', 'valenciaheights@yahoo.com', '45 Valencia Block', 1, 9, '54820', 31.4256, 74.2590, 40, 'co-ed', 'Spacious rooms with modern amenities', FALSE),
('Bahria View', 'Sana Mirza', '03458901234', NULL, 'bahriaview@gmail.com', '67 Sector E', 1, 10, '53720', 31.3689, 74.1856, 32, 'female', 'Beautiful view and secure environment', TRUE),
('Johar Town Mens Hostel', 'Usman Chaudhry', '03015678901', '03125678902', 'johartownmens@gmail.com', '123 Block F', 1, 1, '54782', 31.4689, 74.2634, 24, 'male', 'Near emporium mall', TRUE),
('Gulberg Executive', 'Hina Aslam', '03334561278', NULL, 'gulbergexec@gmail.com', '56 MM Alam Road', 1, 3, '54660', 31.5245, 74.3523, 18, 'female', 'Luxury hostel for working women', TRUE),
('Cantt Boarding House', 'Asif Raza', '03224567812', '03004567813', 'canttboarding@gmail.com', '90 Askari', 1, 7, '54840', 31.4992, 74.3987, 22, 'male', 'Close to railway station', FALSE),
('Model Town Residency', 'Nida Hussain', '03451239876', NULL, 'modelresidency@gmail.com', '34 Block A', 1, 4, '54700', 31.4923, 74.3321, 20, 'female', 'Well-furnished rooms', TRUE),
('Iqbal Town Hostel', 'Kamran Akhtar', '03117894561', '03217894562', 'iqbaltownhostel@gmail.com', '78 Block B', 1, 5, '54570', 31.5123, 74.2845, 26, 'male', 'Budget friendly', TRUE),
('Lahore Hostel City', 'Saima Rafiq', '03338901234', NULL, 'lahorehostelcity@gmail.com', '12 Main Road', 1, 6, '54770', 31.4501, 74.3123, 38, 'co-ed', 'Large capacity with multiple facilities', FALSE),
('DHA Phase 6 Girls', 'Tahira Khan', '03002348901', '03212348902', 'dhaphase6@gmail.com', '56 Sector Y', 1, 2, '54810', 31.4823, 74.3356, 28, 'female', 'Premium girls hostel', TRUE),
('Punjab University Hostel', 'Rizwan Ali', '03455678901', NULL, 'pu_hostel@gmail.com', '90 New Campus', 1, 1, '54782', 31.4956, 74.2956, 45, 'male', 'Official PU affiliated hostel', TRUE),
('Executive Inn', 'Farah Ahmed', '03128901234', '03008901235', 'executiveinn@gmail.com', '34 Liberty', 1, 3, '54660', 31.5289, 74.3501, 16, 'female', 'Boutique hostel experience', FALSE),
('Students Paradise', 'Waseem Abbas', '03347891234', NULL, 'studentsparadise@gmail.com', '67 College Road', 1, 1, '54782', 31.4656, 74.2601, 30, 'male', 'Popular among students', TRUE),
('Valencia Girls Hostel', 'Samina Zafar', '03235678901', '03135678902', 'valenciagirls@gmail.com', '23 Valencia Town', 1, 9, '54820', 31.4278, 74.2623, 24, 'female', 'Newly constructed', TRUE),
('Bahria Town Executive', 'Faisal Rana', '03006789012', NULL, 'bahriaexecutive@gmail.com', '78 Sector C', 1, 10, '53720', 31.3723, 74.1878, 36, 'co-ed', 'Luxury living', FALSE),
('Wapda Town Mens', 'Arif Mehmood', '03331234567', '03451234568', 'wapdatownmens@gmail.com', '12 Sector B', 1, 8, '54760', 31.4401, 74.2801, 22, 'male', 'Affordable and clean', TRUE),
('Township Girls Hostel', 'Shazia Kiran', '03456789012', NULL, 'townshipgirls@gmail.com', '45 Block C', 1, 6, '54770', 31.4523, 74.3156, 20, 'female', 'Safe environment', TRUE),
('Lahore Backpackers', 'Zeeshan Khan', '03124567890', '03004567891', 'lahorebackpackers@gmail.com', '89 The Mall', 1, 5, '54570', 31.5623, 74.3178, 50, 'co-ed', 'International backpacker hostel', FALSE);

-- =====================================================
-- 5. ROOM TYPES (4 types)
-- =====================================================
INSERT INTO room_types (type_name, description) VALUES
('Single', 'Private room with single bed, ideal for one person'),
('Double', 'Room with two beds, sharing option'),
('Triple', 'Room with three beds, for group of friends'),
('Dormitory', '4-6 bed shared dormitory');

-- =====================================================
-- 6. HOSTEL ROOMS (75 rooms across hostels)
-- =====================================================
INSERT INTO hostel_rooms (hostel_id, room_type_id, room_number, total_beds_in_room, available_beds, monthly_rent, security_deposit, is_available, floor_number) VALUES
-- Student Haven Hostel (hostel_id 1)
(1, 1, '101', 1, 1, 12000, 5000, TRUE, 1),
(1, 1, '102', 1, 0, 12000, 5000, FALSE, 1),
(1, 2, '103', 2, 2, 8000, 4000, TRUE, 1),
(1, 2, '104', 2, 1, 8000, 4000, TRUE, 1),
(1, 3, '201', 3, 2, 6000, 3000, TRUE, 2),
(1, 4, '202', 6, 4, 4500, 2000, TRUE, 2),
(1, 4, '203', 6, 6, 4500, 2000, TRUE, 2),

-- Lahore Girls Hostel (hostel_id 2)
(2, 1, 'A1', 1, 1, 15000, 6000, TRUE, 1),
(2, 1, 'A2', 1, 0, 15000, 6000, FALSE, 1),
(2, 2, 'B1', 2, 1, 10000, 5000, TRUE, 1),
(2, 2, 'B2', 2, 2, 10000, 5000, TRUE, 2),
(2, 3, 'C1', 3, 3, 7500, 4000, TRUE, 2),
(2, 3, 'C2', 3, 0, 7500, 4000, FALSE, 2),

-- Central Executive Hostel (hostel_id 3)
(3, 1, '101', 1, 0, 20000, 10000, FALSE, 1),
(3, 1, '102', 1, 0, 20000, 10000, FALSE, 1),
(3, 1, '103', 1, 1, 20000, 10000, TRUE, 1),
(3, 2, '201', 2, 1, 15000, 8000, TRUE, 2),
(3, 2, '202', 2, 2, 15000, 8000, TRUE, 2),

-- University Inn (hostel_id 4)
(4, 1, '1', 1, 0, 11000, 4500, FALSE, 1),
(4, 2, '2', 2, 2, 8500, 4000, TRUE, 1),
(4, 3, '3', 3, 3, 6500, 3500, TRUE, 2),
(4, 4, '4', 4, 2, 4000, 2000, TRUE, 2),

-- Green View Hostel (hostel_id 5)
(5, 1, 'G1', 1, 1, 10000, 4000, TRUE, 1),
(5, 2, 'G2', 2, 2, 7500, 3500, TRUE, 1),
(5, 2, 'G3', 2, 1, 7500, 3500, TRUE, 2),

-- DHA Residency (hostel_id 6)
(6, 1, 'D101', 1, 0, 25000, 15000, FALSE, 1),
(6, 1, 'D102', 1, 1, 25000, 15000, TRUE, 1),
(6, 1, 'D103', 1, 1, 25000, 15000, TRUE, 1),
(6, 2, 'D201', 2, 2, 18000, 10000, TRUE, 2),

-- Township Boys Hostel (hostel_id 7)
(7, 1, 'T1', 1, 1, 8000, 3000, TRUE, 1),
(7, 2, 'T2', 2, 0, 6000, 2500, FALSE, 1),
(7, 3, 'T3', 3, 2, 5000, 2000, TRUE, 2),
(7, 4, 'T4', 6, 4, 3500, 1500, TRUE, 2),

-- Wapda Enclave (hostel_id 8)
(8, 1, 'W1', 1, 0, 9000, 3500, FALSE, 1),
(8, 2, 'W2', 2, 1, 7000, 3000, TRUE, 1),

-- Valencia Heights (hostel_id 9)
(9, 1, 'V101', 1, 1, 14000, 6000, TRUE, 1),
(9, 1, 'V102', 1, 1, 14000, 6000, TRUE, 1),
(9, 2, 'V201', 2, 2, 10000, 5000, TRUE, 2),

-- Bahria View (hostel_id 10)
(10, 1, 'B1', 1, 0, 18000, 8000, FALSE, 1),
(10, 1, 'B2', 1, 0, 18000, 8000, FALSE, 1),
(10, 2, 'B3', 2, 1, 12000, 6000, TRUE, 2),

-- Johar Town Mens Hostel (hostel_id 11)
(11, 1, 'J101', 1, 1, 11000, 4500, TRUE, 1),
(11, 2, 'J102', 2, 2, 8000, 3500, TRUE, 1),
(11, 3, 'J201', 3, 3, 6000, 2500, TRUE, 2),

-- Gulberg Executive (hostel_id 12)
(12, 1, 'G101', 1, 1, 22000, 12000, TRUE, 1),
(12, 1, 'G102', 1, 0, 22000, 12000, FALSE, 1),

-- Cantt Boarding House (hostel_id 13)
(13, 1, 'C1', 1, 1, 13000, 5000, TRUE, 1),
(13, 2, 'C2', 2, 2, 9000, 4000, TRUE, 1),

-- Model Town Residency (hostel_id 14)
(14, 1, 'M1', 1, 0, 16000, 7000, FALSE, 1),
(14, 2, 'M2', 2, 1, 11000, 5000, TRUE, 2),

-- Iqbal Town Hostel (hostel_id 15)
(15, 1, 'I1', 1, 1, 9000, 3500, TRUE, 1),
(15, 2, 'I2', 2, 2, 7000, 3000, TRUE, 1),

-- Lahore Hostel City (hostel_id 16)
(16, 1, 'L101', 1, 1, 10000, 4000, TRUE, 1),
(16, 2, 'L102', 2, 2, 7500, 3500, TRUE, 1),
(16, 4, 'L201', 6, 5, 4000, 2000, TRUE, 2),

-- DHA Phase 6 Girls (hostel_id 17)
(17, 1, 'D1', 1, 0, 19000, 9000, FALSE, 1),
(17, 2, 'D2', 2, 1, 13000, 6500, TRUE, 1),

-- Punjab University Hostel (hostel_id 18)
(18, 1, 'P101', 1, 0, 10000, 4000, FALSE, 1),
(18, 1, 'P102', 1, 0, 10000, 4000, FALSE, 1),
(18, 2, 'P201', 2, 1, 7500, 3500, TRUE, 2),

-- Executive Inn (hostel_id 19)
(19, 1, 'E1', 1, 1, 21000, 11000, TRUE, 1),

-- Students Paradise (hostel_id 20)
(20, 1, 'S101', 1, 1, 9500, 4000, TRUE, 1),
(20, 2, 'S102', 2, 2, 7200, 3500, TRUE, 1),

-- Valencia Girls Hostel (hostel_id 21)
(21, 1, 'V1', 1, 0, 13000, 5500, FALSE, 1),
(21, 2, 'V2', 2, 2, 9500, 4500, TRUE, 2),

-- Bahria Town Executive (hostel_id 22)
(22, 1, 'B101', 1, 1, 23000, 12000, TRUE, 1),

-- Wapda Town Mens (hostel_id 23)
(23, 1, 'W101', 1, 1, 8500, 3500, TRUE, 1),

-- Township Girls Hostel (hostel_id 24)
(24, 1, 'T101', 1, 0, 10500, 4000, FALSE, 1),

-- Lahore Backpackers (hostel_id 25)
(25, 4, 'D1', 8, 6, 3000, 1000, TRUE, 1),
(25, 4, 'D2', 8, 8, 3000, 1000, TRUE, 2);

-- =====================================================
-- 7. AMENITIES (20 amenities)
-- =====================================================
INSERT INTO amenities (amenity_name, category, icon_name) VALUES
('WiFi', 'electronics', 'wifi-icon'),
('Air Conditioning', 'electronics', 'ac-icon'),
('Geyser', 'basic', 'geyser-icon'),
('TV', 'electronics', 'tv-icon'),
('Study Table', 'furniture', 'table-icon'),
('Chair', 'furniture', 'chair-icon'),
('Wardrobe', 'furniture', 'wardrobe-icon'),
('Attached Bathroom', 'basic', 'bathroom-icon'),
('Kitchen Access', 'food', 'kitchen-icon'),
('Mess/Canteen', 'food', 'mess-icon'),
('Laundry Service', 'basic', 'laundry-icon'),
('Housekeeping', 'basic', 'housekeeping-icon'),
('CCTV Surveillance', 'safety', 'cctv-icon'),
('Security Guard', 'safety', 'guard-icon'),
('Fire Extinguisher', 'safety', 'fire-icon'),
('First Aid Kit', 'safety', 'firstaid-icon'),
('Parking', 'basic', 'parking-icon'),
('Elevator', 'basic', 'elevator-icon'),
('Generator Backup', 'electronics', 'generator-icon'),
('RO Water Filter', 'basic', 'water-icon');

-- =====================================================
-- 8. HOSTEL AMENITIES (linking hostels to amenities)
-- =====================================================
INSERT INTO hostel_amenities (hostel_id, amenity_id, is_available, additional_charges, notes) VALUES
-- Student Haven Hostel (1)
(1, 1, TRUE, 0.00, 'Free WiFi'),
(1, 2, TRUE, 1000.00, 'AC rooms available at extra cost'),
(1, 3, TRUE, 0.00, '24/7 geyser'),
(1, 5, TRUE, 0.00, 'Study table in each room'),
(1, 6, TRUE, 0.00, 'Chair provided'),
(1, 7, TRUE, 0.00, 'Spacious wardrobe'),
(1, 10, TRUE, 3000.00, 'Mess facility, monthly mess bill'),
(1, 11, TRUE, 500.00, 'Laundry service available'),
(1, 12, TRUE, 0.00, 'Weekly housekeeping'),
(1, 13, TRUE, 0.00, 'CCTV in common areas'),

-- Lahore Girls Hostel (2)
(2, 1, TRUE, 0.00, 'Free WiFi'),
(2, 3, TRUE, 0.00, 'Geyser in each room'),
(2, 7, TRUE, 0.00, 'Built-in wardrobe'),
(2, 8, TRUE, 0.00, 'Attached bathrooms'),
(2, 10, TRUE, 2500.00, 'Mess available'),
(2, 13, TRUE, 0.00, 'CCTV all floors'),
(2, 14, TRUE, 0.00, 'Female security guard'),
(2, 16, TRUE, 0.00, 'First aid available'),

-- Central Executive Hostel (3)
(3, 1, TRUE, 0.00, 'High-speed fiber optic'),
(3, 2, TRUE, 0.00, 'Central AC'),
(3, 4, TRUE, 0.00, 'LED TV in lounge'),
(3, 5, TRUE, 0.00, 'Ergonomic study tables'),
(3, 11, TRUE, 0.00, 'Free laundry service'),
(3, 12, TRUE, 0.00, 'Daily housekeeping'),
(3, 13, TRUE, 0.00, '24/7 CCTV monitoring'),
(3, 14, TRUE, 0.00, 'Security guard at entrance'),
(3, 18, TRUE, 0.00, 'Elevator available'),
(3, 19, TRUE, 0.00, 'Generator backup'),

-- University Inn (4)
(4, 1, TRUE, 0.00, 'WiFi included'),
(4, 3, TRUE, 0.00, 'Geyser'),
(4, 7, TRUE, 0.00, 'Wardrobe'),
(4, 10, FALSE, 0.00, 'No mess, kitchen access instead'),
(4, 9, TRUE, 0.00, 'Shared kitchen'),
(4, 12, TRUE, 0.00, 'Weekly cleaning'),

-- Green View Hostel (5)
(5, 1, TRUE, 0.00, 'Free WiFi'),
(5, 3, TRUE, 0.00, 'Solar geyser'),
(5, 5, TRUE, 0.00, 'Study table'),
(5, 11, TRUE, 600.00, 'Laundry service'),
(5, 15, TRUE, 0.00, 'Fire extinguishers installed'),

-- DHA Residency (6)
(6, 1, TRUE, 0.00, 'Free WiFi'),
(6, 2, TRUE, 0.00, 'Central AC'),
(6, 4, TRUE, 0.00, 'Smart TV in each room'),
(6, 5, TRUE, 0.00, 'Premium study desk'),
(6, 8, TRUE, 0.00, 'Attached bathroom'),
(6, 11, TRUE, 0.00, 'Free laundry service'),
(6, 12, TRUE, 0.00, 'Daily housekeeping'),
(6, 13, TRUE, 0.00, 'CCTV surveillance'),
(6, 14, TRUE, 0.00, '24/7 security'),
(6, 19, TRUE, 0.00, 'Generator backup'),

-- Township Boys Hostel (7)
(7, 1, TRUE, 200.00, 'WiFi card available'),
(7, 3, TRUE, 0.00, 'Common geyser'),
(7, 7, TRUE, 0.00, 'Wardrobe'),
(7, 10, TRUE, 2500.00, 'Mess available'),
(7, 13, TRUE, 0.00, 'CCTV at entrance'),

-- Wapda Enclave (8)
(8, 1, TRUE, 0.00, 'WiFi included'),
(8, 3, TRUE, 0.00, 'Geyser'),
(8, 7, TRUE, 0.00, 'Wardrobe'),
(8, 9, TRUE, 0.00, 'Kitchen access'),
(8, 16, TRUE, 0.00, 'First aid kit'),

-- Valencia Heights (9)
(9, 1, TRUE, 0.00, 'Free WiFi'),
(9, 2, TRUE, 1500.00, 'AC optional'),
(9, 5, TRUE, 0.00, 'Study table'),
(9, 8, TRUE, 0.00, 'Attached bathroom'),
(9, 11, TRUE, 0.00, 'Laundry service included'),
(9, 13, TRUE, 0.00, 'CCTV'),
(9, 19, TRUE, 0.00, 'Generator backup'),

-- Bahria View (10)
(10, 1, TRUE, 0.00, 'Free WiFi'),
(10, 2, TRUE, 0.00, 'AC rooms'),
(10, 4, TRUE, 0.00, 'TV in common area'),
(10, 7, TRUE, 0.00, 'Wardrobe'),
(10, 10, TRUE, 2800.00, 'Mess facility'),
(10, 12, TRUE, 0.00, 'Daily cleaning'),
(10, 13, TRUE, 0.00, 'CCTV cameras'),
(10, 14, TRUE, 0.00, 'Security guard'),

-- Johar Town Mens Hostel (11)
(11, 1, TRUE, 0.00, 'Free WiFi'),
(11, 3, TRUE, 0.00, 'Geyser'),
(11, 5, TRUE, 0.00, 'Study table'),
(11, 10, TRUE, 2000.00, 'Mess'),
(11, 13, TRUE, 0.00, 'CCTV'),

-- Gulberg Executive (12)
(12, 1, TRUE, 0.00, 'Free high-speed WiFi'),
(12, 2, TRUE, 0.00, 'Central AC'),
(12, 4, TRUE, 0.00, 'TV in each room'),
(12, 11, TRUE, 0.00, 'Laundry included'),
(12, 12, TRUE, 0.00, 'Daily housekeeping'),
(12, 14, TRUE, 0.00, '24/7 security'),

-- Add more hostel amenities for remaining hostels...
-- (Continuing pattern for all hostels)
(13, 1, TRUE, 0.00, 'Free WiFi'),
(13, 3, TRUE, 0.00, 'Geyser'),
(13, 7, TRUE, 0.00, 'Wardrobe'),
(13, 10, TRUE, 2200.00, 'Mess available'),

(14, 1, TRUE, 0.00, 'Free WiFi'),
(14, 5, TRUE, 0.00, 'Study table'),
(14, 8, TRUE, 0.00, 'Attached bathroom'),
(14, 12, TRUE, 0.00, 'Weekly cleaning'),

(15, 1, TRUE, 0.00, 'Free WiFi'),
(15, 3, TRUE, 0.00, 'Geyser'),
(15, 7, TRUE, 0.00, 'Wardrobe'),
(15, 10, TRUE, 1800.00, 'Mess'),
(15, 13, TRUE, 0.00, 'CCTV'),

(16, 1, TRUE, 100.00, 'WiFi card'),
(16, 3, TRUE, 0.00, 'Common geyser'),
(16, 7, TRUE, 0.00, 'Wardrobe'),
(16, 9, TRUE, 0.00, 'Kitchen access'),

(17, 1, TRUE, 0.00, 'Free WiFi'),
(17, 2, TRUE, 0.00, 'AC rooms'),
(17, 8, TRUE, 0.00, 'Attached bathroom'),
(17, 11, TRUE, 0.00, 'Laundry service'),
(17, 13, TRUE, 0.00, 'CCTV'),
(17, 14, TRUE, 0.00, 'Female security guard'),

(18, 1, TRUE, 0.00, 'Free WiFi'),
(18, 3, TRUE, 0.00, 'Geyser'),
(18, 5, TRUE, 0.00, 'Study table'),
(18, 10, TRUE, 2000.00, 'Mess'),
(18, 13, TRUE, 0.00, 'CCTV'),

(19, 1, TRUE, 0.00, 'Free WiFi'),
(19, 2, TRUE, 0.00, 'AC'),
(19, 4, TRUE, 0.00, 'TV'),
(19, 11, TRUE, 0.00, 'Laundry'),

(20, 1, TRUE, 0.00, 'Free WiFi'),
(20, 3, TRUE, 0.00, 'Geyser'),
(20, 5, TRUE, 0.00, 'Study table'),
(20, 10, TRUE, 1900.00, 'Mess'),

(21, 1, TRUE, 0.00, 'Free WiFi'),
(21, 3, TRUE, 0.00, 'Geyser'),
(21, 7, TRUE, 0.00, 'Wardrobe'),
(21, 8, TRUE, 0.00, 'Attached bathroom'),
(21, 13, TRUE, 0.00, 'CCTV'),

(22, 1, TRUE, 0.00, 'Free WiFi'),
(22, 2, TRUE, 0.00, 'AC'),
(22, 4, TRUE, 0.00, 'TV'),
(22, 11, TRUE, 0.00, 'Laundry'),
(22, 12, TRUE, 0.00, 'Daily cleaning'),
(22, 19, TRUE, 0.00, 'Generator'),

(23, 1, TRUE, 0.00, 'Free WiFi'),
(23, 3, TRUE, 0.00, 'Geyser'),
(23, 10, TRUE, 1700.00, 'Mess'),

(24, 1, TRUE, 0.00, 'Free WiFi'),
(24, 3, TRUE, 0.00, 'Geyser'),
(24, 7, TRUE, 0.00, 'Wardrobe'),
(24, 13, TRUE, 0.00, 'CCTV'),

(25, 1, TRUE, 0.00, 'Free WiFi in common areas'),
(25, 9, TRUE, 0.00, 'Shared kitchen'),
(25, 11, TRUE, 300.00, 'Laundry'),
(25, 12, TRUE, 0.00, 'Weekly cleaning'),
(25, 13, TRUE, 0.00, 'CCTV'),
(25, 15, TRUE, 0.00, 'Fire extinguishers');

-- =====================================================
-- 9. MEAL TYPES (Breakfast, Lunch, Brunch, Dinner)
-- =====================================================
INSERT INTO meal_types (meal_name, meal_time) VALUES
('Breakfast', '08:00:00'),
('Lunch', '13:00:00'),
('Brunch', '11:00:00'),
('Dinner', '20:00:00');

-- =====================================================
-- 10. HOSTEL FOOD OPTIONS (meal offerings at hostels)
-- =====================================================
INSERT INTO hostel_food (hostel_id, meal_type_id, food_category, is_included_in_rent, monthly_cost, description) VALUES
-- Student Haven Hostel (1)
(1, 1, 'both', FALSE, 2500, 'Breakfast - eggs, paratha, tea'),
(1, 2, 'both', FALSE, 3500, 'Lunch - daal, sabzi, roti, rice'),
(1, 4, 'both', FALSE, 3500, 'Dinner - chicken/veggie curry with roti'),

-- Lahore Girls Hostel (2)
(2, 1, 'vegetarian', TRUE, 0, 'Breakfast included in rent'),
(2, 2, 'vegetarian', TRUE, 0, 'Lunch included'),
(2, 4, 'vegetarian', TRUE, 0, 'Dinner included'),

-- Central Executive Hostel (3)
(3, 1, 'both', TRUE, 0, 'Continental breakfast'),
(3, 2, 'both', TRUE, 0, 'Executive lunch'),
(3, 4, 'both', TRUE, 0, 'Premium dinner'),
(3, 3, 'both', TRUE, 0, 'Weekend brunch'),

-- University Inn (4)
(4, 1, 'both', FALSE, 2000, 'Simple breakfast'),
(4, 2, 'both', FALSE, 3000, 'Lunch'),
(4, 4, 'both', FALSE, 3000, 'Dinner'),

-- Green View Hostel (5)
(5, 1, 'vegetarian', FALSE, 1800, 'Vegetarian breakfast'),
(5, 2, 'vegetarian', FALSE, 2800, 'Vegetarian lunch'),
(5, 4, 'vegetarian', FALSE, 2800, 'Vegetarian dinner'),

-- DHA Residency (6)
(6, 1, 'both', TRUE, 0, 'Breakfast included'),
(6, 2, 'both', TRUE, 0, 'Lunch included'),
(6, 4, 'both', TRUE, 0, 'Dinner included'),

-- Township Boys Hostel (7)
(7, 1, 'both', FALSE, 1500, 'Breakfast'),
(7, 2, 'both', FALSE, 2500, 'Lunch'),
(7, 4, 'both', FALSE, 2500, 'Dinner'),

-- Wapda Enclave (8)
(8, 1, 'vegetarian', FALSE, 1600, 'Breakfast'),
(8, 2, 'vegetarian', FALSE, 2600, 'Lunch'),

-- Valencia Heights (9)
(9, 1, 'both', FALSE, 2200, 'Breakfast'),
(9, 4, 'both', FALSE, 3200, 'Dinner only'),

-- Bahria View (10)
(10, 1, 'both', TRUE, 0, 'Breakfast'),
(10, 2, 'both', TRUE, 0, 'Lunch'),
(10, 4, 'both', TRUE, 0, 'Dinner'),

-- Johar Town Mens Hostel (11)
(11, 2, 'both', FALSE, 2800, 'Lunch only'),
(11, 4, 'both', FALSE, 2800, 'Dinner only'),

-- Gulberg Executive (12)
(12, 1, 'both', TRUE, 0, 'Breakfast'),
(12, 3, 'both', TRUE, 0, 'Brunch on weekends'),

-- Cantt Boarding House (13)
(13, 1, 'both', FALSE, 1900, 'Breakfast'),
(13, 4, 'both', FALSE, 2900, 'Dinner'),

-- Model Town Residency (14)
(14, 2, 'both', TRUE, 0, 'Lunch included'),

-- Iqbal Town Hostel (15)
(15, 1, 'both', FALSE, 1500, 'Breakfast'),
(15, 4, 'both', FALSE, 2500, 'Dinner'),

-- Lahore Hostel City (16)
(16, 1, 'both', FALSE, 1400, 'Breakfast'),
(16, 2, 'both', FALSE, 2400, 'Lunch'),
(16, 4, 'both', FALSE, 2400, 'Dinner'),

-- DHA Phase 6 Girls (17)
(17, 1, 'vegetarian', TRUE, 0, 'Breakfast'),
(17, 2, 'vegetarian', TRUE, 0, 'Lunch'),
(17, 4, 'vegetarian', TRUE, 0, 'Dinner'),

-- Punjab University Hostel (18)
(18, 1, 'both', FALSE, 1500, 'Breakfast'),
(18, 4, 'both', FALSE, 2500, 'Dinner'),

-- Executive Inn (19)
(19, 1, 'both', TRUE, 0, 'Breakfast'),
(19, 2, 'both', TRUE, 0, 'Lunch'),

-- Students Paradise (20)
(20, 4, 'both', FALSE, 2600, 'Dinner only'),

-- Valencia Girls Hostel (21)
(21, 1, 'vegetarian', FALSE, 1800, 'Breakfast'),
(21, 4, 'vegetarian', FALSE, 2800, 'Dinner'),

-- Bahria Town Executive (22)
(22, 1, 'both', TRUE, 0, 'Breakfast'),
(22, 2, 'both', TRUE, 0, 'Lunch'),
(22, 4, 'both', TRUE, 0, 'Dinner'),

-- Wapda Town Mens (23)
(23, 4, 'both', FALSE, 2400, 'Dinner only'),

-- Township Girls Hostel (24)
(24, 1, 'vegetarian', TRUE, 0, 'Breakfast'),
(24, 4, 'vegetarian', TRUE, 0, 'Dinner'),

-- Lahore Backpackers (25)
(25, 1, 'both', FALSE, 1000, 'Simple breakfast'),
(25, 3, 'both', FALSE, 1500, 'Brunch');

-- =====================================================
-- 11. NEARBY CATEGORIES
-- =====================================================
INSERT INTO nearby_categories (category_name, icon) VALUES
('Restaurant', 'restaurant-icon'),
('Hospital', 'hospital-icon'),
('Metro Station', 'metro-icon'),
('Bus Stop', 'bus-icon'),
('Supermarket', 'supermarket-icon'),
('ATM', 'atm-icon'),
('Pharmacy', 'pharmacy-icon'),
('Park', 'park-icon'),
('University', 'university-icon'),
('College', 'college-icon');

-- =====================================================
-- 12. NEARBY PLACES (locations near hostels)
-- =====================================================
INSERT INTO nearby_places (hostel_id, place_name, category_id, area_id, distance_km, estimated_time_minutes, walking_distance, landmark) VALUES
-- Student Haven Hostel (1)
(1, 'Emporium Mall', 5, 1, 1.2, 15, TRUE, TRUE),
(1, 'LUMS University', 9, 2, 2.5, 25, FALSE, TRUE),
(1, 'Services Hospital', 2, 1, 1.8, 20, TRUE, FALSE),
(1, 'Johar Town Bus Stop', 4, 1, 0.3, 4, TRUE, FALSE),
(1, 'UBQ Restaurant', 1, 1, 0.5, 6, TRUE, FALSE),

-- Lahore Girls Hostel (2)
(2, 'DHA Phase 5 Market', 5, 2, 0.4, 5, TRUE, TRUE),
(2, 'Fatima Memorial Hospital', 2, 2, 1.5, 18, FALSE, FALSE),
(2, 'Howdy Restaurant', 1, 2, 0.3, 4, TRUE, FALSE),
(2, 'DHA Phase 5 Metro', 3, 2, 1.2, 5, FALSE, FALSE),
(2, 'LUMS', 9, 2, 2.0, 20, FALSE, FALSE),

-- Central Executive Hostel (3)
(3, 'MM Alam Road', 1, 3, 0.5, 6, TRUE, TRUE),
(3, 'Gulberg Hospital', 2, 3, 0.8, 10, TRUE, FALSE),
(3, 'Gulberg Metro Station', 3, 3, 0.9, 8, FALSE, FALSE),
(3, 'Cosa Nostra', 1, 3, 0.4, 5, TRUE, FALSE),
(3, 'Packages Mall', 5, 3, 2.0, 12, FALSE, FALSE),

-- University Inn (4)
(4, 'Punjab University', 9, 4, 0.7, 8, TRUE, TRUE),
(4, 'Model Town Park', 8, 4, 1.0, 12, TRUE, TRUE),
(4, 'HBL ATM', 6, 4, 0.2, 2, TRUE, FALSE),
(4, 'Bilal Hospital', 2, 4, 1.2, 15, TRUE, FALSE),

-- Green View Hostel (5)
(5, 'Iqbal Town Park', 8, 5, 0.6, 7, TRUE, TRUE),
(5, 'ChenOne Restaurant', 1, 5, 0.8, 10, TRUE, FALSE),
(5, 'Al Razi Healthcare', 2, 5, 1.1, 13, TRUE, FALSE),
(5, 'Iqbal Town Bus Terminal', 4, 5, 1.5, 8, FALSE, FALSE),

-- DHA Residency (6)
(6, 'Giga Mall', 5, 2, 1.8, 15, FALSE, TRUE),
(6, 'DHA Golf Club', 8, 2, 2.0, 20, FALSE, TRUE),
(6, 'Butt Karahi', 1, 2, 0.5, 6, TRUE, FALSE),
(6, 'DHA Phase 6 Park', 8, 2, 0.3, 4, TRUE, FALSE),

-- Township Boys Hostel (7)
(7, 'Township Market', 5, 6, 0.4, 5, TRUE, TRUE),
(7, 'Jinnah Hospital', 2, 6, 2.2, 15, FALSE, TRUE),
(7, 'Babu Bhai Restaurant', 1, 6, 0.3, 4, TRUE, FALSE),
(7, 'Township Metro', 3, 6, 2.5, 10, FALSE, FALSE),

-- Wapda Enclave (8)
(8, 'Wapda Town Park', 8, 8, 0.5, 6, TRUE, TRUE),
(8, 'Imtiaz Supermarket', 5, 8, 1.2, 15, TRUE, FALSE),
(8, 'Wapda Hospital', 2, 8, 0.7, 8, TRUE, FALSE),

-- Valencia Heights (9)
(9, 'Valencia Market', 5, 9, 0.3, 4, TRUE, TRUE),
(9, 'OPTP Hospital', 2, 9, 1.0, 12, TRUE, FALSE),
(9, 'Alfatah Supermarket', 5, 9, 0.8, 10, TRUE, FALSE),

-- Bahria View (10)
(10, 'Bahria Orchard', 8, 10, 0.5, 6, TRUE, TRUE),
(10, 'Jalal Sons', 5, 10, 0.7, 8, TRUE, FALSE),
(10, 'Ghousia Hospital', 2, 10, 1.5, 18, FALSE, FALSE),

-- Johar Town Mens Hostel (11)
(11, 'Emporium Mall', 5, 1, 0.8, 10, TRUE, TRUE),
(11, 'Bundu Khan', 1, 1, 0.4, 5, TRUE, FALSE),
(11, 'Johar Town Police Station', 2, 1, 1.2, 15, TRUE, FALSE),

-- Gulberg Executive (12)
(12, 'Cafe Aylanto', 1, 3, 0.2, 3, TRUE, TRUE),
(12, 'Gulberg Main Market', 5, 3, 0.5, 6, TRUE, TRUE),

-- Cantt Boarding House (13)
(13, 'Lahore Cantt Station', 4, 7, 1.5, 10, FALSE, TRUE),
(13, 'Fortress Stadium', 8, 7, 1.8, 15, FALSE, TRUE),

-- Model Town Residency (14)
(14, 'Model Town Park', 8, 4, 0.6, 7, TRUE, TRUE),
(14, 'Ravi Urban Restaurant', 1, 4, 0.4, 5, TRUE, FALSE),

-- Iqbal Town Hostel (15)
(15, 'Iqbal Town Main Market', 5, 5, 0.3, 4, TRUE, TRUE),
(15, 'Rahat Bakery', 1, 5, 0.2, 2, TRUE, FALSE),

-- Lahore Hostel City (16)
(16, 'Fortress Stadium', 8, 7, 1.0, 12, TRUE, TRUE),
(16, 'Askari Hospital', 2, 7, 0.8, 10, TRUE, FALSE),

-- DHA Phase 6 Girls (17)
(17, 'Y Block Market', 5, 2, 0.5, 6, TRUE, TRUE),
(17, 'Secret Curry', 1, 2, 0.3, 4, TRUE, FALSE),

-- Punjab University Hostel (18)
(18, 'PU New Campus', 9, 1, 0.2, 3, TRUE, TRUE),
(18, 'Quaid-e-Azam Library', 8, 1, 0.6, 7, TRUE, FALSE),

-- Executive Inn (19)
(19, 'Liberty Market', 5, 3, 0.4, 5, TRUE, TRUE),
(19, 'Freddy’s Cafe', 1, 3, 0.2, 2, TRUE, FALSE),

-- Students Paradise (20)
(20, 'Coke Studio Cafe', 1, 1, 0.7, 8, TRUE, FALSE),
(20, 'Superior College', 10, 1, 0.5, 6, TRUE, TRUE),

-- Valencia Girls Hostel (21)
(21, 'Valencia Food Street', 1, 9, 0.3, 4, TRUE, TRUE),
(21, 'Hashim Pharma', 7, 9, 0.2, 2, TRUE, FALSE),

-- Bahria Town Executive (22)
(22, 'Bahria Grand Mosque', 8, 10, 0.8, 10, TRUE, TRUE),
(22, 'Meezan Bank ATM', 6, 10, 0.4, 5, TRUE, FALSE),

-- Wapda Town Mens (23)
(23, 'Wapda Town Mosque', 8, 8, 0.2, 2, TRUE, TRUE),
(23, 'Utility Store', 5, 8, 0.3, 4, TRUE, FALSE),

-- Township Girls Hostel (24)
(24, 'Township Girls College', 10, 6, 0.4, 5, TRUE, TRUE),
(24, 'Dania Restaurant', 1, 6, 0.5, 6, TRUE, FALSE),

-- Lahore Backpackers (25)
(25, 'Anarkali Bazaar', 5, 5, 1.2, 15, TRUE, TRUE),
(25, 'Lahore Museum', 8, 5, 0.8, 10, TRUE, TRUE),
(25, 'PC Hotel', 1, 5, 0.6, 7, TRUE, FALSE);

-- =====================================================
-- 13. TRANSPORT ROUTES
-- =====================================================
INSERT INTO transport_routes (route_name, route_number, transport_type, city_id) VALUES
('Metro Orange Line', 'M1', 'metro', 1),
('Metro Blue Line', 'M2', 'metro', 1),
('Ferozepur Road Route', 'F1', 'bus', 1),
('Canal Bank Route', 'C1', 'bus', 1),
('MM Alam to Thokar', 'G1', 'bus', 1),
('DHA to Anarkali', 'D1', 'bus', 1),
('Johar Town to Railway Station', 'J1', 'bus', 1),
('Green Line Bus', 'G2', 'bus', 1),
('Lahore-Islamabad Motorway', 'M1', 'bus', 1),
('Wapda Town to Airport', 'W1', 'bus', 1),
('Gulberg to Cantonment', 'GC1', 'bus', 1),
('Metro Feeder Route', 'MF1', 'bus', 1),
('Samjhota Express', 'SE1', 'train', 1),
('Allama Iqbal Express', 'AI1', 'train', 1),
('Ravi Urban Route', 'R1', 'bus', 1),
('Auto Stand Route', 'A1', 'auto', 1);

-- =====================================================
-- 14. HOSTEL TRANSPORT CONNECTIONS
-- =====================================================
INSERT INTO hostel_transport (hostel_id, route_id, stop_name, distance_to_stop_km, frequency_minutes, first_ride, last_ride) VALUES
(1, 1, 'Johar Town Metro Station', 1.2, 10, '06:00', '22:00'),
(1, 2, 'Johar Town Metro', 1.3, 12, '06:30', '23:00'),
(1, 4, 'Canal Bank Stop', 0.5, 15, '06:00', '22:30'),

(2, 5, 'DHA Phase 5 Stop', 0.3, 10, '06:00', '23:00'),
(2, 6, 'DHA Main Boulevard', 0.4, 12, '06:15', '22:45'),

(3, 10, 'Gulberg Main Market', 0.2, 8, '06:00', '23:30'),
(3, 3, 'Ferozepur Road', 0.6, 10, '05:45', '23:00'),

(4, 4, 'Model Town Canal Stop', 0.7, 15, '06:00', '22:00'),
(4, 8, 'Green Line Model Town', 0.8, 12, '06:30', '22:30'),

(5, 11, 'Iqbal Town Stop', 0.4, 10, '06:00', '23:00'),
(5, 3, 'Ferozepur Road', 0.9, 10, '05:45', '23:00'),

(6, 2, 'DHA Metro Station', 1.5, 10, '06:30', '22:00'),
(6, 5, 'DHA Bus Stop', 0.5, 12, '06:15', '22:45'),

(7, 12, 'Township Feeder Stop', 0.3, 8, '06:00', '22:30'),
(7, 4, 'Township Canal Stop', 0.8, 15, '06:15', '22:00'),

(8, 14, 'Wapda Town Stop', 0.4, 20, '07:00', '21:00'),

(9, 15, 'Valencia Stop', 0.5, 15, '06:30', '22:00'),

(10, 9, 'Bahria Town Stop', 0.6, 30, '07:00', '21:30'),

(11, 1, 'Johar Town Metro', 0.9, 10, '06:00', '22:00'),
(11, 3, 'Ferozepur Road', 0.7, 10, '05:45', '23:00'),

(12, 10, 'Gulberg Stop', 0.3, 8, '06:00', '23:30'),

(13, 13, 'Cantt Railway Station', 1.8, 60, '05:00', '23:00'),
(13, 7, 'Cantt Bus Stop', 1.2, 15, '06:00', '22:30'),

(14, 4, 'Model Town Canal', 0.6, 15, '06:00', '22:00'),

(15, 11, 'Iqbal Town', 0.3, 10, '06:00', '23:00'),

(16, 7, 'Cantt Bus Stop', 1.0, 15, '06:00', '22:30'),

(17, 5, 'DHA Phase 6', 0.4, 12, '06:15', '22:45'),

(18, 4, 'PU Canal Stop', 0.5, 15, '06:00', '22:00'),

(19, 10, 'Liberty Stop', 0.4, 8, '06:00', '23:30'),

(20, 3, 'Ferozepur Road', 0.6, 10, '05:45', '23:00'),

(21, 15, 'Valencia Stop', 0.3, 15, '06:30', '22:00'),

(22, 9, 'Bahria Town', 0.7, 30, '07:00', '21:30'),

(23, 14, 'Wapda Town', 0.2, 20, '07:00', '21:00'),

(24, 12, 'Township Stop', 0.5, 8, '06:00', '22:30'),

(25, 8, 'Mall Road Stop', 0.6, 10, '06:30', '22:30');

-- =====================================================
-- 15. USERS (30 users)
-- =====================================================
INSERT INTO users (first_name, last_name, email, phone, password_hash, user_type, institution_id, verified, last_login) VALUES
('Ali', 'Raza', 'ali.raza@email.com', '03001234501', 'hash123', 'student', 1, TRUE, '2025-02-20 10:30:00'),
('Sara', 'Khan', 'sara.khan@email.com', '03001234502', 'hash123', 'student', 2, TRUE, '2025-02-21 14:15:00'),
('Bilal', 'Ahmed', 'bilal.ahmed@email.com', '03001234503', 'hash123', 'student', 4, TRUE, '2025-02-19 09:45:00'),
('Ayesha', 'Malik', 'ayesha.malik@email.com', '03001234504', 'hash123', 'student', 3, TRUE, '2025-02-22 11:20:00'),
('Hamza', 'Ali', 'hamza.ali@email.com', '03001234505', 'hash123', 'professional', 15, TRUE, '2025-02-18 16:30:00'),
('Zara', 'Tariq', 'zara.tariq@email.com', '03001234506', 'hash123', 'student', 5, TRUE, '2025-02-20 13:10:00'),
('Omar', 'Farooq', 'omar.farooq@email.com', '03001234507', 'hash123', 'owner', NULL, TRUE, '2025-02-21 08:45:00'),
('Fatima', 'Zafar', 'fatima.zafar@email.com', '03001234508', 'hash123', 'student', 7, TRUE, '2025-02-22 15:30:00'),
('Usman', 'Chaudhry', 'usman.c@email.com', '03001234509', 'hash123', 'owner', NULL, TRUE, '2025-02-19 12:00:00'),
('Hina', 'Akhtar', 'hina.akhtar@email.com', '03001234510', 'hash123', 'admin', NULL, TRUE, '2025-02-22 09:00:00'),
('Ahmed', 'Hassan', 'ahmed.h@email.com', '03001234511', 'hash123', 'student', 2, TRUE, '2025-02-20 17:45:00'),
('Sadia', 'Naz', 'sadia.naz@email.com', '03001234512', 'hash123', 'student', 6, TRUE, '2025-02-21 10:20:00'),
('Rizwan', 'Akhtar', 'rizwan.a@email.com', '03001234513', 'hash123', 'professional', 15, TRUE, '2025-02-18 14:30:00'),
('Nida', 'Yasmeen', 'nida.y@email.com', '03001234514', 'hash123', 'student', 9, TRUE, '2025-02-22 12:15:00'),
('Shahid', 'Afridi', 'shahid.a@email.com', '03001234515', 'hash123', 'owner', NULL, TRUE, '2025-02-19 11:30:00'),
('Kiran', 'Tariq', 'kiran.t@email.com', '03001234516', 'hash123', 'student', 10, TRUE, '2025-02-20 09:50:00'),
('Faisal', 'Mehmood', 'faisal.m@email.com', '03001234517', 'hash123', 'professional', 15, TRUE, '2025-02-21 16:40:00'),
('Samina', 'Gul', 'samina.g@email.com', '03001234518', 'hash123', 'student', 11, TRUE, '2025-02-22 13:25:00'),
('Waseem', 'Abbas', 'waseem.a@email.com', '03001234519', 'hash123', 'owner', NULL, TRUE, '2025-02-18 10:10:00'),
('Rabia', 'Anjum', 'rabia.a@email.com', '03001234520', 'hash123', 'student', 12, TRUE, '2025-02-19 15:20:00'),
('Tariq', 'Mehmood', 'tariq.m@email.com', '03001234521', 'hash123', 'student', 13, TRUE, '2025-02-20 11:40:00'),
('Saima', 'Kausar', 'saima.k@email.com', '03001234522', 'hash123', 'professional', 15, TRUE, '2025-02-21 08:30:00'),
('Imran', 'Khan', 'imran.k@email.com', '03001234523', 'hash123', 'student', 14, TRUE, '2025-02-22 14:50:00'),
('Nadia', 'Hussain', 'nadia.h@email.com', '03001234524', 'hash123', 'student', 1, TRUE, '2025-02-18 13:15:00'),
('Kamran', 'Akhtar', 'kamran.a@email.com', '03001234525', 'hash123', 'owner', NULL, TRUE, '2025-02-19 09:30:00'),
('Shazia', 'Bano', 'shazia.b@email.com', '03001234526', 'hash123', 'student', 3, TRUE, '2025-02-20 16:20:00'),
('Zeeshan', 'Ali', 'zeeshan.a@email.com', '03001234527', 'hash123', 'professional', 15, TRUE, '2025-02-21 12:10:00'),
('Fariha', 'Riaz', 'fariha.r@email.com', '03001234528', 'hash123', 'student', 5, TRUE, '2025-02-22 10:45:00'),
('Asif', 'Mehmood', 'asif.m@email.com', '03001234529', 'hash123', 'student', 7, TRUE, '2025-02-19 17:30:00'),
('Maria', 'Khan', 'maria.k@email.com', '03001234530', 'hash123', 'admin', NULL, TRUE, '2025-02-20 08:15:00');

-- =====================================================
-- 16. BOOKINGS (30 bookings)
-- =====================================================
INSERT INTO bookings (booking_reference, user_id, hostel_room_id, booking_date, check_in_date, check_out_date, status, total_amount, advance_paid, payment_status, special_requests) VALUES
('HST20250001', 1, 1, '2025-01-15 10:30:00', '2025-02-01', '2025-05-31', 'confirmed', 48000, 10000, 'partial', 'Need quiet room, top floor'),
('HST20250002', 2, 9, '2025-01-16 14:20:00', '2025-02-05', '2025-06-05', 'confirmed', 75000, 15000, 'partial', 'Vegetarian meals only'),
('HST20250003', 3, 16, '2025-01-18 09:15:00', '2025-02-10', '2025-08-10', 'confirmed', 120000, 25000, 'partial', 'Early check-in requested'),
('HST20250004', 4, 21, '2025-01-20 11:45:00', '2025-02-15', '2025-04-15', 'confirmed', 25500, 5000, 'partial', 'Need study table'),
('HST20250005', 5, 25, '2025-01-22 16:30:00', '2025-02-20', '2025-12-20', 'confirmed', 180000, 30000, 'partial', 'AC room required'),
('HST20250006', 6, 28, '2025-01-23 13:10:00', '2025-03-01', '2025-06-01', 'confirmed', 21000, 5000, 'partial', 'Near university'),
('HST20250007', 7, 30, '2025-01-25 08:50:00', '2025-02-25', '2025-08-25', 'confirmed', 30000, 8000, 'partial', 'Non-vegetarian meals'),
('HST20250008', 8, 34, '2025-01-26 15:40:00', '2025-03-10', '2025-09-10', 'pending', 54000, 0, 'pending', NULL),
('HST20250009', 9, 37, '2025-01-28 12:20:00', '2025-04-01', '2025-10-01', 'confirmed', 84000, 15000, 'partial', 'Parking needed'),
('HST20250010', 10, 40, '2025-01-30 09:30:00', '2025-02-15', '2025-08-15', 'completed', 108000, 108000, 'completed', NULL),
('HST20250011', 11, 3, '2025-02-01 14:15:00', '2025-03-01', '2025-06-01', 'confirmed', 24000, 8000, 'partial', 'Double room sharing'),
('HST20250012', 12, 10, '2025-02-02 11:30:00', '2025-03-15', '2025-07-15', 'confirmed', 40000, 10000, 'partial', 'Window room'),
('HST20250013', 13, 17, '2025-02-03 16:45:00', '2025-04-01', '2025-10-01', 'cancelled', 90000, 0, 'pending', 'Cancelled due to date change'),
('HST20250014', 14, 22, '2025-02-04 10:20:00', '2025-03-01', '2025-05-31', 'confirmed', 19500, 4000, 'partial', 'Female only floor'),
('HST20250015', 15, 26, '2025-02-05 13:50:00', '2025-03-10', '2025-06-10', 'confirmed', 45000, 10000, 'partial', 'Near market'),
('HST20250016', 16, 29, '2025-02-06 09:10:00', '2025-04-01', '2025-07-01', 'pending', 27000, 0, 'pending', NULL),
('HST20250017', 17, 32, '2025-02-07 15:30:00', '2025-03-15', '2025-08-15', 'confirmed', 35000, 7000, 'partial', 'Laundry service'),
('HST20250018', 18, 35, '2025-02-08 12:40:00', '2025-05-01', '2025-08-01', 'confirmed', 39000, 8000, 'partial', 'Quiet environment'),
('HST20250019', 19, 38, '2025-02-09 08:25:00', '2025-04-10', '2025-07-10', 'confirmed', 42000, 10000, 'partial', 'Mess food'),
('HST20250020', 20, 41, '2025-02-10 14:50:00', '2025-03-20', '2025-06-20', 'completed', 21000, 21000, 'completed', 'Good experience'),
('HST20250021', 21, 4, '2025-02-11 11:15:00', '2025-04-01', '2025-07-01', 'confirmed', 24000, 5000, 'partial', 'Second floor'),
('HST20250022', 22, 11, '2025-02-12 16:20:00', '2025-05-01', '2025-08-01', 'pending', 30000, 0, 'pending', 'Need AC'),
('HST20250023', 23, 18, '2025-02-13 09:45:00', '2025-04-15', '2025-07-15', 'confirmed', 45000, 10000, 'partial', 'Near university'),
('HST20250024', 24, 23, '2025-02-14 13:30:00', '2025-05-10', '2025-08-10', 'confirmed', 21000, 5000, 'partial', 'Vegetarian'),
('HST20250025', 25, 27, '2025-02-15 10:50:00', '2025-04-20', '2025-07-20', 'cancelled', 22500, 0, 'pending', 'Changed city'),
('HST20250026', 26, 31, '2025-02-16 15:10:00', '2025-06-01', '2025-09-01', 'confirmed', 27000, 6000, 'partial', 'Parking'),
('HST20250027', 27, 33, '2025-02-17 12:00:00', '2025-05-15', '2025-08-15', 'confirmed', 25500, 5000, 'partial', 'Early morning check-in'),
('HST20250028', 28, 36, '2025-02-18 08:40:00', '2025-06-10', '2025-09-10', 'pending', 27000, 0, 'pending', NULL),
('HST20250029', 29, 39, '2025-02-19 14:30:00', '2025-05-20', '2025-08-20', 'confirmed', 36000, 8000, 'partial', 'Female only'),
('HST20250030', 30, 42, '2025-02-20 11:55:00', '2025-07-01', '2025-10-01', 'confirmed', 25500, 5000, 'partial', 'Corner room');

-- =====================================================
-- 17. REVIEWS (12 reviews)
-- =====================================================
INSERT INTO reviews (user_id, hostel_id, booking_id, rating, cleanliness_rating, food_rating, safety_rating, location_rating, comment, stay_start_date, stay_end_date, helpful_count, created_at) VALUES
(1, 1, 1, 4.5, 5, 4, 5, 4, 'Great hostel, clean rooms and friendly staff. WiFi works well.', '2025-02-01', '2025-05-31', 12, '2025-06-05 14:30:00'),
(2, 2, 2, 4.8, 5, 5, 5, 4, 'Best girls hostel in DHA. Very safe and food is excellent.', '2025-02-05', '2025-06-05', 8, '2025-06-10 11:20:00'),
(3, 3, 3, 4.2, 4, 3, 5, 5, 'Good location but food could be better. Rooms are spacious.', '2025-02-10', '2025-08-10', 5, '2025-08-15 16:45:00'),
(4, 4, 4, 4.0, 4, 4, 3, 5, 'Near university which is great. Security needs improvement.', '2025-02-15', '2025-04-15', 3, '2025-04-20 10:30:00'),
(5, 6, 5, 5.0, 5, 5, 5, 5, 'Luxury living! Worth every penny. Highly recommended.', '2025-02-20', '2025-12-20', 15, '2025-12-25 13:15:00'),
(6, 7, 6, 3.8, 4, 3, 4, 4, 'Budget friendly but basic amenities. Good for students.', '2025-03-01', '2025-06-01', 4, '2025-06-05 09:30:00'),
(7, 8, 7, 4.3, 4, 4, 5, 4, 'Clean and secure. Warden is very helpful.', '2025-02-25', '2025-08-25', 6, '2025-08-28 15:20:00'),
(8, 10, 8, 4.6, 5, 4, 5, 4, 'Beautiful view from rooms. Close to market.', '2025-03-10', '2025-09-10', 7, '2025-09-15 12:40:00'),
(9, 11, 9, 4.1, 4, 4, 4, 4, 'Good value for money. Recommended for boys.', '2025-04-01', '2025-10-01', 3, '2025-10-05 11:10:00'),
(10, 15, 10, 4.7, 5, 5, 4, 5, 'Very satisfied with my stay. Will come again.', '2025-02-15', '2025-08-15', 9, '2025-08-20 14:50:00'),
(11, 1, 11, 4.4, 4, 4, 5, 4, 'Good hostel. Management responsive.', '2025-03-01', '2025-06-01', 4, '2025-06-05 16:30:00'),
(12, 3, 12, 4.2, 4, 4, 4, 5, 'Located in good area. Rooms are clean.', '2025-03-15', '2025-07-15', 2, '2025-07-20 13:10:00'),
(14, 4, 14, 3.9, 4, 3, 4, 4, 'Average experience. Food could improve.', '2025-03-01', '2025-05-31', 1, '2025-06-05 10:15:00'),
(15, 5, 15, 4.0, 4, 4, 3, 4, 'Decent hostel. Location is convenient.', '2025-03-10', '2025-06-10', 3, '2025-06-15 12:20:00'),
(20, 17, 20, 4.6, 5, 4, 5, 4, 'Very safe for girls. Recommended.', '2025-03-20', '2025-06-20', 6, '2025-06-25 09:45:00');

-- =====================================================
-- 18. HOSTEL PHOTOS (50 photos)
-- =====================================================
INSERT INTO hostel_photos (hostel_id, photo_url, photo_type, caption, is_primary, uploaded_at) VALUES
(1, '/images/student_haven_exterior.jpg', 'exterior', 'Main building view', TRUE, '2025-01-10 09:00:00'),
(1, '/images/student_haven_room1.jpg', 'room', 'Single room interior', FALSE, '2025-01-10 09:05:00'),
(1, '/images/student_haven_dining.jpg', 'dining', 'Mess area', FALSE, '2025-01-10 09:10:00'),
(1, '/images/student_haven_common.jpg', 'common_area', 'Lounge area', FALSE, '2025-01-10 09:15:00'),
(1, '/images/student_haven_bathroom.jpg', 'bathroom', 'Attached bathroom', FALSE, '2025-01-10 09:20:00'),

(2, '/images/lahore_girls_exterior.jpg', 'exterior', 'Front view', TRUE, '2025-01-11 10:30:00'),
(2, '/images/lahore_girls_room.jpg', 'room', 'Double room', FALSE, '2025-01-11 10:35:00'),
(2, '/images/lahore_girls_common.jpg', 'common_area', 'Common room', FALSE, '2025-01-11 10:40:00'),
(2, '/images/lahore_girls_kitchen.jpg', 'dining', 'Kitchen', FALSE, '2025-01-11 10:45:00'),

(3, '/images/central_executive_exterior.jpg', 'exterior', 'Building exterior', TRUE, '2025-01-12 11:00:00'),
(3, '/images/central_executive_room.jpg', 'room', 'Executive single room', FALSE, '2025-01-12 11:05:00'),
(3, '/images/central_executive_lounge.jpg', 'common_area', 'Executive lounge', FALSE, '2025-01-12 11:10:00'),
(3, '/images/central_executive_dining.jpg', 'dining', 'Dining hall', FALSE, '2025-01-12 11:15:00'),

(4, '/images/university_inn_exterior.jpg', 'exterior', 'Front facade', TRUE, '2025-01-13 09:30:00'),
(4, '/images/university_inn_room.jpg', 'room', 'Standard room', FALSE, '2025-01-13 09:35:00'),
(4, '/images/university_inn_study.jpg', 'common_area', 'Study area', FALSE, '2025-01-13 09:40:00'),

(5, '/images/green_view_exterior.jpg', 'exterior', 'Green View building', TRUE, '2025-01-14 14:00:00'),
(5, '/images/green_view_room.jpg', 'room', 'Eco-friendly room', FALSE, '2025-01-14 14:05:00'),
(5, '/images/green_view_garden.jpg', 'common_area', 'Garden area', FALSE, '2025-01-14 14:10:00'),

(6, '/images/dha_residency_exterior.jpg', 'exterior', 'DHA Residency building', TRUE, '2025-01-15 13:20:00'),
(6, '/images/dha_residency_room.jpg', 'room', 'Luxury room', FALSE, '2025-01-15 13:25:00'),
(6, '/images/dha_residency_lobby.jpg', 'common_area', 'Lobby area', FALSE, '2025-01-15 13:30:00'),
(6, '/images/dha_residency_dining.jpg', 'dining', 'Dining area', FALSE, '2025-01-15 13:35:00'),

(7, '/images/township_boys_exterior.jpg', 'exterior', 'Township Boys Hostel', TRUE, '2025-01-16 10:15:00'),
(7, '/images/township_boys_room.jpg', 'room', 'Triple sharing room', FALSE, '2025-01-16 10:20:00'),

(8, '/images/wapda_enclave_exterior.jpg', 'exterior', 'Wapda Enclave', TRUE, '2025-01-17 11:45:00'),
(8, '/images/wapda_enclave_room.jpg', 'room', 'Girls room', FALSE, '2025-01-17 11:50:00'),

(9, '/images/valencia_heights_exterior.jpg', 'exterior', 'Valencia Heights', TRUE, '2025-01-18 12:30:00'),
(9, '/images/valencia_heights_room.jpg', 'room', 'Spacious room', FALSE, '2025-01-18 12:35:00'),

(10, '/images/bahria_view_exterior.jpg', 'exterior', 'Bahria View', TRUE, '2025-01-19 15:10:00'),
(10, '/images/bahria_view_room.jpg', 'room', 'Room with view', FALSE, '2025-01-19 15:15:00'),
(10, '/images/bahria_view_common.jpg', 'common_area', 'Common area', FALSE, '2025-01-19 15:20:00'),

(11, '/images/johar_town_mens_exterior.jpg', 'exterior', 'Johar Town Mens', TRUE, '2025-01-20 09:45:00'),
(11, '/images/johar_town_mens_room.jpg', 'room', 'Single room', FALSE, '2025-01-20 09:50:00'),

(12, '/images/gulberg_executive_exterior.jpg', 'exterior', 'Gulberg Executive', TRUE, '2025-01-21 14:30:00'),
(12, '/images/gulberg_executive_room.jpg', 'room', 'Executive room', FALSE, '2025-01-21 14:35:00'),

(13, '/images/cantt_boarding_exterior.jpg', 'exterior', 'Cantt Boarding House', TRUE, '2025-01-22 11:20:00'),

(14, '/images/model_town_residency_exterior.jpg', 'exterior', 'Model Town Residency', TRUE, '2025-01-23 10:00:00'),
(14, '/images/model_town_residency_room.jpg', 'room', 'Furnished room', FALSE, '2025-01-23 10:05:00'),

(15, '/images/iqbal_town_hostel_exterior.jpg', 'exterior', 'Iqbal Town Hostel', TRUE, '2025-01-24 13:15:00'),

(16, '/images/lahore_hostel_city_exterior.jpg', 'exterior', 'Lahore Hostel City', TRUE, '2025-01-25 16:20:00'),
(16, '/images/lahore_hostel_city_dorm.jpg', 'room', 'Dormitory', FALSE, '2025-01-25 16:25:00'),

(17, '/images/dha_phase6_girls_exterior.jpg', 'exterior', 'DHA Phase 6 Girls', TRUE, '2025-01-26 12:45:00'),
(17, '/images/dha_phase6_girls_room.jpg', 'room', 'Girls room', FALSE, '2025-01-26 12:50:00'),

(18, '/images/pu_hostel_exterior.jpg', 'exterior', 'PU Hostel', TRUE, '2025-01-27 09:30:00'),

(20, '/images/students_paradise_exterior.jpg', 'exterior', 'Students Paradise', TRUE, '2025-01-28 14:10:00'),

(22, '/images/bahria_executive_exterior.jpg', 'exterior', 'Bahria Executive', TRUE, '2025-01-29 11:40:00'),

(25, '/images/lahore_backpackers_exterior.jpg', 'exterior', 'Lahore Backpackers', TRUE, '2025-01-30 15:50:00'),
(25, '/images/lahore_backpackers_dorm.jpg', 'room', 'Dormitory room', FALSE, '2025-01-30 15:55:00'),
(25, '/images/lahore_backpackers_common.jpg', 'common_area', 'Common lounge', FALSE, '2025-01-30 16:00:00');

-- =====================================================
-- 19. WISHLIST (30 wishlist entries)
-- =====================================================
INSERT INTO wishlist (user_id, hostel_id, added_date, notes) VALUES
(1, 6, '2025-01-10 14:30:00', 'Want to shift here next semester'),
(1, 10, '2025-01-15 09:20:00', 'Luxury option, if budget allows'),
(2, 17, '2025-01-12 11:45:00', 'Near DHA, good reviews'),
(2, 2, '2025-01-18 16:30:00', 'Current hostel, but saved for reference'),
(3, 1, '2025-01-05 10:15:00', 'Close to university'),
(3, 11, '2025-01-20 13:40:00', 'Affordable option'),
(4, 4, '2025-01-08 15:20:00', 'Already staying here, saving for friend'),
(5, 22, '2025-01-22 12:10:00', 'Executive option for work'),
(5, 3, '2025-01-25 09:50:00', 'Central location'),
(6, 7, '2025-01-14 17:30:00', 'Budget friendly'),
(6, 16, '2025-01-28 11:20:00', 'Large hostel with many facilities'),
(7, 5, '2025-01-09 14:15:00', 'Eco-friendly option'),
(8, 21, '2025-01-17 10:40:00', 'Girls only, secure'),
(8, 8, '2025-01-30 13:25:00', 'Wapda Town location'),
(9, 9, '2025-01-11 16:50:00', 'Valencia area, modern'),
(10, 12, '2025-01-19 12:30:00', 'Gulberg executive'),
(11, 18, '2025-01-13 09:15:00', 'PU hostel for reference'),
(12, 19, '2025-01-21 14:45:00', 'Executive inn, looks nice'),
(13, 13, '2025-01-16 11:10:00', 'Cantt area, near work'),
(14, 14, '2025-01-24 15:30:00', 'Model Town, good location'),
(15, 15, '2025-01-26 10:20:00', 'Iqbal Town, budget'),
(16, 20, '2025-01-29 13:50:00', 'Students paradise, name says it all'),
(17, 23, '2025-01-27 16:40:00', 'Wapda Town mens'),
(18, 24, '2025-01-31 09:30:00', 'Township girls, for sister'),
(19, 25, '2025-02-01 14:20:00', 'Backpackers, international vibe'),
(20, 1, '2025-02-02 11:35:00', 'Popular choice'),
(21, 2, '2025-02-03 15:15:00', 'DHA location'),
(22, 3, '2025-02-04 10:45:00', 'Executive option'),
(23, 4, '2025-02-05 13:20:00', 'Near university'),
(24, 5, '2025-02-06 16:10:00', 'Green environment');
