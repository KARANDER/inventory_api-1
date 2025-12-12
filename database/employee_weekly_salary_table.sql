-- Employee Weekly Salary Table
-- Stores daily attendance (days worked) and overtime hours for each employee per week

CREATE TABLE IF NOT EXISTS employee_weekly_salary (
    id INT AUTO_INCREMENT PRIMARY KEY,
    employee_id INT NOT NULL,
    week_start_date DATE NOT NULL,  -- Monday of the week
    week_end_date DATE NOT NULL,    -- Sunday of the week
    
    -- Monday
    mon_days DECIMAL(3,1) DEFAULT 0,  -- 0 or 1 (can be 0.5 for half day if needed)
    mon_ot DECIMAL(5,2) DEFAULT 0,    -- Overtime hours
    
    -- Tuesday
    tue_days DECIMAL(3,1) DEFAULT 0,
    tue_ot DECIMAL(5,2) DEFAULT 0,
    
    -- Wednesday
    wed_days DECIMAL(3,1) DEFAULT 0,
    wed_ot DECIMAL(5,2) DEFAULT 0,
    
    -- Thursday
    thu_days DECIMAL(3,1) DEFAULT 0,
    thu_ot DECIMAL(5,2) DEFAULT 0,
    
    -- Friday
    fri_days DECIMAL(3,1) DEFAULT 0,
    fri_ot DECIMAL(5,2) DEFAULT 0,
    
    -- Saturday
    sat_days DECIMAL(3,1) DEFAULT 0,
    sat_ot DECIMAL(5,2) DEFAULT 0,
    
    -- Sunday
    sun_days DECIMAL(3,1) DEFAULT 0,
    sun_ot DECIMAL(5,2) DEFAULT 0,
    
    -- Calculated totals (stored for quick access)
    total_days DECIMAL(4,1) DEFAULT 0,
    total_ot DECIMAL(6,2) DEFAULT 0,
    total_salary DECIMAL(12,2) DEFAULT 0,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    -- Ensure one record per employee per week
    UNIQUE KEY unique_employee_week (employee_id, week_start_date),
    
    -- Foreign key to employees table
    FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE
);

-- Index for faster queries
CREATE INDEX idx_week_dates ON employee_weekly_salary(week_start_date, week_end_date);
CREATE INDEX idx_employee_week ON employee_weekly_salary(employee_id, week_start_date);
