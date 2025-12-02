// utils/hourlyRateCalculator.js

const STANDARD_WORK_HOURS = 10;

/**
 * Calculates the daily gross pay based on fixed daily salary and hours worked.
 * @param {number} dailySalary - The fixed daily salary from the employees table.
 * @param {number} workingHours - Actual working hours.
 * @param {number} overtimeHours - Actual overtime hours.
 * @returns {number} The calculated daily gross salary paid, rounded to 2 decimal places.
 */
const calculateDailyPay = (dailySalary, workingHours, overtimeHours) => {
    if (dailySalary <= 0 || (workingHours <= 0 && overtimeHours <= 0)) {
        return 0;
    }
    
    // Step 1: Calculate the Standard Hourly Rate
    const hourlyRate = dailySalary / STANDARD_WORK_HOURS;
    
    // Step 2: Determine Total Paid Hours (Assuming 1x multiplier for OT)
    const totalPaidHours = workingHours + overtimeHours;
    
    // Step 3: Calculate Daily Salary Paid
    const dailyPay = totalPaidHours * hourlyRate;
    
    // Return the value rounded to two decimal places
    return parseFloat(dailyPay.toFixed(2));
};

module.exports = {
    calculateDailyPay,
    STANDARD_WORK_HOURS
};