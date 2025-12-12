# Employee Weekly Salary API

## Database Setup

Run the SQL file first:

```sql
source database/employee_weekly_salary_table.sql
```

## API Endpoints

### 1. Get Current Week Data

Returns all employees with their current week salary data (empty slots if no data entered).

```bash
curl -X GET "http://localhost:3000/employee-weekly-salary/current" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Response:**

```json
{
  "success": true,
  "data": {
    "week_start_date": "2024-12-09",
    "week_end_date": "2024-12-15",
    "employees": [
      {
        "employee_id": 1,
        "employee_name": "Amit Sharma",
        "daily_salary": 500,
        "mon_days": 1,
        "mon_ot": 2,
        "tue_days": 1,
        "tue_ot": 0,
        "wed_days": 0,
        "wed_ot": 0,
        "thu_days": 0,
        "thu_ot": 0,
        "fri_days": 0,
        "fri_ot": 0,
        "sat_days": 0,
        "sat_ot": 0,
        "sun_days": 0,
        "sun_ot": 0,
        "total_days": 2,
        "total_ot": 2,
        "total_salary": 1100
      }
    ]
  }
}
```

### 2. Bulk Save Weekly Salary (Multiple Employees)

Save/update salary data for multiple employees at once.

```bash
curl -X POST "http://localhost:3000/employee-weekly-salary/bulk-save" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "employees": [
      {
        "employee_id": 1,
        "daily_salary": 500,
        "mon_days": 1, "mon_ot": 2,
        "tue_days": 1, "tue_ot": 0,
        "wed_days": 1, "wed_ot": 1,
        "thu_days": 0, "thu_ot": 0,
        "fri_days": 0, "fri_ot": 0,
        "sat_days": 0, "sat_ot": 0,
        "sun_days": 0, "sun_ot": 0
      },
      {
        "employee_id": 2,
        "daily_salary": 600,
        "mon_days": 1, "mon_ot": 0,
        "tue_days": 1, "tue_ot": 3,
        "wed_days": 0, "wed_ot": 0,
        "thu_days": 0, "thu_ot": 0,
        "fri_days": 0, "fri_ot": 0,
        "sat_days": 0, "sat_ot": 0,
        "sun_days": 0, "sun_ot": 0
      }
    ]
  }'
```

### 3. Get Past Weeks History

Get list of past weeks that have salary data.

```bash
curl -X GET "http://localhost:3000/employee-weekly-salary/history?limit=10" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 4. Get Specific Week Data

Get salary data for a specific past week.

```bash
curl -X GET "http://localhost:3000/employee-weekly-salary/week/2024-12-02" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Calculation Formula

```
perHour = daily_salary / 10
total_salary = (sum_of_days × daily_salary) + (sum_of_ot × perHour)
```

**Example:**

- daily_salary = 500
- Days worked: Mon=1, Tue=1, Wed=1 (total_days = 3)
- Overtime: Mon=2hrs, Wed=1hr (total_ot = 3)
- perHour = 500/10 = 50
- total_salary = (3 × 500) + (3 × 50) = 1500 + 150 = **₹1650**
