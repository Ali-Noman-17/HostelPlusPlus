use hostel_services;

-- =======================================================================
-- 1.  Students looking for hostels in a specific area within their budget
-- =======================================================================

-- BEFORE
EXPLAIN ANALYZE
SELECT hr.hostel_room_id, h.hostel_name, hr.room_number, 
       rt.type_name, hr.monthly_rent, hr.available_beds
FROM hostel_rooms hr
JOIN hostels h ON hr.hostel_id = h.hostel_id
JOIN room_types rt ON hr.room_type_id = rt.room_type_id
JOIN hostel_amenities ha ON h.hostel_id = ha.hostel_id
JOIN amenities a ON ha.amenity_id = a.amenity_id
WHERE hr.is_available = TRUE
  AND hr.monthly_rent < 15000
  AND a.amenity_name IN ('WiFi', 'Air Conditioning')
  AND ha.is_available = TRUE
GROUP BY hr.hostel_room_id
HAVING COUNT(DISTINCT a.amenity_id) = 2
ORDER BY hr.monthly_rent;

-- Full table scan on areas table
-- No index on monthly_rent for price filtering
-- No composite index for area + price filtering

-- creating indexes
CREATE INDEX idx_areas_name ON areas(area_name);
CREATE INDEX idx_rooms_price_availability ON hostel_rooms(monthly_rent, is_available, hostel_id);
CREATE INDEX idx_hostels_area_rating ON hostels(area_id, rating);

-- AFTER
EXPLAIN ANALYZE
SELECT h.hostel_id, h.hostel_name, h.address, a.area_name, 
       MIN(hr.monthly_rent) as min_price, AVG(hr.monthly_rent) as avg_price,
       h.rating, h.gender_preference
FROM hostels h
JOIN areas a ON h.area_id = a.area_id
JOIN hostel_rooms hr ON h.hostel_id = hr.hostel_id
WHERE a.area_name = 'Johar Town'
  AND hr.monthly_rent BETWEEN 8000 AND 15000
  AND hr.is_available = TRUE
GROUP BY h.hostel_id, h.hostel_name, h.address, a.area_name, h.rating, h.gender_preference
ORDER BY min_price ASC;

-- time went from 1.14 to 0.184

-- =======================================================================
-- 2.  Students wanting hostels close to their university
-- =======================================================================

-- BEFORE 
EXPLAIN ANALYZE
SELECT h.hostel_id, h.hostel_name, h.address, 
       SQRT(POW(69.1 * (h.latitude - i.latitude), 2) + POW(69.1 * (h.longitude - i.longitude) * COS(h.latitude/57.3), 2)) AS distance_miles,
       h.rating, MIN(hr.monthly_rent) as min_rent
FROM hostels h
CROSS JOIN institutions i
JOIN hostel_rooms hr ON h.hostel_id = hr.hostel_id
WHERE i.institution_name = 'LUMS'
  AND h.city_id = i.city_id
  AND hr.is_available = TRUE
GROUP BY h.hostel_id
HAVING distance_miles < 2
ORDER BY distance_miles;

-- Creating indexes
CREATE INDEX idx_institutions_name ON institutions(institution_name);
CREATE INDEX idx_institutions_city ON institutions(city_id);
CREATE INDEX idx_hostels_city_location ON hostels(city_id, latitude, longitude);
CREATE INDEX idx_rooms_availability_hostel ON hostel_rooms(is_available, hostel_id);

-- Full table scan on institutions
-- No spatial index for location queries
-- Cartesian join before filtering

-- AFTER
EXPLAIN ANALYZE
SELECT h.hostel_id, h.hostel_name, h.address, 
       SQRT(POW(69.1 * (h.latitude - i.latitude), 2) + POW(69.1 * (h.longitude - i.longitude) * COS(h.latitude/57.3), 2)) AS distance_miles,
       h.rating, MIN(hr.monthly_rent) as min_rent
FROM hostels h
JOIN institutions i ON h.city_id = i.city_id
JOIN hostel_rooms hr ON h.hostel_id = hr.hostel_id
WHERE i.institution_name = 'LUMS'
  AND hr.is_available = TRUE
GROUP BY h.hostel_id
HAVING distance_miles < 2
ORDER BY distance_miles;

-- time went from 0.606 to 0.585


-- =======================================================================
-- 3.   Users viewing their past and upcoming bookings
-- =======================================================================

-- BEFORE 
EXPLAIN ANALYZE
SELECT b.booking_id, b.booking_reference, b.check_in_date, b.check_out_date,
       b.status, b.total_amount, b.advance_paid, b.payment_status,
       h.hostel_name, h.address, a.area_name, c.city_name,
       rt.type_name as room_type, hr.room_number
FROM bookings b
JOIN users u ON b.user_id = u.user_id
JOIN hostel_rooms hr ON b.hostel_room_id = hr.hostel_room_id
JOIN hostels h ON hr.hostel_id = h.hostel_id
LEFT JOIN areas a ON h.area_id = a.area_id
JOIN cities c ON h.city_id = c.city_id
JOIN room_types rt ON hr.room_type_id = rt.room_type_id
WHERE u.email = 'ali.raza@email.com'
ORDER BY b.check_in_date DESC;

-- Full table scan on users to find email
-- Multiple sequential lookups

-- Creating indexes
CREATE INDEX idx_bookings_user_dates ON bookings(user_id, check_in_date DESC, status);
CREATE INDEX idx_rooms_hostel ON hostel_rooms(hostel_room_id, hostel_id, room_type_id);

-- AFTER
EXPLAIN ANALYZE
SELECT b.booking_id, b.booking_reference, b.check_in_date, b.check_out_date,
       b.status, b.total_amount, b.advance_paid, b.payment_status,
       h.hostel_name, h.address, a.area_name, c.city_name,
       rt.type_name as room_type, hr.room_number
FROM bookings b
JOIN users u ON b.user_id = u.user_id
JOIN hostel_rooms hr ON b.hostel_room_id = hr.hostel_room_id
JOIN hostels h ON hr.hostel_id = h.hostel_id
LEFT JOIN areas a ON h.area_id = a.area_id
JOIN cities c ON h.city_id = c.city_id
JOIN room_types rt ON hr.room_type_id = rt.room_type_id
WHERE u.email = 'ali.raza@email.com'
ORDER BY b.check_in_date DESC;

-- time went from 0.0823 to 0.0732