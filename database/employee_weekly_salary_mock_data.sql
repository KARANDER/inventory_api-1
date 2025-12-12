-- Mock data for employee_weekly_salary table
-- 5 weeks of past data for testing

-- Assuming employee_id 2 = Amit Sharma (daily_salary = 120)
-- Assuming employee_id 3 = Priya Singh (daily_salary = 150)

-- Week 1: Nov 11-17, 2025
INSERT INTO employee_weekly_salary (
    employee_id, week_start_date, week_end_date,
    mon_days, mon_ot, tue_days, tue_ot, wed_days, wed_ot,
    thu_days, thu_ot, fri_days, fri_ot, sat_days, sat_ot, sun_days, sun_ot,
    total_days, total_ot, total_salary
) VALUES 
(2, '2025-11-10', '2025-11-16', 1, 2, 1, 0, 1, 1, 1, 0, 1, 2, 0, 0, 0, 0, 5, 5, 660),
(3, '2025-11-10', '2025-11-16', 1, 0, 1, 1, 1, 0, 1, 2, 1, 0, 1, 0, 0, 0, 6, 3, 945);

-- Week 2: Nov 17-23, 2025
INSERT INTO employee_weekly_salary (
    employee_id, week_start_date, week_end_date,
    mon_days, mon_ot, tue_days, tue_ot, wed_days, wed_ot,
    thu_days, thu_ot, fri_days, fri_ot, sat_days, sat_ot, sun_days, sun_ot,
    total_days, total_ot, total_salary
) VALUES 
(2, '2025-11-17', '2025-11-23', 1, 0, 1, 2, 1, 0, 1, 1, 1, 0, 0, 0, 0, 0, 5, 3, 636),
(3, '2025-11-17', '2025-11-23', 1, 1, 1, 0, 0, 0, 1, 2, 1, 1, 1, 0, 0, 0, 5, 4, 810);

-- Week 3: Nov 24-30, 2025
INSERT INTO employee_weekly_salary (
    employee_id, week_start_date, week_end_date,
    mon_days, mon_ot, tue_days, tue_ot, wed_days, wed_ot,
    thu_days, thu_ot, fri_days, fri_ot, sat_days, sat_ot, sun_days, sun_ot,
    total_days, total_ot, total_salary
) VALUES 
(2, '2025-11-24', '2025-11-30', 1, 1, 1, 1, 1, 2, 1, 0, 1, 1, 1, 0, 0, 0, 6, 5, 780),
(3, '2025-11-24', '2025-11-30', 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 0, 0, 0, 0, 5, 1, 765);

-- Week 4: Dec 1-7, 2025
INSERT INTO employee_weekly_salary (
    employee_id, week_start_date, week_end_date,
    mon_days, mon_ot, tue_days, tue_ot, wed_days, wed_ot,
    thu_days, thu_ot, fri_days, fri_ot, sat_days, sat_ot, sun_days, sun_ot,
    total_days, total_ot, total_salary
) VALUES 
(2, '2025-12-01', '2025-12-07', 1, 2, 1, 0, 1, 1, 0, 0, 1, 2, 1, 0, 0, 0, 5, 5, 660),
(3, '2025-12-01', '2025-12-07', 1, 1, 1, 2, 1, 0, 1, 1, 1, 0, 1, 1, 0, 0, 6, 5, 975);

-- Week 5: Dec 8-14, 2025 (last week - just before current)
INSERT INTO employee_weekly_salary (
    employee_id, week_start_date, week_end_date,
    mon_days, mon_ot, tue_days, tue_ot, wed_days, wed_ot,
    thu_days, thu_ot, fri_days, fri_ot, sat_days, sat_ot, sun_days, sun_ot,
    total_days, total_ot, total_salary
) VALUES 
(2, '2025-12-08', '2025-12-14', 1, 0, 1, 1, 1, 0, 1, 2, 1, 0, 0, 0, 0, 0, 5, 3, 636),
(3, '2025-12-08', '2025-12-14', 1, 2, 1, 0, 1, 1, 1, 0, 1, 2, 1, 0, 0, 0, 6, 5, 975);
