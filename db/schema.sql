CREATE DATABASE IF NOT EXISTS hostel_services 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;
USE hostel_services;

-- =====================================================
-- TABLES 
-- =====================================================

-- 1. CITIES TABLE
CREATE TABLE cities (
    city_id INT PRIMARY KEY AUTO_INCREMENT,
    city_name VARCHAR(100) NOT NULL,
    state VARCHAR(100),
    country VARCHAR(100) NOT NULL DEFAULT 'India',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_cities_country (country)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. AREAS TABLE
CREATE TABLE areas (
    area_id INT PRIMARY KEY AUTO_INCREMENT,
    area_name VARCHAR(100) NOT NULL,
    city_id INT NOT NULL,
    pincode VARCHAR(10),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_areas_city FOREIGN KEY (city_id) REFERENCES cities(city_id) ON DELETE CASCADE,
    CONSTRAINT uc_area_city UNIQUE (area_name, city_id),
    CONSTRAINT chk_latitude_area CHECK (latitude IS NULL OR (latitude BETWEEN -90 AND 90)),
    CONSTRAINT chk_longitude_area CHECK (longitude IS NULL OR (longitude BETWEEN -180 AND 180)),
    INDEX idx_areas_city (city_id, area_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. INSTITUTIONS TABLE
CREATE TABLE institutions (
    institution_id INT PRIMARY KEY AUTO_INCREMENT,
    institution_name VARCHAR(200) NOT NULL,
    institution_type ENUM('university', 'college', 'workplace', 'other') NOT NULL DEFAULT 'other',
    address TEXT,
    city_id INT NOT NULL,
    area_id INT,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_institutions_city FOREIGN KEY (city_id) REFERENCES cities(city_id),
    CONSTRAINT fk_institutions_area FOREIGN KEY (area_id) REFERENCES areas(area_id),
    CONSTRAINT uc_institution_city UNIQUE (institution_name, city_id),
    CONSTRAINT chk_latitude_inst CHECK (latitude IS NULL OR (latitude BETWEEN -90 AND 90)),
    CONSTRAINT chk_longitude_inst CHECK (longitude IS NULL OR (longitude BETWEEN -180 AND 180)),
    INDEX idx_institutions_type (institution_type),
    INDEX idx_institutions_city_area (city_id, area_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. HOSTELS TABLE
CREATE TABLE hostels (
    hostel_id INT PRIMARY KEY AUTO_INCREMENT,
    hostel_name VARCHAR(200) NOT NULL,
    owner_name VARCHAR(100),
    contact_number VARCHAR(20) NOT NULL,
    alternate_number VARCHAR(20),
    email VARCHAR(100),
    address TEXT NOT NULL,
    city_id INT NOT NULL,
    area_id INT,
    pincode VARCHAR(10),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    total_rooms INT NOT NULL DEFAULT 0,
    gender_preference ENUM('male', 'female', 'co-ed') NOT NULL DEFAULT 'co-ed',
    description TEXT,
    rating DECIMAL(3, 2) NOT NULL DEFAULT 0.00,
    total_reviews INT NOT NULL DEFAULT 0,
    is_verified BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_hostels_city FOREIGN KEY (city_id) REFERENCES cities(city_id),
    CONSTRAINT fk_hostels_area FOREIGN KEY (area_id) REFERENCES areas(area_id),
    CONSTRAINT chk_contact CHECK (contact_number REGEXP '^[0-9+\\-\\s]{10,20}$'),
    CONSTRAINT chk_alt_contact CHECK (alternate_number IS NULL OR alternate_number REGEXP '^[0-9+\\-\\s]{10,20}$'),
    CONSTRAINT chk_email CHECK (email IS NULL OR email LIKE '%_@__%.__%'),
    CONSTRAINT chk_latitude CHECK (latitude IS NULL OR (latitude BETWEEN -90 AND 90)),
    CONSTRAINT chk_longitude CHECK (longitude IS NULL OR (longitude BETWEEN -180 AND 180)),
    CONSTRAINT chk_total_rooms CHECK (total_rooms >= 0),
    CONSTRAINT chk_rating CHECK (rating BETWEEN 0 AND 5),
    CONSTRAINT chk_reviews CHECK (total_reviews >= 0),
    
    INDEX idx_hostels_city_area (city_id, area_id, rating),
    INDEX idx_hostels_verified_rating (is_verified, rating),
    INDEX idx_hostels_gender (gender_preference),
    INDEX idx_hostels_location (latitude, longitude),
    FULLTEXT INDEX ft_hostels_search (hostel_name, description)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 5. ROOM TYPES (Lookup table)
CREATE TABLE room_types (
    room_type_id INT PRIMARY KEY AUTO_INCREMENT,
    type_name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    INDEX idx_room_types_name (type_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 6. HOSTEL ROOMS
CREATE TABLE hostel_rooms (
    hostel_room_id INT PRIMARY KEY AUTO_INCREMENT,
    hostel_id INT NOT NULL,
    room_type_id INT NOT NULL,
    room_number VARCHAR(20),
    total_beds_in_room INT NOT NULL,
    available_beds INT NOT NULL,
    monthly_rent DECIMAL(10, 2) NOT NULL,
    security_deposit DECIMAL(10, 2) DEFAULT 0.00,
    is_available BOOLEAN NOT NULL DEFAULT TRUE,
    floor_number INT DEFAULT 1,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_rooms_hostel FOREIGN KEY (hostel_id) REFERENCES hostels(hostel_id) ON DELETE CASCADE,
    CONSTRAINT fk_rooms_type FOREIGN KEY (room_type_id) REFERENCES room_types(room_type_id),
    CONSTRAINT uc_hostel_room UNIQUE (hostel_id, room_number),
    CONSTRAINT chk_total_beds CHECK (total_beds_in_room > 0),
    CONSTRAINT chk_available_beds CHECK (available_beds >= 0),
    CONSTRAINT chk_beds_available CHECK (available_beds <= total_beds_in_room),
    CONSTRAINT chk_rent CHECK (monthly_rent > 0),
    CONSTRAINT chk_deposit CHECK (security_deposit >= 0),
    CONSTRAINT chk_floor CHECK (floor_number >= 0),
    
    INDEX idx_rooms_availability (hostel_id, is_available, monthly_rent),
    INDEX idx_rooms_type_price (room_type_id, monthly_rent)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 7. AMENITIES (Master list)
CREATE TABLE amenities (
    amenity_id INT PRIMARY KEY AUTO_INCREMENT,
    amenity_name VARCHAR(100) NOT NULL UNIQUE,
    category ENUM('basic', 'food', 'furniture', 'electronics', 'safety', 'other') NOT NULL DEFAULT 'basic',
    icon_name VARCHAR(50),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_amenities_category (category)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 8. HOSTEL AMENITIES (Junction table)
CREATE TABLE hostel_amenities (
    hostel_id INT NOT NULL,
    amenity_id INT NOT NULL,
    is_available BOOLEAN NOT NULL DEFAULT TRUE,
    additional_charges DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    notes TEXT,
    PRIMARY KEY (hostel_id, amenity_id),
    CONSTRAINT fk_ha_hostel FOREIGN KEY (hostel_id) REFERENCES hostels(hostel_id) ON DELETE CASCADE,
    CONSTRAINT fk_ha_amenity FOREIGN KEY (amenity_id) REFERENCES amenities(amenity_id) ON DELETE CASCADE,
    CONSTRAINT chk_ha_charges CHECK (additional_charges >= 0)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 9. MEAL TYPES
CREATE TABLE meal_types (
    meal_type_id INT PRIMARY KEY AUTO_INCREMENT,
    meal_name VARCHAR(50) NOT NULL UNIQUE,
    meal_time TIME,
    INDEX idx_meal_time (meal_time)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 10. HOSTEL FOOD OPTIONS
CREATE TABLE hostel_food (
    food_id INT PRIMARY KEY AUTO_INCREMENT,
    hostel_id INT NOT NULL,
    meal_type_id INT NOT NULL,
    food_category ENUM('vegetarian', 'non-vegetarian', 'both') NOT NULL DEFAULT 'both',
    is_included_in_rent BOOLEAN NOT NULL DEFAULT FALSE,
    monthly_cost DECIMAL(10, 2),
    description TEXT,
    
    CONSTRAINT fk_food_hostel FOREIGN KEY (hostel_id) REFERENCES hostels(hostel_id) ON DELETE CASCADE,
    CONSTRAINT fk_food_meal FOREIGN KEY (meal_type_id) REFERENCES meal_types(meal_type_id),
    CONSTRAINT uc_hostel_meal UNIQUE (hostel_id, meal_type_id),
    CONSTRAINT chk_monthly_cost CHECK (monthly_cost IS NULL OR monthly_cost >= 0),
    
    INDEX idx_food_cost (hostel_id, is_included_in_rent, monthly_cost)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 11. NEARBY CATEGORIES
CREATE TABLE nearby_categories (
    category_id INT PRIMARY KEY AUTO_INCREMENT,
    category_name VARCHAR(100) NOT NULL UNIQUE,
    icon VARCHAR(50),
    INDEX idx_cat_name (category_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 12. NEARBY PLACES
CREATE TABLE nearby_places (
    place_id INT PRIMARY KEY AUTO_INCREMENT,
    hostel_id INT NOT NULL,
    place_name VARCHAR(200) NOT NULL,
    category_id INT NOT NULL,
    area_id INT,
    distance_km DECIMAL(5, 2) NOT NULL,
    estimated_time_minutes INT,
    walking_distance BOOLEAN NOT NULL DEFAULT TRUE,
    landmark BOOLEAN NOT NULL DEFAULT FALSE,
    
    CONSTRAINT fk_np_hostel FOREIGN KEY (hostel_id) REFERENCES hostels(hostel_id) ON DELETE CASCADE,
    CONSTRAINT fk_np_category FOREIGN KEY (category_id) REFERENCES nearby_categories(category_id),
    CONSTRAINT fk_np_area FOREIGN KEY (area_id) REFERENCES areas(area_id),
    CONSTRAINT uc_hostel_place UNIQUE (hostel_id, place_name),
    CONSTRAINT chk_distance CHECK (distance_km >= 0),
    CONSTRAINT chk_eta CHECK (estimated_time_minutes IS NULL OR estimated_time_minutes > 0),
    
    INDEX idx_nearby_hostel_cat (hostel_id, category_id, distance_km),
    INDEX idx_nearby_area (area_id, category_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 13. TRANSPORT ROUTES
CREATE TABLE transport_routes (
    route_id INT PRIMARY KEY AUTO_INCREMENT,
    route_name VARCHAR(100) NOT NULL,
    route_number VARCHAR(50),
    transport_type ENUM('bus', 'metro', 'train', 'auto') NOT NULL,
    city_id INT NOT NULL,
    
    CONSTRAINT fk_tr_city FOREIGN KEY (city_id) REFERENCES cities(city_id),
    INDEX idx_transport_city (city_id, transport_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 14. HOSTEL TRANSPORT CONNECTIONS
CREATE TABLE hostel_transport (
    hostel_id INT NOT NULL,
    route_id INT NOT NULL,
    stop_name VARCHAR(200) NOT NULL,
    distance_to_stop_km DECIMAL(5, 2) NOT NULL,
    frequency_minutes INT,
    first_ride TIME,
    last_ride TIME,
    
    PRIMARY KEY (hostel_id, route_id),
    CONSTRAINT fk_ht_hostel FOREIGN KEY (hostel_id) REFERENCES hostels(hostel_id) ON DELETE CASCADE,
    CONSTRAINT fk_ht_route FOREIGN KEY (route_id) REFERENCES transport_routes(route_id),
    CONSTRAINT chk_ht_distance CHECK (distance_to_stop_km >= 0),
    CONSTRAINT chk_frequency CHECK (frequency_minutes IS NULL OR frequency_minutes > 0),
    CONSTRAINT chk_ride_times CHECK (last_ride IS NULL OR first_ride IS NULL OR last_ride > first_ride),
    
    INDEX idx_transport_distance (hostel_id, distance_to_stop_km)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 15. USERS TABLE
CREATE TABLE users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50),
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    user_type ENUM('student', 'professional', 'owner', 'admin') NOT NULL DEFAULT 'student',
    institution_id INT,
    verified BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL,
    
    CONSTRAINT fk_users_institution FOREIGN KEY (institution_id) REFERENCES institutions(institution_id),
    CONSTRAINT uc_email UNIQUE (email),
    CONSTRAINT uc_phone UNIQUE (phone),
    CONSTRAINT chk_email_format CHECK (email LIKE '%_@__%.__%'),
    CONSTRAINT chk_phone_format CHECK (phone REGEXP '^[0-9+\\-\\s]{10,20}$'),
    CONSTRAINT chk_student_institution CHECK (
        (user_type = 'student' AND institution_id IS NOT NULL) OR 
        (user_type != 'student')
    ),
    
    INDEX idx_users_email (email),
    INDEX idx_users_phone (phone),
    INDEX idx_users_type (user_type),
    INDEX idx_users_verified (verified)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 16. BOOKINGS TABLE
CREATE TABLE bookings (
    booking_id INT PRIMARY KEY AUTO_INCREMENT,
    booking_reference VARCHAR(20) NOT NULL,
    user_id INT NOT NULL,
    hostel_room_id INT NOT NULL,
    booking_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    check_in_date DATE NOT NULL,
    check_out_date DATE,
    status ENUM('pending', 'confirmed', 'cancelled', 'completed') NOT NULL DEFAULT 'pending',
    total_amount DECIMAL(10, 2) NOT NULL,
    advance_paid DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    payment_status ENUM('pending', 'partial', 'completed') NOT NULL DEFAULT 'pending',
    special_requests TEXT,
    cancelled_at TIMESTAMP NULL,
    cancellation_reason VARCHAR(255),
    
    CONSTRAINT fk_bookings_user FOREIGN KEY (user_id) REFERENCES users(user_id),
    CONSTRAINT fk_bookings_room FOREIGN KEY (hostel_room_id) REFERENCES hostel_rooms(hostel_room_id),
    CONSTRAINT uc_booking_ref UNIQUE (booking_reference),
    CONSTRAINT chk_dates CHECK (check_out_date IS NULL OR check_out_date > check_in_date),
    CONSTRAINT chk_amounts CHECK (total_amount >= 0 AND advance_paid >= 0),
    CONSTRAINT chk_advance CHECK (advance_paid <= total_amount),
    
    INDEX idx_bookings_user_status (user_id, status, check_in_date),
    INDEX idx_bookings_dates (check_in_date, check_out_date, status),
    INDEX idx_bookings_reference (booking_reference),
    INDEX idx_bookings_payment (payment_status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 17. REVIEWS TABLE
CREATE TABLE reviews (
    review_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    hostel_id INT NOT NULL,
    booking_id INT,
    rating DECIMAL(3, 2) NOT NULL,
    cleanliness_rating INT,
    food_rating INT,
    safety_rating INT,
    location_rating INT,
    comment TEXT,
    stay_start_date DATE,
    stay_end_date DATE,
    helpful_count INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_reviews_user FOREIGN KEY (user_id) REFERENCES users(user_id),
    CONSTRAINT fk_reviews_hostel FOREIGN KEY (hostel_id) REFERENCES hostels(hostel_id) ON DELETE CASCADE,
    CONSTRAINT fk_reviews_booking FOREIGN KEY (booking_id) REFERENCES bookings(booking_id),
    CONSTRAINT uc_user_hostel UNIQUE (user_id, hostel_id),
    CONSTRAINT chk_rating_range CHECK (rating BETWEEN 1 AND 5),
    CONSTRAINT chk_cleanliness CHECK (cleanliness_rating IS NULL OR (cleanliness_rating BETWEEN 1 AND 5)),
    CONSTRAINT chk_food_rating CHECK (food_rating IS NULL OR (food_rating BETWEEN 1 AND 5)),
    CONSTRAINT chk_safety_rating CHECK (safety_rating IS NULL OR (safety_rating BETWEEN 1 AND 5)),
    CONSTRAINT chk_location_rating CHECK (location_rating IS NULL OR (location_rating BETWEEN 1 AND 5)),
    CONSTRAINT chk_stay_dates CHECK (stay_end_date IS NULL OR stay_start_date IS NULL OR stay_end_date >= stay_start_date),
    CONSTRAINT chk_helpful CHECK (helpful_count >= 0),
   
    INDEX idx_reviews_hostel (hostel_id, rating, created_at),
    INDEX idx_reviews_user (user_id, created_at),
    INDEX idx_reviews_helpful (helpful_count)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 18. HOSTEL PHOTOS
CREATE TABLE hostel_photos (
    photo_id INT PRIMARY KEY AUTO_INCREMENT,
    hostel_id INT NOT NULL,
    photo_url VARCHAR(500) NOT NULL,
    photo_type ENUM('exterior', 'room', 'common_area', 'dining', 'bathroom', 'other') NOT NULL DEFAULT 'other',
    caption VARCHAR(255),
    is_primary BOOLEAN NOT NULL DEFAULT FALSE,
    uploaded_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_photos_hostel FOREIGN KEY (hostel_id) REFERENCES hostels(hostel_id) ON DELETE CASCADE,
    
    INDEX idx_photos_hostel_type (hostel_id, photo_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 19. WISHLIST TABLE
CREATE TABLE wishlist (
    wishlist_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    hostel_id INT NOT NULL,
    added_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    notes TEXT,
    
    CONSTRAINT fk_wishlist_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    CONSTRAINT fk_wishlist_hostel FOREIGN KEY (hostel_id) REFERENCES hostels(hostel_id) ON DELETE CASCADE,
    CONSTRAINT uc_user_hostel_wishlist UNIQUE (user_id, hostel_id),
    
    INDEX idx_wishlist_user (user_id, added_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 20. AUDIT TABLE (FUTURE USE)
CREATE TABLE audit_log (
    log_id INT PRIMARY KEY AUTO_INCREMENT,
    table_name VARCHAR(50) NOT NULL,
    record_id INT NOT NULL,
    action ENUM('INSERT', 'UPDATE', 'DELETE') NOT NULL,
    old_data JSON,
    new_data JSON,
    changed_by INT,
    changed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_audit_user FOREIGN KEY (changed_by) REFERENCES users(user_id),
    INDEX idx_audit_table_record (table_name, record_id),
    INDEX idx_audit_time (changed_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =====================================================
-- VIEWS
-- =====================================================

-- 1. PROXIMITY VIEW
CREATE VIEW area_proximity AS
SELECT 
    h.hostel_id,
    h.hostel_name,
    a.area_name,
    c.city_name,
    np.place_name,
    nc.category_name,
    np.distance_km,
    np.estimated_time_minutes,
    np.walking_distance
FROM hostels h
JOIN areas a ON h.area_id = a.area_id
JOIN cities c ON h.city_id = c.city_id
LEFT JOIN nearby_places np ON h.hostel_id = np.hostel_id
LEFT JOIN nearby_categories nc ON np.category_id = nc.category_id
WHERE np.place_id IS NOT NULL;

-- 2. BOOKING DETAILS VIEW
CREATE VIEW booking_details AS
SELECT 
    b.booking_id,
    b.booking_reference,
    u.first_name,
    u.last_name,
    u.email,
    u.phone,
    h.hostel_name,
    h.address,
    a.area_name,
    c.city_name,
    rt.type_name as room_type,
    hr.room_number,
    hr.monthly_rent,
    b.check_in_date,
    b.check_out_date,
    DATEDIFF(b.check_out_date, b.check_in_date) as nights,
    b.total_amount,
    b.advance_paid,
    b.total_amount - b.advance_paid as balance_due,
    b.payment_status,
    b.status as booking_status,
    CASE 
        WHEN b.payment_status = 'completed' THEN 'Fully Paid'
        WHEN b.advance_paid > 0 THEN 'Partial Paid'
        ELSE 'No Payment'
    END as payment_summary,
    b.booking_date,
    b.special_requests
FROM bookings b
JOIN users u ON b.user_id = u.user_id
JOIN hostel_rooms hr ON b.hostel_room_id = hr.hostel_room_id
JOIN hostels h ON hr.hostel_id = h.hostel_id
LEFT JOIN areas a ON h.area_id = a.area_id
JOIN cities c ON h.city_id = c.city_id
JOIN room_types rt ON hr.room_type_id = rt.room_type_id;

-- 3. HOSTEL SUMMARY VIEW
CREATE VIEW hostel_summary AS
SELECT 
    h.hostel_id,
    h.hostel_name,
    h.address,
    a.area_name,
    c.city_name,
    h.gender_preference,
    h.rating,
    h.total_reviews,
    h.is_verified,
    MIN(hr.monthly_rent) as min_rent,
    MAX(hr.monthly_rent) as max_rent,
    SUM(hr.total_beds_in_room) as total_beds,
    SUM(hr.available_beds) as available_beds,
    GROUP_CONCAT(DISTINCT am.amenity_name SEPARATOR ', ') as amenities,
    COUNT(DISTINCT np.place_id) as nearby_places_count
FROM hostels h
JOIN cities c ON h.city_id = c.city_id
LEFT JOIN areas a ON h.area_id = a.area_id
LEFT JOIN hostel_rooms hr ON h.hostel_id = hr.hostel_id AND hr.is_available = TRUE
LEFT JOIN hostel_amenities ha ON h.hostel_id = ha.hostel_id
LEFT JOIN amenities am ON ha.amenity_id = am.amenity_id
LEFT JOIN nearby_places np ON h.hostel_id = np.hostel_id
GROUP BY h.hostel_id;

-- =====================================================
-- TRIGGERS
-- =====================================================

DELIMITER //

CREATE TRIGGER update_hostel_rating AFTER INSERT ON reviews
FOR EACH ROW
BEGIN
    UPDATE hostels 
    SET rating = (
        SELECT AVG(rating) 
        FROM reviews 
        WHERE hostel_id = NEW.hostel_id
    ),
    total_reviews = (
        SELECT COUNT(*) 
        FROM reviews 
        WHERE hostel_id = NEW.hostel_id
    )
    WHERE hostel_id = NEW.hostel_id;
END//


CREATE TRIGGER generate_booking_ref BEFORE INSERT ON bookings
FOR EACH ROW
BEGIN
    DECLARE year_prefix VARCHAR(4);
    DECLARE next_number INT;
    
    SET year_prefix = DATE_FORMAT(NEW.booking_date, '%Y');
    
    SELECT COALESCE(MAX(CAST(SUBSTRING(booking_reference, 8) AS UNSIGNED)), 0) + 1
    INTO next_number
    FROM bookings
    WHERE booking_reference IS NOT NULL;
    
    SET NEW.booking_reference = CONCAT('HST', year_prefix, LPAD(next_number, 6, '0'));
END//

CREATE TRIGGER update_available_beds_on_booking AFTER UPDATE ON bookings
FOR EACH ROW
BEGIN
    -- When booking is confirmed
    IF NEW.status = 'confirmed' AND OLD.status != 'confirmed' THEN
        UPDATE hostel_rooms 
        SET available_beds = available_beds - 1
        WHERE hostel_room_id = NEW.hostel_room_id;
    
    -- When booking is cancelled
    ELSEIF NEW.status = 'cancelled' AND OLD.status != 'cancelled' THEN
        UPDATE hostel_rooms 
        SET available_beds = available_beds + 1
        WHERE hostel_room_id = NEW.hostel_room_id;
    END IF;
END//

CREATE TRIGGER prevent_double_booking BEFORE INSERT ON bookings
FOR EACH ROW
BEGIN
    DECLARE existing_bookings INT;
    
    -- Check for overlapping confirmed bookings for the same room
    SELECT COUNT(*) INTO existing_bookings
    FROM bookings b
    WHERE b.hostel_room_id = NEW.hostel_room_id
    AND b.status IN ('confirmed', 'pending')
    AND (
        (NEW.check_in_date BETWEEN b.check_in_date AND IFNULL(b.check_out_date, '9999-12-31'))
        OR (IFNULL(NEW.check_out_date, '9999-12-31') BETWEEN b.check_in_date AND IFNULL(b.check_out_date, '9999-12-31'))
        OR (b.check_in_date BETWEEN NEW.check_in_date AND IFNULL(NEW.check_out_date, '9999-12-31'))
    );
    
    IF existing_bookings > 0 THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'Room already booked for selected dates';
    END IF;
END//

CREATE TRIGGER check_room_capacity BEFORE INSERT ON bookings
FOR EACH ROW
BEGIN
    DECLARE beds_available INT;
    
    SELECT available_beds INTO beds_available
    FROM hostel_rooms
    WHERE hostel_room_id = NEW.hostel_room_id;
    
    IF beds_available <= 0 THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'No beds available in this room';
    END IF;
END//

CREATE TRIGGER validate_booking_dates BEFORE INSERT ON bookings
FOR EACH ROW
BEGIN
    IF NEW.check_out_date IS NOT NULL AND NEW.check_out_date <= NEW.check_in_date THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'Check-out date must be after check-in date';
    END IF;
END//

CREATE TRIGGER set_cancellation_timestamp BEFORE UPDATE ON bookings
FOR EACH ROW
BEGIN
    IF NEW.status = 'cancelled' AND OLD.status != 'cancelled' THEN
        SET NEW.cancelled_at = CURRENT_TIMESTAMP();
    END IF;
END//

CREATE TRIGGER auto_complete_booking BEFORE UPDATE ON bookings
FOR EACH ROW
BEGIN
    IF NEW.status = 'confirmed' AND NEW.check_out_date < CURRENT_DATE() THEN
        SET NEW.status = 'completed';
    END IF;
END//

CREATE TRIGGER prevent_modify_old_bookings BEFORE UPDATE ON bookings
FOR EACH ROW
BEGIN
    IF OLD.status IN ('completed', 'cancelled') THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'Cannot modify completed or cancelled bookings';
    END IF;
END//

CREATE TRIGGER prevent_duplicate_wishlist BEFORE INSERT ON wishlist
FOR EACH ROW
BEGIN
    DECLARE existing INT;
    
    SELECT COUNT(*) INTO existing
    FROM wishlist
    WHERE user_id = NEW.user_id AND hostel_id = NEW.hostel_id;
    
    IF existing > 0 THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'Hostel already in wishlist';
    END IF;
END//

CREATE TRIGGER validate_user_phone BEFORE INSERT ON users
FOR EACH ROW
BEGIN
    IF NEW.phone NOT REGEXP '^[0-9+][0-9]{9,14}$' THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'Invalid phone number format';
    END IF;
END//

CREATE TRIGGER update_hostel_rating_on_delete AFTER DELETE ON reviews
FOR EACH ROW
BEGIN
    UPDATE hostels 
    SET rating = COALESCE((
        SELECT AVG(rating) 
        FROM reviews 
        WHERE hostel_id = OLD.hostel_id
    ), 0),
    total_reviews = (
        SELECT COUNT(*) 
        FROM reviews 
        WHERE hostel_id = OLD.hostel_id
    )
    WHERE hostel_id = OLD.hostel_id;
END//

CREATE TRIGGER update_hostel_rooms_on_insert AFTER INSERT ON hostel_rooms
FOR EACH ROW
BEGIN
    UPDATE hostels h
    SET total_rooms = (
        SELECT COUNT(DISTINCT hostel_room_id) 
        FROM hostel_rooms 
        WHERE hostel_id = NEW.hostel_id
    )
    WHERE h.hostel_id = NEW.hostel_id;
END//

CREATE TRIGGER update_hostel_rooms_on_delete AFTER DELETE ON hostel_rooms
FOR EACH ROW
BEGIN
    UPDATE hostels h
    SET total_rooms = (
        SELECT COUNT(DISTINCT hostel_room_id) 
        FROM hostel_rooms 
        WHERE hostel_id = OLD.hostel_id
    )
    WHERE h.hostel_id = OLD.hostel_id;
END//

CREATE TRIGGER validate_future_checkin BEFORE INSERT ON bookings
FOR EACH ROW
BEGIN
    IF NEW.status = 'confirmed' AND NEW.check_in_date < CURDATE() THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'Check-in date must be today or in the future for confirmed bookings';
    END IF;
END//

CREATE TRIGGER validate_future_checkin_update BEFORE UPDATE ON bookings
FOR EACH ROW
BEGIN
    IF NEW.status = 'confirmed' AND NEW.check_in_date < CURDATE() THEN
        SIGNAL SQLSTATE '45000' 
        SET MESSAGE_TEXT = 'Check-in date must be today or in the future for confirmed bookings';
    END IF;
END//

DELIMITER ;