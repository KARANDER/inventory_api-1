-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: May 05, 2026 at 08:30 AM
-- Server version: 8.4.7-7
-- PHP Version: 8.1.34

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `inventory`
--

-- --------------------------------------------------------

--
-- Table structure for table `accounts`
--

CREATE TABLE `accounts` (
  `id` int NOT NULL,
  `account_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `balance` decimal(15,2) NOT NULL DEFAULT '0.00',
  `code` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `created_by` int DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `accounts`
--

INSERT INTO `accounts` (`id`, `account_name`, `balance`, `code`, `created_by`, `created_at`, `updated_at`) VALUES
(1, 'NO_1', 0.00, 'NO_1', 18, '2026-04-16 09:46:39', '2026-04-16 09:46:39'),
(2, 'NO_2', 2.00, 'NO_2', 18, '2026-04-16 09:46:48', '2026-04-24 19:49:55');

-- --------------------------------------------------------

--
-- Table structure for table `account_history`
--

CREATE TABLE `account_history` (
  `id` int NOT NULL,
  `account_id` int NOT NULL,
  `transaction_type` enum('CREDIT','DEBIT') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT 'CREDIT = Receipt (money added), DEBIT = Payment (money subtracted)',
  `amount` decimal(15,2) NOT NULL,
  `contact_id` int DEFAULT NULL COMMENT 'ID from contacts table (customer or supplier)',
  `contact_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT 'Name of customer/supplier for easy display',
  `contact_type` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT 'Customer or Supplier',
  `date` date NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `reference` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `receipt_id` int DEFAULT NULL COMMENT 'Link to receipts table if transaction is from receipt',
  `payment_id` int DEFAULT NULL COMMENT 'Link to payments table if transaction is from payment',
  `balance_after` decimal(15,2) DEFAULT NULL COMMENT 'Account balance after this transaction',
  `user_id` int DEFAULT NULL COMMENT 'User who created the transaction',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `account_history`
--

INSERT INTO `account_history` (`id`, `account_id`, `transaction_type`, `amount`, `contact_id`, `contact_name`, `contact_type`, `date`, `description`, `reference`, `receipt_id`, `payment_id`, `balance_after`, `user_id`, `created_at`, `updated_at`) VALUES
(1, 2, 'CREDIT', 1.00, 6, 'PHKK', 'Customer', '2026-04-24', 'huvg', '115', NULL, NULL, 1.00, 18, '2026-04-24 19:49:27', '2026-04-24 19:49:27'),
(2, 2, 'CREDIT', 1.00, 5, 'SSSJ', 'Customer', '2026-04-24', '554', NULL, NULL, NULL, 2.00, 18, '2026-04-24 19:49:55', '2026-04-24 19:49:55');

-- --------------------------------------------------------

--
-- Table structure for table `carton_inventory`
--

CREATE TABLE `carton_inventory` (
  `id` int NOT NULL,
  `carton_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `carton_quantity` int NOT NULL DEFAULT '0',
  `ctn_wt` decimal(10,2) DEFAULT '0.00',
  `created_by` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `carton_inventory`
--

INSERT INTO `carton_inventory` (`id`, `carton_name`, `carton_quantity`, `ctn_wt`, `created_by`) VALUES
(1, 'CTN STEEL 4', 0, 0.60, 18),
(2, 'CTN STEEL 5', 0, 0.00, 18),
(3, 'CTN NANU', 0, 0.00, 18),
(4, 'CTN MOTU', 0, 0.00, 18),
(5, 'CTN RLY', 0, 0.00, 18),
(6, 'CTN GOLD 4', 0, 0.00, 18),
(7, 'CTN GOLD 5', 0, 0.00, 18),
(8, 'CTN GOLD 6', 0, 0.00, 18),
(9, 'CTN DUCK', 0, 0.00, 18),
(10, 'CTN TB 18', 0, 0.00, 18),
(11, 'CTN TB 24', 0, 0.00, 18),
(12, 'CTN TB 8', 0, 0.00, 18);

-- --------------------------------------------------------

--
-- Table structure for table `contacts`
--

CREATE TABLE `contacts` (
  `id` int NOT NULL,
  `contact_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `type` enum('Customer','Supplier','Other') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `created_by` int DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `code` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `image_url` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `address` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `updated_by` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `contacts`
--

INSERT INTO `contacts` (`id`, `contact_name`, `type`, `created_by`, `created_at`, `updated_at`, `code`, `email`, `image_url`, `address`, `updated_by`) VALUES
(1, 'SVBK', 'Customer', 18, '2026-03-27 14:48:15', '2026-03-27 14:48:15', 'SVBK', '', NULL, '', NULL),
(2, 'NTHY', 'Customer', 18, '2026-03-27 14:48:25', '2026-03-27 14:48:25', 'NTHY', '', NULL, '', NULL),
(3, 'KHUSH', 'Supplier', 18, '2026-03-27 14:48:37', '2026-03-27 14:48:37', 'KHUSH', '', NULL, '', NULL),
(4, 'AFEL', 'Supplier', 18, '2026-03-27 14:48:45', '2026-03-27 14:48:45', 'AFEL', '', NULL, '', NULL),
(5, 'SSSJ', 'Customer', 29, '2026-04-19 12:51:13', '2026-04-19 12:51:13', 'SSSJ', '', NULL, '', NULL),
(6, 'PHKK', 'Customer', 29, '2026-04-19 13:45:36', '2026-04-19 13:45:36', 'PHKK', '', NULL, '', NULL),
(7, 'KLIP', 'Supplier', 29, '2026-04-22 03:54:33', '2026-04-22 03:54:33', 'KLIP', '', NULL, '', NULL),
(11, 'MHVS', 'Customer', 29, '2026-05-02 13:24:58', '2026-05-02 13:24:58', 'MHVS', '', NULL, '', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `customer_details`
--

CREATE TABLE `customer_details` (
  `id` int NOT NULL,
  `contact_id` int NOT NULL,
  `credit_period` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `billing_address` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `delivery_address` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `gstin` varchar(15) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `pan` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `place_of_supply` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `reverse_charge` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `type_of_registration` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `total_amount` decimal(12,2) DEFAULT NULL,
  `notes` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `payment` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `date` date DEFAULT NULL,
  `order_follow_up` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `no_1` decimal(10,2) DEFAULT NULL,
  `no_2` decimal(10,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `customer_details`
--

INSERT INTO `customer_details` (`id`, `contact_id`, `credit_period`, `billing_address`, `delivery_address`, `gstin`, `pan`, `place_of_supply`, `reverse_charge`, `type_of_registration`, `total_amount`, `notes`, `payment`, `date`, `order_follow_up`, `no_1`, `no_2`) VALUES
(1, 1, '', '', '', '', '', '', 'No', 'Regular', 27140.00, NULL, NULL, NULL, NULL, 12000.00, 15140.00),
(2, 2, '', '', '', '', '', '', 'No', 'Regular', NULL, NULL, NULL, NULL, NULL, NULL, NULL),
(3, 5, '', '', '', '', '', '', 'No', 'Regular', -1.00, NULL, NULL, NULL, NULL, NULL, -1.00),
(4, 6, '', '', '', '', '', '', 'No', 'Regular', -1.00, NULL, NULL, NULL, NULL, NULL, -1.00),
(6, 11, '', '', '', '', '', '', 'No', 'Regular', NULL, NULL, NULL, NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `employees`
--

CREATE TABLE `employees` (
  `id` int NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `age` int DEFAULT NULL,
  `gender` enum('Male','Female','Other') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `mobile` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `profile_photo` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `document_photos` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin,
  `daily_salary` decimal(10,2) NOT NULL COMMENT 'Fixed pay for a standard 10-hour day',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `employee_advances`
--

CREATE TABLE `employee_advances` (
  `id` int NOT NULL,
  `employee_id` int NOT NULL,
  `amount` decimal(15,2) NOT NULL COMMENT 'Original advance amount given',
  `remaining_balance` decimal(15,2) NOT NULL COMMENT 'Amount still pending repayment',
  `reason` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT 'Reason for advance (e.g., emergency, personal)',
  `date` date NOT NULL COMMENT 'Date when advance was given',
  `status` enum('PENDING','PARTIAL','PAID') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT 'PENDING' COMMENT 'PENDING=No repayment, PARTIAL=Some repaid, PAID=Fully repaid',
  `created_by` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `employee_advance_repayments`
--

CREATE TABLE `employee_advance_repayments` (
  `id` int NOT NULL,
  `advance_id` int NOT NULL COMMENT 'Link to employee_advances table',
  `employee_id` int NOT NULL,
  `amount` decimal(15,2) NOT NULL COMMENT 'Amount repaid in this transaction',
  `date` date NOT NULL COMMENT 'Date of repayment',
  `notes` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL COMMENT 'Additional notes for repayment',
  `created_by` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `employee_advance_repayments`
--

INSERT INTO `employee_advance_repayments` (`id`, `advance_id`, `employee_id`, `amount`, `date`, `notes`, `created_by`, `created_at`) VALUES
(1, 1, 10, 1000.00, '2025-12-17', NULL, 18, '2025-12-17 08:16:38'),
(2, 1, 10, 1000.00, '2025-12-17', NULL, 18, '2025-12-17 08:16:57');

-- --------------------------------------------------------

--
-- Stand-in structure for view `employee_advance_summary`
-- (See below for the actual view)
--
CREATE TABLE `employee_advance_summary` (
`employee_id` int
,`employee_name` varchar(255)
,`total_advances` bigint
,`pending_amount` decimal(37,2)
,`total_remaining_balance` decimal(37,2)
,`total_repaid` decimal(37,2)
);

-- --------------------------------------------------------

--
-- Table structure for table `employee_weekly_salary`
--

CREATE TABLE `employee_weekly_salary` (
  `id` int NOT NULL,
  `employee_id` int NOT NULL,
  `week_start_date` date NOT NULL,
  `week_end_date` date NOT NULL,
  `mon_days` decimal(3,1) DEFAULT '0.0',
  `mon_ot` decimal(5,2) DEFAULT '0.00',
  `tue_days` decimal(3,1) DEFAULT '0.0',
  `tue_ot` decimal(5,2) DEFAULT '0.00',
  `wed_days` decimal(3,1) DEFAULT '0.0',
  `wed_ot` decimal(5,2) DEFAULT '0.00',
  `thu_days` decimal(3,1) DEFAULT '0.0',
  `thu_ot` decimal(5,2) DEFAULT '0.00',
  `fri_days` decimal(3,1) DEFAULT '0.0',
  `fri_ot` decimal(5,2) DEFAULT '0.00',
  `sat_days` decimal(3,1) DEFAULT '0.0',
  `sat_ot` decimal(5,2) DEFAULT '0.00',
  `sun_days` decimal(3,1) DEFAULT '0.0',
  `sun_ot` decimal(5,2) DEFAULT '0.00',
  `total_days` decimal(4,1) DEFAULT '0.0',
  `total_ot` decimal(6,2) DEFAULT '0.00',
  `total_salary` decimal(12,2) DEFAULT '0.00',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `employee_work_records`
--

CREATE TABLE `employee_work_records` (
  `id` int NOT NULL,
  `employee_id` int NOT NULL,
  `work_date` date NOT NULL,
  `working_hours` decimal(4,2) NOT NULL,
  `overtime_hours` decimal(4,2) DEFAULT '0.00',
  `daily_salary_paid` decimal(10,2) NOT NULL COMMENT 'Calculated gross pay for the day',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `finishes_table`
--

CREATE TABLE `finishes_table` (
  `id` int NOT NULL,
  `finish` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `finishes_table`
--

INSERT INTO `finishes_table` (`id`, `finish`) VALUES
(4, 'SS'),
(5, 'ANT'),
(6, 'JET BLACK'),
(7, 'PVD RG'),
(8, 'MATT SS'),
(9, 'MATT ANT'),
(10, 'SATIN'),
(11, 'ANT STEEL');

-- --------------------------------------------------------

--
-- Table structure for table `inventory_items`
--

CREATE TABLE `inventory_items` (
  `id` int NOT NULL,
  `item_code` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `user` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `code_user` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `stock_quantity` decimal(15,6) DEFAULT NULL,
  `finish` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `scrap` decimal(15,6) DEFAULT NULL,
  `labour` decimal(15,6) DEFAULT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `kg_dzn` decimal(15,6) DEFAULT NULL,
  `pcs_box` decimal(15,6) DEFAULT NULL,
  `box_ctn` decimal(15,6) DEFAULT NULL,
  `pcs_ctn` decimal(15,6) DEFAULT NULL,
  `kg_box` decimal(15,6) DEFAULT NULL,
  `empty_wt` decimal(15,6) DEFAULT NULL,
  `actual_wt` decimal(15,6) DEFAULT NULL,
  `rate_pcs` decimal(15,6) DEFAULT NULL,
  `base_rate_pcs` decimal(15,6) DEFAULT NULL,
  `rate_adjustment` varchar(20) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `rate_kg` decimal(15,6) DEFAULT NULL,
  `total_kg` decimal(10,2) DEFAULT '0.00',
  `actual_net_kg` decimal(10,2) DEFAULT '0.00',
  `created_by` int DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `pic_or_kg` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `inventory_items`
--

INSERT INTO `inventory_items` (`id`, `item_code`, `user`, `code_user`, `stock_quantity`, `finish`, `scrap`, `labour`, `description`, `kg_dzn`, `pcs_box`, `box_ctn`, `pcs_ctn`, `kg_box`, `empty_wt`, `actual_wt`, `rate_pcs`, `base_rate_pcs`, `rate_adjustment`, `rate_kg`, `total_kg`, `actual_net_kg`, `created_by`, `created_at`, `updated_at`, `pic_or_kg`) VALUES
(1, '3112', 'AFEL', '3112AFEL', 0.000000, '', 0.000000, 90.000000, 'L-HINGE    3 * 1 - 12  SILVER', 1.400000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, NULL, 90.000000, 0.00, 0.00, 18, '2026-03-27 14:59:50', '2026-04-13 14:19:41', 1),
(2, '3119', 'AFEL', '3119AFEL', 0.000000, '', 0.000000, 90.000000, 'L-HINGE    3 * 1 - 19  SILVER', 1.500000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, NULL, 90.000000, 0.00, 0.00, 18, '2026-03-27 14:59:50', '2026-04-13 14:19:41', 1),
(3, '31212', 'AFEL', '31212AFEL', 0.000000, '', 0.000000, 60.000000, 'L-HINGE    3 * 1/2 - 12  SILVER', 1.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, NULL, 60.000000, 0.00, 0.00, 18, '2026-03-27 14:59:50', '2026-04-13 14:19:41', 1),
(4, '31219', 'AFEL', '31219AFEL', 0.000000, '', 0.000000, 60.000000, 'L-HINGE    3 * 1/2 - 19  SILVER', 1.100000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, NULL, 60.000000, 0.00, 0.00, 18, '2026-03-27 14:59:50', '2026-04-13 14:19:41', 1),
(5, '31225', 'AFEL', '31225AFEL', 0.000000, '', 0.000000, 60.000000, 'L-HINGE    3 * 1/2 - 25  SILVER', 1.300000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, NULL, 60.000000, 0.00, 0.00, 18, '2026-03-27 14:59:50', '2026-04-13 14:19:41', 1),
(6, '3125', 'AFEL', '3125AFEL', 0.000000, '', 0.000000, 90.000000, 'L-HINGE    3 * 1 - 25  SILVER', 1.650000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, NULL, 90.000000, 0.00, 0.00, 18, '2026-03-27 14:59:50', '2026-04-13 14:19:41', 1),
(7, '3126', 'AFEL', '3126AFEL', 0.000000, '', 0.000000, 60.000000, 'L-HINGE    3 * 1/2 - 6  SILVER', 0.900000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, NULL, 60.000000, 0.00, 0.00, 18, '2026-03-27 14:59:50', '2026-04-13 14:19:41', 1),
(8, '316', 'AFEL', '316AFEL', 0.000000, '', 0.000000, 90.000000, 'L-HINGE    3 * 1 - 6  SILVER', 1.300000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, NULL, 90.000000, 0.00, 0.00, 18, '2026-03-27 14:59:50', '2026-04-13 14:19:41', 1),
(9, '33412', 'AFEL', '33412AFEL', 0.000000, '', 0.000000, 60.000000, 'L-HINGE    3 * 3/4 - 12  SILVER', 1.200000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, NULL, 60.000000, 0.00, 0.00, 18, '2026-03-27 14:59:50', '2026-04-13 14:19:41', 1),
(10, '33419', 'AFEL', '33419AFEL', 0.000000, '', 0.000000, 60.000000, 'L-HINGE    3 * 3/4 - 19  SILVER', 1.300000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, NULL, 60.000000, 0.00, 0.00, 18, '2026-03-27 14:59:50', '2026-04-13 14:19:41', 1),
(11, '33425', 'AFEL', '33425AFEL', 0.000000, '', 0.000000, 60.000000, 'L-HINGE    3 * 3/4 - 25  SILVER', 1.450000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, NULL, 60.000000, 0.00, 0.00, 18, '2026-03-27 14:59:50', '2026-04-13 14:19:41', 1),
(265, '2131212', 'SVBK', '2131212SVBK', 0.000000, 'SS', 0.000000, 120.000000, 'W-HINGE (2 in 1)   3 * 1/2 - 12  SILVER', 1.300000, 15.000000, 16.000000, 240.000000, 1.690000, 0.000000, 0.060000, 0.000000, NULL, NULL, 120.000000, 0.00, 0.00, 18, '2026-04-13 13:59:32', '2026-04-16 04:59:20', 1),
(266, '2131219', 'SVBK', '2131219SVBK', 0.000000, 'SS', 0.000000, 120.000000, 'W-HINGE (2 in 1)   3 * 1/2 - 19  SILVER', 1.400000, 15.000000, 16.000000, 240.000000, 1.810000, 0.000000, 0.060000, 0.000000, NULL, NULL, 120.000000, 0.00, 0.00, 18, '2026-04-13 13:59:32', '2026-04-16 04:59:20', 1),
(267, '2131225', 'SVBK', '2131225SVBK', 0.000000, 'SS', 0.000000, 150.000000, 'W-HINGE (2 in 1)   3 * 1/2 - 25  SILVER', 1.500000, 15.000000, 16.000000, 240.000000, 1.940000, 0.000000, 0.060000, 0.000000, NULL, NULL, 150.000000, 0.00, 0.00, 18, '2026-04-13 13:59:32', '2026-04-16 04:59:20', 1),
(269, '213126', 'SVBK', '213126SVBK', 0.000000, 'SS', 0.000000, 120.000000, 'W-HINGE (2 in 1)   3 * 1/2 - 6  SILVER', 1.200000, 15.000000, 16.000000, 240.000000, 1.560000, 0.000000, 0.060000, 0.000000, NULL, NULL, 120.000000, 0.00, 0.00, 18, '2026-04-13 13:59:32', '2026-04-16 04:59:20', 1),
(271, '2133412', 'SVBK', '2133412SVBK', 0.000000, 'SS', 0.000000, 120.000000, 'W-HINGE (2 in 1)   3 * 3/4 - 12  SILVER', 1.500000, 12.000000, 16.000000, 192.000000, 1.560000, 0.000000, 0.060000, 0.000000, NULL, NULL, 120.000000, 0.00, 0.00, 18, '2026-04-13 13:59:32', '2026-04-16 04:59:20', 1),
(272, '2133419', 'SVBK', '2133419SVBK', 0.000000, 'SS', 0.000000, 120.000000, 'W-HINGE (2 in 1)   3 * 3/4 - 19  SILVER', 1.600000, 12.000000, 16.000000, 192.000000, 1.660000, 0.000000, 0.060000, 0.000000, NULL, NULL, 120.000000, 0.00, 0.00, 18, '2026-04-13 13:59:32', '2026-04-16 04:59:20', 1),
(273, '2133425', 'SVBK', '2133425SVBK', 0.000000, 'SS', 0.000000, 150.000000, 'W-HINGE (2 in 1)   3 * 3/4 - 25  SILVER', 1.700000, 12.000000, 16.000000, 192.000000, 1.760000, 0.000000, 0.060000, 0.000000, NULL, NULL, 150.000000, 0.00, 0.00, 18, '2026-04-13 13:59:32', '2026-04-16 04:59:20', 1),
(274, '213346', 'SVBK', '213346SVBK', 0.000000, 'SS', 0.000000, 120.000000, 'W-HINGE (2 in 1)   3 * 3/4 - 6  SILVER', 1.400000, 12.000000, 16.000000, 192.000000, 1.460000, 0.000000, 0.060000, 0.000000, NULL, NULL, 120.000000, 0.00, 0.00, 18, '2026-04-13 13:59:32', '2026-04-16 04:59:20', 1),
(277, '2141212', 'SVBK', '2141212SVBK', 0.000000, 'SS', 0.000000, 120.000000, 'W-HINGE (2 in 1)   4 * 1/2 - 12  SILVER', 1.740000, 12.000000, 16.000000, 192.000000, 1.800000, 0.000000, 0.060000, 0.000000, NULL, NULL, 120.000000, 0.00, 0.00, 18, '2026-04-13 13:59:32', '2026-04-16 04:59:20', 1),
(278, '2141219', 'SVBK', '2141219SVBK', 0.000000, 'SS', 0.000000, 120.000000, 'W-HINGE (2 in 1)   4 * 1/2 - 19  SILVER', 1.870000, 12.000000, 16.000000, 192.000000, 1.930000, 0.000000, 0.060000, 0.000000, NULL, NULL, 120.000000, 0.00, 0.00, 18, '2026-04-13 13:59:32', '2026-04-16 04:59:20', 1),
(279, '2141225', 'SVBK', '2141225SVBK', 0.000000, 'SS', 0.000000, 150.000000, 'W-HINGE (2 in 1)   4 * 1/2 - 25  SILVER', 2.000000, 12.000000, 16.000000, 192.000000, 2.060000, 0.000000, 0.060000, 0.000000, NULL, NULL, 150.000000, 0.00, 0.00, 18, '2026-04-13 13:59:32', '2026-04-16 04:59:20', 1),
(281, '214126', 'SVBK', '214126SVBK', 0.000000, 'SS', 0.000000, 120.000000, 'W-HINGE (2 in 1)   4 * 1/2 - 6  SILVER', 1.600000, 12.000000, 16.000000, 192.000000, 1.660000, 0.000000, 0.060000, 0.000000, NULL, NULL, 120.000000, 0.00, 0.00, 18, '2026-04-13 13:59:32', '2026-04-16 04:59:20', 1),
(283, '2143412', 'SVBK', '2143412SVBK', 0.000000, 'SS', 0.000000, 120.000000, 'W-HINGE (2 in 1)   4 * 3/4 - 12  SILVER', 2.000000, 10.000000, 16.000000, 160.000000, 1.730000, 0.000000, 0.060000, 0.000000, NULL, NULL, 120.000000, 0.00, 0.00, 18, '2026-04-13 13:59:32', '2026-04-16 04:59:20', 1),
(284, '2143419', 'SVBK', '2143419SVBK', 0.000000, 'SS', 0.000000, 120.000000, 'W-HINGE (2 in 1)   4 * 3/4 - 19  SILVER', 2.140000, 10.000000, 16.000000, 160.000000, 1.850000, 0.000000, 0.060000, 0.000000, NULL, NULL, 120.000000, 0.00, 0.00, 18, '2026-04-13 13:59:32', '2026-04-16 04:59:20', 1),
(285, '2143425', 'SVBK', '2143425SVBK', 0.000000, 'SS', 0.000000, 150.000000, 'W-HINGE (2 in 1)   4 * 3/4 - 25  SILVER', 2.270000, 10.000000, 16.000000, 160.000000, 1.960000, 0.000000, 0.060000, 0.000000, NULL, NULL, 150.000000, 0.00, 0.00, 18, '2026-04-13 13:59:32', '2026-04-16 04:59:20', 1),
(286, '214346', 'SVBK', '214346SVBK', 0.000000, 'SS', 0.000000, 120.000000, 'W-HINGE (2 in 1)   4 * 3/4 - 6  SILVER', 1.870000, 10.000000, 16.000000, 160.000000, 1.620000, 0.000000, 0.060000, 0.000000, NULL, NULL, 120.000000, 0.00, 0.00, 18, '2026-04-13 13:59:32', '2026-04-16 04:59:20', 1),
(288, '3112', 'SVBK', '3112SVBK', 0.000000, 'SS', 0.000000, 140.000000, 'L-HINGE    3 * 1 - 12  SILVER', 1.400000, 2.000000, 24.000000, 48.000000, 0.280000, 0.000000, 0.050000, 0.000000, NULL, NULL, 140.000000, 0.00, 0.00, 18, '2026-04-13 13:59:32', '2026-04-16 04:59:20', 1),
(289, '3119', 'SVBK', '3119SVBK', 0.000000, 'SS', 0.000000, 140.000000, 'L-HINGE    3 * 1 - 19  SILVER', 1.500000, 12.000000, 24.000000, 288.000000, 1.550000, 0.000000, 0.050000, 0.000000, NULL, NULL, 140.000000, 0.00, 0.00, 18, '2026-04-13 13:59:32', '2026-04-16 04:59:20', 1),
(290, '31212', 'SVBK', '31212SVBK', 0.000000, 'SS', 0.000000, 110.000000, 'L-HINGE    3 * 1/2 - 12  SILVER', 1.000000, 24.000000, 20.000000, 480.000000, 2.050000, 0.000000, 0.050000, 0.000000, NULL, NULL, 110.000000, 0.00, 0.00, 18, '2026-04-13 13:59:32', '2026-04-16 04:59:20', 1),
(291, '31219', 'SVBK', '31219SVBK', 0.000000, 'SS', 0.000000, 110.000000, 'L-HINGE    3 * 1/2 - 19  SILVER', 1.100000, 24.000000, 20.000000, 480.000000, 2.250000, 0.000000, 0.050000, 0.000000, NULL, NULL, 110.000000, 0.00, 0.00, 18, '2026-04-13 13:59:32', '2026-04-16 04:59:20', 1),
(292, '31225', 'SVBK', '31225SVBK', 0.000000, 'SS', 0.000000, 140.000000, 'L-HINGE    3 * 1/2 - 25  SILVER', 1.300000, 24.000000, 20.000000, 480.000000, 2.650000, 0.000000, 0.050000, 0.000000, NULL, NULL, 140.000000, 0.00, 0.00, 18, '2026-04-13 13:59:32', '2026-04-16 04:59:20', 1),
(293, '3125', 'SVBK', '3125SVBK', 0.000000, 'SS', 0.000000, 170.000000, 'L-HINGE    3 * 1 - 25  SILVER', 1.650000, 12.000000, 24.000000, 288.000000, 1.700000, 0.000000, 0.050000, 0.000000, NULL, NULL, 170.000000, 0.00, 0.00, 18, '2026-04-13 13:59:32', '2026-04-16 04:59:20', 1),
(294, '3126', 'SVBK', '3126SVBK', 0.000000, 'SS', 0.000000, 110.000000, 'L-HINGE    3 * 1/2 - 6  SILVER', 0.900000, 24.000000, 24.000000, 576.000000, 1.850000, 0.000000, 0.050000, 0.000000, NULL, NULL, 110.000000, 0.00, 0.00, 18, '2026-04-13 13:59:32', '2026-04-16 04:59:20', 1),
(295, '316', 'SVBK', '316SVBK', 0.000000, 'SS', 0.000000, 140.000000, 'L-HINGE    3 * 1 - 6  SILVER', 1.300000, 12.000000, 24.000000, 288.000000, 1.350000, 0.000000, 0.050000, 0.000000, NULL, NULL, 140.000000, 0.00, 0.00, 18, '2026-04-13 13:59:32', '2026-04-16 04:59:20', 1),
(296, '33412', 'SVBK', '33412SVBK', 0.000000, 'SS', 0.000000, 110.000000, 'L-HINGE    3 * 3/4 - 12  SILVER', 1.200000, 20.000000, 20.000000, 400.000000, 2.050000, 0.000000, 0.050000, 0.000000, NULL, NULL, 110.000000, 0.00, 0.00, 18, '2026-04-13 13:59:32', '2026-04-16 04:59:20', 1),
(297, '33419', 'SVBK', '33419SVBK', 0.000000, 'SS', 0.000000, 110.000000, 'L-HINGE    3 * 3/4 - 19  SILVER', 1.300000, 20.000000, 20.000000, 400.000000, 2.220000, 0.000000, 0.050000, 0.000000, NULL, NULL, 110.000000, 0.00, 0.00, 18, '2026-04-13 13:59:32', '2026-04-16 04:59:20', 1),
(298, '33425', 'SVBK', '33425SVBK', 0.000000, 'SS', 0.000000, 140.000000, 'L-HINGE    3 * 3/4 - 25  SILVER', 1.450000, 18.000000, 20.000000, 360.000000, 2.230000, 0.000000, 0.050000, 0.000000, NULL, NULL, 140.000000, 0.00, 0.00, 18, '2026-04-13 13:59:32', '2026-04-16 04:59:20', 1),
(299, '3346', 'SVBK', '3346SVBK', 0.000000, 'SS', 0.000000, 110.000000, 'L-HINGE    3 * 3/4 - 6  SILVER', 1.150000, 20.000000, 24.000000, 480.000000, 1.960000, 0.000000, 0.050000, 0.000000, NULL, NULL, 110.000000, 0.00, 0.00, 18, '2026-04-13 13:59:32', '2026-04-16 04:59:20', 1),
(301, '4112', 'SVBK', '4112SVBK', 0.000000, 'SS', 0.000000, 140.000000, 'L-HINGE    4 * 1 - 12  SILVER', 1.850000, 8.000000, 24.000000, 192.000000, 1.280000, 0.000000, 0.050000, 0.000000, NULL, NULL, 140.000000, 0.00, 0.00, 18, '2026-04-13 13:59:32', '2026-04-16 04:59:20', 1),
(302, '4119', 'SVBK', '4119SVBK', 0.000000, 'SS', 0.000000, 140.000000, 'L-HINGE    4 * 1 - 19  SILVER', 2.000000, 8.000000, 24.000000, 192.000000, 1.380000, 0.000000, 0.050000, 0.000000, NULL, NULL, 140.000000, 0.00, 0.00, 18, '2026-04-13 13:59:32', '2026-04-16 04:59:20', 1),
(303, '41212', 'SVBK', '41212SVBK', 0.000000, 'SS', 0.000000, 110.000000, 'L-HINGE    4 * 1/2 - 12  SILVER', 1.350000, 15.000000, 24.000000, 360.000000, 1.740000, 0.000000, 0.050000, 0.000000, NULL, NULL, 110.000000, 0.00, 0.00, 18, '2026-04-13 13:59:32', '2026-04-16 04:59:20', 1),
(304, '41219', 'SVBK', '41219SVBK', 0.000000, 'SS', 0.000000, 110.000000, 'L-HINGE    4 * 1/2 - 19  SILVER', 1.470000, 15.000000, 24.000000, 360.000000, 1.880000, 0.000000, 0.050000, 0.000000, NULL, NULL, 110.000000, 0.00, 0.00, 18, '2026-04-13 13:59:32', '2026-04-16 04:59:20', 1),
(305, '41225', 'SVBK', '41225SVBK', 0.000000, 'SS', 0.000000, 140.000000, 'L-HINGE    4 * 1/2 - 25  SILVER', 1.750000, 12.000000, 24.000000, 288.000000, 1.800000, 0.000000, 0.050000, 0.000000, NULL, NULL, 140.000000, 0.00, 0.00, 18, '2026-04-13 13:59:32', '2026-04-16 04:59:20', 1),
(306, '4125', 'SVBK', '4125SVBK', 0.000000, 'SS', 0.000000, 140.000000, 'L-HINGE    4 * 1 - 25  SILVER', 2.200000, 8.000000, 24.000000, 192.000000, 1.510000, 0.000000, 0.050000, 0.000000, NULL, NULL, 140.000000, 0.00, 0.00, 18, '2026-04-13 13:59:32', '2026-04-16 04:59:20', 1),
(307, '4126', 'SVBK', '4126SVBK', 0.000000, 'SS', 0.000000, 110.000000, 'L-HINGE    4 * 1/2 - 6  SILVER', 1.200000, 15.000000, 24.000000, 360.000000, 1.550000, 0.000000, 0.050000, 0.000000, NULL, NULL, 110.000000, 0.00, 0.00, 18, '2026-04-13 13:59:32', '2026-04-16 04:59:20', 1),
(308, '416', 'SVBK', '416SVBK', 0.000000, 'SS', 0.000000, 140.000000, 'L-HINGE    4 * 1 - 6  SILVER', 1.750000, 8.000000, 24.000000, 192.000000, 1.210000, 0.000000, 0.050000, 0.000000, NULL, NULL, 140.000000, 0.00, 0.00, 18, '2026-04-13 13:59:32', '2026-04-16 04:59:20', 1),
(309, '43412', 'SVBK', '43412SVBK', 0.000000, 'SS', 0.000000, 110.000000, 'L-HINGE    4 * 3/4 - 12  SILVER', 1.600000, 10.000000, 24.000000, 240.000000, 1.380000, 0.000000, 0.050000, 0.000000, NULL, NULL, 110.000000, 0.00, 0.00, 18, '2026-04-13 13:59:32', '2026-04-16 04:59:20', 1),
(310, '43419', 'SVBK', '43419SVBK', 0.000000, 'SS', 0.000000, 110.000000, 'L-HINGE    4 * 3/4 - 19  SILVER', 1.750000, 10.000000, 24.000000, 240.000000, 1.500000, 0.000000, 0.050000, 0.000000, NULL, NULL, 110.000000, 0.00, 0.00, 18, '2026-04-13 13:59:32', '2026-04-16 04:59:20', 1),
(311, '43425', 'SVBK', '43425SVBK', 0.000000, 'SS', 0.000000, 140.000000, 'L-HINGE    4 * 3/4 - 25  SILVER', 1.950000, 8.000000, 24.000000, 192.000000, 1.350000, 0.000000, 0.050000, 0.000000, NULL, NULL, 140.000000, 0.00, 0.00, 18, '2026-04-13 13:59:32', '2026-04-16 04:59:20', 1),
(312, '4346', 'SVBK', '4346SVBK', 0.000000, 'SS', 0.000000, 110.000000, 'L-HINGE    4 * 3/4 - 6  SILVER', 1.550000, 10.000000, 24.000000, 240.000000, 1.340000, 0.000000, 0.050000, 0.000000, NULL, NULL, 110.000000, 0.00, 0.00, 18, '2026-04-13 13:59:32', '2026-04-16 04:59:20', 1),
(313, 'L31212', 'SVBK', 'L31212SVBK', 0.000000, 'SS', 0.000000, 110.000000, 'L-LOCK HINGE    3 * 1/2 - 12  SILVER', 1.050000, 24.000000, 20.000000, 480.000000, 2.150000, 0.000000, 0.050000, 0.000000, NULL, NULL, 110.000000, 0.00, 0.00, 18, '2026-04-13 13:59:32', '2026-04-16 04:59:20', 1),
(314, 'L31219', 'SVBK', 'L31219SVBK', 0.000000, 'SS', 0.000000, 110.000000, 'L-LOCK HINGE    3 * 1/2 - 19  SILVER', 1.100000, 24.000000, 20.000000, 480.000000, 2.250000, 0.000000, 0.050000, 0.000000, NULL, NULL, 110.000000, 0.00, 0.00, 18, '2026-04-13 13:59:32', '2026-04-16 04:59:20', 1),
(315, 'L31225', 'SVBK', 'L31225SVBK', 0.000000, 'SS', 0.000000, 150.000000, 'L-LOCK HINGE    3 * 1/2 - 25  SILVER', 1.350000, 24.000000, 20.000000, 480.000000, 2.750000, 0.000000, 0.050000, 0.000000, NULL, NULL, 150.000000, 0.00, 0.00, 18, '2026-04-13 13:59:32', '2026-04-16 04:59:20', 1),
(316, 'L3126', 'SVBK', 'L3126SVBK', 0.000000, 'SS', 0.000000, 110.000000, 'L-LOCK HINGE    3 * 1/2 - 6  SILVER', 0.950000, 24.000000, 24.000000, 576.000000, 1.950000, 0.000000, 0.050000, 0.000000, NULL, NULL, 110.000000, 0.00, 0.00, 18, '2026-04-13 13:59:32', '2026-04-16 04:59:20', 1),
(317, 'L33412', 'SVBK', 'L33412SVBK', 0.000000, 'SS', 0.000000, 110.000000, 'L-LOCK HINGE    3 * 3/4 - 12  SILVER', 1.250000, 20.000000, 20.000000, 400.000000, 2.130000, 0.000000, 0.050000, 0.000000, NULL, NULL, 110.000000, 0.00, 0.00, 18, '2026-04-13 13:59:32', '2026-04-16 04:59:20', 1),
(318, 'L33419', 'SVBK', 'L33419SVBK', 0.000000, 'SS', 0.000000, 110.000000, 'L-LOCK HINGE    3 * 3/4 - 19  SILVER', 1.320000, 20.000000, 20.000000, 400.000000, 2.250000, 0.000000, 0.050000, 0.000000, NULL, NULL, 110.000000, 0.00, 0.00, 18, '2026-04-13 13:59:32', '2026-04-16 04:59:20', 1),
(319, 'L33425', 'SVBK', 'L33425SVBK', 0.000000, 'SS', 0.000000, 150.000000, 'L-LOCK HINGE    3 * 3/4 - 25  SILVER', 1.500000, 18.000000, 20.000000, 360.000000, 2.300000, 0.000000, 0.050000, 0.000000, NULL, NULL, 150.000000, 0.00, 0.00, 18, '2026-04-13 13:59:32', '2026-04-16 04:59:20', 1),
(320, 'L3346', 'SVBK', 'L3346SVBK', 0.000000, 'SS', 0.000000, 110.000000, 'L-LOCK HINGE    3 * 3/4 - 6  SILVER', 1.170000, 20.000000, 24.000000, 480.000000, 2.000000, 0.000000, 0.050000, 0.000000, NULL, NULL, 110.000000, 0.00, 0.00, 18, '2026-04-13 13:59:32', '2026-04-16 04:59:20', 1),
(321, 'L33812', 'SVBK', 'L33812SVBK', 0.000000, 'SS', 0.000000, 110.000000, 'L-LOCK HINGE    3 * 3/8 - 12  SILVER', 0.950000, 24.000000, 24.000000, 576.000000, 1.950000, 0.000000, 0.050000, 0.000000, NULL, NULL, 110.000000, 0.00, 0.00, 18, '2026-04-13 13:59:32', '2026-04-16 04:59:20', 1),
(322, 'L33819', 'SVBK', 'L33819SVBK', 0.000000, 'SS', 0.000000, 110.000000, 'L-LOCK HINGE    3 * 3/8 - 19  SILVER', 1.000000, 24.000000, 24.000000, 576.000000, 2.050000, 0.000000, 0.050000, 0.000000, NULL, NULL, 110.000000, 0.00, 0.00, 18, '2026-04-13 13:59:32', '2026-04-16 04:59:20', 1),
(323, 'L3386', 'SVBK', 'L3386SVBK', 0.000000, 'SS', 0.000000, 110.000000, 'L-LOCK HINGE    3 * 3/8 - 6  SILVER', 0.850000, 24.000000, 24.000000, 576.000000, 1.750000, 0.000000, 0.050000, 0.000000, NULL, NULL, 110.000000, 0.00, 0.00, 18, '2026-04-13 13:59:32', '2026-04-16 04:59:20', 1),
(324, 'L41212', 'SVBK', 'L41212SVBK', 0.000000, 'SS', 0.000000, 110.000000, 'L-LOCK HINGE    4 * 1/2 - 12  SILVER', 1.400000, 15.000000, 24.000000, 360.000000, 1.800000, 0.000000, 0.050000, 0.000000, NULL, NULL, 110.000000, 0.00, 0.00, 18, '2026-04-13 13:59:32', '2026-04-16 04:59:20', 1),
(325, 'L41219', 'SVBK', 'L41219SVBK', 0.000000, 'SS', 0.000000, 110.000000, 'L-LOCK HINGE    4 * 1/2 - 19  SILVER', 1.470000, 15.000000, 24.000000, 360.000000, 1.880000, 0.000000, 0.050000, 0.000000, NULL, NULL, 110.000000, 0.00, 0.00, 18, '2026-04-13 13:59:32', '2026-04-16 04:59:20', 1),
(326, 'L41225', 'SVBK', 'L41225SVBK', 0.000000, 'SS', 0.000000, 150.000000, 'L-LOCK HINGE    4 * 1/2 - 25  SILVER', 1.800000, 8.000000, 24.000000, 192.000000, 1.250000, 0.000000, 0.050000, 0.000000, NULL, NULL, 150.000000, 0.00, 0.00, 18, '2026-04-13 13:59:32', '2026-04-16 04:59:20', 1),
(327, 'L4126', 'SVBK', 'L4126SVBK', 0.000000, 'SS', 0.000000, 110.000000, 'L-LOCK HINGE    4 * 1/2 - 6  SILVER', 1.270000, 8.000000, 24.000000, 192.000000, 0.890000, 0.000000, 0.050000, 0.000000, NULL, NULL, 110.000000, 0.00, 0.00, 18, '2026-04-13 13:59:32', '2026-04-16 04:59:20', 1),
(328, 'L43412', 'SVBK', 'L43412SVBK', 0.000000, 'SS', 0.000000, 110.000000, 'L-LOCK HINGE    4 * 3/4 - 12  SILVER', 1.670000, 10.000000, 24.000000, 240.000000, 1.440000, 0.000000, 0.050000, 0.000000, NULL, NULL, 110.000000, 0.00, 0.00, 18, '2026-04-13 13:59:32', '2026-04-16 04:59:20', 1),
(329, 'L43419', 'SVBK', 'L43419SVBK', 0.000000, 'SS', 0.000000, 110.000000, 'L-LOCK HINGE    4 * 3/4 - 19  SILVER', 1.770000, 10.000000, 24.000000, 240.000000, 1.520000, 0.000000, 0.050000, 0.000000, NULL, NULL, 110.000000, 0.00, 0.00, 18, '2026-04-13 13:59:32', '2026-04-16 04:59:20', 1),
(330, 'L43425', 'SVBK', 'L43425SVBK', 0.000000, 'SS', 0.000000, 150.000000, 'L-LOCK HINGE    4 * 3/4 - 25  SILVER', 2.000000, 8.000000, 24.000000, 192.000000, 1.380000, 0.000000, 0.050000, 0.000000, NULL, NULL, 150.000000, 0.00, 0.00, 18, '2026-04-13 13:59:32', '2026-04-16 04:59:20', 1),
(331, 'L4346', 'SVBK', 'L4346SVBK', 0.000000, 'SS', 0.000000, 110.000000, 'L-LOCK HINGE    4 * 3/4 - 6  SILVER', 1.560000, 10.000000, 24.000000, 240.000000, 1.350000, 0.000000, 0.050000, 0.000000, NULL, NULL, 110.000000, 0.00, 0.00, 18, '2026-04-13 13:59:32', '2026-04-16 04:59:20', 1),
(332, '3346', 'AFEL', '3346AFEL', 0.000000, '', 0.000000, 60.000000, 'L-HINGE    3 * 3/4 - 6  SILVER', 1.150000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, NULL, NULL, 60.000000, 0.00, 0.00, 18, '2026-04-13 14:14:11', '2026-04-13 14:34:07', 1),
(333, 'S10112316', 'SVBK', 'S10112316SVBK', 0.000000, NULL, 0.000000, 0.000000, 'RAILWAY HINGE SM   10 * 1½ * 3/16  GOLD+', 12.100000, 3.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, NULL, NULL, 0.000000, 0.00, 0.00, 18, '2026-04-18 12:44:15', '2026-04-18 13:15:28', NULL),
(334, 'S102316', 'SVBK', 'S102316SVBK', 0.000000, NULL, 0.000000, 0.000000, 'RAILWAY HINGE SM   10 * 2 * 3/16  GOLD+', 14.200000, 3.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, NULL, NULL, 0.000000, 0.00, 0.00, 18, '2026-04-18 12:44:15', '2026-04-18 13:15:28', NULL),
(335, 'S12112316', 'SVBK', 'S12112316SVBK', 0.000000, NULL, 0.000000, 0.000000, 'RAILWAY HINGE SM   12 * 1½ * 3/16  GOLD+', 14.500000, 3.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, NULL, NULL, 0.000000, 0.00, 0.00, 18, '2026-04-18 12:44:15', '2026-04-18 13:15:28', NULL),
(336, 'S122316', 'SVBK', 'S122316SVBK', 0.000000, NULL, 0.000000, 0.000000, 'RAILWAY HINGE SM   12 * 2 * 3/16  GOLD+', 17.050000, 3.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, NULL, NULL, 0.000000, 0.00, 0.00, 18, '2026-04-18 12:44:15', '2026-04-18 13:15:28', NULL),
(337, 'S311', 'SVBK', 'S311SVBK', 0.000000, NULL, 0.000000, 0.000000, 'RAILWAY HINGE SM   3 * 1 *1/8  GOLD+', 1.650000, 18.000000, 0.000000, 0.000000, 2.530000, 0.000000, 0.050000, 0.000000, NULL, NULL, 0.000000, 0.00, 0.00, 18, '2026-04-18 12:44:15', '2026-04-18 13:31:40', NULL),
(338, 'S31532', 'SVBK', 'S31532SVBK', 0.000000, NULL, 0.000000, 0.000000, 'RAILWAY HINGE SM   3 * 1 * 5/32  GOLD+', 2.000000, 12.000000, 0.000000, 0.000000, 2.050000, 0.000000, 0.050000, 0.000000, NULL, NULL, 0.000000, 0.00, 0.00, 18, '2026-04-18 12:44:15', '2026-04-18 13:31:40', NULL),
(339, 'S33434', 'SVBK', 'S33434SVBK', 0.000000, NULL, 0.000000, 0.000000, 'RAILWAY HINGE SM   3 * 3/4 GOLD+', 0.850000, 24.000000, 0.000000, 0.000000, 1.750000, 0.000000, 0.050000, 0.000000, NULL, NULL, 0.000000, 0.00, 0.00, 18, '2026-04-18 12:44:15', '2026-04-18 13:31:40', NULL),
(340, 'S378', 'SVBK', 'S378SVBK', 0.000000, NULL, 0.000000, 0.000000, 'RAILWAY HINGE SM   3 * 7/8   GOLD+', 1.150000, 20.000000, 0.000000, 0.000000, 1.970000, 0.000000, 0.050000, 0.000000, NULL, NULL, 0.000000, 0.00, 0.00, 18, '2026-04-18 12:44:15', '2026-04-18 13:31:40', NULL),
(341, 'S411', 'SVBK', 'S411SVBK', 0.000000, NULL, 0.000000, 0.000000, 'RAILWAY HINGE SM   4 * 1 * 1/8  GOLD+', 2.200000, 6.000000, 0.000000, 0.000000, 1.130000, 0.000000, 0.030000, 0.000000, NULL, NULL, 0.000000, 0.00, 0.00, 18, '2026-04-18 12:44:15', '2026-04-18 13:31:40', NULL),
(342, 'S4114532', 'SVBK', 'S4114532SVBK', 0.000000, NULL, 0.000000, 0.000000, 'RAILWAY HINGE SM   4 * 1¼ * 5/32  GOLD+', 2.900000, 5.000000, 0.000000, 0.000000, 1.240000, 0.000000, 0.030000, 0.000000, NULL, NULL, 0.000000, 0.00, 0.00, 18, '2026-04-18 12:44:15', '2026-04-18 13:31:40', NULL),
(343, 'S411818', 'SVBK', 'S411818SVBK', 0.000000, NULL, 0.000000, 0.000000, 'RAILWAY HINGE SM   4 * 1⅛ * 1/8  GOLD+', 1.850000, 6.000000, 0.000000, 0.000000, 0.950000, 0.000000, 0.030000, 0.000000, NULL, NULL, 0.000000, 0.00, 0.00, 18, '2026-04-18 12:44:15', '2026-04-18 13:31:40', NULL),
(344, 'S4118532', 'SVBK', 'S4118532SVBK', 0.000000, NULL, 0.000000, 0.000000, 'RAILWAY HINGE SM   4 * 1⅛ * 5/32  GOLD+', 2.250000, 6.000000, 0.000000, 0.000000, 1.150000, 0.000000, 0.030000, 0.000000, NULL, NULL, 0.000000, 0.00, 0.00, 18, '2026-04-18 12:44:15', '2026-04-18 13:31:40', NULL),
(345, 'S4118532H', 'SVBK', 'S4118532HSVBK', 0.000000, NULL, 0.000000, 0.000000, 'RAILWAY HINGE SM   4 * 1⅛ * 5/32 H  GOLD+', 2.720000, 5.000000, 0.000000, 0.000000, 1.160000, 0.000000, 0.030000, 0.000000, NULL, NULL, 0.000000, 0.00, 0.00, 18, '2026-04-18 12:44:15', '2026-04-18 13:31:40', NULL),
(346, 'S41532', 'SVBK', 'S41532SVBK', 0.000000, NULL, 0.000000, 0.000000, 'RAILWAY HINGE SM   4 * 1 * 5/32  GOLD+', 2.600000, 5.000000, 0.000000, 0.000000, 1.120000, 0.000000, 0.030000, 0.000000, NULL, NULL, 0.000000, 0.00, 0.00, 18, '2026-04-18 12:44:15', '2026-04-18 13:31:40', NULL),
(347, 'S511', 'SVBK', 'S511SVBK', 0.000000, NULL, 0.000000, 0.000000, 'RAILWAY HINGE SM   5 * 1 * 1/8  GOLD+', 2.750000, 6.000000, 0.000000, 0.000000, 1.410000, 0.000000, 0.030000, 0.000000, NULL, NULL, 0.000000, 0.00, 0.00, 18, '2026-04-18 12:44:15', '2026-04-18 13:31:40', NULL),
(348, 'S5112316', 'SVBK', 'S5112316SVBK', 0.000000, NULL, 0.000000, 0.000000, 'RAILWAY HINGE SM   5 * 1½ * 3/16  GOLD+', 4.800000, 4.000000, 0.000000, 0.000000, 1.630000, 0.000000, 0.030000, 0.000000, NULL, NULL, 0.000000, 0.00, 0.00, 18, '2026-04-18 12:44:15', '2026-04-18 13:31:40', NULL),
(349, 'S5112316H', 'SVBK', 'S5112316HSVBK', 0.000000, NULL, 0.000000, 0.000000, 'RAILWAY HINGE SM   5 * 1½ * 3/16 H  GOLD+', 5.400000, 4.000000, 0.000000, 0.000000, 1.830000, 0.000000, 0.030000, 0.000000, NULL, NULL, 0.000000, 0.00, 0.00, 18, '2026-04-18 12:44:15', '2026-04-18 13:31:40', NULL),
(350, 'S5114316', 'SVBK', 'S5114316SVBK', 0.000000, NULL, 0.000000, 0.000000, 'RAILWAY HINGE SM   5 * 1¼ * 3/16  GOLD+', 4.200000, 5.000000, 0.000000, 0.000000, 1.780000, 0.000000, 0.030000, 0.000000, NULL, NULL, 0.000000, 0.00, 0.00, 18, '2026-04-18 12:44:15', '2026-04-18 13:31:40', NULL),
(351, 'S5114316H', 'SVBK', 'S5114316HSVBK', 0.000000, NULL, 0.000000, 0.000000, 'RAILWAY HINGE SM   5 * 1¼ * 3/16 H  GOLD+', 4.800000, 5.000000, 0.000000, 0.000000, 2.030000, 0.000000, 0.030000, 0.000000, NULL, NULL, 0.000000, 0.00, 0.00, 18, '2026-04-18 12:44:15', '2026-04-18 13:31:40', NULL),
(352, 'S5114532', 'SVBK', 'S5114532SVBK', 0.000000, NULL, 0.000000, 0.000000, 'RAILWAY HINGE SM   5 * 1¼ * 5/32  GOLD+', 3.600000, 5.000000, 0.000000, 0.000000, 1.530000, 0.000000, 0.030000, 0.000000, NULL, NULL, 0.000000, 0.00, 0.00, 18, '2026-04-18 12:44:15', '2026-04-18 13:31:40', NULL),
(353, 'S511818', 'SVBK', 'S511818SVBK', 0.000000, NULL, 0.000000, 0.000000, 'RAILWAY HINGE SM   5 * 1⅛ * 1/8  GOLD+', 2.300000, 6.000000, 0.000000, 0.000000, 1.180000, 0.000000, 0.030000, 0.000000, NULL, NULL, 0.000000, 0.00, 0.00, 18, '2026-04-18 12:44:15', '2026-04-18 13:31:40', NULL),
(354, 'S5118532', 'SVBK', 'S5118532SVBK', 0.000000, NULL, 0.000000, 0.000000, 'RAILWAY HINGE SM   5 * 1⅛ * 5/32  GOLD+', 2.800000, 6.000000, 0.000000, 0.000000, 1.430000, 0.000000, 0.030000, 0.000000, NULL, NULL, 0.000000, 0.00, 0.00, 18, '2026-04-18 12:44:15', '2026-04-18 13:31:40', NULL),
(355, 'S5118532H', 'SVBK', 'S5118532HSVBK', 0.000000, NULL, 0.000000, 0.000000, 'RAILWAY HINGE SM   5 * 1⅛ * 5/32 H  GOLD+', 3.400000, 5.000000, 0.000000, 0.000000, 1.450000, 0.000000, 0.030000, 0.000000, NULL, NULL, 0.000000, 0.00, 0.00, 18, '2026-04-18 12:44:15', '2026-04-18 13:31:40', NULL),
(356, 'S51532', 'SVBK', 'S51532SVBK', 0.000000, NULL, 0.000000, 0.000000, 'RAILWAY HINGE SM   5 * 1 * 5/32  GOLD+', 3.250000, 5.000000, 0.000000, 0.000000, 1.390000, 0.000000, 0.030000, 0.000000, NULL, NULL, 0.000000, 0.00, 0.00, 18, '2026-04-18 12:44:15', '2026-04-18 13:31:40', NULL),
(357, 'S6112316', 'SVBK', 'S6112316SVBK', 0.000000, NULL, 0.000000, 0.000000, 'RAILWAY HINGE SM   6 * 1½ * 3/16  GOLD+', 5.800000, 4.000000, 0.000000, 0.000000, 2.450000, 0.000000, 0.040000, 0.000000, NULL, NULL, 0.000000, 0.00, 0.00, 18, '2026-04-18 12:44:15', '2026-04-18 13:31:40', NULL),
(358, 'S6112316H', 'SVBK', 'S6112316HSVBK', 0.000000, NULL, 0.000000, 0.000000, 'RAILWAY HINGE SM   6 * 1½ * 3/16 H  GOLD+', 6.500000, 5.000000, 0.000000, 0.000000, 2.750000, 0.000000, 0.040000, 0.000000, NULL, NULL, 0.000000, 0.00, 0.00, 18, '2026-04-18 12:44:15', '2026-04-18 13:31:40', NULL),
(359, 'S6114316', 'SVBK', 'S6114316SVBK', 0.000000, NULL, 0.000000, 0.000000, 'RAILWAY HINGE SM   6 * 1¼ * 3/16   GOLD+', 5.050000, 5.000000, 0.000000, 0.000000, 2.150000, 0.000000, 0.040000, 0.000000, NULL, NULL, 0.000000, 0.00, 0.00, 18, '2026-04-18 12:44:15', '2026-04-18 13:31:40', NULL),
(360, 'S6114316H', 'SVBK', 'S6114316HSVBK', 0.000000, NULL, 0.000000, 0.000000, 'RAILWAY HINGE SM   6 * 1¼ * 3/16 H  GOLD+', 5.800000, 5.000000, 0.000000, 0.000000, 2.450000, 0.000000, 0.040000, 0.000000, NULL, NULL, 0.000000, 0.00, 0.00, 18, '2026-04-18 12:44:15', '2026-04-18 13:31:40', NULL),
(361, 'S6114532', 'SVBK', 'S6114532SVBK', 0.000000, NULL, 0.000000, 0.000000, 'RAILWAY HINGE SM   6 * 1¼ * 5/32  GOLD+', 4.320000, 5.000000, 0.000000, 0.000000, 1.840000, 0.000000, 0.040000, 0.000000, NULL, NULL, 0.000000, 0.00, 0.00, 18, '2026-04-18 12:44:15', '2026-04-18 13:31:40', NULL),
(362, 'S6118532', 'SVBK', 'S6118532SVBK', 0.000000, NULL, 0.000000, 0.000000, 'RAILWAY HINGE SM   6 * 1⅛ * 5/32  GOLD+', 3.400000, 6.000000, 0.000000, 0.000000, 1.740000, 0.000000, 0.040000, 0.000000, NULL, NULL, 0.000000, 0.00, 0.00, 18, '2026-04-18 12:44:15', '2026-04-18 13:31:40', NULL),
(363, 'S6118532H', 'SVBK', 'S6118532HSVBK', 0.000000, NULL, 0.000000, 0.000000, 'RAILWAY HINGE SM   6 * 1⅛ * 5/32 H  GOLD+', 4.100000, 5.000000, 0.000000, 0.000000, 1.750000, 0.000000, 0.040000, 0.000000, NULL, NULL, 0.000000, 0.00, 0.00, 18, '2026-04-18 12:44:15', '2026-04-18 13:31:40', NULL),
(364, 'S62316', 'SVBK', 'S62316SVBK', 0.000000, NULL, 0.000000, 0.000000, 'RAILWAY HINGE SM   6 * 2 * 3/16  GOLD+', 8.900000, 4.000000, 0.000000, 0.000000, 3.030000, 0.000000, 0.060000, 0.000000, NULL, NULL, 0.000000, 0.00, 0.00, 18, '2026-04-18 12:44:15', '2026-04-18 13:31:40', NULL),
(365, 'S8112316', 'SVBK', 'S8112316SVBK', 0.000000, NULL, 0.000000, 0.000000, 'RAILWAY HINGE SM   8 * 1½ * 3/16  GOLD+', 8.700000, 4.000000, 0.000000, 0.000000, 2.950000, 0.000000, 0.040000, 0.000000, NULL, NULL, 0.000000, 0.00, 0.00, 18, '2026-04-18 12:44:15', '2026-04-18 13:15:28', NULL),
(366, 'S8112316H', 'SVBK', 'S8112316HSVBK', 0.000000, NULL, 0.000000, 0.000000, 'RAILWAY HINGE SM   8 * 1½ * 3/16 H  GOLD+', 9.600000, 4.000000, 0.000000, 0.000000, 3.240000, 0.000000, 0.040000, 0.000000, NULL, NULL, 0.000000, 0.00, 0.00, 18, '2026-04-18 12:44:15', '2026-04-18 13:15:28', NULL),
(367, 'S8114316', 'SVBK', 'S8114316SVBK', 0.000000, NULL, 0.000000, 0.000000, 'RAILWAY HINGE SM   8 * 1¼ * 3/16  GOLD+', 7.700000, 5.000000, 0.000000, 0.000000, 3.250000, 0.000000, 0.040000, 0.000000, NULL, NULL, 0.000000, 0.00, 0.00, 18, '2026-04-18 12:44:15', '2026-04-18 13:15:28', NULL),
(368, 'S82316', 'SVBK', 'S82316SVBK', 0.000000, NULL, 0.000000, 0.000000, 'RAILWAY HINGE SM   8 * 2 * 3/16  GOLD+', 11.900000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.070000, 0.000000, NULL, NULL, 0.000000, 0.00, 0.00, 18, '2026-04-18 12:44:15', '2026-04-18 13:07:31', NULL),
(402, 'ST312', 'PHKK', 'ST312PHKK', 0.000000, NULL, 0.000000, 0.000000, 'STEEL HINGE JINDAL   3 x 12', 1.128000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, NULL, NULL, 0.000000, 0.00, 0.00, 29, '2026-04-20 10:51:29', '2026-04-20 14:08:57', NULL),
(403, 'ST31234', 'PHKK', 'ST31234PHKK', 0.000000, NULL, 0.000000, 0.000000, 'STEEL HINGE JINDAL   3 x 1/2 x 3/4', 0.504000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, NULL, NULL, 0.000000, 0.00, 0.00, 29, '2026-04-20 10:51:29', '2026-04-20 14:08:57', NULL),
(404, 'ST31234ANT', 'PHKK', 'ST31234ANTPHKK', 0.000000, 'ANT STEEL', 0.000000, 0.000000, 'STEEL HINGE JINDAL   3 x 1/2 x 3/4 ANT', 0.504000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, NULL, NULL, 0.000000, 0.00, 0.00, 29, '2026-04-20 10:51:29', '2026-04-20 14:16:25', NULL),
(405, 'ST312ANT', 'PHKK', 'ST312ANTPHKK', 0.000000, 'ANT STEEL', 0.000000, 0.000000, 'STEEL HINGE JINDAL   3 x 12 ANT', 1.128000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, NULL, NULL, 0.000000, 0.00, 0.00, 29, '2026-04-20 10:51:29', '2026-04-20 14:16:25', NULL),
(407, 'ST314ANT', 'PHKK', 'ST314ANTPHKK', 0.000000, 'ANT STEEL', 0.000000, 0.000000, 'STEEL HINGE JINDAL   3 x 14 ANT', 0.828000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, NULL, NULL, 0.000000, 0.00, 0.00, 29, '2026-04-20 10:51:29', '2026-04-20 14:16:25', NULL),
(408, 'ST316', 'PHKK', 'ST316PHKK', 0.000000, 'SATIN', 152.600000, 83.000000, 'STEEL HINGE JINDAL   3 x 16', 0.672000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 15.436512, 13.193600, '17%', 235.600000, 0.00, 0.00, 29, '2026-04-20 10:51:29', '2026-04-20 14:56:30', NULL),
(409, 'ST316ANT', 'PHKK', 'ST316ANTPHKK', 0.000000, 'ANT STEEL', 0.000000, 0.000000, 'STEEL HINGE JINDAL   3 x 16 ANT', 0.672000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, NULL, NULL, 0.000000, 0.00, 0.00, 29, '2026-04-20 10:51:29', '2026-04-20 14:16:25', NULL),
(410, 'ST33434', 'PHKK', 'ST33434PHKK', 0.000000, 'SATIN', 152.600000, 105.000000, 'STEEL HINGE JINDAL   3 x 3/4 x 3/4', 0.564000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 14.165424, 12.107200, '17%', 257.600000, 0.00, 0.00, 29, '2026-04-20 10:51:29', '2026-04-20 14:56:30', NULL),
(411, 'ST33434ANT', 'PHKK', 'ST33434ANTPHKK', 0.000000, 'ANT STEEL', 0.000000, 0.000000, 'STEEL HINGE JINDAL   3 x 3/4 x 3/4 ANT', 0.564000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, NULL, NULL, 0.000000, 0.00, 0.00, 29, '2026-04-20 10:51:29', '2026-04-20 14:16:25', NULL),
(412, 'ST412', 'PHKK', 'ST412PHKK', 0.000000, 'SATIN', 152.600000, 48.000000, 'STEEL HINGE JINDAL   4 x 12', 1.824000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 35.674704, 30.491200, '17%', 200.600000, 0.00, 0.00, 29, '2026-04-20 10:51:29', '2026-04-20 14:56:30', NULL),
(413, 'ST41234', 'PHKK', 'ST41234PHKK', 0.000000, 'SATIN', 152.600000, 85.000000, 'STEEL HINGE JINDAL   4 x 1/2 x 3/4', 0.672000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 15.567552, 13.305600, '17%', 237.600000, 0.00, 0.00, 29, '2026-04-20 10:51:29', '2026-04-20 14:56:30', NULL),
(414, 'ST41234ANT', 'PHKK', 'ST41234ANTPHKK', 0.000000, 'ANT STEEL', 0.000000, 0.000000, 'STEEL HINGE JINDAL   4 x 1/2 x 3/4 ANT', 0.672000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, NULL, NULL, 0.000000, 0.00, 0.00, 29, '2026-04-20 10:51:29', '2026-04-20 14:16:25', NULL),
(415, 'ST412ANT', 'PHKK', 'ST412ANTPHKK', 0.000000, 'ANT STEEL', 0.000000, 0.000000, 'STEEL HINGE JINDAL   4 x 12 ANT', 1.824000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, NULL, NULL, 0.000000, 0.00, 0.00, 29, '2026-04-20 10:51:29', '2026-04-20 14:16:25', NULL),
(416, 'ST414', 'PHKK', 'ST414PHKK', 0.000000, 'SATIN', 152.600000, 50.000000, 'STEEL HINGE JINDAL   4 x 14', 1.392000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 27.496872, 23.501600, '17%', 202.600000, 0.00, 0.00, 29, '2026-04-20 10:51:29', '2026-04-20 14:56:30', NULL),
(417, 'ST414ANT', 'PHKK', 'ST414ANTPHKK', 0.000000, 'ANT STEEL', 0.000000, 0.000000, 'STEEL HINGE JINDAL   4 x 14 ANT', 1.392000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, NULL, NULL, 0.000000, 0.00, 0.00, 29, '2026-04-20 10:51:29', '2026-04-20 14:16:25', NULL),
(418, 'ST43434', 'PHKK', 'ST43434PHKK', 0.000000, 'SATIN', 152.600000, 80.000000, 'STEEL HINGE JINDAL   4 x 3/4 x 3/4', 0.780000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 17.689230, 15.119000, '17%', 232.600000, 0.00, 0.00, 29, '2026-04-20 10:51:29', '2026-04-20 14:56:30', NULL),
(419, 'ST43434ANT', 'PHKK', 'ST43434ANTPHKK', 0.000000, 'ANT STEEL', 0.000000, 0.000000, 'STEEL HINGE JINDAL   4 x 3/4 x 3/4 ANT', 0.780000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, NULL, NULL, 0.000000, 0.00, 0.00, 29, '2026-04-20 10:51:29', '2026-04-20 14:16:25', NULL),
(423, 'ST5112ANT', 'PHKK', 'ST5112ANTPHKK', 0.000000, 'ANT STEEL', 0.000000, 0.000000, 'STEEL HINGE JINDAL   5 x 1.1/2 ANT', 2.940000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, NULL, NULL, 0.000000, 0.00, 0.00, 29, '2026-04-20 10:51:29', '2026-04-20 14:16:25', NULL),
(425, 'ST5114ANT', 'PHKK', 'ST5114ANTPHKK', 0.000000, 'ANT STEEL', 0.000000, 0.000000, 'STEEL HINGE JINDAL   5 x 1.1/4 ANT', 2.628000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, NULL, NULL, 0.000000, 0.00, 0.00, 29, '2026-04-20 10:51:29', '2026-04-20 14:16:25', NULL),
(426, 'ST512', 'PHKK', 'ST512PHKK', 0.000000, 'SATIN', 152.600000, 39.000000, 'STEEL HINGE JINDAL   5 x 12', 2.460000, 12.000000, 20.000000, 240.000000, 2.500000, 0.050000, 0.040000, 45.130422, 39.278000, '14.90%', 191.600000, 0.00, 0.00, 29, '2026-04-20 10:51:29', '2026-04-28 19:09:18', 0),
(427, 'ST512ANT', 'PHKK', 'ST512ANTPHKK', 0.000000, 'ANT STEEL', 162.410000, 79.000000, 'STEEL HINGE JINDAL   5 x 12 ANT', 2.460000, 12.000000, 20.000000, 240.000000, 2.520000, 0.000000, 0.050000, 55.922683, 49.489100, '13%', 241.410000, 0.00, 0.00, 29, '2026-04-20 10:51:29', '2026-04-30 20:50:13', NULL),
(428, 'ST514', 'PHKK', 'ST514PHKK', 0.000000, 'SATIN', 152.600000, 48.000000, 'STEEL HINGE JINDAL   5 x 14', 1.824000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 35.674704, 30.491200, '17%', 200.600000, 0.00, 0.00, 29, '2026-04-20 10:51:29', '2026-04-20 14:56:30', NULL),
(429, 'ST514ANT', 'PHKK', 'ST514ANTPHKK', 0.000000, 'ANT STEEL', 0.000000, 0.000000, 'STEEL HINGE JINDAL   5 x 14 ANT', 1.824000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, NULL, NULL, 0.000000, 0.00, 0.00, 29, '2026-04-20 10:51:29', '2026-04-20 14:16:25', NULL),
(433, 'ST6112ANT', 'PHKK', 'ST6112ANTPHKK', 0.000000, 'ANT STEEL', 0.000000, 0.000000, 'STEEL HINGE JINDAL   6 x 1.1/2 ANT', 3.588000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, NULL, NULL, 0.000000, 0.00, 0.00, 29, '2026-04-20 10:51:29', '2026-04-20 14:16:25', NULL),
(435, 'ST6114ANT', 'PHKK', 'ST6114ANTPHKK', 0.000000, 'ANT STEEL', 0.000000, 0.000000, 'STEEL HINGE JINDAL   6 x 1.1/4 ANT', 3.132000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, NULL, NULL, 0.000000, 0.00, 0.00, 29, '2026-04-20 10:51:29', '2026-04-20 14:16:25', NULL),
(436, 'ST612', 'PHKK', 'ST612PHKK', 0.000000, 'SATIN', 152.600000, 50.000000, 'STEEL HINGE JINDAL   6 x 12', 2.940000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 57.747686, 49.637000, '16.34%', 202.600000, 0.00, 0.00, 29, '2026-04-20 10:51:29', '2026-04-20 14:56:30', 0),
(437, 'ST612ANT', 'PHKK', 'ST612ANTPHKK', 0.000000, 'ANT STEEL', 152.600000, 90.000000, 'STEEL HINGE JINDAL   6 x 12 ANT', 2.940000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 69.149006, 59.437000, '16.34%', 242.600000, 0.00, 0.00, 29, '2026-04-20 10:51:29', '2026-04-20 14:10:27', 0),
(441, 'ST31234STN', 'KLIP', 'ST31234STNKLIP', 0.000000, NULL, NULL, 110.000000, 'STEEL HINGE JINDAL   3 x 1/2 x 3/4', 0.504000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 4.620000, 4.620000, NULL, 110.000000, 0.00, 0.00, 29, '2026-04-22 03:58:04', '2026-04-22 04:05:11', 1),
(442, 'ST312LSTN', 'KLIP', 'ST312LSTNKLIP', 0.000000, NULL, NULL, NULL, 'STEEL HINGE JINDAL   3 x 12 L', 0.960000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, NULL, NULL, NULL, 0.000000, 0.00, 0.00, 29, '2026-04-22 03:58:04', '2026-04-22 04:00:41', 1),
(443, 'ST312STN', 'KLIP', 'ST312STNKLIP', 0.000000, NULL, NULL, 75.000000, 'STEEL HINGE JINDAL   3 x 12', 1.128000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 7.050000, 7.050000, NULL, 75.000000, 0.00, 0.00, 29, '2026-04-22 03:58:04', '2026-04-22 04:05:11', 1),
(444, 'ST314STN', 'KLIP', 'ST314STNKLIP', 0.000000, NULL, NULL, 75.000000, 'STEEL HINGE JINDAL   3 x 14', 0.828000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 5.175000, 5.175000, NULL, 75.000000, 0.00, 0.00, 29, '2026-04-22 03:58:04', '2026-04-22 04:05:11', 1),
(445, 'ST316HSTN', 'KLIP', 'ST316HSTNKLIP', 0.000000, NULL, NULL, NULL, 'STEEL HINGE JINDAL   3 x 16 H', 0.756000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, NULL, NULL, NULL, 0.000000, 0.00, 0.00, 29, '2026-04-22 03:58:04', '2026-04-22 04:00:41', 1),
(446, 'ST316STN', 'KLIP', 'ST316STNKLIP', 0.000000, NULL, NULL, 83.000000, 'STEEL HINGE JINDAL   3 x 16', 0.672000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 4.648000, 4.648000, NULL, 83.000000, 0.00, 0.00, 29, '2026-04-22 03:58:04', '2026-04-22 04:05:11', 1),
(447, 'ST33434STN', 'KLIP', 'ST33434STNKLIP', 0.000000, NULL, NULL, 105.000000, 'STEEL HINGE JINDAL   3 x 3/4 x 3/4', 0.564000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 4.935000, 4.935000, NULL, 105.000000, 0.00, 0.00, 29, '2026-04-22 03:58:04', '2026-04-22 04:05:11', 1),
(448, 'ST410STN', 'KLIP', 'ST410STNKLIP', 0.000000, NULL, NULL, NULL, 'STEEL HINGE JINDAL   4 x 10', 2.700000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, NULL, NULL, NULL, 0.000000, 0.00, 0.00, 29, '2026-04-22 03:58:04', '2026-04-22 04:00:41', 1),
(449, 'ST41234STN', 'KLIP', 'ST41234STNKLIP', 0.000000, NULL, NULL, 85.000000, 'STEEL HINGE JINDAL   4 x 1/2 x 3/4', 0.672000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 4.760000, 4.760000, NULL, 85.000000, 0.00, 0.00, 29, '2026-04-22 03:58:04', '2026-04-22 04:05:11', 1),
(450, 'ST412LSTN', 'KLIP', 'ST412LSTNKLIP', 0.000000, NULL, NULL, NULL, 'STEEL HINGE JINDAL   4 x 12 L', 1.584000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, NULL, NULL, NULL, 0.000000, 0.00, 0.00, 29, '2026-04-22 03:58:04', '2026-04-22 04:00:41', 1),
(451, 'ST412STN', 'KLIP', 'ST412STNKLIP', 0.000000, NULL, NULL, 44.000000, 'STEEL HINGE JINDAL   4 x 12', 1.824000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 6.688000, 6.688000, NULL, 44.000000, 0.00, 0.00, 29, '2026-04-22 03:58:04', '2026-04-22 04:05:11', 1),
(452, 'ST414STN', 'KLIP', 'ST414STNKLIP', 0.000000, NULL, NULL, 50.000000, 'STEEL HINGE JINDAL   4 x 14', 1.392000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 5.800000, 5.800000, NULL, 50.000000, 0.00, 0.00, 29, '2026-04-22 03:58:04', '2026-04-22 04:05:11', 1),
(453, 'ST43434STN', 'KLIP', 'ST43434STNKLIP', 0.000000, NULL, NULL, 80.000000, 'STEEL HINGE JINDAL   4 x 3/4 x 3/4', 0.780000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 5.200000, 5.200000, NULL, 80.000000, 0.00, 0.00, 29, '2026-04-22 03:58:04', '2026-04-22 04:05:11', 1),
(455, 'ST5112STN', 'KLIP', 'ST5112STNKLIP', 0.000000, NULL, NULL, NULL, 'STEEL HINGE JINDAL   5 x 1.1/2', 2.940000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, NULL, NULL, NULL, 0.000000, 0.00, 0.00, 29, '2026-04-22 03:58:04', '2026-04-22 04:00:41', 1),
(456, 'ST5114STN', 'KLIP', 'ST5114STNKLIP', 0.000000, NULL, NULL, NULL, 'STEEL HINGE JINDAL   5 x 1.1/4', 2.628000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, NULL, NULL, NULL, 0.000000, 0.00, 0.00, 29, '2026-04-22 03:58:04', '2026-04-22 04:00:41', 1),
(457, 'ST512HSTN', 'KLIP', 'ST512HSTNKLIP', 0.000000, NULL, NULL, NULL, 'STEEL HINGE JINDAL   5 x 12 H', 2.520000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, NULL, NULL, NULL, 0.000000, 0.00, 0.00, 29, '2026-04-22 03:58:04', '2026-04-22 04:00:41', 1),
(458, 'ST512LSTN', 'KLIP', 'ST512LSTNKLIP', 0.000000, NULL, NULL, 40.000000, 'STEEL HINGE JINDAL   5 x 12 L', 2.160000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 7.200000, 7.200000, NULL, 40.000000, 0.00, 0.00, 29, '2026-04-22 03:58:04', '2026-04-22 04:19:52', 1),
(459, 'ST512STN', 'KLIP', 'ST512STNKLIP', 0.000000, NULL, NULL, 39.000000, 'STEEL HINGE JINDAL   5 x 12', 2.460000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 7.995000, 7.995000, NULL, 39.000000, 0.00, 0.00, 29, '2026-04-22 03:58:04', '2026-04-22 04:05:11', 1),
(460, 'ST514STN', 'KLIP', 'ST514STNKLIP', 0.000000, NULL, NULL, 47.000000, 'STEEL HINGE JINDAL   5 x 14', 1.824000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 7.144000, 7.144000, NULL, 47.000000, 0.00, 0.00, 29, '2026-04-22 03:58:04', '2026-04-22 04:05:11', 1),
(462, 'ST6112STN', 'KLIP', 'ST6112STNKLIP', 0.000000, NULL, NULL, NULL, 'STEEL HINGE JINDAL   6 x 1.1/2', 3.588000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, NULL, NULL, NULL, 0.000000, 0.00, 0.00, 29, '2026-04-22 03:58:04', '2026-04-22 04:00:04', 1),
(463, 'ST6114STN', 'KLIP', 'ST6114STNKLIP', 0.000000, NULL, NULL, NULL, 'STEEL HINGE JINDAL   6 x 1.1/4', 3.132000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, NULL, NULL, NULL, 0.000000, 0.00, 0.00, 29, '2026-04-22 03:58:04', '2026-04-22 04:00:04', 1),
(464, 'ST612STN', 'KLIP', 'ST612STNKLIP', 0.000000, NULL, NULL, 46.000000, 'STEEL HINGE JINDAL   6 x 12', 2.940000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 11.270000, 11.270000, NULL, 46.000000, 0.00, 0.00, 29, '2026-04-22 03:58:04', '2026-04-22 04:19:52', 1),
(465, 'ST512ANT', 'NTHY', 'ST512ANTNTHY', 0.000000, 'ANT STEEL', 100.000000, 40.000000, 'STEEL HINGE JINDAL   5 x 12 ANT', 2.460000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 31.570000, 28.700000, '10%', 140.000000, 0.00, 0.00, 29, '2026-04-28 14:18:52', '2026-04-28 14:18:52', 1),
(466, 'ST31234STN', 'MHVS', 'ST31234STNMHVS', 0.000000, NULL, 146.000000, 110.000000, 'STEEL HINGE JINDAL   3 x 1/2 x 3/4', 0.504000, 30.000000, 24.000000, 720.000000, 1.310000, 0.000000, 0.050000, 13.224960, 10.752000, '23%', 256.000000, 0.00, 0.00, 29, '2026-05-02 13:27:09', '2026-05-02 16:06:09', NULL),
(467, 'ST316STN', 'MHVS', 'ST316STNMHVS', 0.000000, NULL, 146.000000, 85.000000, 'STEEL HINGE JINDAL   3 x 16', 0.672000, 30.000000, 24.000000, 720.000000, 1.730000, 0.000000, 0.050000, 15.911280, 12.936000, '23%', 231.000000, 0.00, 0.00, 29, '2026-05-02 13:27:09', '2026-05-02 16:06:09', NULL),
(468, 'ST33434STN', 'MHVS', 'ST33434STNMHVS', 0.000000, '', 146.000000, 105.000000, 'STEEL HINGE JINDAL   3 x 3/4 x 3/4', 0.564000, 30.000000, 24.000000, 720.000000, 0.000000, 0.000000, 0.050000, 14.510310, 11.797000, '23%', 251.000000, 0.00, 0.00, 29, '2026-05-02 13:27:09', '2026-05-02 16:09:02', 0),
(469, 'ST41234STN', 'MHVS', 'ST41234STNMHVS', 0.000000, NULL, 146.000000, 86.000000, 'STEEL HINGE JINDAL   4 x 1/2 x 3/4', 0.672000, 24.000000, 24.000000, 576.000000, 0.000000, 0.000000, 0.050000, 15.980160, 12.992000, '23%', 232.000000, 0.00, 0.00, 29, '2026-05-02 13:27:09', '2026-05-02 16:08:01', NULL),
(470, 'ST412STN', 'MHVS', 'ST412STNMHVS', 0.000000, '', 146.000000, 51.000000, 'STEEL HINGE JINDAL   4 x 12', 1.824000, 12.000000, 24.000000, 288.000000, 0.000000, 0.000000, 0.050000, 36.831120, 29.944000, '23%', 197.000000, 0.00, 0.00, 29, '2026-05-02 13:27:09', '2026-05-02 16:08:01', 0),
(471, 'ST414STN', 'MHVS', 'ST414STNMHVS', 0.000000, NULL, 146.000000, 53.000000, 'STEEL HINGE JINDAL   4 x 14', 1.392000, 12.000000, 24.000000, 288.000000, 1.440000, 0.000000, 0.050000, 28.393320, 23.084000, '23%', 199.000000, 0.00, 0.00, 29, '2026-05-02 13:27:09', '2026-05-02 16:06:09', NULL),
(472, 'ST43434STN', 'MHVS', 'ST43434STNMHVS', 0.000000, '', 146.000000, 81.000000, 'STEEL HINGE JINDAL   4 x 3/4 x 3/4', 0.780000, 24.000000, 24.000000, 576.000000, 1.610000, 0.000000, 0.050000, 18.148650, 14.755000, '23%', 227.000000, 0.00, 0.00, 29, '2026-05-02 13:27:09', '2026-05-02 16:06:54', 0),
(474, 'ST512STN', 'MHVS', 'ST512STNMHVS', 0.000000, '', 146.000000, 42.000000, 'STEEL HINGE JINDAL   5 x 12', 2.460000, 12.000000, 20.000000, 240.000000, 2.460000, 0.000000, 0.050000, 47.404200, 38.540000, '23%', 188.000000, 0.00, 0.00, 29, '2026-05-02 13:27:09', '2026-05-02 16:06:37', 0),
(475, 'ST514STN', 'MHVS', 'ST514STNMHVS', 0.000000, NULL, 146.000000, 51.000000, 'STEEL HINGE JINDAL   5 x 14', 1.824000, 12.000000, 20.000000, 240.000000, 1.870000, 0.000000, 0.050000, 36.831120, 29.944000, '23%', 197.000000, 0.00, 0.00, 29, '2026-05-02 13:27:09', '2026-05-02 16:06:09', NULL),
(477, 'ST612STN', 'MHVS', 'ST612STNMHVS', 0.000000, NULL, 146.000000, 50.000000, 'STEEL HINGE JINDAL   6 x 12', 2.940000, 0.000000, 0.000000, 0.000000, 3.000000, 0.000000, 0.060000, 59.064600, 48.020000, '23%', 196.000000, 0.00, 0.00, 29, '2026-05-02 13:27:09', '2026-05-02 16:06:09', NULL),
(479, 'ST31234ANT', 'MHVS', 'ST31234ANTMHVS', 0.000000, NULL, 146.000000, 158.000000, 'STEEL HINGE JINDAL   3 x 1/2 x 3/4 ANT', 0.504000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 15.704640, 12.768000, '23%', 304.000000, 0.00, 0.00, 29, '2026-05-02 13:28:10', '2026-05-02 15:44:55', NULL),
(480, 'ST316ANT', 'MHVS', 'ST316ANTMHVS', 0.000000, NULL, 146.000000, 133.000000, 'STEEL HINGE JINDAL   3 x 16 ANT', 0.672000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 19.217520, 15.624000, '23%', 279.000000, 0.00, 0.00, 29, '2026-05-02 13:28:10', '2026-05-02 15:44:55', NULL),
(481, 'ST33434ANT', 'MHVS', 'ST33434ANTMHVS', 0.000000, NULL, 146.000000, 153.000000, 'STEEL HINGE JINDAL   3 x 3/4 x 3/4 ANT', 0.564000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 17.285190, 14.053000, '23%', 299.000000, 0.00, 0.00, 29, '2026-05-02 13:28:10', '2026-05-02 15:44:55', NULL),
(482, 'ST41234ANT', 'MHVS', 'ST41234ANTMHVS', 0.000000, NULL, 146.000000, 134.000000, 'STEEL HINGE JINDAL   4 x 1/2 x 3/4 ANT', 0.672000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 19.286400, 15.680000, '23%', 280.000000, 0.00, 0.00, 29, '2026-05-02 13:28:10', '2026-05-02 15:44:55', NULL),
(483, 'ST412ANT', 'MHVS', 'ST412ANTMHVS', 0.000000, NULL, 146.000000, 79.000000, 'STEEL HINGE JINDAL   4 x 12 ANT', 1.824000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 42.066000, 34.200000, '23%', 225.000000, 0.00, 0.00, 29, '2026-05-02 13:28:10', '2026-05-02 15:44:55', NULL),
(484, 'ST414ANT', 'MHVS', 'ST414ANTMHVS', 0.000000, NULL, 146.000000, 81.000000, 'STEEL HINGE JINDAL   4 x 14 ANT', 1.392000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 32.388360, 26.332000, '23%', 227.000000, 0.00, 0.00, 29, '2026-05-02 13:28:10', '2026-05-02 15:44:55', NULL);
INSERT INTO `inventory_items` (`id`, `item_code`, `user`, `code_user`, `stock_quantity`, `finish`, `scrap`, `labour`, `description`, `kg_dzn`, `pcs_box`, `box_ctn`, `pcs_ctn`, `kg_box`, `empty_wt`, `actual_wt`, `rate_pcs`, `base_rate_pcs`, `rate_adjustment`, `rate_kg`, `total_kg`, `actual_net_kg`, `created_by`, `created_at`, `updated_at`, `pic_or_kg`) VALUES
(485, 'ST43434ANT', 'MHVS', 'ST43434ANTMHVS', 0.000000, NULL, 146.000000, 129.000000, 'STEEL HINGE JINDAL   4 x 3/4 x 3/4 ANT', 0.780000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 21.986250, 17.875000, '23%', 275.000000, 0.00, 0.00, 29, '2026-05-02 13:28:10', '2026-05-02 15:44:55', NULL),
(487, 'ST512ANT', 'MHVS', 'ST512ANTMHVS', 0.000000, NULL, 146.000000, 70.000000, 'STEEL HINGE JINDAL   5 x 12 ANT', 2.460000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 54.464400, 44.280000, '23%', 216.000000, 0.00, 0.00, 29, '2026-05-02 13:28:10', '2026-05-02 15:44:55', NULL),
(488, 'ST514ANT', 'MHVS', 'ST514ANTMHVS', 0.000000, NULL, 146.000000, 79.000000, 'STEEL HINGE JINDAL   5 x 14 ANT', 1.824000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 42.066000, 34.200000, '23%', 225.000000, 0.00, 0.00, 29, '2026-05-02 13:28:10', '2026-05-02 15:44:55', NULL),
(490, 'ST612ANT', 'MHVS', 'ST612ANTMHVS', 0.000000, NULL, 146.000000, 78.000000, 'STEEL HINGE JINDAL   6 x 12 ANT', 2.940000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 67.502400, 54.880000, '23%', 224.000000, 0.00, 0.00, 29, '2026-05-02 13:28:10', '2026-05-02 15:44:55', NULL),
(492, 'ST810ANT', 'MHVS', 'ST810ANTMHVS', 0.000000, 'ANT STEEL', 146.000000, 133.000000, 'STEEL HINGE JINDAL   8 x 10 ANT', 6.420000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 183.595950, 149.265000, '23%', 279.000000, 0.00, 0.00, 29, '2026-05-02 13:40:54', '2026-05-02 15:44:55', NULL),
(493, 'ST810STN', 'MHVS', 'ST810STNMHVS', 0.000000, 'SATIN', 146.000000, 105.000000, 'STEEL HINGE JINDAL   8 x 10', 6.420000, 6.000000, 0.000000, 0.000000, 2.190000, 0.000000, 0.050000, 165.170550, 134.285000, '23%', 251.000000, 0.00, 0.00, 29, '2026-05-02 13:40:54', '2026-05-02 16:08:23', 0),
(494, 'ST510ANT', 'MHVS', 'ST510ANTMHVS', 0.000000, NULL, 146.000000, 81.000000, 'STEEL HINGE JINDAL   5 x 10 ANT', 3.420000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 0.000000, 79.574850, 64.695000, '23%', 227.000000, 0.00, 0.00, 29, '2026-05-02 15:08:05', '2026-05-02 15:44:55', NULL),
(495, 'ST510STN', 'MHVS', 'ST510STNMHVS', 0.000000, NULL, 146.000000, 53.000000, 'STEEL HINGE JINDAL   5 x 10', 3.420000, 8.000000, 20.000000, 160.000000, 2.330000, 0.000000, 0.050000, 69.759450, 56.715000, '23%', 199.000000, 0.00, 0.00, 29, '2026-05-02 15:08:05', '2026-05-02 16:06:09', NULL),
(496, 'ST610ANT', 'MHVS', 'ST610ANTMHVS', 0.000000, NULL, 146.000000, 86.000000, 'STEEL HINGE JINDAL   6 x 10 ANT', 4.080000, 8.000000, 0.000000, 0.000000, 2.780000, 0.000000, 0.000000, 97.022400, 78.880000, '23%', 232.000000, 0.00, 0.00, 29, '2026-05-02 15:08:18', '2026-05-02 16:39:41', NULL),
(497, 'ST610STN', 'MHVS', 'ST610STNMHVS', 0.000000, '', 146.000000, 58.000000, 'STEEL HINGE JINDAL   6 x 10', 4.080000, 8.000000, 0.000000, 0.000000, 2.780000, 0.000000, 0.060000, 85.312800, 69.360000, '23%', 204.000000, 0.00, 0.00, 29, '2026-05-02 15:08:18', '2026-05-02 16:41:32', 0),
(498, 'ST512LANT', 'MHVS', 'ST512LANTMHVS', 0.000000, 'ANT STEEL', 146.000000, 73.000000, 'STEEL HINGE JINDAL   5 x 12 L ANT', 2.160000, 12.000000, 20.000000, 240.000000, 2.210000, 0.000000, 0.000000, 48.486600, 39.420000, '23%', 219.000000, 0.00, 0.00, 29, '2026-05-02 16:11:38', '2026-05-02 16:22:35', 0),
(499, 'ST512LSTN', 'MHVS', 'ST512LSTNMHVS', 0.000000, 'SATIN', 146.000000, 45.000000, 'STEEL HINGE JINDAL   5 x 12 L', 2.160000, 12.000000, 20.000000, 240.000000, 2.210000, 0.000000, 0.000000, 42.287400, 34.380000, '23%', 191.000000, 0.00, 0.00, 29, '2026-05-02 16:11:38', '2026-05-02 16:37:06', 0);

-- --------------------------------------------------------

--
-- Table structure for table `invoices`
--

CREATE TABLE `invoices` (
  `id` int NOT NULL,
  `invoice_number` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `invoice_date` date NOT NULL,
  `customer_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `reference_no_1` decimal(15,6) DEFAULT NULL,
  `reference_no_2` decimal(15,6) DEFAULT NULL,
  `sub_total` decimal(12,2) NOT NULL DEFAULT '0.00',
  `gst_amount` decimal(12,2) NOT NULL DEFAULT '0.00',
  `other_charge` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `other_charge_amount` decimal(12,2) DEFAULT '0.00',
  `grand_total` decimal(15,2) DEFAULT NULL,
  `remaining_amount` decimal(15,2) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `tr_number` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `lr_number` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `invoice_items`
--

CREATE TABLE `invoice_items` (
  `id` int NOT NULL,
  `invoice_id` int NOT NULL,
  `item_code` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `item_description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `item_size` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `item_finish` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `pcs_per_box` int DEFAULT '0',
  `total_boxes` int DEFAULT '0',
  `extra_pcs` int DEFAULT '0',
  `total_pcs` int DEFAULT '0',
  `pcs_rate` decimal(10,2) DEFAULT NULL,
  `rate_kg` decimal(10,2) DEFAULT NULL,
  `total_rs` decimal(12,2) DEFAULT NULL,
  `total_weight` decimal(10,3) DEFAULT NULL,
  `scrap_lb` decimal(10,3) DEFAULT NULL,
  `brass` decimal(10,3) DEFAULT NULL,
  `kg_box` decimal(10,3) DEFAULT NULL,
  `lb` decimal(10,3) DEFAULT NULL,
  `box_wt` decimal(10,3) DEFAULT NULL,
  `tmp_wt` decimal(10,3) DEFAULT NULL,
  `net_kg` decimal(10,3) DEFAULT NULL,
  `box_name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `journal_customers`
--

CREATE TABLE `journal_customers` (
  `id` int NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `notes` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `journal_customers`
--

INSERT INTO `journal_customers` (`id`, `name`, `notes`, `created_at`, `updated_at`) VALUES
(1, 'PUJAN WIRE', NULL, '2026-04-19 13:00:39', '2026-04-19 13:00:47'),
(2, 'PATEL WIRE', NULL, '2026-04-19 13:01:01', '2026-04-19 13:01:01'),
(3, 'FRAIT', NULL, '2026-04-20 05:04:40', '2026-04-20 05:04:40'),
(4, 'SC RANVEER', NULL, '2026-04-20 05:04:58', '2026-05-02 06:35:10'),
(5, 'NILKANTH TR', NULL, '2026-04-20 05:05:33', '2026-04-20 05:05:33'),
(6, 'OTIX TR', NULL, '2026-04-20 05:05:40', '2026-04-20 05:05:40'),
(7, 'SAGAR PRSNL', NULL, '2026-04-20 05:05:57', '2026-04-20 05:05:57'),
(8, 'SANDIP PRSNL', NULL, '2026-04-20 05:06:07', '2026-04-20 05:06:07'),
(9, 'AMIT NASIT', NULL, '2026-04-20 05:06:37', '2026-04-20 05:06:37'),
(10, 'P-ANMOL', NULL, '2026-04-20 05:06:49', '2026-05-02 06:34:52'),
(11, 'SAI RLY', NULL, '2026-04-20 05:06:57', '2026-04-20 05:06:57'),
(12, 'OPENING', NULL, '2026-04-20 05:12:15', '2026-04-20 05:12:15'),
(13, 'AC ARST', NULL, '2026-04-21 10:36:47', '2026-05-02 06:35:48'),
(14, 'AC GCNG', NULL, '2026-04-21 10:36:53', '2026-05-02 06:36:47'),
(15, 'AGADIYA', NULL, '2026-04-21 10:38:51', '2026-04-21 10:38:51'),
(16, 'ZEEL', NULL, '2026-04-23 13:03:28', '2026-04-23 13:03:28'),
(17, 'VIVEKANAD', NULL, '2026-04-23 13:03:37', '2026-04-23 13:03:37'),
(18, 'SHIV Investment', NULL, '2026-04-23 13:34:53', '2026-04-23 13:36:29'),
(20, 'AC AFTR', NULL, '2026-04-23 13:58:36', '2026-05-02 06:17:32'),
(27, 'AC AVPN', NULL, '2026-04-23 13:59:13', '2026-05-02 06:35:54'),
(28, 'AC CSRA', NULL, '2026-04-23 13:59:25', '2026-05-02 06:36:12'),
(29, 'AC DKHY', NULL, '2026-04-23 13:59:32', '2026-05-02 06:36:18'),
(33, 'N PRAGTI CS', NULL, '2026-04-28 14:50:39', '2026-04-28 15:09:17'),
(34, 'N KAILASH CH', NULL, '2026-04-28 14:51:01', '2026-04-28 15:08:29'),
(35, 'N SAI WH', NULL, '2026-04-28 15:06:12', '2026-04-28 15:09:38'),
(36, 'N NEW PATEL CH', NULL, '2026-04-28 15:06:21', '2026-04-28 15:08:58'),
(37, 'N GADHIYA CH', NULL, '2026-04-28 15:06:27', '2026-04-28 15:08:19'),
(38, 'N DM WATER RAJU', NULL, '2026-04-28 15:07:30', '2026-04-28 15:07:30'),
(39, 'N INFINITY CH', NULL, '2026-04-28 15:07:49', '2026-04-28 15:07:49'),
(40, 'N OSCAR CH', NULL, '2026-04-28 15:08:03', '2026-04-28 15:08:03'),
(41, 'N OTIX CS', NULL, '2026-04-28 15:14:59', '2026-04-28 15:15:09'),
(42, 'VIJAY PERSONAL', NULL, '2026-04-29 13:17:00', '2026-04-29 13:17:00'),
(43, 'KHUSH', NULL, '2026-04-30 14:03:38', '2026-04-30 14:03:38'),
(45, 'SC AMIT', NULL, '2026-05-02 05:22:54', '2026-05-02 06:35:32'),
(46, 'P-AKSHAR', NULL, '2026-05-02 05:35:41', '2026-05-02 05:35:41'),
(47, 'P-TISA', NULL, '2026-05-02 05:35:48', '2026-05-02 05:35:48'),
(48, 'P-AKSHIT', NULL, '2026-05-02 05:35:59', '2026-05-02 05:35:59'),
(49, 'P-SAI', NULL, '2026-05-02 05:36:04', '2026-05-02 05:36:04'),
(50, 'P-TANYA', NULL, '2026-05-02 05:36:11', '2026-05-02 05:36:11'),
(51, 'P-VIVEKANAD', NULL, '2026-05-02 05:36:16', '2026-05-02 06:38:32'),
(52, 'P-KHODAL', NULL, '2026-05-02 05:36:22', '2026-05-02 05:36:22'),
(53, 'P-AFEL', NULL, '2026-05-02 05:36:31', '2026-05-02 05:36:31'),
(54, 'GAJANAN', NULL, '2026-05-02 13:49:04', '2026-05-02 13:49:04'),
(55, 'P-HOLE TO GLASS', NULL, '2026-05-04 04:31:23', '2026-05-04 04:31:55');

-- --------------------------------------------------------

--
-- Table structure for table `journal_entries`
--

CREATE TABLE `journal_entries` (
  `id` int NOT NULL,
  `entry_type_id` int DEFAULT NULL,
  `date` date NOT NULL,
  `type` enum('Payment','Receipt') CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `customer_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `method_id` int NOT NULL,
  `amount` decimal(15,2) NOT NULL,
  `notes` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `note_1` text COLLATE utf8mb4_unicode_ci,
  `note_2` decimal(15,2) DEFAULT NULL,
  `note_3` text COLLATE utf8mb4_unicode_ci,
  `note_4` text COLLATE utf8mb4_unicode_ci,
  `attachment` varchar(500) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_id` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `journal_entries`
--

INSERT INTO `journal_entries` (`id`, `entry_type_id`, `date`, `type`, `customer_name`, `method_id`, `amount`, `notes`, `note_1`, `note_2`, `note_3`, `note_4`, `attachment`, `user_id`, `created_at`, `updated_at`) VALUES
(1, 3, '2026-04-20', 'Receipt', 'OPENING', 3, 66780.00, 'OPENING 20-04-26', NULL, NULL, NULL, NULL, NULL, 29, '2026-04-20 05:12:55', '2026-04-23 16:14:54'),
(2, 3, '2026-04-21', 'Receipt', 'ARST', 3, 200000.00, NULL, NULL, NULL, NULL, NULL, NULL, 29, '2026-04-21 10:37:15', '2026-04-21 10:37:15'),
(3, 3, '2026-04-21', 'Payment', 'RANVEER', 3, 200000.00, NULL, NULL, NULL, NULL, NULL, NULL, 29, '2026-04-21 10:37:36', '2026-04-21 10:37:36'),
(4, 3, '2026-04-21', 'Payment', 'AGADIYA', 3, 200.00, 'ARST', NULL, NULL, NULL, NULL, NULL, 29, '2026-04-21 10:39:05', '2026-04-21 10:39:05'),
(5, 3, '2026-04-21', 'Receipt', 'GCNG', 3, 100000.00, NULL, NULL, NULL, NULL, NULL, NULL, 29, '2026-04-21 10:39:37', '2026-04-21 10:39:37'),
(6, 3, '2026-04-21', 'Payment', 'RANVEER', 3, 99600.00, NULL, NULL, NULL, NULL, NULL, NULL, 29, '2026-04-21 10:47:14', '2026-04-21 10:47:14'),
(7, 3, '2026-04-21', 'Payment', 'AGADIYA', 3, 400.00, 'GCNG', NULL, NULL, NULL, NULL, NULL, 29, '2026-04-21 10:47:31', '2026-04-21 10:47:31'),
(8, 7, '2026-04-21', 'Receipt', 'AKSHAR RLY', 4, 55.00, '66+5', NULL, NULL, NULL, NULL, NULL, 18, '2026-04-22 07:52:11', '2026-04-22 07:52:11'),
(10, 3, '2026-04-23', 'Receipt', 'ARST', 3, 150000.00, 'SANDIP AGADIYA', NULL, NULL, NULL, NULL, NULL, 29, '2026-04-23 10:59:35', '2026-04-23 10:59:35'),
(11, 3, '2026-04-23', 'Payment', 'VIVEKANAD', 3, 19800.00, 'NILL 03-26', NULL, NULL, NULL, NULL, NULL, 29, '2026-04-23 13:04:12', '2026-04-23 13:04:12'),
(12, 3, '2026-04-23', 'Payment', 'ZEEL', 3, 38000.00, 'NILL ', NULL, NULL, NULL, NULL, NULL, 29, '2026-04-23 13:04:28', '2026-04-23 13:04:28'),
(13, 8, '2026-04-23', 'Payment', 'SHIV INTERNAL', 5, 38000.00, 'Cromton moter and wire', NULL, NULL, NULL, NULL, NULL, 29, '2026-04-23 13:35:46', '2026-04-23 13:35:46'),
(17, 8, '2026-04-23', 'Payment', 'SHIV Investment', 3, 15000.00, 'EAT', NULL, NULL, NULL, NULL, NULL, 29, '2026-04-23 13:39:51', '2026-04-23 13:39:51'),
(18, 8, '2026-04-23', 'Payment', 'SHIV Investment', 3, 14000.00, 'RETI KAKRI FERA', NULL, NULL, NULL, NULL, NULL, 29, '2026-04-23 13:40:43', '2026-04-23 13:40:43'),
(19, 8, '2026-04-23', 'Payment', 'SHIV Investment', 3, 14300.00, 'KOTHO AND PLATE PANKAJBHAI', NULL, NULL, NULL, NULL, NULL, 29, '2026-04-23 13:41:23', '2026-04-23 13:41:23'),
(20, 8, '2026-04-23', 'Payment', 'SHIV Investment', 4, 8600.00, 'RUDRA STEEL MATHI PLATE REPAIR', NULL, NULL, NULL, NULL, NULL, 29, '2026-04-23 13:42:42', '2026-04-23 13:42:42'),
(21, 8, '2026-04-23', 'Payment', 'SHIV Investment', 4, 45425.00, 'KADIO JAYESHMAMA G PAY SSSJ EAT NU PAYMENT RETURN LEVANU BAKI ', NULL, NULL, NULL, NULL, NULL, 29, '2026-04-23 13:45:05', '2026-04-23 13:45:05'),
(22, 3, '2026-04-23', 'Payment', 'AGADIYA', 3, 200.00, 'ARST', NULL, NULL, NULL, NULL, NULL, 29, '2026-04-23 16:12:28', '2026-04-23 16:12:28'),
(23, 3, '2026-04-25', 'Payment', 'AMIT NASIT', 3, 20000.00, 'NC', NULL, NULL, NULL, NULL, NULL, 29, '2026-04-25 14:25:36', '2026-04-25 14:25:36'),
(24, 3, '2026-04-25', 'Payment', 'NILKANTH TR', 3, 15000.00, 'SALARY', NULL, NULL, NULL, NULL, NULL, 29, '2026-04-25 14:26:12', '2026-04-25 14:26:12'),
(26, 3, '2026-04-25', 'Payment', 'NILKANTH TR', 3, 5000.00, 'SAMIM SALARY', NULL, NULL, NULL, NULL, NULL, 29, '2026-04-27 05:40:28', '2026-04-27 05:40:28'),
(27, 3, '2026-04-27', 'Payment', 'SANDIP PRSNL', 3, 75000.00, 'ZEN ESSTILO CAR 75 C+ 30 CHECK SANDIP NAME ', NULL, NULL, NULL, NULL, NULL, 29, '2026-04-27 05:41:12', '2026-04-27 05:41:12'),
(30, 4, '2026-04-28', 'Payment', 'N SAI WH', 3, 9900.00, '04-26', NULL, NULL, NULL, NULL, NULL, 21, '2026-04-28 15:10:21', '2026-04-28 15:10:21'),
(31, 4, '2026-04-28', 'Payment', 'N KAILASH CH', 3, 93760.00, '04-26', NULL, NULL, NULL, NULL, NULL, 21, '2026-04-28 15:10:51', '2026-04-28 15:10:51'),
(32, 4, '2026-04-28', 'Payment', 'N NEW PATEL CH', 3, 7000.00, '04-26', NULL, NULL, NULL, NULL, NULL, 21, '2026-04-28 15:11:17', '2026-04-28 15:11:17'),
(33, 4, '2026-04-28', 'Payment', 'N GADHIYA CH', 3, 64850.00, '04-26', NULL, NULL, NULL, NULL, NULL, 21, '2026-04-28 15:11:37', '2026-04-28 15:11:37'),
(34, 4, '2026-04-28', 'Payment', 'N DM WATER RAJU', 3, 3000.00, '04-26', NULL, NULL, NULL, NULL, NULL, 21, '2026-04-28 15:12:34', '2026-04-28 15:12:34'),
(35, 4, '2026-04-28', 'Payment', 'N INFINITY CH', 3, 82620.00, '04-26', NULL, NULL, NULL, NULL, NULL, 21, '2026-04-28 15:12:57', '2026-04-28 15:14:20'),
(36, 4, '2026-04-28', 'Payment', 'N OSCAR CH', 3, 4169.25, '04-26', NULL, NULL, NULL, NULL, NULL, 21, '2026-04-28 15:13:15', '2026-04-28 15:13:15'),
(37, 4, '2026-04-28', 'Receipt', 'N PRAGTI CS', 3, 117341.00, '04-26\r\n27-04-26/////50000 GPAY ANMOL STEEL KRUPESH', NULL, NULL, NULL, NULL, NULL, 21, '2026-04-28 15:13:50', '2026-05-03 04:52:35'),
(38, 4, '2026-04-28', 'Receipt', 'N OTIX CS', 3, 225839.00, '04-26', NULL, NULL, NULL, NULL, NULL, 21, '2026-04-28 15:15:28', '2026-05-03 04:50:11'),
(41, 3, '2026-04-29', 'Payment', 'VIJAY PERSONAL', 3, 4200.00, 'GHEE 1050*4=4,200 ', NULL, NULL, NULL, NULL, NULL, 29, '2026-04-29 13:17:55', '2026-04-29 13:17:55'),
(43, 3, '2026-04-30', 'Receipt', 'KHUSH', 3, 1500000.00, 'NC', NULL, NULL, NULL, NULL, NULL, 29, '2026-04-30 14:04:08', '2026-04-30 14:04:08'),
(44, 3, '2026-05-02', 'Payment', 'AMIT SCRAP', 3, 441500.00, 'Akshar amit 556.1x794=441,543.4 ', NULL, NULL, NULL, NULL, NULL, 29, '2026-05-02 05:24:07', '2026-05-02 05:24:07'),
(46, 3, '2026-05-02', 'Receipt', 'AC ARST', 3, 200000.00, 'AGADIYA SANDIP', NULL, NULL, NULL, NULL, NULL, 29, '2026-05-02 10:59:31', '2026-05-02 10:59:31'),
(47, 3, '2026-05-01', 'Receipt', 'AC ARST', 3, 100000.00, 'AGADIYA SANDIP', NULL, NULL, NULL, NULL, NULL, 29, '2026-05-02 10:59:51', '2026-05-02 10:59:51'),
(48, 3, '2026-05-02', 'Payment', 'AGADIYA', 3, 300.00, '2+1 ARST', NULL, NULL, NULL, NULL, NULL, 29, '2026-05-02 11:00:15', '2026-05-02 11:00:15'),
(49, 9, '2026-03-31', 'Receipt', 'P-AKSHAR', 9, 231100.00, '03-24 OLD DUE', NULL, NULL, NULL, NULL, NULL, 29, '2026-05-02 11:06:54', '2026-05-02 11:06:54'),
(53, 9, '2026-03-31', 'Payment', 'P-AKSHAR', 6, 1150.50, '03-26', NULL, NULL, NULL, NULL, NULL, 29, '2026-05-02 12:09:45', '2026-05-02 12:09:45'),
(54, 9, '2026-04-02', 'Payment', 'P-AKSHAR', 6, 529.15, 'RANVEER', NULL, NULL, NULL, NULL, NULL, 29, '2026-05-02 12:10:34', '2026-05-02 12:10:34'),
(55, 9, '2026-04-07', 'Payment', 'P-AKSHAR', 6, 518.45, 'RANVEER', NULL, NULL, NULL, NULL, NULL, 29, '2026-05-02 12:11:12', '2026-05-02 12:11:12'),
(56, 9, '2026-04-08', 'Payment', 'P-AKSHAR', 6, 572.10, 'AMIT SCRAP', NULL, NULL, NULL, NULL, NULL, 29, '2026-05-02 12:12:39', '2026-05-02 12:12:39'),
(57, 9, '2026-04-09', 'Payment', 'P-AKSHAR', 6, 589.60, 'RANVEER', NULL, NULL, NULL, NULL, NULL, 29, '2026-05-02 12:13:20', '2026-05-02 12:13:20'),
(58, 9, '2026-04-14', 'Payment', 'P-AKSHAR', 6, 510.20, 'RANVEER', NULL, NULL, NULL, NULL, NULL, 29, '2026-05-02 12:14:09', '2026-05-02 12:14:09'),
(59, 9, '2026-04-25', 'Payment', 'P-AKSHAR', 6, 523.95, 'RANVEER', NULL, NULL, NULL, NULL, NULL, 29, '2026-05-02 12:14:53', '2026-05-02 12:14:53'),
(60, 9, '2026-05-02', 'Payment', 'P-AKSHAR', 6, 556.10, 'AMIT SC', NULL, NULL, NULL, NULL, NULL, 29, '2026-05-02 12:15:35', '2026-05-02 12:15:35'),
(62, 9, '2026-04-02', 'Receipt', 'P-AKSHIT', 9, 68085.00, '02-04-26', NULL, NULL, NULL, NULL, NULL, 29, '2026-05-02 12:47:38', '2026-05-02 12:47:38'),
(63, 9, '2026-04-02', 'Receipt', 'P-AKSHIT', 6, 288.50, '02-04-26', NULL, NULL, NULL, NULL, NULL, 29, '2026-05-02 12:48:26', '2026-05-02 12:48:26'),
(64, 9, '2026-05-02', 'Payment', 'P-AKSHIT', 6, 300.00, 'TISA MA APEL NET PENDING', NULL, NULL, NULL, NULL, NULL, 29, '2026-05-02 12:49:16', '2026-05-02 12:49:16'),
(65, 3, '2026-05-02', 'Payment', 'GAJANAN', 3, 16600.00, 'TILL DATE NILL', NULL, NULL, NULL, NULL, NULL, 29, '2026-05-02 13:49:33', '2026-05-02 13:49:33'),
(66, 7, '2026-05-02', 'Receipt', 'AC ARST', 3, 54654656.00, '321321', '32132', 1321.00, '132', '132', 'uploads/attachment-1777732975848.jpg', 18, '2026-05-02 14:42:55', '2026-05-02 14:42:55'),
(67, 7, '2026-05-07', 'Receipt', 'AC CSRA', 7, 6565656.00, '\r\n6565', '65+6', 65656.00, '68465', '6565', 'uploads/attachment-1777733009436.jpg', 18, '2026-05-02 14:43:29', '2026-05-02 14:43:29'),
(69, 3, '2026-05-03', 'Payment', 'SC RANVEER', 6, 123244.00, 'TOTAL AC NILL', NULL, NULL, NULL, NULL, NULL, 29, '2026-05-03 06:12:03', '2026-05-03 06:12:03'),
(70, 4, '2026-05-03', 'Payment', 'NILKANTH TR', 3, 106100.00, 'CASH PAID KAILASH AC NILL TILL DATE 04-26', NULL, NULL, NULL, NULL, NULL, 29, '2026-05-03 11:35:39', '2026-05-03 11:35:39'),
(71, 3, '2026-05-03', 'Payment', 'N KAILASH CH', 3, 106100.00, '04-26 NILL', NULL, NULL, NULL, NULL, NULL, 29, '2026-05-03 11:39:30', '2026-05-03 11:39:41'),
(72, 3, '2026-05-04', 'Payment', 'P-HOLE TO GLASS', 3, 2500.00, 'NILL 20G PAY 2500 CASH 22500 NILL', NULL, NULL, NULL, NULL, NULL, 29, '2026-05-04 04:32:31', '2026-05-04 04:32:31'),
(73, 3, '2026-05-04', 'Receipt', 'AC CSRA', 3, 198800.00, 'AGADIYA DEVRAJ', NULL, NULL, NULL, NULL, NULL, 29, '2026-05-04 12:25:08', '2026-05-04 12:25:08');

-- --------------------------------------------------------

--
-- Table structure for table `journal_entry_types`
--

CREATE TABLE `journal_entry_types` (
  `id` int NOT NULL,
  `name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `created_by` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `journal_entry_types`
--

INSERT INTO `journal_entry_types` (`id`, `name`, `description`, `created_by`, `created_at`, `updated_at`) VALUES
(2, 'STEEL', 'STEEL', 29, '2026-04-19 10:30:06', '2026-04-19 10:30:06'),
(3, 'VIJAY', 'VIJAY', 29, '2026-04-20 04:43:48', '2026-04-20 04:43:48'),
(4, 'NILKANTH', 'NILKANTH', 29, '2026-04-20 04:45:07', '2026-04-20 04:45:07'),
(5, 'OTIX', 'OTIX', 29, '2026-04-20 04:45:41', '2026-04-20 04:45:41'),
(6, 'SALE', 'SALE', 29, '2026-04-20 05:13:23', '2026-04-20 05:13:23'),
(7, '45', '565', 18, '2026-04-22 07:51:47', '2026-04-22 07:51:47'),
(8, 'SHIV', NULL, 29, '2026-04-23 13:33:59', '2026-04-23 13:33:59'),
(9, 'PURCH', NULL, 29, '2026-05-02 10:56:08', '2026-05-02 10:56:08');

-- --------------------------------------------------------

--
-- Table structure for table `journal_entry_type_permissions`
--

CREATE TABLE `journal_entry_type_permissions` (
  `id` int NOT NULL,
  `entry_type_id` int NOT NULL,
  `user_id` int NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `journal_entry_type_permissions`
--

INSERT INTO `journal_entry_type_permissions` (`id`, `entry_type_id`, `user_id`, `created_at`) VALUES
(2, 2, 29, '2026-04-19 10:30:06'),
(4, 3, 29, '2026-04-20 04:43:48'),
(5, 4, 29, '2026-04-20 04:45:07'),
(7, 5, 29, '2026-04-20 04:45:41'),
(9, 6, 29, '2026-04-20 05:13:23'),
(10, 7, 18, '2026-04-22 07:51:47'),
(11, 4, 21, '2026-04-22 10:31:43'),
(12, 8, 29, '2026-04-23 13:33:59'),
(13, 9, 29, '2026-05-02 10:56:08');

-- --------------------------------------------------------

--
-- Table structure for table `master_items`
--

CREATE TABLE `master_items` (
  `id` int NOT NULL,
  `item_code` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `created_by` int DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `kg_dz` decimal(15,6) DEFAULT NULL,
  `stock_quantity` decimal(15,6) DEFAULT NULL,
  `stock_kg` decimal(15,6) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `master_items`
--

INSERT INTO `master_items` (`id`, `item_code`, `description`, `created_by`, `created_at`, `updated_at`, `kg_dz`, `stock_quantity`, `stock_kg`) VALUES
(1, 'ST512LSTN', 'STEEL HINGE JINDAL   5 x 12 L', 18, '2026-03-27 14:46:58', '2026-04-22 03:56:20', 2.160000, 0.000000, 0.000000),
(2, 'ST412LSTN', 'STEEL HINGE JINDAL   4 x 12 L', 18, '2026-03-27 14:46:58', '2026-04-22 03:56:20', 1.584000, 0.000000, 0.000000),
(3, 'ST312LSTN', 'STEEL HINGE JINDAL   3 x 12 L', 18, '2026-03-27 14:46:58', '2026-04-22 03:56:20', 0.960000, 0.000000, 0.000000),
(4, 'ST810STN', 'STEEL HINGE JINDAL   8 x 10', 18, '2026-03-27 14:46:58', '2026-05-02 13:39:53', 6.420000, 0.000000, 0.000000),
(5, 'ST610STN', 'STEEL HINGE JINDAL   6 x 10', 18, '2026-03-27 14:46:58', '2026-05-02 15:06:13', 4.080000, 0.000000, 0.000000),
(6, 'ST510STN', 'STEEL HINGE JINDAL   5 x 10', 18, '2026-03-27 14:46:58', '2026-05-02 15:04:13', 3.420000, 0.000000, 0.000000),
(7, 'ST410STN', 'STEEL HINGE JINDAL   4 x 10', 18, '2026-03-27 14:46:58', '2026-04-22 03:56:20', 2.700000, 0.000000, 0.000000),
(8, 'ST6112STN', 'STEEL HINGE JINDAL   6 x 1.1/2', 18, '2026-03-27 14:46:58', '2026-04-22 03:56:20', 3.588000, 0.000000, 0.000000),
(9, 'ST5112STN', 'STEEL HINGE JINDAL   5 x 1.1/2', 18, '2026-03-27 14:46:58', '2026-04-22 03:56:20', 2.940000, 0.000000, 0.000000),
(10, 'ST6114STN', 'STEEL HINGE JINDAL   6 x 1.1/4', 18, '2026-03-27 14:46:58', '2026-04-22 03:56:20', 3.132000, 0.000000, 0.000000),
(11, 'ST5114STN', 'STEEL HINGE JINDAL   5 x 1.1/4', 18, '2026-03-27 14:46:58', '2026-05-02 15:00:38', 2.640000, 0.000000, 0.000000),
(12, 'ST612STN', 'STEEL HINGE JINDAL   6 x 12', 18, '2026-03-27 14:46:59', '2026-04-22 03:56:20', 2.940000, 0.000000, 0.000000),
(13, 'ST512HSTN', 'STEEL HINGE JINDAL   5 x 12 H', 18, '2026-03-27 14:46:59', '2026-04-22 03:56:20', 2.520000, 0.000000, 0.000000),
(14, 'ST512STN', 'STEEL HINGE JINDAL   5 x 12', 18, '2026-03-27 14:46:59', '2026-04-22 05:13:08', 2.460000, 2448.979592, 500.000000),
(15, 'ST412STN', 'STEEL HINGE JINDAL   4 x 12', 18, '2026-03-27 14:46:59', '2026-04-22 03:56:20', 1.824000, 0.000000, 0.000000),
(16, 'ST312STN', 'STEEL HINGE JINDAL   3 x 12', 18, '2026-03-27 14:46:59', '2026-04-22 03:56:20', 1.128000, 0.000000, 0.000000),
(17, 'ST514STN', 'STEEL HINGE JINDAL   5 x 14', 18, '2026-03-27 14:46:59', '2026-04-22 03:56:20', 1.824000, 0.000000, 0.000000),
(18, 'ST414STN', 'STEEL HINGE JINDAL   4 x 14', 18, '2026-03-27 14:46:59', '2026-04-22 03:56:20', 1.392000, 0.000000, 0.000000),
(19, 'ST314STN', 'STEEL HINGE JINDAL   3 x 14', 18, '2026-03-27 14:46:59', '2026-04-22 03:56:20', 0.828000, 0.000000, 0.000000),
(20, 'ST316HSTN', 'STEEL HINGE JINDAL   3 x 16 H', 18, '2026-03-27 14:46:59', '2026-04-22 03:56:20', 0.756000, 0.000000, 0.000000),
(21, 'ST316STN', 'STEEL HINGE JINDAL   3 x 16', 18, '2026-03-27 14:46:59', '2026-04-22 03:56:20', 0.672000, 0.000000, 0.000000),
(22, 'ST43434STN', 'STEEL HINGE JINDAL   4 x 3/4 x 3/4', 18, '2026-03-27 14:46:59', '2026-04-22 03:56:20', 0.780000, 0.000000, 0.000000),
(23, 'ST41234STN', 'STEEL HINGE JINDAL   4 x 1/2 x 3/4', 18, '2026-03-27 14:46:59', '2026-04-22 03:56:20', 0.672000, 0.000000, 0.000000),
(24, 'ST33434STN', 'STEEL HINGE JINDAL   3 x 3/4 x 3/4', 18, '2026-03-27 14:46:59', '2026-04-22 03:56:20', 0.564000, 0.000000, 0.000000),
(25, 'ST31234STN', 'STEEL HINGE JINDAL   3 x 1/2 x 3/4', 18, '2026-03-27 14:46:59', '2026-04-22 03:56:20', 0.504000, 0.000000, 0.000000),
(26, '2180S4125', 'W-HINGE (2in1) SM   4 * 1 - 25  GOLD +', 18, '2026-03-27 14:46:59', '2026-03-27 14:46:59', 2.950000, 0.000000, 0.000000),
(27, '2180S4119', 'W-HINGE (2in1) SM   4 * 1 - 19  GOLD +', 18, '2026-03-27 14:46:59', '2026-03-27 14:46:59', 2.800000, 0.000000, 0.000000),
(28, '2180S4112', 'W-HINGE (2in1) SM   4 * 1 - 12  GOLD +', 18, '2026-03-27 14:46:59', '2026-03-27 14:46:59', 2.650000, 0.000000, 0.000000),
(29, '2180S416', 'W-HINGE (2in1) SM   4 * 1 - 6  GOLD +', 18, '2026-03-27 14:46:59', '2026-03-27 14:46:59', 2.500000, 0.000000, 0.000000),
(30, '2180S3125', 'W-HINGE (2in1) SM   3 * 1 - 25  GOLD +', 18, '2026-03-27 14:46:59', '2026-03-27 14:46:59', 2.200000, 0.000000, 0.000000),
(31, '2180S3119', 'W-HINGE (2in1) SM   3 * 1 - 19  GOLD +', 18, '2026-03-27 14:46:59', '2026-03-27 14:46:59', 2.100000, 0.000000, 0.000000),
(32, '2180S3112', 'W-HINGE (2in1) SM   3 * 1 - 12  GOLD +', 18, '2026-03-27 14:46:59', '2026-03-27 14:46:59', 2.000000, 0.000000, 0.000000),
(33, '2180S316', 'W-HINGE (2in1) SM   3 * 1 - 6  GOLD +', 18, '2026-03-27 14:46:59', '2026-03-27 14:46:59', 1.860000, 0.000000, 0.000000),
(34, '2180S43425', 'W-HINGE (2in1) SM   4 * 3/4 - 25  GOLD +', 18, '2026-03-27 14:46:59', '2026-03-27 14:46:59', 2.750000, 0.000000, 0.000000),
(35, '2180S43419', 'W-HINGE (2in1) SM   4 * 3/4 - 19  GOLD +', 18, '2026-03-27 14:46:59', '2026-03-27 14:46:59', 2.600000, 0.000000, 0.000000),
(36, '2180S43412', 'W-HINGE (2in1) SM   4 * 3/4 - 12  GOLD +', 18, '2026-03-27 14:46:59', '2026-03-27 14:46:59', 2.470000, 0.000000, 0.000000),
(37, '2180S4346', 'W-HINGE (2in1) SM   4 * 3/4 - 6  GOLD +', 18, '2026-03-27 14:46:59', '2026-03-27 14:46:59', 2.340000, 0.000000, 0.000000),
(38, '2180S33425', 'W-HINGE (2in1) SM   3 * 3/4 - 25  GOLD +', 18, '2026-03-27 14:46:59', '2026-03-27 14:46:59', 2.050000, 0.000000, 0.000000),
(39, '2180S33419', 'W-HINGE (2in1) SM   3 * 3/4 - 19  GOLD +', 18, '2026-03-27 14:46:59', '2026-03-27 14:46:59', 1.950000, 0.000000, 0.000000),
(40, '2180S33412', 'W-HINGE (2in1) SM   3 * 3/4 - 12  GOLD +', 18, '2026-03-27 14:46:59', '2026-03-27 14:46:59', 1.850000, 0.000000, 0.000000),
(41, '2180S3346', 'W-HINGE (2in1) SM   3 * 3/4 - 6  GOLD +', 18, '2026-03-27 14:46:59', '2026-03-27 14:46:59', 1.750000, 0.000000, 0.000000),
(42, '2180S41225', 'W-HINGE (2in1) SM   4 * 1/2 - 25  GOLD +', 18, '2026-03-27 14:46:59', '2026-03-27 14:46:59', 2.500000, 0.000000, 0.000000),
(43, '2180S41219', 'W-HINGE (2in1) SM   4 * 1/2 - 19  GOLD +', 18, '2026-03-27 14:46:59', '2026-03-27 14:46:59', 2.360000, 0.000000, 0.000000),
(44, '2180S41212', 'W-HINGE (2in1) SM   4 * 1/2 - 12  GOLD +', 18, '2026-03-27 14:46:59', '2026-03-27 14:46:59', 2.230000, 0.000000, 0.000000),
(45, '2180S4126', 'W-HINGE (2in1) SM   4 * 1/2 - 6  GOLD +', 18, '2026-03-27 14:46:59', '2026-03-27 14:46:59', 2.100000, 0.000000, 0.000000),
(46, '2180S31225', 'W-HINGE (2in1) SM   3 * 1/2 - 25  GOLD +', 18, '2026-03-27 14:46:59', '2026-03-27 14:46:59', 1.870000, 0.000000, 0.000000),
(47, '2180S31219', 'W-HINGE (2in1) SM   3 * 1/2 - 19  GOLD +', 18, '2026-03-27 14:46:59', '2026-03-27 14:46:59', 1.770000, 0.000000, 0.000000),
(48, '2180S31212', 'W-HINGE (2in1) SM   3 * 1/2 - 12  GOLD +', 18, '2026-03-27 14:46:59', '2026-03-27 14:46:59', 1.670000, 0.000000, 0.000000),
(49, '2180S3126', 'W-HINGE (2in1) SM   3 * 1/2 - 6  GOLD +', 18, '2026-03-27 14:46:59', '2026-03-27 14:46:59', 1.570000, 0.000000, 0.000000),
(50, '3W80S150GM', 'W-HINGE SM   3 inch  GOLD +', 18, '2026-03-27 14:46:59', '2026-03-27 14:46:59', 1.800000, 0.000000, 0.000000),
(51, '2W80S100GM', 'W-HINGE SM   2 inch  GOLD +', 18, '2026-03-27 14:46:59', '2026-03-27 14:46:59', 1.200000, 0.000000, 0.000000),
(52, '214125', 'W-HINGE (2 in 1)   4 * 1 - 25  SILVER', 18, '2026-03-27 14:46:59', '2026-03-27 14:46:59', 2.740000, 0.000000, 0.000000),
(53, '214119', 'W-HINGE (2 in 1)   4 * 1 - 19  SILVER', 18, '2026-03-27 14:46:59', '2026-03-27 14:46:59', 2.600000, 0.000000, 0.000000),
(54, '214112', 'W-HINGE (2 in 1)   4 * 1 - 12  SILVER', 18, '2026-03-27 14:46:59', '2026-03-27 14:46:59', 2.470000, 0.000000, 0.000000),
(55, '21416', 'W-HINGE (2 in 1)   4 * 1 - 6  SILVER', 18, '2026-03-27 14:46:59', '2026-03-27 14:46:59', 2.340000, 0.000000, 0.000000),
(56, '213125', 'W-HINGE (2 in 1)   3 * 1 - 25  SILVER', 18, '2026-03-27 14:46:59', '2026-03-27 14:46:59', 2.050000, 0.000000, 0.000000),
(57, '213119', 'W-HINGE (2 in 1)   3 * 1 - 19  SILVER', 18, '2026-03-27 14:46:59', '2026-03-27 14:46:59', 1.950000, 0.000000, 0.000000),
(58, '213112', 'W-HINGE (2 in 1)   3 * 1 - 12  SILVER', 18, '2026-03-27 14:46:59', '2026-03-27 14:46:59', 1.850000, 0.000000, 0.000000),
(59, '21316', 'W-HINGE (2 in 1)   3 * 1 - 6  SILVER', 18, '2026-03-27 14:46:59', '2026-03-27 14:46:59', 1.750000, 0.000000, 0.000000),
(60, '2143425', 'W-HINGE (2 in 1)   4 * 3/4 - 25  SILVER', 18, '2026-03-27 14:46:59', '2026-03-27 14:46:59', 2.270000, 0.000000, 0.000000),
(61, '2143419', 'W-HINGE (2 in 1)   4 * 3/4 - 19  SILVER', 18, '2026-03-27 14:46:59', '2026-03-27 14:46:59', 2.140000, 0.000000, 0.000000),
(62, '2143412', 'W-HINGE (2 in 1)   4 * 3/4 - 12  SILVER', 18, '2026-03-27 14:46:59', '2026-03-27 14:46:59', 2.000000, 0.000000, 0.000000),
(63, '214346', 'W-HINGE (2 in 1)   4 * 3/4 - 6  SILVER', 18, '2026-03-27 14:46:59', '2026-03-27 14:46:59', 1.870000, 0.000000, 0.000000),
(64, '2133425', 'W-HINGE (2 in 1)   3 * 3/4 - 25  SILVER', 18, '2026-03-27 14:46:59', '2026-03-27 14:46:59', 1.700000, 0.000000, 0.000000),
(65, '2133419', 'W-HINGE (2 in 1)   3 * 3/4 - 19  SILVER', 18, '2026-03-27 14:46:59', '2026-03-27 14:46:59', 1.600000, 0.000000, 0.000000),
(66, '2133412', 'W-HINGE (2 in 1)   3 * 3/4 - 12  SILVER', 18, '2026-03-27 14:46:59', '2026-03-27 14:46:59', 1.500000, 0.000000, 0.000000),
(67, '213346', 'W-HINGE (2 in 1)   3 * 3/4 - 6  SILVER', 18, '2026-03-27 14:46:59', '2026-03-27 14:46:59', 1.400000, 0.000000, 0.000000),
(68, '2141225', 'W-HINGE (2 in 1)   4 * 1/2 - 25  SILVER', 18, '2026-03-27 14:46:59', '2026-03-27 14:46:59', 2.000000, 0.000000, 0.000000),
(69, '2141219', 'W-HINGE (2 in 1)   4 * 1/2 - 19  SILVER', 18, '2026-03-27 14:46:59', '2026-03-27 14:46:59', 1.870000, 0.000000, 0.000000),
(70, '2141212', 'W-HINGE (2 in 1)   4 * 1/2 - 12  SILVER', 18, '2026-03-27 14:46:59', '2026-03-27 14:46:59', 1.740000, 0.000000, 0.000000),
(71, '214126', 'W-HINGE (2 in 1)   4 * 1/2 - 6  SILVER', 18, '2026-03-27 14:46:59', '2026-03-27 14:46:59', 1.600000, 0.000000, 0.000000),
(72, '2131225', 'W-HINGE (2 in 1)   3 * 1/2 - 25  SILVER', 18, '2026-03-27 14:46:59', '2026-03-27 14:46:59', 1.500000, 0.000000, 0.000000),
(73, '2131219', 'W-HINGE (2 in 1)   3 * 1/2 - 19  SILVER', 18, '2026-03-27 14:46:59', '2026-03-27 14:46:59', 1.400000, 0.000000, 0.000000),
(74, '2131212', 'W-HINGE (2 in 1)   3 * 1/2 - 12  SILVER', 18, '2026-03-27 14:46:59', '2026-03-27 14:46:59', 1.300000, 0.000000, 0.000000),
(75, '213126', 'W-HINGE (2 in 1)   3 * 1/2 - 6  SILVER', 18, '2026-03-27 14:46:59', '2026-03-27 14:46:59', 1.200000, 0.000000, 0.000000),
(76, '3W100GM', 'W-HINGE    3 inch  SILVER', 18, '2026-03-27 14:46:59', '2026-03-27 14:46:59', 1.200000, 0.000000, 0.000000),
(77, '2W80GM', 'W-HINGE    2 inch  SILVER', 18, '2026-03-27 14:46:59', '2026-03-27 14:46:59', 0.960000, 0.000000, 0.000000),
(78, 'L80S43425', 'L-LOCK HINGE SM   4 * 3/4 - 25  GOLD +', 18, '2026-03-27 14:46:59', '2026-03-27 14:46:59', 2.250000, 0.000000, 0.000000),
(79, 'L80S43419', 'L-LOCK HINGE SM   4 * 3/4 - 19  GOLD +', 18, '2026-03-27 14:46:59', '2026-03-27 14:46:59', 2.150000, 0.000000, 0.000000),
(80, 'L80S43412', 'L-LOCK HINGE SM   4 * 3/4 - 12  GOLD +', 18, '2026-03-27 14:46:59', '2026-03-27 14:46:59', 2.000000, 0.000000, 0.000000),
(81, 'L80S4346', 'L-LOCK HINGE SM   4 * 3/4 - 6  GOLD +', 18, '2026-03-27 14:46:59', '2026-03-27 14:46:59', 1.850000, 0.000000, 0.000000),
(82, 'L80S33425', 'L-LOCK HINGE SM   3 * 3/4 - 25  GOLD +', 18, '2026-03-27 14:46:59', '2026-03-27 14:46:59', 1.700000, 0.000000, 0.000000),
(83, 'L80S33419', 'L-LOCK HINGE SM   3 * 3/4 - 19  GOLD +', 18, '2026-03-27 14:46:59', '2026-03-27 14:46:59', 1.600000, 0.000000, 0.000000),
(84, 'L80S33412', 'L-LOCK HINGE SM   3 * 3/4 - 12  GOLD +', 18, '2026-03-27 14:46:59', '2026-03-27 14:46:59', 1.500000, 0.000000, 0.000000),
(85, 'L80S3346', 'L-LOCK HINGE SM   3 * 3/4 - 6  GOLD +', 18, '2026-03-27 14:46:59', '2026-03-27 14:46:59', 1.400000, 0.000000, 0.000000),
(86, 'L80S41225', 'L-LOCK HINGE SM   4 * 1/2 - 25  GOLD +', 18, '2026-03-27 14:46:59', '2026-03-27 14:46:59', 2.200000, 0.000000, 0.000000),
(87, 'L80S41219', 'L-LOCK HINGE SM   4 * 1/2 - 19  GOLD +', 18, '2026-03-27 14:46:59', '2026-03-27 14:46:59', 2.000000, 0.000000, 0.000000),
(88, 'L80S41212', 'L-LOCK HINGE SM   4 * 1/2 - 12  GOLD +', 18, '2026-03-27 14:46:59', '2026-03-27 14:46:59', 1.800000, 0.000000, 0.000000),
(89, 'L80S4126', 'L-LOCK HINGE SM   4 * 1/2 - 6  GOLD +', 18, '2026-03-27 14:46:59', '2026-03-27 14:46:59', 1.600000, 0.000000, 0.000000),
(90, 'L80S31225', 'L-LOCK HINGE SM   3 * 1/2 - 25  GOLD +', 18, '2026-03-27 14:46:59', '2026-03-27 14:46:59', 1.650000, 0.000000, 0.000000),
(91, 'L80S31219', 'L-LOCK HINGE SM   3 * 1/2 - 19  GOLD +', 18, '2026-03-27 14:46:59', '2026-03-27 14:46:59', 1.500000, 0.000000, 0.000000),
(92, 'L80S31212', 'L-LOCK HINGE SM   3 * 1/2 - 12  GOLD +', 18, '2026-03-27 14:46:59', '2026-03-27 14:46:59', 1.350000, 0.000000, 0.000000),
(93, 'L80S3126', 'L-LOCK HINGE SM   3 * 1/2 - 6  GOLD +', 18, '2026-03-27 14:46:59', '2026-03-27 14:46:59', 1.200000, 0.000000, 0.000000),
(94, 'L80S33819', 'L-LOCK HINGE SM   3 * 3/8 - 19  GOLD +', 18, '2026-03-27 14:46:59', '2026-03-27 14:46:59', 1.250000, 0.000000, 0.000000),
(95, 'L80S33812', 'L-LOCK HINGE SM   3 * 3/8 - 12  GOLD +', 18, '2026-03-27 14:46:59', '2026-03-27 14:46:59', 1.150000, 0.000000, 0.000000),
(96, 'L80S3386', 'L-LOCK HINGE SM   3 * 3/8 - 6  GOLD +', 18, '2026-03-27 14:46:59', '2026-03-27 14:46:59', 1.050000, 0.000000, 0.000000),
(97, 'L43425', 'L-LOCK HINGE    4 * 3/4 - 25  SILVER', 18, '2026-03-27 14:46:59', '2026-03-27 14:46:59', 2.000000, 0.000000, 0.000000),
(98, 'L43419', 'L-LOCK HINGE    4 * 3/4 - 19  SILVER', 18, '2026-03-27 14:46:59', '2026-03-27 14:46:59', 1.770000, 0.000000, 0.000000),
(99, 'L43412', 'L-LOCK HINGE    4 * 3/4 - 12  SILVER', 18, '2026-03-27 14:46:59', '2026-03-27 14:46:59', 1.670000, 0.000000, 0.000000),
(100, 'L4346', 'L-LOCK HINGE    4 * 3/4 - 6  SILVER', 18, '2026-03-27 14:46:59', '2026-03-27 14:46:59', 1.560000, 0.000000, 0.000000),
(101, 'L33425', 'L-LOCK HINGE    3 * 3/4 - 25  SILVER', 18, '2026-03-27 14:46:59', '2026-03-27 14:46:59', 1.500000, 0.000000, 0.000000),
(102, 'L33419', 'L-LOCK HINGE    3 * 3/4 - 19  SILVER', 18, '2026-03-27 14:46:59', '2026-03-27 14:46:59', 1.320000, 0.000000, 0.000000),
(103, 'L33412', 'L-LOCK HINGE    3 * 3/4 - 12  SILVER', 18, '2026-03-27 14:46:59', '2026-03-27 14:46:59', 1.250000, 0.000000, 0.000000),
(104, 'L3346', 'L-LOCK HINGE    3 * 3/4 - 6  SILVER', 18, '2026-03-27 14:46:59', '2026-03-27 14:46:59', 1.170000, 0.000000, 0.000000),
(105, 'L41225', 'L-LOCK HINGE    4 * 1/2 - 25  SILVER', 18, '2026-03-27 14:46:59', '2026-03-27 14:46:59', 1.800000, 0.000000, 0.000000),
(106, 'L41219', 'L-LOCK HINGE    4 * 1/2 - 19  SILVER', 18, '2026-03-27 14:46:59', '2026-03-27 14:46:59', 1.470000, 0.000000, 0.000000),
(107, 'L41212', 'L-LOCK HINGE    4 * 1/2 - 12  SILVER', 18, '2026-03-27 14:46:59', '2026-03-27 14:46:59', 1.400000, 0.000000, 0.000000),
(108, 'L4126', 'L-LOCK HINGE    4 * 1/2 - 6  SILVER', 18, '2026-03-27 14:46:59', '2026-03-27 14:46:59', 1.270000, 0.000000, 0.000000),
(109, 'L31225', 'L-LOCK HINGE    3 * 1/2 - 25  SILVER', 18, '2026-03-27 14:46:59', '2026-03-27 14:46:59', 1.350000, 0.000000, 0.000000),
(110, 'L31219', 'L-LOCK HINGE    3 * 1/2 - 19  SILVER', 18, '2026-03-27 14:46:59', '2026-03-27 14:46:59', 1.100000, 0.000000, 0.000000),
(111, 'L31212', 'L-LOCK HINGE    3 * 1/2 - 12  SILVER', 18, '2026-03-27 14:46:59', '2026-03-27 14:46:59', 1.050000, 0.000000, 0.000000),
(112, 'L3126', 'L-LOCK HINGE    3 * 1/2 - 6  SILVER', 18, '2026-03-27 14:46:59', '2026-03-27 14:46:59', 0.950000, 0.000000, 0.000000),
(113, 'L33819', 'L-LOCK HINGE    3 * 3/8 - 19  SILVER', 18, '2026-03-27 14:46:59', '2026-03-27 14:46:59', 1.000000, 0.000000, 0.000000),
(114, 'L33812', 'L-LOCK HINGE    3 * 3/8 - 12  SILVER', 18, '2026-03-27 14:46:59', '2026-03-27 14:46:59', 0.950000, 0.000000, 0.000000),
(115, 'L3386', 'L-LOCK HINGE    3 * 3/8 - 6  SILVER', 18, '2026-03-27 14:46:59', '2026-03-27 14:46:59', 0.850000, 0.000000, 0.000000),
(116, '80S4125', 'L-HINGE SM   4 * 1 - 25  GOLD +', 18, '2026-03-27 14:46:59', '2026-03-27 14:46:59', 2.400000, 0.000000, 0.000000),
(117, '80S4119', 'L-HINGE SM   4 * 1 - 19  GOLD +', 18, '2026-03-27 14:46:59', '2026-03-27 14:46:59', 2.270000, 0.000000, 0.000000),
(118, '80S4112', 'L-HINGE SM   4 * 1 - 12  GOLD +', 18, '2026-03-27 14:46:59', '2026-03-27 14:46:59', 2.150000, 0.000000, 0.000000),
(119, '80S416', 'L-HINGE SM   4 * 1 - 6  GOLD +', 18, '2026-03-27 14:46:59', '2026-03-27 14:46:59', 1.950000, 0.000000, 0.000000),
(120, '80S3125', 'L-HINGE SM   3 * 1 - 25  GOLD +', 18, '2026-03-27 14:46:59', '2026-03-27 14:46:59', 1.800000, 0.000000, 0.000000),
(121, '80S3119', 'L-HINGE SM   3 * 1 - 19  GOLD +', 18, '2026-03-27 14:46:59', '2026-03-27 14:46:59', 1.700000, 0.000000, 0.000000),
(122, '80S3112', 'L-HINGE SM   3 * 1 - 12  GOLD +', 18, '2026-03-27 14:46:59', '2026-03-27 14:46:59', 1.600000, 0.000000, 0.000000),
(123, '80S316', 'L-HINGE SM   3 * 1 - 6  GOLD +', 18, '2026-03-27 14:46:59', '2026-03-27 14:46:59', 1.500000, 0.000000, 0.000000),
(124, '80S43425', 'L-HINGE SM   4 * 3/4 - 25  GOLD +', 18, '2026-03-27 14:46:59', '2026-03-27 14:46:59', 2.200000, 0.000000, 0.000000),
(125, '80S43419', 'L-HINGE SM   4 * 3/4 - 19  GOLD +', 18, '2026-03-27 14:46:59', '2026-03-27 14:46:59', 2.100000, 0.000000, 0.000000),
(126, '80S43412', 'L-HINGE SM   4 * 3/4 - 12  GOLD +', 18, '2026-03-27 14:46:59', '2026-03-27 14:46:59', 1.950000, 0.000000, 0.000000),
(127, '80S4346', 'L-HINGE SM   4 * 3/4 - 6  GOLD +', 18, '2026-03-27 14:46:59', '2026-03-27 14:46:59', 1.800000, 0.000000, 0.000000),
(128, '80S33425', 'L-HINGE SM   3 * 3/4 - 25  GOLD +', 18, '2026-03-27 14:46:59', '2026-03-27 14:46:59', 1.650000, 0.000000, 0.000000),
(129, '80S33419', 'L-HINGE SM   3 * 3/4 - 19  GOLD +', 18, '2026-03-27 14:46:59', '2026-03-27 14:46:59', 1.550000, 0.000000, 0.000000),
(130, '80S33412', 'L-HINGE SM   3 * 3/4 - 12  GOLD +', 18, '2026-03-27 14:46:59', '2026-03-27 14:46:59', 1.450000, 0.000000, 0.000000),
(131, '80S3346', 'L-HINGE SM   3 * 3/4 - 6  GOLD +', 18, '2026-03-27 14:46:59', '2026-03-27 14:46:59', 1.350000, 0.000000, 0.000000),
(132, '80S41225', 'L-HINGE SM   4 * 1/2 - 25  GOLD +', 18, '2026-03-27 14:46:59', '2026-03-27 14:46:59', 1.950000, 0.000000, 0.000000),
(133, '80S41219', 'L-HINGE SM   4 * 1/2 - 19  GOLD +', 18, '2026-03-27 14:46:59', '2026-03-27 14:46:59', 1.830000, 0.000000, 0.000000),
(134, '80S41212', 'L-HINGE SM   4 * 1/2 - 12  GOLD +', 18, '2026-03-27 14:46:59', '2026-03-27 14:46:59', 1.650000, 0.000000, 0.000000),
(135, '80S4126', 'L-HINGE SM   4 * 1/2 - 6  GOLD +', 18, '2026-03-27 14:46:59', '2026-03-27 14:46:59', 1.550000, 0.000000, 0.000000),
(136, '80S31225', 'L-HINGE SM   3 * 1/2 - 25  GOLD +', 18, '2026-03-27 14:46:59', '2026-03-27 14:46:59', 1.450000, 0.000000, 0.000000),
(137, '80S31219', 'L-HINGE SM   3 * 1/2 - 19  GOLD +', 18, '2026-03-27 14:46:59', '2026-03-27 15:24:16', 1.370000, 0.000000, 0.000000),
(138, '80S31212', 'L-HINGE SM   3 * 1/2 - 12  GOLD +', 18, '2026-03-27 14:46:59', '2026-03-27 15:24:16', 1.250000, 0.000000, 0.000000),
(139, '80S3126', 'L-HINGE SM   3 * 1/2 - 6  GOLD +', 18, '2026-03-27 14:46:59', '2026-03-27 15:24:16', 1.150000, 0.000000, 0.000000),
(140, '4125', 'L-HINGE    4 * 1 - 25  SILVER', 18, '2026-03-27 14:46:59', '2026-03-27 14:46:59', 2.200000, 0.000000, 0.000000),
(141, '4119', 'L-HINGE    4 * 1 - 19  SILVER', 18, '2026-03-27 14:46:59', '2026-03-27 14:46:59', 2.000000, 0.000000, 0.000000),
(142, '4112', 'L-HINGE    4 * 1 - 12  SILVER', 18, '2026-03-27 14:46:59', '2026-03-27 14:46:59', 1.850000, 0.000000, 0.000000),
(143, '416', 'L-HINGE    4 * 1 - 6  SILVER', 18, '2026-03-27 14:46:59', '2026-03-27 14:46:59', 1.750000, 0.000000, 0.000000),
(144, '3125', 'L-HINGE    3 * 1 - 25  SILVER', 18, '2026-03-27 14:46:59', '2026-03-27 14:46:59', 1.650000, 0.000000, 0.000000),
(145, '3119', 'L-HINGE    3 * 1 - 19  SILVER', 18, '2026-03-27 14:46:59', '2026-03-27 14:46:59', 1.500000, 0.000000, 0.000000),
(146, '3112', 'L-HINGE    3 * 1 - 12  SILVER', 18, '2026-03-27 14:46:59', '2026-03-27 14:46:59', 1.400000, 0.000000, 0.000000),
(147, '316', 'L-HINGE    3 * 1 - 6  SILVER', 18, '2026-03-27 14:46:59', '2026-03-27 14:46:59', 1.300000, 0.000000, 0.000000),
(148, '43425', 'L-HINGE    4 * 3/4 - 25  SILVER', 18, '2026-03-27 14:46:59', '2026-03-27 14:46:59', 1.950000, 0.000000, 0.000000),
(149, '43419', 'L-HINGE    4 * 3/4 - 19  SILVER', 18, '2026-03-27 14:46:59', '2026-03-27 14:46:59', 1.750000, 0.000000, 0.000000),
(150, '43412', 'L-HINGE    4 * 3/4 - 12  SILVER', 18, '2026-03-27 14:46:59', '2026-03-27 14:46:59', 1.600000, 0.000000, 0.000000),
(151, '4346', 'L-HINGE    4 * 3/4 - 6  SILVER', 18, '2026-03-27 14:46:59', '2026-03-27 14:46:59', 1.550000, 0.000000, 0.000000),
(152, '33425', 'L-HINGE    3 * 3/4 - 25  SILVER', 18, '2026-03-27 14:46:59', '2026-03-27 14:46:59', 1.450000, 0.000000, 0.000000),
(153, '33419', 'L-HINGE    3 * 3/4 - 19  SILVER', 18, '2026-03-27 14:46:59', '2026-03-27 14:46:59', 1.300000, 0.000000, 0.000000),
(154, '33412', 'L-HINGE    3 * 3/4 - 12  SILVER', 18, '2026-03-27 14:46:59', '2026-03-27 14:46:59', 1.200000, 0.000000, 0.000000),
(155, '3346', 'L-HINGE    3 * 3/4 - 6  SILVER', 18, '2026-03-27 14:46:59', '2026-03-27 14:46:59', 1.150000, 0.000000, 0.000000),
(156, '41225', 'L-HINGE    4 * 1/2 - 25  SILVER', 18, '2026-03-27 14:46:59', '2026-03-27 14:46:59', 1.750000, 0.000000, 0.000000),
(157, '41219', 'L-HINGE    4 * 1/2 - 19  SILVER', 18, '2026-03-27 14:46:59', '2026-03-27 14:46:59', 1.470000, 0.000000, 0.000000),
(158, '41212', 'L-HINGE    4 * 1/2 - 12  SILVER', 18, '2026-03-27 14:46:59', '2026-03-27 14:46:59', 1.350000, 0.000000, 0.000000),
(159, '4126', 'L-HINGE    4 * 1/2 - 6  SILVER', 18, '2026-03-27 14:46:59', '2026-03-27 14:46:59', 1.200000, 0.000000, 0.000000),
(160, '31225', 'L-HINGE    3 * 1/2 - 25  SILVER', 18, '2026-03-27 14:46:59', '2026-03-27 14:46:59', 1.300000, 0.000000, 0.000000),
(161, '31219', 'L-HINGE    3 * 1/2 - 19  SILVER', 18, '2026-03-27 14:46:59', '2026-03-27 15:24:16', 1.100000, 0.000000, 0.000000),
(162, '31212', 'L-HINGE    3 * 1/2 - 12  SILVER', 18, '2026-03-27 14:46:59', '2026-04-16 05:02:39', 1.000000, 1263.160000, 100.000000),
(163, '3126', 'L-HINGE    3 * 1/2 - 6  SILVER', 18, '2026-03-27 14:46:59', '2026-04-17 06:09:28', 0.900000, 1123.760000, 78.400000),
(164, 'S33434', 'RAILWAY HINGE SM   3 * 3/4 GOLD+', 18, '2026-03-27 14:46:59', '2026-03-27 15:30:42', 0.850000, 0.000000, 0.000000),
(165, 'S122316', 'RAILWAY HINGE SM   12 * 2 * 3/16  GOLD+', 18, '2026-03-27 14:46:59', '2026-03-27 15:30:42', 17.050000, 0.000000, 0.000000),
(166, 'S102316', 'RAILWAY HINGE SM   10 * 2 * 3/16  GOLD+', 18, '2026-03-27 14:46:59', '2026-03-27 15:30:42', 14.200000, 0.000000, 0.000000),
(167, 'S82316', 'RAILWAY HINGE SM   8 * 2 * 3/16  GOLD+', 18, '2026-03-27 14:46:59', '2026-03-27 15:30:42', 11.900000, 0.000000, 0.000000),
(168, 'S62316', 'RAILWAY HINGE SM   6 * 2 * 3/16  GOLD+', 18, '2026-03-27 14:46:59', '2026-03-27 15:30:42', 8.900000, 0.000000, 0.000000),
(169, 'S12112316', 'RAILWAY HINGE SM   12 * 1½ * 3/16  GOLD+', 18, '2026-03-27 14:46:59', '2026-03-27 15:30:42', 14.500000, 0.000000, 0.000000),
(170, 'S10112316', 'RAILWAY HINGE SM   10 * 1½ * 3/16  GOLD+', 18, '2026-03-27 14:46:59', '2026-03-27 15:30:42', 12.100000, 0.000000, 0.000000),
(171, 'S8112316H', 'RAILWAY HINGE SM   8 * 1½ * 3/16 H  GOLD+', 18, '2026-03-27 14:46:59', '2026-03-27 15:30:42', 9.600000, 0.000000, 0.000000),
(172, 'S8112316', 'RAILWAY HINGE SM   8 * 1½ * 3/16  GOLD+', 18, '2026-03-27 14:46:59', '2026-03-27 15:30:42', 8.700000, 0.000000, 0.000000),
(173, 'S8114316', 'RAILWAY HINGE SM   8 * 1¼ * 3/16  GOLD+', 18, '2026-03-27 14:46:59', '2026-03-27 15:30:42', 7.700000, 0.000000, 0.000000),
(174, 'S6112316H', 'RAILWAY HINGE SM   6 * 1½ * 3/16 H  GOLD+', 18, '2026-03-27 14:46:59', '2026-03-27 15:30:42', 6.500000, 0.000000, 0.000000),
(175, 'S5112316H', 'RAILWAY HINGE SM   5 * 1½ * 3/16 H  GOLD+', 18, '2026-03-27 14:46:59', '2026-03-27 15:30:42', 5.400000, 0.000000, 0.000000),
(176, 'S6112316', 'RAILWAY HINGE SM   6 * 1½ * 3/16  GOLD+', 18, '2026-03-27 14:46:59', '2026-03-27 15:30:42', 5.800000, 0.000000, 0.000000),
(177, 'S5112316', 'RAILWAY HINGE SM   5 * 1½ * 3/16  GOLD+', 18, '2026-03-27 14:46:59', '2026-03-27 15:30:42', 4.800000, 0.000000, 0.000000),
(178, 'S6114316H', 'RAILWAY HINGE SM   6 * 1¼ * 3/16 H  GOLD+', 18, '2026-03-27 14:46:59', '2026-03-27 15:30:42', 5.800000, 0.000000, 0.000000),
(179, 'S5114316H', 'RAILWAY HINGE SM   5 * 1¼ * 3/16 H  GOLD+', 18, '2026-03-27 14:46:59', '2026-03-27 15:30:42', 4.800000, 0.000000, 0.000000),
(180, 'S6114316', 'RAILWAY HINGE SM   6 * 1¼ * 3/16   GOLD+', 18, '2026-03-27 14:46:59', '2026-03-27 15:30:42', 5.050000, 0.000000, 0.000000),
(181, 'S5114316', 'RAILWAY HINGE SM   5 * 1¼ * 3/16  GOLD+', 18, '2026-03-27 14:46:59', '2026-03-27 15:30:42', 4.200000, 0.000000, 0.000000),
(182, 'S6114532', 'RAILWAY HINGE SM   6 * 1¼ * 5/32  GOLD+', 18, '2026-03-27 14:46:59', '2026-03-27 15:30:42', 4.320000, 0.000000, 0.000000),
(183, 'S5114532', 'RAILWAY HINGE SM   5 * 1¼ * 5/32  GOLD+', 18, '2026-03-27 14:46:59', '2026-03-27 15:30:42', 3.600000, 0.000000, 0.000000),
(184, 'S4114532', 'RAILWAY HINGE SM   4 * 1¼ * 5/32  GOLD+', 18, '2026-03-27 14:46:59', '2026-03-27 15:30:42', 2.900000, 0.000000, 0.000000),
(185, 'S6118532H', 'RAILWAY HINGE SM   6 * 1⅛ * 5/32 H  GOLD+', 18, '2026-03-27 14:46:59', '2026-03-27 15:30:42', 4.100000, 0.000000, 0.000000),
(186, 'S5118532H', 'RAILWAY HINGE SM   5 * 1⅛ * 5/32 H  GOLD+', 18, '2026-03-27 14:46:59', '2026-03-27 15:30:42', 3.400000, 0.000000, 0.000000),
(187, 'S4118532H', 'RAILWAY HINGE SM   4 * 1⅛ * 5/32 H  GOLD+', 18, '2026-03-27 14:46:59', '2026-03-27 15:30:42', 2.720000, 0.000000, 0.000000),
(188, 'S6118532', 'RAILWAY HINGE SM   6 * 1⅛ * 5/32  GOLD+', 18, '2026-03-27 14:46:59', '2026-03-27 15:30:42', 3.400000, 0.000000, 0.000000),
(189, 'S5118532', 'RAILWAY HINGE SM   5 * 1⅛ * 5/32  GOLD+', 18, '2026-03-27 14:46:59', '2026-03-27 15:30:42', 2.800000, 0.000000, 0.000000),
(190, 'S4118532', 'RAILWAY HINGE SM   4 * 1⅛ * 5/32  GOLD+', 18, '2026-03-27 14:46:59', '2026-03-27 15:30:42', 2.250000, 0.000000, 0.000000),
(191, 'S51532', 'RAILWAY HINGE SM   5 * 1 * 5/32  GOLD+', 18, '2026-03-27 14:46:59', '2026-03-27 15:30:42', 3.250000, 0.000000, 0.000000),
(192, 'S41532', 'RAILWAY HINGE SM   4 * 1 * 5/32  GOLD+', 18, '2026-03-27 14:46:59', '2026-03-27 15:30:42', 2.600000, 0.000000, 0.000000),
(193, 'S31532', 'RAILWAY HINGE SM   3 * 1 * 5/32  GOLD+', 18, '2026-03-27 14:46:59', '2026-03-27 15:30:42', 2.000000, 0.000000, 0.000000),
(194, 'S511818', 'RAILWAY HINGE SM   5 * 1⅛ * 1/8  GOLD+', 18, '2026-03-27 14:46:59', '2026-03-27 15:30:42', 2.300000, 0.000000, 0.000000),
(195, 'S411818', 'RAILWAY HINGE SM   4 * 1⅛ * 1/8  GOLD+', 18, '2026-03-27 14:46:59', '2026-03-27 15:30:42', 1.850000, 0.000000, 0.000000),
(196, 'S511', 'RAILWAY HINGE SM   5 * 1 * 1/8  GOLD+', 18, '2026-03-27 14:46:59', '2026-03-27 15:30:42', 2.750000, 0.000000, 0.000000),
(197, 'S411', 'RAILWAY HINGE SM   4 * 1 * 1/8  GOLD+', 18, '2026-03-27 14:46:59', '2026-03-27 15:30:42', 2.200000, 0.000000, 0.000000),
(198, 'S311', 'RAILWAY HINGE SM   3 * 1 *1/8  GOLD+', 18, '2026-03-27 14:46:59', '2026-03-27 15:30:42', 1.650000, 0.000000, 0.000000),
(199, 'S378', 'RAILWAY HINGE SM   3 * 7/8   GOLD+', 18, '2026-03-27 14:46:59', '2026-03-27 15:30:42', 1.150000, 0.000000, 0.000000),
(200, 'R11503', 'ROUND TOWER BOLT    3 * 3/8  GOLD', 18, '2026-03-27 17:47:52', '2026-03-27 17:47:52', 0.950000, 0.000000, 0.000000),
(201, 'R11504', 'ROUND TOWER BOLT    4 * 3/8  GOLD', 18, '2026-03-27 17:47:52', '2026-03-27 17:47:52', 1.200000, 0.000000, 0.000000),
(202, 'R11506', 'ROUND TOWER BOLT    6 * 3/8  GOLD', 18, '2026-03-27 17:47:52', '2026-03-27 17:47:52', 1.800000, 0.000000, 0.000000),
(203, 'R10M4', 'ROUND TOWER BOLT    4 * 10 mm  GOLD', 18, '2026-03-27 17:47:52', '2026-03-27 17:47:52', 2.200000, 0.000000, 0.000000),
(204, 'R10M6', 'ROUND TOWER BOLT    6 * 10 mm  GOLD', 18, '2026-03-27 17:47:52', '2026-03-27 17:47:52', 3.300000, 0.000000, 0.000000),
(205, 'R10M8', 'ROUND TOWER BOLT    8 * 10 mm  GOLD', 18, '2026-03-27 17:47:52', '2026-03-27 17:47:52', 4.400000, 0.000000, 0.000000),
(206, 'R10M10', 'ROUND TOWER BOLT    10 * 10 mm  GOLD', 18, '2026-03-27 17:47:52', '2026-03-27 17:47:52', 5.500000, 0.000000, 0.000000),
(207, 'R10M12', 'ROUND TOWER BOLT    12 * 10 mm  GOLD', 18, '2026-03-27 17:47:52', '2026-03-27 17:47:52', 6.600000, 0.000000, 0.000000),
(208, 'R4004', 'ROUND TOWER BOLT    4 * 1/2  GOLD', 18, '2026-03-27 17:47:52', '2026-03-27 17:47:52', 1.800000, 0.000000, 0.000000),
(209, 'R4006', 'ROUND TOWER BOLT    6 * 1/2  GOLD', 18, '2026-03-27 17:47:52', '2026-03-27 17:47:52', 2.500000, 0.000000, 0.000000),
(210, 'R4008', 'ROUND TOWER BOLT    8 * 1/2  GOLD', 18, '2026-03-27 17:47:52', '2026-03-27 17:47:52', 3.300000, 0.000000, 0.000000),
(211, 'PM33-4SM350', 'PARLAMENT SM 3 * 3 - 4MM', 29, '2026-04-19 13:22:12', '2026-04-19 13:22:12', 4.200000, 0.000000, 0.000000),
(212, 'PM42-4SM380', 'PARLAMENT SM 4 * 2 - 4MM', 29, '2026-04-19 13:23:13', '2026-04-19 13:23:13', 4.560000, 0.000000, 0.000000),
(213, 'PM43-4SM450', 'PARLAMENT SM 4 * 3 - 4MM', 29, '2026-04-19 13:23:49', '2026-04-19 13:23:49', 5.400000, 0.000000, 0.000000),
(214, 'PM44-4SM510', 'PARLAMENT SM 4 * 4 - 4MM', 29, '2026-04-19 13:24:28', '2026-04-19 13:24:28', 6.120000, 0.000000, 0.000000),
(215, 'PM45-4SM600', 'PARLAMENT SM 4 * 5 - 4MM', 29, '2026-04-19 13:25:43', '2026-04-19 13:25:43', 7.200000, 0.000000, 0.000000),
(216, 'PM46-4SM660', 'PARLAMENT SM 4 * 6 - 4MM', 29, '2026-04-19 13:34:27', '2026-04-19 13:34:27', 7.920000, 0.000000, 0.000000),
(217, 'PM53-5SM505', 'PARLAMENT SM 5 * 3 - 5MM', 29, '2026-04-19 13:41:49', '2026-04-19 13:41:49', 6.060000, 0.000000, 0.000000),
(218, 'PM54-5SM615', 'PARLAMENT SM 5 * 4 - 5MM', 29, '2026-04-19 13:41:49', '2026-04-19 13:41:49', 7.380000, 0.000000, 0.000000),
(219, 'PM55-5SM700', 'PARLAMENT SM 5 * 5 - 5MM', 29, '2026-04-19 13:41:49', '2026-04-19 13:41:49', 8.400000, 0.000000, 0.000000),
(220, 'PM56-5SM730', 'PARLAMENT SM 5 * 6 - 5MM', 29, '2026-04-19 13:41:49', '2026-04-19 13:41:49', 8.760000, 0.000000, 0.000000),
(221, 'PM58-5SM1300', 'PARLAMENT SM 5 * 8 - 5MM', 29, '2026-04-19 13:41:49', '2026-04-19 13:41:49', 15.600000, 0.000000, 0.000000),
(222, 'PM64-5SM670', 'PARLAMENT SM 6 * 4 - 5MM', 29, '2026-04-19 13:41:49', '2026-04-19 13:41:49', 8.040000, 0.000000, 0.000000),
(223, 'PM65-5SM750', 'PARLAMENT SM 6 * 5 - 5MM', 29, '2026-04-19 13:41:49', '2026-04-19 13:41:49', 9.000000, 0.000000, 0.000000),
(224, 'PM66-5SM830', 'PARLAMENT SM 6 * 6 - 5MM', 29, '2026-04-19 13:41:49', '2026-04-19 13:41:49', 9.960000, 0.000000, 0.000000),
(225, 'ST31234ANT', 'STEEL HINGE JINDAL   3 x 1/2 x 3/4 ANT', 29, '2026-04-19 13:49:58', '2026-04-20 10:44:38', 0.504000, 0.000000, 0.000000),
(226, 'ST33434ANT', 'STEEL HINGE JINDAL   3 x 3/4 x 3/4 ANT', 29, '2026-04-19 13:49:58', '2026-04-20 10:44:38', 0.564000, 0.000000, 0.000000),
(227, 'ST41234ANT', 'STEEL HINGE JINDAL   4 x 1/2 x 3/4 ANT', 29, '2026-04-19 13:49:58', '2026-04-20 10:44:38', 0.672000, 0.000000, 0.000000),
(228, 'ST43434ANT', 'STEEL HINGE JINDAL   4 x 3/4 x 3/4 ANT', 29, '2026-04-19 13:49:58', '2026-04-19 14:29:03', 0.780000, 0.000000, 0.000000),
(229, 'ST316ANT', 'STEEL HINGE JINDAL   3 x 16 ANT', 29, '2026-04-19 13:49:58', '2026-04-20 10:44:38', 0.672000, 0.000000, 0.000000),
(230, 'ST316HANT', 'STEEL HINGE JINDAL   3 x 16 H ANT', 29, '2026-04-19 13:49:58', '2026-04-20 10:50:06', 0.756000, 0.000000, 0.000000),
(231, 'ST314ANT', 'STEEL HINGE JINDAL   3 x 14 ANT', 29, '2026-04-19 13:49:58', '2026-04-20 10:44:38', 0.828000, 0.000000, 0.000000),
(232, 'ST414ANT', 'STEEL HINGE JINDAL   4 x 14 ANT', 29, '2026-04-19 13:49:58', '2026-04-20 10:44:38', 1.392000, 0.000000, 0.000000),
(233, 'ST514ANT', 'STEEL HINGE JINDAL   5 x 14 ANT', 29, '2026-04-19 13:49:58', '2026-04-20 10:44:38', 1.824000, 0.000000, 0.000000),
(234, 'ST312ANT', 'STEEL HINGE JINDAL   3 x 12 ANT', 29, '2026-04-19 13:49:58', '2026-04-20 10:44:38', 1.128000, 0.000000, 0.000000),
(235, 'ST412ANT', 'STEEL HINGE JINDAL   4 x 12 ANT', 29, '2026-04-19 13:49:58', '2026-04-20 10:44:38', 1.824000, 0.000000, 0.000000),
(236, 'ST512ANT', 'STEEL HINGE JINDAL   5 x 12 ANT', 29, '2026-04-19 13:49:58', '2026-04-19 13:49:58', 2.460000, 0.000000, 0.000000),
(237, 'ST512HANT', 'STEEL HINGE JINDAL   5 x 12 H ANT', 29, '2026-04-19 13:49:58', '2026-04-19 13:49:58', 2.520000, 0.000000, 0.000000),
(238, 'ST612ANT', 'STEEL HINGE JINDAL   6 x 12 ANT', 29, '2026-04-19 13:49:58', '2026-04-19 14:29:03', 2.940000, 0.000000, 0.000000),
(239, 'ST5114ANT', 'STEEL HINGE JINDAL   5 x 1.1/4 ANT', 29, '2026-04-19 13:49:58', '2026-05-02 15:00:17', 2.640000, 0.000000, 0.000000),
(240, 'ST6114ANT', 'STEEL HINGE JINDAL   6 x 1.1/4 ANT', 29, '2026-04-19 13:49:58', '2026-04-20 10:40:41', 3.132000, 0.000000, 0.000000),
(241, 'ST5112ANT', 'STEEL HINGE JINDAL   5 x 1.1/2 ANT', 29, '2026-04-19 13:49:58', '2026-04-19 13:49:58', 2.940000, 0.000000, 0.000000),
(242, 'ST6112ANT', 'STEEL HINGE JINDAL   6 x 1.1/2 ANT', 29, '2026-04-19 13:49:58', '2026-04-20 10:40:41', 3.588000, 0.000000, 0.000000),
(243, 'ST410ANT', 'STEEL HINGE JINDAL   4 x 10 ANT', 29, '2026-04-19 13:49:58', '2026-04-19 13:49:58', 2.700000, 0.000000, 0.000000),
(244, 'ST510ANT', 'STEEL HINGE JINDAL   5 x 10 ANT', 29, '2026-04-19 13:49:58', '2026-05-02 15:03:59', 3.420000, 0.000000, 0.000000),
(245, 'ST610ANT', 'STEEL HINGE JINDAL   6 x 10 ANT', 29, '2026-04-19 13:49:58', '2026-05-02 15:06:04', 4.080000, 0.000000, 0.000000),
(246, 'ST810ANT', 'STEEL HINGE JINDAL   8 x 10 ANT', 29, '2026-04-19 13:49:58', '2026-05-02 13:39:40', 6.420000, 0.000000, 0.000000),
(247, 'ST312LANT', 'STEEL HINGE JINDAL   3 x 12 L ANT', 29, '2026-04-19 13:49:58', '2026-04-19 13:49:58', 0.960000, 0.000000, 0.000000),
(248, 'ST412LANT', 'STEEL HINGE JINDAL   4 x 12 L ANT', 29, '2026-04-19 13:49:58', '2026-04-20 10:40:41', 1.584000, 0.000000, 0.000000),
(249, 'ST512LANT', 'STEEL HINGE JINDAL   5 x 12 L ANT', 29, '2026-04-19 13:49:58', '2026-04-19 13:49:58', 2.160000, 0.000000, 0.000000);

-- --------------------------------------------------------

--
-- Table structure for table `order_stock`
--

CREATE TABLE `order_stock` (
  `id` int NOT NULL,
  `order_stock` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `pati_table`
--

CREATE TABLE `pati_table` (
  `id` int NOT NULL,
  `pati_type` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `created_by` int DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `pati_table`
--

INSERT INTO `pati_table` (`id`, `pati_type`, `created_by`, `created_at`, `updated_at`) VALUES
(6, 'OTIX-700', 18, '2025-12-14 10:15:42', '2025-12-14 10:15:42'),
(7, 'OTIX-750', 18, '2025-12-14 10:15:53', '2025-12-14 10:15:53');

-- --------------------------------------------------------

--
-- Table structure for table `payments`
--

CREATE TABLE `payments` (
  `id` int NOT NULL,
  `date` date NOT NULL,
  `amount` decimal(15,2) NOT NULL,
  `account_id` int DEFAULT NULL,
  `contact_id` int DEFAULT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `reference` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `note` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `image_url` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `user_id` int DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `payment_methods`
--

CREATE TABLE `payment_methods` (
  `id` int NOT NULL,
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `payment_methods`
--

INSERT INTO `payment_methods` (`id`, `name`, `created_at`, `updated_at`) VALUES
(3, 'CASH', '2026-04-20 04:47:14', '2026-04-20 04:47:14'),
(4, 'G PAY', '2026-04-20 04:47:20', '2026-04-20 04:47:20'),
(5, 'HDFC', '2026-04-20 04:47:36', '2026-04-20 04:47:36'),
(6, 'SCRAP', '2026-05-02 05:35:08', '2026-05-02 05:35:08'),
(7, 'COIL', '2026-05-02 05:35:13', '2026-05-02 05:35:13'),
(9, 'MAJURI', '2026-05-02 05:35:23', '2026-05-02 05:35:23');

-- --------------------------------------------------------

--
-- Table structure for table `purchase_invoices`
--

CREATE TABLE `purchase_invoices` (
  `id` int NOT NULL,
  `code_user` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `user` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `invoice_number` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `issue_date` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `due_date` date NOT NULL,
  `total_amount` decimal(12,2) DEFAULT '0.00',
  `balance_due` decimal(12,2) DEFAULT '0.00',
  `image_url` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `purchase_invoices`
--

INSERT INTO `purchase_invoices` (`id`, `code_user`, `user`, `invoice_number`, `issue_date`, `due_date`, `total_amount`, `balance_due`, `image_url`, `created_at`, `updated_at`) VALUES
(1, 'AFEL', 'AFEL', '123', '2026-04-13', '2026-05-12', 6000.00, 6000.00, '', '2026-04-13 15:09:31', '2026-04-13 15:09:31'),
(2, 'AFEL', 'AFEL', '123', '2026-04-16', '2026-05-18', 86000.00, 86000.00, '', '2026-04-16 05:02:39', '2026-04-16 05:02:39'),
(3, 'KLIP', 'KLIP', '12', '2026-04-22', '2026-04-25', 19500.00, 19500.00, '', '2026-04-22 05:13:08', '2026-04-22 05:13:08');

-- --------------------------------------------------------

--
-- Table structure for table `purchase_invoice_items`
--

CREATE TABLE `purchase_invoice_items` (
  `id` int NOT NULL,
  `invoice_id` int NOT NULL,
  `item_code` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `code` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `stock_kg` decimal(10,2) DEFAULT '0.00',
  `scrap` decimal(10,2) DEFAULT '0.00',
  `labour` decimal(10,2) DEFAULT '0.00',
  `kg_dzn` decimal(10,2) DEFAULT '0.00',
  `actual_dzn_wt` decimal(10,2) DEFAULT '0.00',
  `total_per_6a` decimal(10,2) DEFAULT '0.00',
  `rate_pcr` decimal(10,2) DEFAULT '0.00',
  `total_kg` decimal(10,2) DEFAULT '0.00',
  `no_of_peti` int DEFAULT '0',
  `peti_wt` decimal(10,2) DEFAULT '0.00',
  `peti_balance` decimal(10,2) NOT NULL DEFAULT '0.00',
  `ret_peti_no` decimal(10,2) NOT NULL DEFAULT '0.00',
  `peti_Type` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `net_kg` decimal(10,2) DEFAULT '0.00',
  `amount` decimal(10,2) DEFAULT '0.00',
  `notes` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `pati_status` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT 'Active',
  `pic_or_kg` tinyint(1) DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `total_psc` decimal(10,2) DEFAULT '0.00'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `purchase_invoice_items`
--

INSERT INTO `purchase_invoice_items` (`id`, `invoice_id`, `item_code`, `code`, `description`, `stock_kg`, `scrap`, `labour`, `kg_dzn`, `actual_dzn_wt`, `total_per_6a`, `rate_pcr`, `total_kg`, `no_of_peti`, `peti_wt`, `peti_balance`, `ret_peti_no`, `peti_Type`, `net_kg`, `amount`, `notes`, `pati_status`, `pic_or_kg`, `created_at`, `updated_at`, `total_psc`) VALUES
(1, 1, '3126AFEL', '3126', 'L-HINGE    3 * 1/2 - 6  SILVER', 0.00, 0.00, 60.00, 0.90, 0.85, 0.00, 4.25, 101.00, 1, 1.00, 0.00, 1.00, 'WD', 100.00, 6000.00, '', '2', 1, '2026-04-13 15:09:31', '2026-04-13 15:09:31', 1411.76),
(2, 2, '31212AFEL', '31212', 'L-HINGE    3 * 1/2 - 12  SILVER', 0.00, 800.00, 60.00, 1.00, 0.95, 0.00, 68.08, 102.00, 2, 2.00, 0.00, 2.00, 'WD', 100.00, 86000.00, '', '2', 1, '2026-04-16 05:02:39', '2026-04-16 05:02:39', 1263.16),
(3, 3, 'ST512STNKLIP', 'ST512STN', 'STEEL HINGE JINDAL   5 x 12', 0.00, 0.00, 39.00, 2.46, 2.45, 0.00, 7.96, 520.00, 20, 20.00, 0.00, 20.00, 'WD', 500.00, 19500.00, '', '2', 1, '2026-04-22 05:13:08', '2026-04-22 05:13:08', 2448.98);

-- --------------------------------------------------------

--
-- Table structure for table `receipts`
--

CREATE TABLE `receipts` (
  `id` int NOT NULL,
  `date` date NOT NULL,
  `amount` decimal(15,2) NOT NULL,
  `contact_id` int DEFAULT NULL,
  `account_id` int DEFAULT NULL,
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `reference` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `note` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `image_url` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `user_id` int DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `sales_invoice`
--

CREATE TABLE `sales_invoice` (
  `id` int NOT NULL,
  `customer` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `invoice_no` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `invoice_date` date NOT NULL,
  `due_date` date NOT NULL,
  `status` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `no1` int NOT NULL,
  `no2` int NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `sr_no` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `item_code` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `item_description_size` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `item_finish` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `pcs_per_box` int DEFAULT '0',
  `extra_pcs` int DEFAULT '0',
  `total_pcs` int DEFAULT '0',
  `total_weight` decimal(10,2) DEFAULT '0.00',
  `scrap_lb` decimal(10,2) DEFAULT '0.00',
  `total_rs` decimal(10,2) DEFAULT '0.00',
  `brass` decimal(10,2) DEFAULT '0.00',
  `lb` decimal(10,2) DEFAULT '0.00',
  `kg_per_box` decimal(10,2) DEFAULT '0.00',
  `pcs_rate` decimal(10,2) DEFAULT '0.00',
  `box_wt` decimal(10,2) DEFAULT '0.00',
  `tmp_wt` decimal(10,2) DEFAULT '0.00',
  `net_kg` decimal(10,2) DEFAULT '0.00',
  `ctn_no` int DEFAULT '0',
  `ctn_wt` decimal(10,2) DEFAULT '0.00',
  `weight_per_ctn` decimal(10,2) DEFAULT '0.00',
  `gst` decimal(5,2) DEFAULT '0.00',
  `total` decimal(10,2) DEFAULT '0.00',
  `grand_total` decimal(10,2) DEFAULT '0.00'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `sales_lock`
--

CREATE TABLE `sales_lock` (
  `id` int NOT NULL,
  `module_name` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `display_name` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `is_locked` tinyint(1) NOT NULL DEFAULT '0',
  `locked_by` int DEFAULT NULL,
  `locked_at` timestamp NULL DEFAULT NULL,
  `unlocked_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `sales_lock`
--

INSERT INTO `sales_lock` (`id`, `module_name`, `display_name`, `is_locked`, `locked_by`, `locked_at`, `unlocked_at`, `created_at`, `updated_at`) VALUES
(1, 'all', 'All Pages', 0, 18, NULL, '2026-04-24 19:45:36', '2026-04-24 19:34:25', '2026-04-24 19:45:36'),
(2, 'dashboard', 'Dashboard', 0, 18, '2026-04-24 19:37:47', '2026-04-24 19:45:36', '2026-04-24 19:34:25', '2026-04-24 19:45:36'),
(3, 'accounts', 'Bank and Cash Accounts', 0, 18, '2026-04-24 19:37:48', '2026-04-24 19:45:36', '2026-04-24 19:34:25', '2026-04-24 19:45:36'),
(4, 'receipts', 'Receipts', 0, 18, '2026-04-24 19:49:03', '2026-04-24 20:07:18', '2026-04-24 19:34:25', '2026-04-24 20:07:18'),
(5, 'payments', 'Payments', 0, 18, '2026-04-24 19:37:35', '2026-04-24 19:45:36', '2026-04-24 19:34:25', '2026-04-24 19:45:36'),
(6, 'customers', 'Customers', 0, 18, '2026-04-24 19:45:57', '2026-04-24 20:07:18', '2026-04-24 19:34:25', '2026-04-24 20:07:18'),
(7, 'suppliers', 'Suppliers', 0, 18, '2026-04-24 19:45:59', '2026-04-24 20:07:18', '2026-04-24 19:34:25', '2026-04-24 20:07:18'),
(8, 'sales_orders', 'Sales Orders', 0, 18, '2026-04-24 19:37:38', '2026-04-24 19:45:36', '2026-04-24 19:34:25', '2026-04-24 19:45:36'),
(9, 'sales_invoices', 'Sales Invoices', 0, 18, '2026-04-24 19:37:39', '2026-04-24 19:45:36', '2026-04-24 19:34:25', '2026-04-24 19:45:36'),
(10, 'purchase_invoices', 'Purchase Invoices', 0, 18, '2026-04-24 19:37:40', '2026-04-24 19:45:36', '2026-04-24 19:34:25', '2026-04-24 19:45:36'),
(11, 'inventory_items', 'Inventory Items', 0, 18, '2026-04-24 19:37:41', '2026-04-24 19:45:36', '2026-04-24 19:34:25', '2026-04-24 19:45:36'),
(12, 'master_items', 'Master Product', 0, 18, NULL, '2026-04-24 19:45:36', '2026-04-24 19:34:25', '2026-04-24 19:45:36'),
(13, 'employees', 'Employees', 0, 18, NULL, '2026-04-24 19:45:36', '2026-04-24 19:34:25', '2026-04-24 19:45:36'),
(14, 'journal_entries', 'Journal Entries', 0, 18, NULL, '2026-04-24 19:45:36', '2026-04-24 19:34:25', '2026-04-24 19:45:36');

-- --------------------------------------------------------

--
-- Table structure for table `sales_orders`
--

CREATE TABLE `sales_orders` (
  `id` int NOT NULL,
  `order_number` int DEFAULT NULL,
  `order_date` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `customer_id` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `item_code` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `finish` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `stock_qty` decimal(10,2) DEFAULT NULL,
  `initial_qty` decimal(15,6) DEFAULT NULL,
  `scrap` decimal(15,6) DEFAULT NULL,
  `labour` decimal(15,6) DEFAULT NULL,
  `kg_dzn` decimal(10,2) DEFAULT NULL,
  `pcs_box` int DEFAULT NULL,
  `box_ctn` int DEFAULT NULL,
  `pcs_ctn` int DEFAULT NULL,
  `kg_box` decimal(15,6) DEFAULT NULL,
  `qty_ctn` decimal(10,2) DEFAULT NULL,
  `total_kg` decimal(10,2) DEFAULT NULL,
  `quantity_pcs` decimal(15,6) DEFAULT NULL,
  `order_stock` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `manufacturer_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `po_vr` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `note` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `invoice_status` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `created_by` int DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `customer_code` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `customer_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `rate_pcs` decimal(15,6) DEFAULT NULL,
  `rate_kz` decimal(15,6) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `sales_orders`
--

INSERT INTO `sales_orders` (`id`, `order_number`, `order_date`, `customer_id`, `item_code`, `finish`, `stock_qty`, `initial_qty`, `scrap`, `labour`, `kg_dzn`, `pcs_box`, `box_ctn`, `pcs_ctn`, `kg_box`, `qty_ctn`, `total_kg`, `quantity_pcs`, `order_stock`, `manufacturer_name`, `po_vr`, `note`, `invoice_status`, `created_by`, `created_at`, `updated_at`, `customer_code`, `customer_name`, `rate_pcs`, `rate_kz`) VALUES
(6, 1, '2026-05-02', 'ST512STNMHVS', 'ST512STN', 'SATIN', 2448.98, 480.000000, 146.000000, 42.000000, 2.46, 12, 20, 240, 2.460000, 2.00, 98.40, 480.000000, 'STOCK', NULL, NULL, NULL, NULL, 29, '2026-05-02 16:24:13', '2026-05-02 16:24:13', 'MHVS', NULL, 47.400000, 188.000000),
(7, 1, '2026-05-02', 'ST512LSTNMHVS', 'ST512LSTN', 'SATIN', 0.00, 240.000000, 146.000000, 45.000000, 2.16, 12, 20, 240, 2.210000, 1.00, 43.20, 240.000000, 'STOCK', '', '', '', NULL, 29, '2026-05-02 16:24:31', '2026-05-02 16:27:57', 'MHVS', '', 42.290000, 191.000000),
(8, 1, '2026-05-02', 'ST514STNMHVS', 'ST514STN', 'SATIN', 0.00, 480.000000, 146.000000, 51.000000, 1.82, 12, 20, 240, 1.870000, 2.00, 72.96, 480.000000, 'STOCK', '', '', '', NULL, 29, '2026-05-02 16:24:50', '2026-05-02 16:27:53', 'MHVS', '', 36.830000, 197.000000),
(9, 1, '2026-05-02', 'ST414STNMHVS', 'ST414STN', 'SATIN', 0.00, 576.000000, 146.000000, 53.000000, 1.39, 12, 24, 288, 1.440000, 2.00, 66.82, 576.000000, 'STOCK', '', '', '', NULL, 29, '2026-05-02 16:25:29', '2026-05-02 16:27:48', 'MHVS', '', 28.390000, 199.000000),
(10, 1, '2026-05-02', 'ST316STNMHVS', 'ST316STN', 'SATIN', 0.00, NULL, 146.000000, 85.000000, 0.67, 30, 24, 720, 1.730000, 2.00, 80.40, 1440.000000, 'STOCK', '', '', '', NULL, 29, '2026-05-02 16:26:02', '2026-05-02 16:26:28', 'MHVS', '', 15.910000, 231.000000),
(11, 1, '2026-05-02', 'ST412STNMHVS', 'ST412STN', 'SATIN', NULL, 288.000000, 146.000000, 51.000000, 1.82, 12, 24, 288, NULL, 1.00, 43.78, 288.000000, 'STOCK', NULL, NULL, NULL, NULL, 29, '2026-05-02 16:26:59', '2026-05-02 16:26:59', 'MHVS', NULL, 36.830000, 197.000000),
(12, 1, '2026-05-02', 'ST612STNMHVS', 'ST612STN', 'SATIN', 0.00, 180.000000, 146.000000, 50.000000, 2.94, 0, 0, 0, 3.000000, 0.00, 44.10, 180.000000, 'STOCK', '', '', '', NULL, 29, '2026-05-02 16:27:28', '2026-05-02 16:27:42', 'MHVS', '', 59.060000, 196.000000);

-- --------------------------------------------------------

--
-- Table structure for table `shipping_cartons`
--

CREATE TABLE `shipping_cartons` (
  `id` int NOT NULL,
  `invoice_id` int NOT NULL,
  `carton_number` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `carton_weight` decimal(10,3) DEFAULT '0.000',
  `weight_per_ctn` decimal(10,3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `shipping_cartons`
--

INSERT INTO `shipping_cartons` (`id`, `invoice_id`, `carton_number`, `carton_weight`, `weight_per_ctn`) VALUES
(102, 124, 'CTN-001', 1.000, 1.000);

-- --------------------------------------------------------

--
-- Table structure for table `stock_history`
--

CREATE TABLE `stock_history` (
  `id` int NOT NULL,
  `item_code` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `transaction_type` enum('CREDIT','DEBIT') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT 'CREDIT = Stock In, DEBIT = Stock Out',
  `invoice_type` enum('PURCHASE','SALES') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `invoice_number` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `quantity_pcs` decimal(15,3) NOT NULL DEFAULT '0.000',
  `quantity_kg` decimal(15,3) NOT NULL DEFAULT '0.000',
  `movement_date` date NOT NULL,
  `note` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `user_id` int DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `stock_history`
--

INSERT INTO `stock_history` (`id`, `item_code`, `transaction_type`, `invoice_type`, `invoice_number`, `quantity_pcs`, `quantity_kg`, `movement_date`, `note`, `user_id`, `created_at`, `updated_at`) VALUES
(1, '3126', 'CREDIT', 'PURCHASE', '123', 1411.760, 100.000, '2026-04-13', NULL, NULL, '2026-04-13 15:09:31', '2026-04-13 15:09:31'),
(2, '3126', 'DEBIT', 'SALES', '56', 288.000, 21.600, '2026-04-13', NULL, NULL, '2026-04-13 15:13:03', '2026-04-13 15:13:03'),
(3, '31212', 'CREDIT', 'PURCHASE', '123', 1263.160, 100.000, '2026-04-16', NULL, NULL, '2026-04-16 05:02:39', '2026-04-16 05:02:39'),
(4, '3126', 'DEBIT', 'SALES', '56', 72.000, 5.400, '2026-04-13', 'Invoice update stock adjustment', NULL, '2026-04-16 05:11:33', '2026-04-16 05:11:33'),
(5, '3126', 'CREDIT', 'SALES', '56', 360.000, 27.000, '2026-04-16', 'Undo invoice 56', 18, '2026-04-16 09:53:12', '2026-04-16 09:53:12'),
(6, '3126', 'DEBIT', 'SALES', '56', 288.000, 21.000, '2026-04-17', NULL, NULL, '2026-04-17 05:09:58', '2026-04-17 05:09:58'),
(7, '3126', 'DEBIT', 'SALES', '34', 288.000, 21.600, '2026-04-17', NULL, NULL, '2026-04-17 05:45:01', '2026-04-17 05:45:01'),
(8, '3126', 'CREDIT', 'SALES', '56', 288.000, 21.000, '2026-04-17', 'Undo invoice 56', 18, '2026-04-17 06:09:28', '2026-04-17 06:09:28'),
(9, 'ST512STN', 'CREDIT', 'PURCHASE', '12', 2448.980, 500.000, '2026-04-22', NULL, NULL, '2026-04-22 05:13:08', '2026-04-22 05:13:08');

-- --------------------------------------------------------

--
-- Table structure for table `supplier_details`
--

CREATE TABLE `supplier_details` (
  `id` int NOT NULL,
  `contact_id` int NOT NULL,
  `credit_limit` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `division` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `due_date` date DEFAULT NULL,
  `payment_status` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `note` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `total_amount` decimal(10,2) DEFAULT NULL,
  `notes` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `payment` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT NULL,
  `date` date DEFAULT NULL,
  `order_follow_up` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `note_date` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `supplier_details`
--

INSERT INTO `supplier_details` (`id`, `contact_id`, `credit_limit`, `division`, `due_date`, `payment_status`, `note`, `total_amount`, `notes`, `payment`, `date`, `order_follow_up`, `note_date`) VALUES
(1, 3, '0', 'PLAN', '2026-03-27', 'Pending', '', NULL, NULL, NULL, NULL, NULL, NULL),
(2, 4, '0', 'PLAN', '2026-03-27', 'Pending', '', NULL, NULL, NULL, NULL, NULL, NULL),
(3, 7, '0', 'PLAN', '2026-04-22', 'Pending', '', NULL, NULL, NULL, NULL, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `transport`
--

CREATE TABLE `transport` (
  `id` int NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `transport`
--

INSERT INTO `transport` (`id`, `name`, `created_at`, `updated_at`) VALUES
(2, 'GAJANAND', '2025-10-17 11:04:35', '2025-10-27 06:32:38'),
(3, 'VRL', '2025-10-27 06:32:25', '2025-10-27 06:32:25'),
(4, 'EAGLE', '2025-12-14 10:15:32', '2025-12-14 10:15:32');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int NOT NULL,
  `user_name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `password` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `user_name`, `email`, `password`, `created_at`) VALUES
(18, 'doller2', 'doller2@gmail.com', '$2b$10$9ExwW3ymIgpBcMeXPMKoBup79CvCqF.U8XhXrj7p.ButykaIb2OOi', '2025-10-23 15:05:00'),
(21, 'AC', 'AC@GMAIL.COM', '$2b$10$UgL3BjpewGBZZxLAX9zQjekXMVQ4RCKntF6adGg5pOuT17BaUt3X6', '2026-03-15 16:50:21'),
(29, '0714', '0714@GMAIL.COM', '$2b$10$k0rtJVOfR87fsgJyvpPqIed7f24MXzHESWJeU.9RoWB9o53FgeT2q', '2026-04-19 09:40:50'),
(30, 'ORDER', 'ORDER@GMAIL.COM', '$2b$10$Jgg4DAvWYve4bkZTjGlD7e7NuSRIXeKCdNitgINIdErQ1xsyRMWpS', '2026-04-19 09:45:30'),
(31, 'admin', 'admin@gmail.com', '$2b$10$HecJGAQ2kIzbmC60SY2wTuezROQBZ9kla.Y1qyBh5PGpDYYNzhW9W', '2026-04-19 10:22:34');

-- --------------------------------------------------------

--
-- Table structure for table `user_activity`
--

CREATE TABLE `user_activity` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `user_name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `model_name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT 'Page / model name (e.g., accounts, inventory_items)',
  `action_type` enum('CREATE','UPDATE','DELETE','LOGIN','LOGOUT') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `record_id` int DEFAULT NULL COMMENT 'Affected record primary key (if available)',
  `description` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `changes` json DEFAULT NULL COMMENT 'JSON object storing old and new values for UPDATE actions'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user_activity`
--

INSERT INTO `user_activity` (`id`, `user_id`, `user_name`, `model_name`, `action_type`, `record_id`, `description`, `created_at`, `changes`) VALUES
(2234, 29, '0714', 'users', 'LOGIN', 29, 'User 0714 logged in', '2026-05-02 13:23:04', NULL),
(2235, 29, '0714', 'contacts', 'CREATE', 11, 'Created contact', '2026-05-02 13:24:58', NULL),
(2236, 29, '0714', 'inventory_items', 'CREATE', NULL, 'Created inventory from master for MHVS [Customer] (created: 13, skipped: 0, failed: 0)', '2026-05-02 13:27:09', NULL),
(2237, 29, '0714', 'inventory_items', 'CREATE', NULL, 'Created inventory from master for MHVS [Customer] (created: 13, skipped: 0, failed: 0)', '2026-05-02 13:28:10', NULL),
(2238, 29, '0714', 'inventory_items', 'UPDATE', 478, 'Updated inventory item', '2026-05-02 13:37:11', '{\"rate_pcs\": {\"new\": 138.595, \"old\": \"164.037650\"}, \"base_rate_pcs\": {\"new\": 138.595, \"old\": \"137.2700\"}, \"rate_adjustment\": {\"new\": null, \"old\": \"19.5%\"}}'),
(2239, 29, '0714', 'inventory_items', 'UPDATE', 478, 'Updated inventory item', '2026-05-02 13:37:23', '{\"scrap\": {\"new\": 149, \"old\": \"149.000000\"}, \"finish\": {\"new\": \"\", \"old\": null}, \"kg_box\": {\"new\": 0, \"old\": \"0.00\"}, \"kg_dzn\": {\"new\": 6.36, \"old\": \"6.360000\"}, \"labour\": {\"new\": 112.5, \"old\": \"110.000000\"}, \"rate_kg\": {\"new\": 261.5, \"old\": \"259.00\"}, \"empty_wt\": {\"new\": 0, \"old\": \"0.00\"}, \"rate_pcs\": {\"new\": 138.595, \"old\": \"138.595000\"}, \"total_kg\": {\"new\": 0, \"old\": \"0.00\"}, \"actual_wt\": {\"new\": 0, \"old\": \"0.00\"}, \"pic_or_kg\": {\"new\": 0, \"old\": null}, \"actual_net_kg\": {\"new\": 0, \"old\": \"0.00\"}, \"stock_quantity\": {\"new\": 0, \"old\": \"0.000000\"}}'),
(2240, 29, '0714', 'inventory_items', 'UPDATE', 478, 'Updated inventory item', '2026-05-02 13:37:45', '{\"rate_pcs\": {\"new\": 165.621025, \"old\": \"138.595000\"}, \"base_rate_pcs\": {\"new\": 138.595, \"old\": \"138.5950\"}, \"rate_adjustment\": {\"new\": \"19.50%\", \"old\": null}}'),
(2241, 29, '0714', 'master_items', 'UPDATE', 246, 'Updated master item', '2026-05-02 13:39:40', '{\"kg_dz\": {\"new\": 6.42, \"old\": \"6.360000\"}, \"stock_quantity\": {\"new\": 0, \"old\": \"0.000000\"}}'),
(2242, 29, '0714', 'master_items', 'UPDATE', 4, 'Updated master item', '2026-05-02 13:39:53', '{\"kg_dz\": {\"new\": 6.42, \"old\": \"6.360000\"}, \"stock_quantity\": {\"new\": 0, \"old\": \"0.000000\"}}'),
(2243, 29, '0714', 'inventory_items', 'CREATE', NULL, 'Created inventory from master for MHVS [Customer] (created: 2, skipped: 0, failed: 0)', '2026-05-02 13:40:54', NULL),
(2244, 29, '0714', 'users', 'LOGIN', 29, 'User 0714 logged in', '2026-05-02 13:48:00', NULL),
(2245, 29, '0714', 'journal_customers', 'CREATE', 54, 'Created journal customer: GAJANAN', '2026-05-02 13:49:04', NULL),
(2246, 29, '0714', 'journal_entries', 'CREATE', 65, 'Created Payment entry for GAJANAN: ₹16600', '2026-05-02 13:49:33', NULL),
(2247, 29, '0714', 'users', 'LOGIN', 29, 'User 0714 logged in', '2026-05-02 13:55:23', NULL),
(2248, 18, 'doller2', 'journal_entries', 'CREATE', 66, 'Created Receipt entry for AC ARST: ₹54654656', '2026-05-02 14:42:55', NULL),
(2249, 18, 'doller2', 'journal_entries', 'CREATE', 67, 'Created Receipt entry for AC CSRA: ₹6565656', '2026-05-02 14:43:29', NULL),
(2250, 29, '0714', 'users', 'LOGIN', 29, 'User 0714 logged in', '2026-05-02 14:56:17', NULL),
(2251, 29, '0714', 'master_items', 'UPDATE', 239, 'Updated master item', '2026-05-02 15:00:17', '{\"kg_dz\": {\"new\": 2.64, \"old\": \"2.628000\"}, \"stock_quantity\": {\"new\": 0, \"old\": \"0.000000\"}}'),
(2252, 29, '0714', 'master_items', 'UPDATE', 11, 'Updated master item', '2026-05-02 15:00:38', '{\"kg_dz\": {\"new\": 2.64, \"old\": \"2.628000\"}, \"stock_quantity\": {\"new\": 0, \"old\": \"0.000000\"}}'),
(2253, 29, '0714', 'master_items', 'UPDATE', 244, 'Updated master item', '2026-05-02 15:03:59', '{\"kg_dz\": {\"new\": 3.42, \"old\": \"3.360000\"}, \"stock_quantity\": {\"new\": 0, \"old\": \"0.000000\"}}'),
(2254, 29, '0714', 'master_items', 'UPDATE', 6, 'Updated master item', '2026-05-02 15:04:13', '{\"kg_dz\": {\"new\": 3.42, \"old\": \"3.396000\"}, \"stock_quantity\": {\"new\": 0, \"old\": \"0.000000\"}}'),
(2255, 29, '0714', 'master_items', 'UPDATE', 245, 'Updated master item', '2026-05-02 15:06:04', '{\"kg_dz\": {\"new\": 4.08, \"old\": \"4.020000\"}, \"stock_quantity\": {\"new\": 0, \"old\": \"0.000000\"}}'),
(2256, 29, '0714', 'master_items', 'UPDATE', 5, 'Updated master item', '2026-05-02 15:06:13', '{\"kg_dz\": {\"new\": 4.08, \"old\": \"4.020000\"}, \"stock_quantity\": {\"new\": 0, \"old\": \"0.000000\"}}'),
(2257, 29, '0714', 'inventory_items', 'CREATE', NULL, 'Created inventory from master for MHVS [Customer] (created: 2, skipped: 0, failed: 0)', '2026-05-02 15:08:05', NULL),
(2258, 29, '0714', 'inventory_items', 'CREATE', NULL, 'Created inventory from master for MHVS [Customer] (created: 2, skipped: 0, failed: 0)', '2026-05-02 15:08:18', NULL),
(2259, 29, '0714', 'users', 'LOGIN', 29, 'User 0714 logged in', '2026-05-02 15:16:28', NULL),
(2260, 29, '0714', 'inventory_items', 'UPDATE', 497, 'Updated inventory item', '2026-05-02 15:18:48', '{\"rate_pcs\": {\"new\": 69.36, \"old\": \"97.022400\"}, \"base_rate_pcs\": {\"new\": 69.36, \"old\": \"78.8800\"}, \"rate_adjustment\": {\"new\": null, \"old\": \"23%\"}}'),
(2261, 29, '0714', 'inventory_items', 'UPDATE', 497, 'Updated inventory item', '2026-05-02 15:19:12', '{\"rate_pcs\": {\"new\": 85.3128, \"old\": \"69.360000\"}, \"base_rate_pcs\": {\"new\": 69.36, \"old\": \"69.3600\"}, \"rate_adjustment\": {\"new\": \"23%\", \"old\": null}}'),
(2262, 29, '0714', 'users', 'LOGIN', 29, 'User 0714 logged in', '2026-05-02 15:25:11', NULL),
(2263, 29, '0714', 'inventory_items', 'UPDATE', 497, 'Updated inventory item', '2026-05-02 15:31:34', '{\"scrap\": {\"new\": 146, \"old\": \"146.000000\"}, \"finish\": {\"new\": \"\", \"old\": null}, \"kg_box\": {\"new\": 0, \"old\": \"0.00\"}, \"kg_dzn\": {\"new\": 4.08, \"old\": \"4.080000\"}, \"labour\": {\"new\": 58, \"old\": \"86.000000\"}, \"rate_kg\": {\"new\": 204, \"old\": \"232.00\"}, \"empty_wt\": {\"new\": 0, \"old\": \"0.00\"}, \"rate_pcs\": {\"new\": 69.36, \"old\": \"85.312800\"}, \"total_kg\": {\"new\": 0, \"old\": \"0.00\"}, \"actual_wt\": {\"new\": 0, \"old\": \"0.00\"}, \"pic_or_kg\": {\"new\": 0, \"old\": null}, \"actual_net_kg\": {\"new\": 0, \"old\": \"0.00\"}, \"stock_quantity\": {\"new\": 0, \"old\": \"0.000000\"}}'),
(2264, 29, '0714', 'users', 'LOGIN', 29, 'User 0714 logged in', '2026-05-02 15:40:23', NULL),
(2265, 29, '0714', 'sales_orders', 'DELETE', 5, 'Deleted sales order', '2026-05-02 15:50:16', NULL),
(2266, 29, '0714', 'inventory_items', 'UPDATE', 474, 'Updated inventory item', '2026-05-02 16:06:37', '{\"scrap\": {\"new\": 146, \"old\": \"146.000000\"}, \"finish\": {\"new\": \"\", \"old\": null}, \"kg_box\": {\"new\": 2.46, \"old\": \"0.00\"}, \"kg_dzn\": {\"new\": 2.46, \"old\": \"2.460000\"}, \"labour\": {\"new\": 42, \"old\": \"42.000000\"}, \"rate_kg\": {\"new\": 188, \"old\": \"188.00\"}, \"empty_wt\": {\"new\": 0, \"old\": \"0.00\"}, \"rate_pcs\": {\"new\": 47.4042, \"old\": \"47.404200\"}, \"total_kg\": {\"new\": 0, \"old\": \"0.00\"}, \"actual_wt\": {\"new\": 0.05, \"old\": \"0.00\"}, \"pic_or_kg\": {\"new\": 0, \"old\": null}, \"actual_net_kg\": {\"new\": 0, \"old\": \"0.00\"}, \"stock_quantity\": {\"new\": 0, \"old\": \"0.000000\"}}'),
(2267, 29, '0714', 'inventory_items', 'UPDATE', 472, 'Updated inventory item', '2026-05-02 16:06:54', '{\"scrap\": {\"new\": 146, \"old\": \"146.000000\"}, \"finish\": {\"new\": \"\", \"old\": null}, \"kg_box\": {\"new\": 1.61, \"old\": \"1.61\"}, \"kg_dzn\": {\"new\": 0.78, \"old\": \"0.780000\"}, \"labour\": {\"new\": 81, \"old\": \"81.000000\"}, \"rate_kg\": {\"new\": 227, \"old\": \"227.00\"}, \"empty_wt\": {\"new\": 0, \"old\": \"0.00\"}, \"rate_pcs\": {\"new\": 18.14865, \"old\": \"18.148650\"}, \"total_kg\": {\"new\": 0, \"old\": \"0.00\"}, \"actual_wt\": {\"new\": 0.048, \"old\": \"0.05\"}, \"pic_or_kg\": {\"new\": 0, \"old\": null}, \"actual_net_kg\": {\"new\": 0, \"old\": \"0.00\"}, \"stock_quantity\": {\"new\": 0, \"old\": \"0.000000\"}}'),
(2268, 29, '0714', 'inventory_items', 'UPDATE', 470, 'Updated inventory item', '2026-05-02 16:07:37', '{\"scrap\": {\"new\": 146, \"old\": \"146.000000\"}, \"finish\": {\"new\": \"\", \"old\": null}, \"kg_box\": {\"new\": 0, \"old\": \"0.00\"}, \"kg_dzn\": {\"new\": 1.824, \"old\": \"1.824000\"}, \"labour\": {\"new\": 51, \"old\": \"51.000000\"}, \"rate_kg\": {\"new\": 197, \"old\": \"197.00\"}, \"empty_wt\": {\"new\": 0, \"old\": \"0.00\"}, \"rate_pcs\": {\"new\": 36.83112, \"old\": \"36.831120\"}, \"total_kg\": {\"new\": 0, \"old\": \"0.00\"}, \"actual_wt\": {\"new\": 0, \"old\": \"0.00\"}, \"pic_or_kg\": {\"new\": 0, \"old\": null}, \"actual_net_kg\": {\"new\": 0, \"old\": \"0.00\"}, \"stock_quantity\": {\"new\": 0, \"old\": \"0.000000\"}}'),
(2269, 29, '0714', 'inventory_items', 'UPDATE', 493, 'Updated inventory item', '2026-05-02 16:08:23', '{\"scrap\": {\"new\": 146, \"old\": \"146.000000\"}, \"kg_box\": {\"new\": 2.19, \"old\": \"2.19\"}, \"kg_dzn\": {\"new\": 6.42, \"old\": \"6.420000\"}, \"labour\": {\"new\": 105, \"old\": \"105.000000\"}, \"rate_kg\": {\"new\": 251, \"old\": \"251.00\"}, \"empty_wt\": {\"new\": 0, \"old\": \"0.00\"}, \"rate_pcs\": {\"new\": 165.17055, \"old\": \"165.170550\"}, \"total_kg\": {\"new\": 0, \"old\": \"0.00\"}, \"actual_wt\": {\"new\": 0.045, \"old\": \"0.05\"}, \"pic_or_kg\": {\"new\": 0, \"old\": null}, \"actual_net_kg\": {\"new\": 0, \"old\": \"0.00\"}, \"stock_quantity\": {\"new\": 0, \"old\": \"0.000000\"}}'),
(2270, 29, '0714', 'inventory_items', 'UPDATE', 493, 'Updated inventory item', '2026-05-02 16:08:36', '{\"scrap\": {\"new\": 146, \"old\": \"146.000000\"}, \"kg_box\": {\"new\": 2.19, \"old\": \"2.19\"}, \"kg_dzn\": {\"new\": 6.42, \"old\": \"6.420000\"}, \"labour\": {\"new\": 105, \"old\": \"105.000000\"}, \"rate_kg\": {\"new\": 251, \"old\": \"251.00\"}, \"empty_wt\": {\"new\": 0, \"old\": \"0.00\"}, \"rate_pcs\": {\"new\": 165.17055, \"old\": \"165.170550\"}, \"total_kg\": {\"new\": 0, \"old\": \"0.00\"}, \"actual_wt\": {\"new\": 0.045, \"old\": \"0.05\"}, \"actual_net_kg\": {\"new\": 0, \"old\": \"0.00\"}, \"stock_quantity\": {\"new\": 0, \"old\": \"0.000000\"}}'),
(2271, 29, '0714', 'inventory_items', 'UPDATE', 468, 'Updated inventory item', '2026-05-02 16:09:02', '{\"scrap\": {\"new\": 146, \"old\": \"146.000000\"}, \"finish\": {\"new\": \"\", \"old\": null}, \"kg_box\": {\"new\": 0, \"old\": \"0.00\"}, \"kg_dzn\": {\"new\": 0.564, \"old\": \"0.564000\"}, \"labour\": {\"new\": 105, \"old\": \"105.000000\"}, \"rate_kg\": {\"new\": 251, \"old\": \"251.00\"}, \"empty_wt\": {\"new\": 0, \"old\": \"0.00\"}, \"rate_pcs\": {\"new\": 14.51031, \"old\": \"14.510310\"}, \"total_kg\": {\"new\": 0, \"old\": \"0.00\"}, \"actual_wt\": {\"new\": 0.048, \"old\": \"0.48\"}, \"pic_or_kg\": {\"new\": 0, \"old\": null}, \"actual_net_kg\": {\"new\": 0, \"old\": \"0.00\"}, \"stock_quantity\": {\"new\": 0, \"old\": \"0.000000\"}}'),
(2272, 29, '0714', 'inventory_items', 'CREATE', NULL, 'Created inventory from master for MHVS [Customer] (created: 2, skipped: 0, failed: 0)', '2026-05-02 16:11:38', NULL),
(2273, 29, '0714', 'inventory_items', 'UPDATE', 499, 'Updated inventory item', '2026-05-02 16:12:27', '{\"rate_pcs\": {\"new\": 57.38, \"old\": null}, \"base_rate_pcs\": {\"new\": 34.38, \"old\": null}, \"rate_adjustment\": {\"new\": \"23\", \"old\": null}}'),
(2274, 29, '0714', 'inventory_items', 'UPDATE', 499, 'Updated inventory item', '2026-05-02 16:12:36', '{\"rate_pcs\": {\"new\": 42.287400000000005, \"old\": \"57.380000\"}, \"base_rate_pcs\": {\"new\": 34.38, \"old\": \"34.3800\"}, \"rate_adjustment\": {\"new\": \"23%\", \"old\": \"23\"}}'),
(2275, 29, '0714', 'inventory_items', 'UPDATE', 498, 'Updated inventory item', '2026-05-02 16:13:16', '{\"rate_pcs\": {\"new\": 48.4866, \"old\": null}, \"base_rate_pcs\": {\"new\": 39.42, \"old\": null}, \"rate_adjustment\": {\"new\": \"23%\", \"old\": null}}'),
(2276, 29, '0714', 'inventory_items', 'UPDATE', 499, 'Updated inventory item', '2026-05-02 16:13:34', '{\"rate_pcs\": {\"new\": 35.82, \"old\": \"42.287400\"}, \"base_rate_pcs\": {\"new\": 35.82, \"old\": \"34.3800\"}, \"rate_adjustment\": {\"new\": null, \"old\": \"23%\"}}'),
(2277, 29, '0714', 'inventory_items', 'UPDATE', 499, 'Updated inventory item', '2026-05-02 16:14:07', '{\"scrap\": {\"new\": 146, \"old\": null}, \"finish\": {\"new\": \"\", \"old\": null}, \"kg_box\": {\"new\": 2.21, \"old\": \"0.00\"}, \"kg_dzn\": {\"new\": 2.16, \"old\": \"2.160000\"}, \"labour\": {\"new\": 53, \"old\": null}, \"box_ctn\": {\"new\": 20, \"old\": 0}, \"pcs_box\": {\"new\": 12, \"old\": 0}, \"pcs_ctn\": {\"new\": 240, \"old\": 0}, \"rate_kg\": {\"new\": 199, \"old\": \"0.00\"}, \"empty_wt\": {\"new\": 0, \"old\": \"0.00\"}, \"rate_pcs\": {\"new\": 35.82, \"old\": \"35.820000\"}, \"total_kg\": {\"new\": 0, \"old\": \"0.00\"}, \"actual_wt\": {\"new\": 0.048, \"old\": \"0.00\"}, \"pic_or_kg\": {\"new\": 0, \"old\": null}, \"actual_net_kg\": {\"new\": 0, \"old\": \"0.00\"}, \"stock_quantity\": {\"new\": 0, \"old\": \"0.000000\"}}'),
(2278, 29, '0714', 'inventory_items', 'UPDATE', 499, 'Updated inventory item', '2026-05-02 16:14:15', '{\"scrap\": {\"new\": 146, \"old\": \"146.000000\"}, \"finish\": {\"new\": \"SATIN\", \"old\": \"\"}, \"kg_box\": {\"new\": 2.21, \"old\": \"2.21\"}, \"kg_dzn\": {\"new\": 2.16, \"old\": \"2.160000\"}, \"labour\": {\"new\": 53, \"old\": \"53.000000\"}, \"rate_kg\": {\"new\": 199, \"old\": \"199.00\"}, \"empty_wt\": {\"new\": 0, \"old\": \"0.00\"}, \"rate_pcs\": {\"new\": 35.82, \"old\": \"35.820000\"}, \"total_kg\": {\"new\": 0, \"old\": \"0.00\"}, \"actual_wt\": {\"new\": 0.05, \"old\": \"0.05\"}, \"actual_net_kg\": {\"new\": 0, \"old\": \"0.00\"}, \"stock_quantity\": {\"new\": 0, \"old\": \"0.000000\"}}'),
(2279, 29, '0714', 'inventory_items', 'UPDATE', 498, 'Updated inventory item', '2026-05-02 16:14:25', '{\"scrap\": {\"new\": 0, \"old\": null}, \"finish\": {\"new\": \"ANT STEEL\", \"old\": null}, \"kg_box\": {\"new\": 0, \"old\": \"0.00\"}, \"kg_dzn\": {\"new\": 2.16, \"old\": \"2.160000\"}, \"labour\": {\"new\": 0, \"old\": null}, \"rate_kg\": {\"new\": 0, \"old\": \"0.00\"}, \"empty_wt\": {\"new\": 0, \"old\": \"0.00\"}, \"rate_pcs\": {\"new\": 48.4866, \"old\": \"48.486600\"}, \"total_kg\": {\"new\": 0, \"old\": \"0.00\"}, \"actual_wt\": {\"new\": 0, \"old\": \"0.00\"}, \"pic_or_kg\": {\"new\": 0, \"old\": null}, \"actual_net_kg\": {\"new\": 0, \"old\": \"0.00\"}, \"stock_quantity\": {\"new\": 0, \"old\": \"0.000000\"}}'),
(2280, 29, '0714', 'inventory_items', 'UPDATE', 498, 'Updated inventory item', '2026-05-02 16:14:46', '{\"scrap\": {\"new\": 0, \"old\": \"0.000000\"}, \"kg_box\": {\"new\": 2.21, \"old\": \"0.00\"}, \"kg_dzn\": {\"new\": 2.16, \"old\": \"2.160000\"}, \"labour\": {\"new\": 0, \"old\": \"0.000000\"}, \"box_ctn\": {\"new\": 20, \"old\": 0}, \"pcs_box\": {\"new\": 12, \"old\": 0}, \"pcs_ctn\": {\"new\": 240, \"old\": 0}, \"rate_kg\": {\"new\": 0, \"old\": \"0.00\"}, \"empty_wt\": {\"new\": 0, \"old\": \"0.00\"}, \"rate_pcs\": {\"new\": 48.4866, \"old\": \"48.486600\"}, \"total_kg\": {\"new\": 0, \"old\": \"0.00\"}, \"actual_wt\": {\"new\": 0.05, \"old\": \"0.00\"}, \"actual_net_kg\": {\"new\": 0, \"old\": \"0.00\"}, \"stock_quantity\": {\"new\": 0, \"old\": \"0.000000\"}}'),
(2281, 29, '0714', 'inventory_items', 'UPDATE', 499, 'Updated inventory item', '2026-05-02 16:15:00', '{\"rate_pcs\": {\"new\": 44.0586, \"old\": \"35.820000\"}, \"base_rate_pcs\": {\"new\": 35.82, \"old\": \"35.8200\"}, \"rate_adjustment\": {\"new\": \"23%\", \"old\": null}}'),
(2282, 29, '0714', 'inventory_items', 'UPDATE', 499, 'Updated inventory item', '2026-05-02 16:19:16', '{\"scrap\": {\"new\": 146, \"old\": \"146.000000\"}, \"kg_box\": {\"new\": 2.21, \"old\": \"2.21\"}, \"kg_dzn\": {\"new\": 2.16, \"old\": \"2.160000\"}, \"labour\": {\"new\": 53, \"old\": \"53.000000\"}, \"rate_kg\": {\"new\": 199, \"old\": \"199.00\"}, \"empty_wt\": {\"new\": 0, \"old\": \"0.00\"}, \"rate_pcs\": {\"new\": 44.0586, \"old\": \"44.058600\"}, \"total_kg\": {\"new\": 0, \"old\": \"0.00\"}, \"actual_wt\": {\"new\": 0, \"old\": \"0.05\"}, \"actual_net_kg\": {\"new\": 0, \"old\": \"0.00\"}, \"stock_quantity\": {\"new\": 0, \"old\": \"0.000000\"}}'),
(2283, 29, '0714', 'inventory_items', 'UPDATE', 499, 'Updated inventory item', '2026-05-02 16:19:39', '{\"scrap\": {\"new\": 146, \"old\": \"146.000000\"}, \"kg_box\": {\"new\": 2.21, \"old\": \"2.21\"}, \"kg_dzn\": {\"new\": 2.16, \"old\": \"2.160000\"}, \"labour\": {\"new\": 53, \"old\": \"53.000000\"}, \"rate_kg\": {\"new\": 199, \"old\": \"199.00\"}, \"empty_wt\": {\"new\": 0, \"old\": \"0.00\"}, \"rate_pcs\": {\"new\": 44.0586, \"old\": \"44.058600\"}, \"total_kg\": {\"new\": 0, \"old\": \"0.00\"}, \"actual_wt\": {\"new\": 0, \"old\": \"0.00\"}, \"actual_net_kg\": {\"new\": 0, \"old\": \"0.00\"}, \"stock_quantity\": {\"new\": 0, \"old\": \"0.000000\"}}'),
(2284, 29, '0714', 'inventory_items', 'UPDATE', 499, 'Updated inventory item', '2026-05-02 16:20:06', '{\"scrap\": {\"new\": 146, \"old\": \"146.000000\"}, \"kg_box\": {\"new\": 2.21, \"old\": \"2.21\"}, \"kg_dzn\": {\"new\": 2.16, \"old\": \"2.160000\"}, \"labour\": {\"new\": 53, \"old\": \"53.000000\"}, \"rate_kg\": {\"new\": 199, \"old\": \"199.00\"}, \"empty_wt\": {\"new\": 0, \"old\": \"0.00\"}, \"rate_pcs\": {\"new\": 35.82, \"old\": \"44.058600\"}, \"total_kg\": {\"new\": 0, \"old\": \"0.00\"}, \"actual_wt\": {\"new\": 0, \"old\": \"0.00\"}, \"actual_net_kg\": {\"new\": 0, \"old\": \"0.00\"}, \"stock_quantity\": {\"new\": 0, \"old\": \"0.000000\"}}'),
(2285, 29, '0714', 'inventory_items', 'UPDATE', 499, 'Updated inventory item', '2026-05-02 16:20:27', '{\"rate_pcs\": {\"new\": 44.0586, \"old\": \"35.820000\"}, \"base_rate_pcs\": {\"new\": 35.82, \"old\": \"35.8200\"}}'),
(2286, 29, '0714', 'inventory_items', 'UPDATE', 499, 'Updated inventory item', '2026-05-02 16:21:25', '{\"rate_pcs\": {\"new\": 34.38, \"old\": \"44.058600\"}, \"base_rate_pcs\": {\"new\": 34.38, \"old\": \"35.8200\"}, \"rate_adjustment\": {\"new\": null, \"old\": \"23%\"}}'),
(2287, 29, '0714', 'inventory_items', 'UPDATE', 499, 'Updated inventory item', '2026-05-02 16:21:32', '{\"scrap\": {\"new\": 146, \"old\": \"146.000000\"}, \"kg_box\": {\"new\": 2.21, \"old\": \"2.21\"}, \"kg_dzn\": {\"new\": 2.16, \"old\": \"2.160000\"}, \"labour\": {\"new\": 45, \"old\": \"53.000000\"}, \"rate_kg\": {\"new\": 191, \"old\": \"199.00\"}, \"empty_wt\": {\"new\": 0, \"old\": \"0.00\"}, \"rate_pcs\": {\"new\": 34.38, \"old\": \"34.380000\"}, \"total_kg\": {\"new\": 0, \"old\": \"0.00\"}, \"actual_wt\": {\"new\": 0, \"old\": \"0.00\"}, \"actual_net_kg\": {\"new\": 0, \"old\": \"0.00\"}, \"stock_quantity\": {\"new\": 0, \"old\": \"0.000000\"}}'),
(2288, 29, '0714', 'inventory_items', 'UPDATE', 498, 'Updated inventory item', '2026-05-02 16:21:53', '{\"scrap\": {\"new\": 146, \"old\": \"0.000000\"}, \"kg_box\": {\"new\": 2.21, \"old\": \"2.21\"}, \"kg_dzn\": {\"new\": 2.16, \"old\": \"2.160000\"}, \"labour\": {\"new\": 73, \"old\": \"0.000000\"}, \"rate_kg\": {\"new\": 219, \"old\": \"0.00\"}, \"empty_wt\": {\"new\": 0, \"old\": \"0.00\"}, \"rate_pcs\": {\"new\": 39.42, \"old\": \"48.486600\"}, \"total_kg\": {\"new\": 0, \"old\": \"0.00\"}, \"actual_wt\": {\"new\": 0.05, \"old\": \"0.05\"}, \"actual_net_kg\": {\"new\": 0, \"old\": \"0.00\"}, \"stock_quantity\": {\"new\": 0, \"old\": \"0.000000\"}}'),
(2289, 29, '0714', 'inventory_items', 'UPDATE', 498, 'Updated inventory item', '2026-05-02 16:22:12', '{\"scrap\": {\"new\": 146, \"old\": \"146.000000\"}, \"kg_box\": {\"new\": 2.21, \"old\": \"2.21\"}, \"kg_dzn\": {\"new\": 2.16, \"old\": \"2.160000\"}, \"labour\": {\"new\": 73, \"old\": \"73.000000\"}, \"rate_kg\": {\"new\": 219, \"old\": \"219.00\"}, \"empty_wt\": {\"new\": 0, \"old\": \"0.00\"}, \"rate_pcs\": {\"new\": 39.42, \"old\": \"39.420000\"}, \"total_kg\": {\"new\": 0, \"old\": \"0.00\"}, \"actual_wt\": {\"new\": 0, \"old\": \"0.05\"}, \"actual_net_kg\": {\"new\": 0, \"old\": \"0.00\"}, \"stock_quantity\": {\"new\": 0, \"old\": \"0.000000\"}}'),
(2290, 29, '0714', 'inventory_items', 'UPDATE', 498, 'Updated inventory item', '2026-05-02 16:22:24', '{\"rate_pcs\": {\"new\": 62.42, \"old\": \"39.420000\"}, \"base_rate_pcs\": {\"new\": 39.42, \"old\": \"39.4200\"}, \"rate_adjustment\": {\"new\": \"23\", \"old\": \"23%\"}}'),
(2291, 29, '0714', 'inventory_items', 'UPDATE', 498, 'Updated inventory item', '2026-05-02 16:22:35', '{\"rate_pcs\": {\"new\": 48.4866, \"old\": \"62.420000\"}, \"base_rate_pcs\": {\"new\": 39.42, \"old\": \"39.4200\"}, \"rate_adjustment\": {\"new\": \"23%\", \"old\": \"23\"}}'),
(2292, 29, '0714', 'inventory_items', 'UPDATE', 499, 'Updated inventory item', '2026-05-02 16:22:48', '{\"rate_pcs\": {\"new\": 42.287400000000005, \"old\": \"34.380000\"}, \"base_rate_pcs\": {\"new\": 34.38, \"old\": \"34.3800\"}, \"rate_adjustment\": {\"new\": \"23%\", \"old\": null}}'),
(2293, 29, '0714', 'sales_orders', 'CREATE', 6, 'Created sales order', '2026-05-02 16:24:13', NULL),
(2294, 29, '0714', 'sales_orders', 'CREATE', 7, 'Created sales order', '2026-05-02 16:24:31', NULL),
(2295, 29, '0714', 'sales_orders', 'CREATE', 8, 'Created sales order', '2026-05-02 16:24:50', NULL),
(2296, 29, '0714', 'sales_orders', 'CREATE', 9, 'Created sales order', '2026-05-02 16:25:29', NULL),
(2297, 29, '0714', 'sales_orders', 'CREATE', 10, 'Created sales order', '2026-05-02 16:26:02', NULL),
(2298, 29, '0714', 'sales_orders', 'UPDATE', 10, 'Updated sales order', '2026-05-02 16:26:16', '{\"note\": {\"new\": \"\", \"old\": null}, \"po_vr\": {\"new\": \"\", \"old\": null}, \"scrap\": {\"new\": 146, \"old\": \"146.00\"}, \"kg_box\": {\"new\": 1.73, \"old\": \"1.73\"}, \"kg_dzn\": {\"new\": 0.67, \"old\": \"0.67\"}, \"labour\": {\"new\": 85, \"old\": \"85.00\"}, \"qty_ctn\": {\"new\": 2, \"old\": \"1.00\"}, \"rate_kz\": {\"new\": 231, \"old\": \"231.000000\"}, \"rate_pcs\": {\"new\": 15.91, \"old\": \"15.91\"}, \"total_kg\": {\"new\": 80.4, \"old\": \"40.32\"}, \"stock_qty\": {\"new\": 0, \"old\": null}, \"quantity_pcs\": {\"new\": 1440, \"old\": null}, \"customer_name\": {\"new\": \"\", \"old\": null}, \"manufacturer_name\": {\"new\": \"\", \"old\": null}}'),
(2299, 29, '0714', 'sales_orders', 'UPDATE', 10, 'Updated sales order', '2026-05-02 16:26:28', '{\"scrap\": {\"new\": 146, \"old\": \"146.00\"}, \"kg_box\": {\"new\": 1.73, \"old\": \"1.73\"}, \"kg_dzn\": {\"new\": 0.67, \"old\": \"0.67\"}, \"labour\": {\"new\": 85, \"old\": \"85.00\"}, \"qty_ctn\": {\"new\": 2, \"old\": \"2.00\"}, \"rate_kz\": {\"new\": 231, \"old\": \"231.000000\"}, \"rate_pcs\": {\"new\": 15.91, \"old\": \"15.91\"}, \"total_kg\": {\"new\": 80.4, \"old\": \"80.40\"}, \"stock_qty\": {\"new\": 0, \"old\": \"0.00\"}, \"quantity_pcs\": {\"new\": 1440, \"old\": \"1440.000000\"}, \"customer_name\": {\"new\": \"\", \"old\": null}}'),
(2300, 29, '0714', 'sales_orders', 'CREATE', 11, 'Created sales order', '2026-05-02 16:26:59', NULL),
(2301, 29, '0714', 'sales_orders', 'CREATE', 12, 'Created sales order', '2026-05-02 16:27:28', NULL),
(2302, 29, '0714', 'sales_orders', 'UPDATE', 12, 'Updated sales order', '2026-05-02 16:27:42', '{\"note\": {\"new\": \"\", \"old\": null}, \"po_vr\": {\"new\": \"\", \"old\": null}, \"scrap\": {\"new\": 146, \"old\": \"146.00\"}, \"finish\": {\"new\": \"SATIN\", \"old\": null}, \"kg_box\": {\"new\": 3, \"old\": \"3.00\"}, \"kg_dzn\": {\"new\": 2.94, \"old\": \"2.94\"}, \"labour\": {\"new\": 50, \"old\": \"50.00\"}, \"box_ctn\": {\"new\": 0, \"old\": null}, \"pcs_box\": {\"new\": 0, \"old\": null}, \"pcs_ctn\": {\"new\": 0, \"old\": null}, \"qty_ctn\": {\"new\": 0, \"old\": null}, \"rate_kz\": {\"new\": 196, \"old\": \"196.000000\"}, \"rate_pcs\": {\"new\": 59.06, \"old\": \"59.06\"}, \"total_kg\": {\"new\": 44.1, \"old\": \"44.10\"}, \"stock_qty\": {\"new\": 0, \"old\": null}, \"quantity_pcs\": {\"new\": 180, \"old\": \"180.000000\"}, \"customer_name\": {\"new\": \"\", \"old\": null}, \"manufacturer_name\": {\"new\": \"\", \"old\": null}}'),
(2303, 29, '0714', 'sales_orders', 'UPDATE', 9, 'Updated sales order', '2026-05-02 16:27:48', '{\"note\": {\"new\": \"\", \"old\": null}, \"po_vr\": {\"new\": \"\", \"old\": null}, \"scrap\": {\"new\": 146, \"old\": \"146.00\"}, \"finish\": {\"new\": \"SATIN\", \"old\": null}, \"kg_box\": {\"new\": 1.44, \"old\": \"1.44\"}, \"kg_dzn\": {\"new\": 1.39, \"old\": \"1.39\"}, \"labour\": {\"new\": 53, \"old\": \"53.00\"}, \"qty_ctn\": {\"new\": 2, \"old\": \"2.00\"}, \"rate_kz\": {\"new\": 199, \"old\": \"199.000000\"}, \"rate_pcs\": {\"new\": 28.39, \"old\": \"28.39\"}, \"total_kg\": {\"new\": 66.82, \"old\": \"66.82\"}, \"stock_qty\": {\"new\": 0, \"old\": null}, \"quantity_pcs\": {\"new\": 576, \"old\": \"576.000000\"}, \"customer_name\": {\"new\": \"\", \"old\": null}, \"manufacturer_name\": {\"new\": \"\", \"old\": null}}'),
(2304, 29, '0714', 'sales_orders', 'UPDATE', 8, 'Updated sales order', '2026-05-02 16:27:53', '{\"note\": {\"new\": \"\", \"old\": null}, \"po_vr\": {\"new\": \"\", \"old\": null}, \"scrap\": {\"new\": 146, \"old\": \"146.00\"}, \"finish\": {\"new\": \"SATIN\", \"old\": null}, \"kg_box\": {\"new\": 1.87, \"old\": \"1.87\"}, \"kg_dzn\": {\"new\": 1.82, \"old\": \"1.82\"}, \"labour\": {\"new\": 51, \"old\": \"51.00\"}, \"qty_ctn\": {\"new\": 2, \"old\": \"2.00\"}, \"rate_kz\": {\"new\": 197, \"old\": \"197.000000\"}, \"rate_pcs\": {\"new\": 36.83, \"old\": \"36.83\"}, \"total_kg\": {\"new\": 72.96, \"old\": \"72.96\"}, \"stock_qty\": {\"new\": 0, \"old\": null}, \"quantity_pcs\": {\"new\": 480, \"old\": \"480.000000\"}, \"customer_name\": {\"new\": \"\", \"old\": null}, \"manufacturer_name\": {\"new\": \"\", \"old\": null}}'),
(2305, 29, '0714', 'sales_orders', 'UPDATE', 7, 'Updated sales order', '2026-05-02 16:27:57', '{\"note\": {\"new\": \"\", \"old\": null}, \"po_vr\": {\"new\": \"\", \"old\": null}, \"scrap\": {\"new\": 146, \"old\": \"146.00\"}, \"finish\": {\"new\": \"SATIN\", \"old\": null}, \"kg_box\": {\"new\": 2.21, \"old\": \"2.21\"}, \"kg_dzn\": {\"new\": 2.16, \"old\": \"2.16\"}, \"labour\": {\"new\": 45, \"old\": \"45.00\"}, \"qty_ctn\": {\"new\": 1, \"old\": \"1.00\"}, \"rate_kz\": {\"new\": 191, \"old\": \"191.000000\"}, \"rate_pcs\": {\"new\": 42.29, \"old\": \"42.29\"}, \"total_kg\": {\"new\": 43.2, \"old\": \"43.20\"}, \"stock_qty\": {\"new\": 0, \"old\": null}, \"quantity_pcs\": {\"new\": 240, \"old\": \"240.000000\"}, \"customer_name\": {\"new\": \"\", \"old\": null}, \"manufacturer_name\": {\"new\": \"\", \"old\": null}}'),
(2306, 29, '0714', 'users', 'LOGIN', 29, 'User 0714 logged in', '2026-05-02 16:29:29', NULL),
(2307, 29, '0714', 'inventory_items', 'UPDATE', 499, 'Updated inventory item', '2026-05-02 16:35:18', '{\"scrap\": {\"new\": 146, \"old\": \"146.000000\"}, \"kg_box\": {\"new\": 2.21, \"old\": \"2.21\"}, \"kg_dzn\": {\"new\": 2.16, \"old\": \"2.160000\"}, \"labour\": {\"new\": 45, \"old\": \"45.000000\"}, \"rate_kg\": {\"new\": 191, \"old\": \"191.00\"}, \"empty_wt\": {\"new\": 0.05, \"old\": \"0.00\"}, \"rate_pcs\": {\"new\": 42.2874, \"old\": \"42.287400\"}, \"total_kg\": {\"new\": 0, \"old\": \"0.00\"}, \"actual_wt\": {\"new\": 0, \"old\": \"0.00\"}, \"actual_net_kg\": {\"new\": 0, \"old\": \"0.00\"}, \"stock_quantity\": {\"new\": 0, \"old\": \"0.000000\"}}'),
(2308, 29, '0714', 'inventory_items', 'UPDATE', 499, 'Updated inventory item', '2026-05-02 16:36:44', '{\"scrap\": {\"new\": 146, \"old\": \"146.000000\"}, \"kg_box\": {\"new\": 2.21, \"old\": \"2.21\"}, \"kg_dzn\": {\"new\": 2.16, \"old\": \"2.160000\"}, \"labour\": {\"new\": 45, \"old\": \"45.000000\"}, \"rate_kg\": {\"new\": 191, \"old\": \"191.00\"}, \"empty_wt\": {\"new\": 0.05, \"old\": \"0.05\"}, \"rate_pcs\": {\"new\": 42.2874, \"old\": \"42.287400\"}, \"total_kg\": {\"new\": 0, \"old\": \"0.00\"}, \"actual_wt\": {\"new\": 0.05, \"old\": \"0.00\"}, \"actual_net_kg\": {\"new\": 0, \"old\": \"0.00\"}, \"stock_quantity\": {\"new\": 0, \"old\": \"0.000000\"}}'),
(2309, 29, '0714', 'inventory_items', 'UPDATE', 499, 'Updated inventory item', '2026-05-02 16:37:06', '{\"scrap\": {\"new\": 146, \"old\": \"146.000000\"}, \"kg_box\": {\"new\": 2.21, \"old\": \"2.21\"}, \"kg_dzn\": {\"new\": 2.16, \"old\": \"2.160000\"}, \"labour\": {\"new\": 45, \"old\": \"45.000000\"}, \"rate_kg\": {\"new\": 191, \"old\": \"191.00\"}, \"empty_wt\": {\"new\": 0, \"old\": \"0.05\"}, \"rate_pcs\": {\"new\": 42.2874, \"old\": \"42.287400\"}, \"total_kg\": {\"new\": 0, \"old\": \"0.00\"}, \"actual_wt\": {\"new\": 0, \"old\": \"0.05\"}, \"actual_net_kg\": {\"new\": 0, \"old\": \"0.00\"}, \"stock_quantity\": {\"new\": 0, \"old\": \"0.000000\"}}'),
(2310, 29, '0714', 'inventory_items', 'UPDATE', 497, 'Updated inventory item', '2026-05-02 16:40:14', '{\"rate_pcs\": {\"new\": 85.3128, \"old\": \"69.360000\"}, \"base_rate_pcs\": {\"new\": 69.36, \"old\": \"69.3600\"}}'),
(2311, 29, '0714', 'inventory_items', 'UPDATE', 497, 'Updated inventory item', '2026-05-02 16:40:29', '{\"scrap\": {\"new\": 146, \"old\": \"146.000000\"}, \"kg_box\": {\"new\": 2.78, \"old\": \"2.78\"}, \"kg_dzn\": {\"new\": 4.08, \"old\": \"4.080000\"}, \"labour\": {\"new\": 58, \"old\": \"58.000000\"}, \"rate_kg\": {\"new\": 204, \"old\": \"204.00\"}, \"empty_wt\": {\"new\": 0, \"old\": \"0.00\"}, \"rate_pcs\": {\"new\": 85.3128, \"old\": \"85.312800\"}, \"total_kg\": {\"new\": 0, \"old\": \"0.00\"}, \"actual_wt\": {\"new\": 0.06, \"old\": \"0.06\"}, \"actual_net_kg\": {\"new\": 0, \"old\": \"0.00\"}, \"stock_quantity\": {\"new\": 0, \"old\": \"0.000000\"}}'),
(2312, 29, '0714', 'inventory_items', 'UPDATE', 497, 'Updated inventory item', '2026-05-02 16:40:40', '{\"scrap\": {\"new\": 146, \"old\": \"146.000000\"}, \"kg_box\": {\"new\": 2.78, \"old\": \"2.78\"}, \"kg_dzn\": {\"new\": 4.08, \"old\": \"4.080000\"}, \"labour\": {\"new\": 58, \"old\": \"58.000000\"}, \"rate_kg\": {\"new\": 204, \"old\": \"204.00\"}, \"empty_wt\": {\"new\": 0, \"old\": \"0.00\"}, \"rate_pcs\": {\"new\": 85.3128, \"old\": \"85.312800\"}, \"total_kg\": {\"new\": 0, \"old\": \"0.00\"}, \"actual_wt\": {\"new\": 0.06, \"old\": \"0.06\"}, \"actual_net_kg\": {\"new\": 0, \"old\": \"0.00\"}, \"stock_quantity\": {\"new\": 0, \"old\": \"0.000000\"}}'),
(2313, 29, '0714', 'inventory_items', 'UPDATE', 497, 'Updated inventory item', '2026-05-02 16:40:55', '{\"scrap\": {\"new\": 146, \"old\": \"146.000000\"}, \"kg_box\": {\"new\": 2.78, \"old\": \"2.78\"}, \"kg_dzn\": {\"new\": 4.08, \"old\": \"4.080000\"}, \"labour\": {\"new\": 58, \"old\": \"58.000000\"}, \"rate_kg\": {\"new\": 204, \"old\": \"204.00\"}, \"empty_wt\": {\"new\": 0, \"old\": \"0.00\"}, \"rate_pcs\": {\"new\": 85.3128, \"old\": \"85.312800\"}, \"total_kg\": {\"new\": 0, \"old\": \"0.00\"}, \"actual_wt\": {\"new\": 0.06, \"old\": \"0.06\"}, \"actual_net_kg\": {\"new\": 0, \"old\": \"0.00\"}, \"stock_quantity\": {\"new\": 0, \"old\": \"0.000000\"}}'),
(2314, 29, '0714', 'inventory_items', 'UPDATE', 497, 'Updated inventory item', '2026-05-02 16:41:19', '{\"rate_pcs\": {\"new\": 84.6192, \"old\": \"85.312800\"}, \"base_rate_pcs\": {\"new\": 69.36, \"old\": \"69.3600\"}, \"rate_adjustment\": {\"new\": \"22%\", \"old\": \"23%\"}}'),
(2315, 29, '0714', 'inventory_items', 'UPDATE', 497, 'Updated inventory item', '2026-05-02 16:41:32', '{\"rate_pcs\": {\"new\": 85.3128, \"old\": \"84.619200\"}, \"base_rate_pcs\": {\"new\": 69.36, \"old\": \"69.3600\"}, \"rate_adjustment\": {\"new\": \"23%\", \"old\": \"22%\"}}'),
(2316, 21, 'AC', 'users', 'LOGIN', 21, 'User AC logged in', '2026-05-03 04:49:43', NULL),
(2317, 21, 'AC', 'journal_entries', 'UPDATE', 38, 'Updated journal entry', '2026-05-03 04:50:11', NULL),
(2318, 21, 'AC', 'journal_entries', 'UPDATE', 37, 'Updated journal entry', '2026-05-03 04:50:21', NULL),
(2319, 21, 'AC', 'journal_entries', 'UPDATE', 37, 'Updated journal entry', '2026-05-03 04:52:35', NULL),
(2320, 21, 'AC', 'journal_entries', 'UPDATE', 37, 'Updated journal entry', '2026-05-03 04:53:01', NULL),
(2321, 21, 'AC', 'journal_entries', 'CREATE', 68, 'Created Payment entry for N PRAGTI CS: ₹50000', '2026-05-03 04:54:08', NULL),
(2322, 21, 'AC', 'journal_entries', 'DELETE', 68, 'Deleted journal entry', '2026-05-03 04:56:19', NULL),
(2323, 29, '0714', 'users', 'LOGIN', 29, 'User 0714 logged in', '2026-05-03 06:11:05', NULL),
(2324, 29, '0714', 'journal_entries', 'CREATE', 69, 'Created Payment entry for SC RANVEER: ₹123244', '2026-05-03 06:12:03', NULL),
(2325, 29, '0714', 'users', 'LOGIN', 29, 'User 0714 logged in', '2026-05-03 11:34:28', NULL),
(2326, 29, '0714', 'journal_entries', 'CREATE', 70, 'Created Payment entry for NILKANTH TR: ₹106100', '2026-05-03 11:35:39', NULL),
(2327, 29, '0714', 'journal_entries', 'CREATE', 71, 'Created Payment entry for N KAILASH CH: ₹106100', '2026-05-03 11:39:30', NULL),
(2328, 29, '0714', 'journal_entries', 'UPDATE', 71, 'Updated journal entry', '2026-05-03 11:39:41', NULL),
(2329, 29, '0714', 'users', 'LOGIN', 29, 'User 0714 logged in', '2026-05-04 04:30:02', NULL),
(2330, 29, '0714', 'journal_customers', 'CREATE', 55, 'Created journal customer: HOLE TO GLASS', '2026-05-04 04:31:23', NULL),
(2331, 29, '0714', 'journal_customers', 'UPDATE', 55, 'Updated journal customer: P-HOLE TO GLASS', '2026-05-04 04:31:55', NULL),
(2332, 29, '0714', 'journal_entries', 'CREATE', 72, 'Created Payment entry for P-HOLE TO GLASS: ₹2500', '2026-05-04 04:32:31', NULL),
(2333, 29, '0714', 'users', 'LOGIN', 29, 'User 0714 logged in', '2026-05-04 04:48:55', NULL),
(2334, 29, '0714', 'users', 'LOGIN', 29, 'User 0714 logged in', '2026-05-04 12:24:25', NULL),
(2335, 29, '0714', 'journal_entries', 'CREATE', 73, 'Created Receipt entry for AC CSRA: ₹198800', '2026-05-04 12:25:08', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `user_permissions`
--

CREATE TABLE `user_permissions` (
  `id` int NOT NULL,
  `user_id` int NOT NULL,
  `permission_name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user_permissions`
--

INSERT INTO `user_permissions` (`id`, `user_id`, `permission_name`) VALUES
(141, 18, 'accounts'),
(155, 18, 'contacts'),
(152, 18, 'create_user'),
(144, 18, 'customers'),
(140, 18, 'dashboard'),
(151, 18, 'employees'),
(174, 18, 'employee_management'),
(149, 18, 'inventory_items'),
(153, 18, 'journal_entries'),
(150, 18, 'master_items'),
(143, 18, 'payments'),
(148, 18, 'purchase_invoices'),
(142, 18, 'receipts'),
(154, 18, 'reports'),
(147, 18, 'sales_invoices'),
(146, 18, 'sales_orders'),
(145, 18, 'suppliers'),
(265, 21, 'inventory_items'),
(267, 21, 'journal_entries'),
(266, 21, 'master_items'),
(264, 21, 'purchase_invoices'),
(263, 21, 'sales_invoices'),
(262, 21, 'sales_orders'),
(238, 29, 'accounts'),
(251, 29, 'contacts'),
(249, 29, 'create_user'),
(241, 29, 'customers'),
(237, 29, 'dashboard'),
(248, 29, 'employees'),
(246, 29, 'inventory_items'),
(250, 29, 'journal_entries'),
(247, 29, 'master_items'),
(240, 29, 'payments'),
(245, 29, 'purchase_invoices'),
(239, 29, 'receipts'),
(244, 29, 'sales_invoices'),
(243, 29, 'sales_orders'),
(242, 29, 'suppliers'),
(258, 30, 'sales_orders'),
(259, 31, 'payments'),
(261, 31, 'sales_invoices'),
(260, 31, 'sales_orders');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `accounts`
--
ALTER TABLE `accounts`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `code` (`code`),
  ADD KEY `created_by` (`created_by`);

--
-- Indexes for table `account_history`
--
ALTER TABLE `account_history`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_account_id` (`account_id`),
  ADD KEY `idx_contact_id` (`contact_id`),
  ADD KEY `idx_date` (`date`),
  ADD KEY `idx_transaction_type` (`transaction_type`),
  ADD KEY `idx_receipt_id` (`receipt_id`),
  ADD KEY `idx_payment_id` (`payment_id`),
  ADD KEY `idx_account_date` (`account_id`,`date`),
  ADD KEY `idx_account_type` (`account_id`,`transaction_type`);

--
-- Indexes for table `carton_inventory`
--
ALTER TABLE `carton_inventory`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `carton_name` (`carton_name`);

--
-- Indexes for table `contacts`
--
ALTER TABLE `contacts`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `code` (`code`),
  ADD KEY `created_by` (`created_by`);

--
-- Indexes for table `customer_details`
--
ALTER TABLE `customer_details`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `contact_id` (`contact_id`),
  ADD UNIQUE KEY `contact_id_2` (`contact_id`);

--
-- Indexes for table `employees`
--
ALTER TABLE `employees`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `mobile` (`mobile`);

--
-- Indexes for table `employee_advances`
--
ALTER TABLE `employee_advances`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_employee_id` (`employee_id`),
  ADD KEY `idx_date` (`date`),
  ADD KEY `idx_status` (`status`),
  ADD KEY `idx_employee_status` (`employee_id`,`status`),
  ADD KEY `idx_advance_date` (`employee_id`,`date`);

--
-- Indexes for table `employee_advance_repayments`
--
ALTER TABLE `employee_advance_repayments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_advance_id` (`advance_id`),
  ADD KEY `idx_employee_id` (`employee_id`),
  ADD KEY `idx_date` (`date`);

--
-- Indexes for table `employee_weekly_salary`
--
ALTER TABLE `employee_weekly_salary`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_employee_week` (`employee_id`,`week_start_date`),
  ADD KEY `idx_week_dates` (`week_start_date`,`week_end_date`),
  ADD KEY `idx_employee_week` (`employee_id`,`week_start_date`);

--
-- Indexes for table `employee_work_records`
--
ALTER TABLE `employee_work_records`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uk_employee_date` (`employee_id`,`work_date`);

--
-- Indexes for table `finishes_table`
--
ALTER TABLE `finishes_table`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `inventory_items`
--
ALTER TABLE `inventory_items`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `code_user` (`code_user`),
  ADD KEY `created_by` (`created_by`);

--
-- Indexes for table `invoices`
--
ALTER TABLE `invoices`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `invoice_number` (`invoice_number`),
  ADD KEY `customer_id` (`customer_id`);

--
-- Indexes for table `invoice_items`
--
ALTER TABLE `invoice_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `invoice_id` (`invoice_id`);

--
-- Indexes for table `journal_customers`
--
ALTER TABLE `journal_customers`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `journal_entries`
--
ALTER TABLE `journal_entries`
  ADD PRIMARY KEY (`id`),
  ADD KEY `method_id` (`method_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `idx_date` (`date`),
  ADD KEY `idx_type` (`type`),
  ADD KEY `idx_customer` (`customer_name`),
  ADD KEY `idx_entry_type` (`entry_type_id`);

--
-- Indexes for table `journal_entry_types`
--
ALTER TABLE `journal_entry_types`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`),
  ADD KEY `created_by` (`created_by`),
  ADD KEY `idx_name` (`name`);

--
-- Indexes for table `journal_entry_type_permissions`
--
ALTER TABLE `journal_entry_type_permissions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_type_user` (`entry_type_id`,`user_id`),
  ADD KEY `idx_user` (`user_id`),
  ADD KEY `idx_type` (`entry_type_id`);

--
-- Indexes for table `master_items`
--
ALTER TABLE `master_items`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `item_code` (`item_code`),
  ADD KEY `created_by` (`created_by`);

--
-- Indexes for table `order_stock`
--
ALTER TABLE `order_stock`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `pati_table`
--
ALTER TABLE `pati_table`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `payments`
--
ALTER TABLE `payments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `account_id` (`account_id`),
  ADD KEY `contact_id` (`contact_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `payment_methods`
--
ALTER TABLE `payment_methods`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `purchase_invoices`
--
ALTER TABLE `purchase_invoices`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `purchase_invoice_items`
--
ALTER TABLE `purchase_invoice_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `invoice_id` (`invoice_id`);

--
-- Indexes for table `receipts`
--
ALTER TABLE `receipts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `contact_id` (`contact_id`),
  ADD KEY `account_id` (`account_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `sales_invoice`
--
ALTER TABLE `sales_invoice`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `sales_lock`
--
ALTER TABLE `sales_lock`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `module_name` (`module_name`),
  ADD KEY `locked_by` (`locked_by`);

--
-- Indexes for table `sales_orders`
--
ALTER TABLE `sales_orders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `created_by` (`created_by`);

--
-- Indexes for table `shipping_cartons`
--
ALTER TABLE `shipping_cartons`
  ADD PRIMARY KEY (`id`),
  ADD KEY `invoice_id` (`invoice_id`);

--
-- Indexes for table `stock_history`
--
ALTER TABLE `stock_history`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_item_code` (`item_code`),
  ADD KEY `idx_movement_date` (`movement_date`),
  ADD KEY `idx_invoice_number` (`invoice_number`),
  ADD KEY `idx_transaction_type` (`transaction_type`),
  ADD KEY `idx_invoice_type` (`invoice_type`);

--
-- Indexes for table `supplier_details`
--
ALTER TABLE `supplier_details`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `contact_id` (`contact_id`),
  ADD UNIQUE KEY `contact_id_2` (`contact_id`);

--
-- Indexes for table `transport`
--
ALTER TABLE `transport`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `user_name` (`user_name`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `user_activity`
--
ALTER TABLE `user_activity`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_user_id` (`user_id`),
  ADD KEY `idx_model_name` (`model_name`),
  ADD KEY `idx_action_type` (`action_type`),
  ADD KEY `idx_created_at` (`created_at`);

--
-- Indexes for table `user_permissions`
--
ALTER TABLE `user_permissions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `user_id` (`user_id`,`permission_name`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `accounts`
--
ALTER TABLE `accounts`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `account_history`
--
ALTER TABLE `account_history`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `carton_inventory`
--
ALTER TABLE `carton_inventory`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `contacts`
--
ALTER TABLE `contacts`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `customer_details`
--
ALTER TABLE `customer_details`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `employees`
--
ALTER TABLE `employees`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `employee_advances`
--
ALTER TABLE `employee_advances`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `employee_advance_repayments`
--
ALTER TABLE `employee_advance_repayments`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `employee_weekly_salary`
--
ALTER TABLE `employee_weekly_salary`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `employee_work_records`
--
ALTER TABLE `employee_work_records`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=52;

--
-- AUTO_INCREMENT for table `finishes_table`
--
ALTER TABLE `finishes_table`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `inventory_items`
--
ALTER TABLE `inventory_items`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=500;

--
-- AUTO_INCREMENT for table `invoices`
--
ALTER TABLE `invoices`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `invoice_items`
--
ALTER TABLE `invoice_items`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `journal_customers`
--
ALTER TABLE `journal_customers`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=56;

--
-- AUTO_INCREMENT for table `journal_entries`
--
ALTER TABLE `journal_entries`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=74;

--
-- AUTO_INCREMENT for table `journal_entry_types`
--
ALTER TABLE `journal_entry_types`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `journal_entry_type_permissions`
--
ALTER TABLE `journal_entry_type_permissions`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `master_items`
--
ALTER TABLE `master_items`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=253;

--
-- AUTO_INCREMENT for table `order_stock`
--
ALTER TABLE `order_stock`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `pati_table`
--
ALTER TABLE `pati_table`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `payments`
--
ALTER TABLE `payments`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `payment_methods`
--
ALTER TABLE `payment_methods`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `purchase_invoices`
--
ALTER TABLE `purchase_invoices`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `purchase_invoice_items`
--
ALTER TABLE `purchase_invoice_items`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `receipts`
--
ALTER TABLE `receipts`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- AUTO_INCREMENT for table `sales_invoice`
--
ALTER TABLE `sales_invoice`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `sales_lock`
--
ALTER TABLE `sales_lock`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `sales_orders`
--
ALTER TABLE `sales_orders`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `shipping_cartons`
--
ALTER TABLE `shipping_cartons`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=106;

--
-- AUTO_INCREMENT for table `stock_history`
--
ALTER TABLE `stock_history`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `supplier_details`
--
ALTER TABLE `supplier_details`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `transport`
--
ALTER TABLE `transport`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=32;

--
-- AUTO_INCREMENT for table `user_activity`
--
ALTER TABLE `user_activity`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2336;

--
-- AUTO_INCREMENT for table `user_permissions`
--
ALTER TABLE `user_permissions`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=268;

-- --------------------------------------------------------

--
-- Structure for view `employee_advance_summary`
--
DROP TABLE IF EXISTS `employee_advance_summary`;

CREATE ALGORITHM=UNDEFINED DEFINER=`Dhrumit`@`%` SQL SECURITY DEFINER VIEW `employee_advance_summary`  AS SELECT `e`.`id` AS `employee_id`, `e`.`name` AS `employee_name`, count(distinct `ea`.`id`) AS `total_advances`, coalesce(sum((case when (`ea`.`status` = 'PENDING') then `ea`.`amount` else 0 end)),0) AS `pending_amount`, coalesce(sum((case when (`ea`.`status` in ('PENDING','PARTIAL')) then `ea`.`remaining_balance` else 0 end)),0) AS `total_remaining_balance`, coalesce(sum(`ear`.`amount`),0) AS `total_repaid` FROM ((`employees` `e` left join `employee_advances` `ea` on((`e`.`id` = `ea`.`employee_id`))) left join `employee_advance_repayments` `ear` on((`ea`.`id` = `ear`.`advance_id`))) GROUP BY `e`.`id`, `e`.`name` ;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `accounts`
--
ALTER TABLE `accounts`
  ADD CONSTRAINT `accounts_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `account_history`
--
ALTER TABLE `account_history`
  ADD CONSTRAINT `fk_account_history_account` FOREIGN KEY (`account_id`) REFERENCES `accounts` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_account_history_contact` FOREIGN KEY (`contact_id`) REFERENCES `contacts` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_account_history_payment` FOREIGN KEY (`payment_id`) REFERENCES `payments` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `fk_account_history_receipt` FOREIGN KEY (`receipt_id`) REFERENCES `receipts` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `contacts`
--
ALTER TABLE `contacts`
  ADD CONSTRAINT `contacts_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `customer_details`
--
ALTER TABLE `customer_details`
  ADD CONSTRAINT `customer_details_ibfk_1` FOREIGN KEY (`contact_id`) REFERENCES `contacts` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `employee_advances`
--
ALTER TABLE `employee_advances`
  ADD CONSTRAINT `employee_advances_ibfk_1` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `employee_advance_repayments`
--
ALTER TABLE `employee_advance_repayments`
  ADD CONSTRAINT `employee_advance_repayments_ibfk_1` FOREIGN KEY (`advance_id`) REFERENCES `employee_advances` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `employee_advance_repayments_ibfk_2` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `employee_weekly_salary`
--
ALTER TABLE `employee_weekly_salary`
  ADD CONSTRAINT `employee_weekly_salary_ibfk_1` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `employee_work_records`
--
ALTER TABLE `employee_work_records`
  ADD CONSTRAINT `employee_work_records_ibfk_1` FOREIGN KEY (`employee_id`) REFERENCES `employees` (`id`);

--
-- Constraints for table `invoice_items`
--
ALTER TABLE `invoice_items`
  ADD CONSTRAINT `invoice_items_ibfk_1` FOREIGN KEY (`invoice_id`) REFERENCES `invoices` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `journal_entries`
--
ALTER TABLE `journal_entries`
  ADD CONSTRAINT `journal_entries_ibfk_1` FOREIGN KEY (`method_id`) REFERENCES `payment_methods` (`id`) ON DELETE RESTRICT,
  ADD CONSTRAINT `journal_entries_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `journal_entries_ibfk_3` FOREIGN KEY (`entry_type_id`) REFERENCES `journal_entry_types` (`id`) ON DELETE RESTRICT;

--
-- Constraints for table `journal_entry_types`
--
ALTER TABLE `journal_entry_types`
  ADD CONSTRAINT `journal_entry_types_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `journal_entry_type_permissions`
--
ALTER TABLE `journal_entry_type_permissions`
  ADD CONSTRAINT `journal_entry_type_permissions_ibfk_1` FOREIGN KEY (`entry_type_id`) REFERENCES `journal_entry_types` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `journal_entry_type_permissions_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `master_items`
--
ALTER TABLE `master_items`
  ADD CONSTRAINT `master_items_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `payments`
--
ALTER TABLE `payments`
  ADD CONSTRAINT `payments_ibfk_1` FOREIGN KEY (`account_id`) REFERENCES `accounts` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `payments_ibfk_2` FOREIGN KEY (`contact_id`) REFERENCES `contacts` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `payments_ibfk_3` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `purchase_invoice_items`
--
ALTER TABLE `purchase_invoice_items`
  ADD CONSTRAINT `purchase_invoice_items_ibfk_1` FOREIGN KEY (`invoice_id`) REFERENCES `purchase_invoices` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `receipts`
--
ALTER TABLE `receipts`
  ADD CONSTRAINT `receipts_ibfk_1` FOREIGN KEY (`contact_id`) REFERENCES `contacts` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `receipts_ibfk_2` FOREIGN KEY (`account_id`) REFERENCES `accounts` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `receipts_ibfk_3` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `sales_lock`
--
ALTER TABLE `sales_lock`
  ADD CONSTRAINT `sales_lock_ibfk_1` FOREIGN KEY (`locked_by`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `sales_orders`
--
ALTER TABLE `sales_orders`
  ADD CONSTRAINT `sales_orders_ibfk_2` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`);

--
-- Constraints for table `shipping_cartons`
--
ALTER TABLE `shipping_cartons`
  ADD CONSTRAINT `shipping_cartons_ibfk_1` FOREIGN KEY (`invoice_id`) REFERENCES `invoices` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `stock_history`
--
ALTER TABLE `stock_history`
  ADD CONSTRAINT `fk_stock_history_item` FOREIGN KEY (`item_code`) REFERENCES `master_items` (`item_code`) ON DELETE CASCADE;

--
-- Constraints for table `supplier_details`
--
ALTER TABLE `supplier_details`
  ADD CONSTRAINT `supplier_details_ibfk_1` FOREIGN KEY (`contact_id`) REFERENCES `contacts` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `user_activity`
--
ALTER TABLE `user_activity`
  ADD CONSTRAINT `fk_user_activity_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `user_permissions`
--
ALTER TABLE `user_permissions`
  ADD CONSTRAINT `user_permissions_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
