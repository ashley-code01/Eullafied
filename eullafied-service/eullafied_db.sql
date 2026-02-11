-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               8.0.41 - MySQL Community Server - GPL
-- Server OS:                    Win64
-- HeidiSQL Version:             12.12.0.7122
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

-- Dumping data for table eullafied_db.department: ~4 rows (approximately)
INSERT INTO `department` (`department_id`, `department_name`) VALUES
	('87012dbe-32dd-413f-931d-5ab0f851dda9', 'Networks & Communications'),
	('93215cc2-8162-4e2a-9d19-0b965d6cd15f', 'HR'),
	('9ba08d7a-5689-49bb-b7e3-fe778321ca4f', 'IT '),
	('bb7c5e72-6161-4a86-89b3-5f1de5da0354', 'Finance');

-- Dumping data for table eullafied_db.role: ~4 rows (approximately)
INSERT INTO `role` (`role_id`, `role_name`) VALUES
	('0a456084-e185-4350-baf7-336bf659c022', 'IT Staff'),
	('c1feb29f-66a6-4190-92d8-7e0cdea74616', 'Admin'),
	('f69acee4-46e3-4be5-a37f-559b193dfd8f', 'Manager'),
	('g69acee4-46e3-4be5-a37f-559b193dfd8f', 'Staff Emp');

-- Dumping data for table eullafied_db.staff_performance_counters: ~2 rows (approximately)
INSERT INTO `staff_performance_counters` (`id`, `user_id`, `metric_date`, `tickets_resolved`, `avg_resolution_seconds`, `created_at`, `updated_at`) VALUES
	(1, '21046d24-bb4c-4b36-94c8-d4ed9b16bc96', '2025-10-27', 1, 901836, '2025-10-29 16:03:00.061312', '2025-10-30 20:55:00.000000'),
	(2, '21046d24-bb4c-4b36-94c8-d4ed9b16bc96', '2025-10-29', 2, 1998420, '2025-10-29 19:26:50.917401', '2025-10-29 19:26:50.917401'),
	(6, '21046d24-bb4c-4b36-94c8-d4ed9b16bc96', '2025-10-30', 2, 1998420, '2025-10-30 20:26:19.724255', '2025-10-30 20:26:19.724255');

-- Dumping data for table eullafied_db.tickets: ~11 rows (approximately)
INSERT INTO `tickets` (`ticket_id`, `ticket_number`, `description`, `manager_approved_at`, `manager_comment`, `created_at`, `updated_at`, `closed_at`, `cancelled_at`, `resolution_summary`, `requester_id`, `department_id`, `category_id`, `priority_id`, `status_id`, `manager_id`) VALUES
	('22ed2b60-ca58-419a-b530-a257ba57c287', 'TN-002', 'Hardware failure keyboard not working', NULL, 'Ticket has been approved', '2025-09-22 13:40:18.124981', '2025-10-30 20:57:58.000000', NULL, NULL, NULL, 'ee544faf-f79d-4bc1-b5d0-9d14546be409', '93215cc2-8162-4e2a-9d19-0b965d6cd15f', '9945fd0d-35b8-4e09-9500-8ea2243b8dad', 'cd0d107e-e9af-4152-8f94-4f77b09cb114', '16c036a4-7ebe-4dd5-b3ee-b3ba7f1d1f6e', 'd64f9738-bf5b-4514-843c-ab61ce57825a'),
	('2898c9f0-c94d-493c-9079-e2c8860b94be', 'TN-003', 'dsdde', NULL, 'jk', '2025-10-20 10:24:02.726430', '2025-10-30 20:54:39.000000', '2025-10-30 20:54:39', NULL, NULL, '2dd4a8bc-4488-4386-9c10-ef5a12366553', '9ba08d7a-5689-49bb-b7e3-fe778321ca4f', '5c475a07-2197-4761-974b-c12b5b808963', '2e49431d-a0f5-49fc-87e1-20e55132c1fa', '4bcec89a-c7cc-4ab1-afb7-d2a559c2d44d', '2dd4a8bc-4488-4386-9c10-ef5a12366553'),
	('441df7d3-9b27-4119-a388-6dd664e44b04', 'TN-003', 'fsdfv', NULL, NULL, '2025-10-20 12:15:38.480417', '2025-10-20 12:15:38.480417', NULL, NULL, NULL, '80d12f09-6c30-484f-a67b-2d059017c8a1', '9ba08d7a-5689-49bb-b7e3-fe778321ca4f', '9945fd0d-35b8-4e09-9500-8ea2243b8dad', '9b3989f2-f105-4aa6-9761-ef321f6f4f7b', 'aeebbd22-df93-4d45-aa00-d1bd0cf30735', NULL),
	('48f7f91e-7cab-41f0-a5ce-3dce55187064', 'TN-003', 'I don\'t have network', NULL, NULL, '2025-10-29 19:46:03.219831', '2025-10-29 19:46:03.219831', NULL, NULL, NULL, '2dd4a8bc-4488-4386-9c10-ef5a12366553', '9ba08d7a-5689-49bb-b7e3-fe778321ca4f', '5c475a07-2197-4761-974b-c12b5b808963', 'cd0d107e-e9af-4152-8f94-4f77b09cb114', 'aeebbd22-df93-4d45-aa00-d1bd0cf30735', '2dd4a8bc-4488-4386-9c10-ef5a12366553'),
	('4a2692c2-babc-4d21-80a4-1933f761bbf5', 'TN-003', 'sfva yes yes', NULL, NULL, '2025-10-19 18:58:23.840594', '2025-10-20 10:34:25.744994', NULL, NULL, NULL, '2dd4a8bc-4488-4386-9c10-ef5a12366553', '9ba08d7a-5689-49bb-b7e3-fe778321ca4f', '9945fd0d-35b8-4e09-9500-8ea2243b8dad', 'cd0d107e-e9af-4152-8f94-4f77b09cb114', '237537e4-2f8c-4b1e-aea6-b39c2329b88b', '2dd4a8bc-4488-4386-9c10-ef5a12366553'),
	('629a1b67-7920-441c-bd7a-7c4da3725da8', 'TN-001', 'Hardware failure keyboard not working', NULL, NULL, '2025-09-22 13:32:54.234349', '2025-10-20 10:49:21.037009', NULL, NULL, NULL, '80d12f09-6c30-484f-a67b-2d059017c8a1', '9ba08d7a-5689-49bb-b7e3-fe778321ca4f', '9945fd0d-35b8-4e09-9500-8ea2243b8dad', 'ac29bb75-0860-4df8-8113-c2bcb55f4e89', 'aeebbd22-df93-4d45-aa00-d1bd0cf30735', '21046d24-bb4c-4b36-94c8-d4ed9b16bc96'),
	('6ec3ed8a-cd1d-4ba3-b023-9a41bf7824eb', 'TN-003', 'cvdsc', NULL, NULL, '2025-10-20 12:46:32.386961', '2025-10-20 12:46:32.386961', NULL, NULL, NULL, '80d12f09-6c30-484f-a67b-2d059017c8a1', '9ba08d7a-5689-49bb-b7e3-fe778321ca4f', '9945fd0d-35b8-4e09-9500-8ea2243b8dad', '2e49431d-a0f5-49fc-87e1-20e55132c1fa', 'aeebbd22-df93-4d45-aa00-d1bd0cf30735', NULL),
	('758302bb-1fe6-4322-b9ff-533cde76d1f6', 'TN-003', 'dewf', NULL, NULL, '2025-10-20 12:18:25.116798', '2025-10-30 20:57:53.000000', '2025-10-30 20:57:44', NULL, NULL, '80d12f09-6c30-484f-a67b-2d059017c8a1', '9ba08d7a-5689-49bb-b7e3-fe778321ca4f', '5c475a07-2197-4761-974b-c12b5b808963', 'cd0d107e-e9af-4152-8f94-4f77b09cb114', '16c036a4-7ebe-4dd5-b3ee-b3ba7f1d1f6e', NULL),
	('8ab4e127-476a-4ae5-a0d9-36ee6a7f4d2e', 'TN-003', 'gteer', NULL, NULL, '2025-10-20 12:32:19.363268', '2025-10-20 12:32:19.363268', NULL, NULL, NULL, '80d12f09-6c30-484f-a67b-2d059017c8a1', '9ba08d7a-5689-49bb-b7e3-fe778321ca4f', '9945fd0d-35b8-4e09-9500-8ea2243b8dad', 'cd0d107e-e9af-4152-8f94-4f77b09cb114', 'aeebbd22-df93-4d45-aa00-d1bd0cf30735', NULL),
	('ac2b3acb-8acf-4617-b93e-1819bfb61a08', 'TN-003', 'cdscsdc', NULL, NULL, '2025-10-30 20:09:46.905024', '2025-10-30 20:09:46.905024', NULL, NULL, NULL, '80d12f09-6c30-484f-a67b-2d059017c8a1', '9ba08d7a-5689-49bb-b7e3-fe778321ca4f', 'c99d0c6c-9625-4433-9e85-d593fc97a9dd', '2e49431d-a0f5-49fc-87e1-20e55132c1fa', '237537e4-2f8c-4b1e-aea6-b39c2329b88b', NULL),
	('b8dee8c0-fda6-41ee-a6d4-088cdb0f3d4c', 'TN-003', 'NEshjkl', NULL, NULL, '2025-10-20 12:03:54.903066', '2025-10-20 12:03:54.903066', NULL, NULL, NULL, '80d12f09-6c30-484f-a67b-2d059017c8a1', '9ba08d7a-5689-49bb-b7e3-fe778321ca4f', '9945fd0d-35b8-4e09-9500-8ea2243b8dad', '2e49431d-a0f5-49fc-87e1-20e55132c1fa', 'aeebbd22-df93-4d45-aa00-d1bd0cf30735', '80d12f09-6c30-484f-a67b-2d059017c8a1'),
	('c4174392-eaa1-4bac-a171-d8fb4e40ae9f', 'TN-003', 'cfve', NULL, NULL, '2025-10-30 21:14:25.395804', '2025-10-30 21:14:25.395804', NULL, NULL, NULL, '80d12f09-6c30-484f-a67b-2d059017c8a1', '9ba08d7a-5689-49bb-b7e3-fe778321ca4f', 'c99d0c6c-9625-4433-9e85-d593fc97a9dd', 'ac29bb75-0860-4df8-8113-c2bcb55f4e89', '237537e4-2f8c-4b1e-aea6-b39c2329b88b', NULL),
	('eccaeb91-d968-4cd5-b08f-bec582f3919f', 'TN-002', 'bkhbh', NULL, NULL, '2025-10-19 18:57:09.127585', '2025-10-20 10:34:44.508768', NULL, NULL, NULL, '2dd4a8bc-4488-4386-9c10-ef5a12366553', '9ba08d7a-5689-49bb-b7e3-fe778321ca4f', '9945fd0d-35b8-4e09-9500-8ea2243b8dad', 'ac29bb75-0860-4df8-8113-c2bcb55f4e89', '16c036a4-7ebe-4dd5-b3ee-b3ba7f1d1f6e', '2dd4a8bc-4488-4386-9c10-ef5a12366553');

-- Dumping data for table eullafied_db.ticket_assignments: ~3 rows (approximately)
INSERT INTO `ticket_assignments` (`assignment_id`, `assigned_at`, `updated_at`, `assignment_reason`, `ticket_id`, `assigned_to`, `unassigned_at`) VALUES
	('0da16100-04a3-4bca-84d9-f730a5c49c08', '2025-10-30 21:07:02.068237', '2025-10-30 21:07:02.068237', NULL, 'b8dee8c0-fda6-41ee-a6d4-088cdb0f3d4c', '21046d24-bb4c-4b36-94c8-d4ed9b16bc96', NULL),
	('18500d7b-ed3d-4f0b-9a04-0602acb0fc4f', '2025-10-30 21:10:35.689620', '2025-10-30 21:10:35.689620', NULL, '629a1b67-7920-441c-bd7a-7c4da3725da8', '21046d24-bb4c-4b36-94c8-d4ed9b16bc96', NULL),
	('1ad662d8-cd3a-4daf-a1a3-286454edfc0d', '2025-10-30 21:11:12.144271', '2025-10-30 21:11:12.144271', NULL, '629a1b67-7920-441c-bd7a-7c4da3725da8', '21046d24-bb4c-4b36-94c8-d4ed9b16bc96', NULL),
	('2cc7d65f-9b44-4e6d-8acd-6310ac9077c8', '2025-10-30 21:12:34.590039', '2025-10-30 21:12:34.590039', NULL, '629a1b67-7920-441c-bd7a-7c4da3725da8', '21046d24-bb4c-4b36-94c8-d4ed9b16bc96', NULL),
	('39798b5d-cb96-4e8f-b967-1a2506eec9c7', '2025-10-21 05:49:09.640113', '2025-10-21 05:49:09.640113', NULL, '22ed2b60-ca58-419a-b530-a257ba57c287', '21046d24-bb4c-4b36-94c8-d4ed9b16bc96', NULL),
	('4035451e-b4ad-45a3-8303-4b14a0cf7072', '2025-10-30 21:11:21.381484', '2025-10-30 21:11:21.381484', NULL, '629a1b67-7920-441c-bd7a-7c4da3725da8', '21046d24-bb4c-4b36-94c8-d4ed9b16bc96', NULL),
	('6cb21b28-c933-459c-aa43-f2fc6910f04d', '2025-10-30 21:09:00.447169', '2025-10-30 21:09:00.447169', NULL, '8ab4e127-476a-4ae5-a0d9-36ee6a7f4d2e', '21046d24-bb4c-4b36-94c8-d4ed9b16bc96', NULL),
	('7ad08d82-5a9a-4c61-b7e7-1d702f3c5a43', '2025-10-30 21:04:27.082974', '2025-10-30 21:04:27.082974', NULL, '441df7d3-9b27-4119-a388-6dd664e44b04', '21046d24-bb4c-4b36-94c8-d4ed9b16bc96', NULL),
	('b17db617-6f05-41e4-b35f-847c0c445872', '2025-10-21 05:59:00.637415', '2025-10-21 05:59:00.637415', NULL, '758302bb-1fe6-4322-b9ff-533cde76d1f6', '21046d24-bb4c-4b36-94c8-d4ed9b16bc96', NULL),
	('e9c09080-413f-4615-8f25-275832da372d', '2025-10-27 15:31:11.534942', '2025-10-27 15:31:11.534942', NULL, '2898c9f0-c94d-493c-9079-e2c8860b94be', '21046d24-bb4c-4b36-94c8-d4ed9b16bc96', NULL);

-- Dumping data for table eullafied_db.ticket_category: ~4 rows (approximately)
INSERT INTO `ticket_category` (`category_id`, `name`) VALUES
	('5c475a07-2197-4761-974b-c12b5b808963', 'Network'),
	('6d6c4c79-cc17-4ddc-a1ff-01266f497814', 'Software'),
	('9945fd0d-35b8-4e09-9500-8ea2243b8dad', 'Hardware'),
	('c99d0c6c-9625-4433-9e85-d593fc97a9dd', 'Assistance');

-- Dumping data for table eullafied_db.ticket_priority: ~5 rows (approximately)
INSERT INTO `ticket_priority` (`priority_id`, `name`) VALUES
	('2e49431d-a0f5-49fc-87e1-20e55132c1fa', 'High'),
	('9b3989f2-f105-4aa6-9761-ef321f6f4f7b', 'Low'),
	('ac29bb75-0860-4df8-8113-c2bcb55f4e89', 'Medium'),
	('b274fa68-3392-4de2-9b14-875437a08960', 'Moderate'),
	('cd0d107e-e9af-4152-8f94-4f77b09cb114', 'Critical');

-- Dumping data for table eullafied_db.ticket_status: ~6 rows (approximately)
INSERT INTO `ticket_status` (`status_id`, `status_name`) VALUES
	('16c036a4-7ebe-4dd5-b3ee-b3ba7f1d1f6e', 'In Progress'),
	('1c76b35e-0f04-419b-8b7e-7178461b06c3', 'Finished'),
	('237537e4-2f8c-4b1e-aea6-b39c2329b88b', 'Pending Approval'),
	('4bcec89a-c7cc-4ab1-afb7-d2a559c2d44d', 'Completed'),
	('aeebbd22-df93-4d45-aa00-d1bd0cf30735', 'Approved-Awaiting Assistance'),
	('db216acd-be48-4841-8afc-18d39978997f', 'Declined');

-- Dumping data for table eullafied_db.user: ~7 rows (approximately)
INSERT INTO `user` (`user_id`, `name`, `surname`, `password`, `email`, `role_id`, `department_id`, `assigned_at`, `updated_at`) VALUES
	('0d6a1a3d-cfd3-41bd-8819-a70363a97b6f', 'Jac IT man', 'Don', '12345', 'itman@main.com', '0a456084-e185-4350-baf7-336bf659c022', '9ba08d7a-5689-49bb-b7e3-fe778321ca4f', '2025-09-22 13:36:50.826044', '2025-10-29 12:58:51.000000'),
	('21046d24-bb4c-4b36-94c8-d4ed9b16bc96', 'Sibu', 'Maseko', '$2b$10$4yeEGs8odXiOWI8o7yzZz.CJ2KmFX2rPs4.kWsoy3.Ec1bnpAi//K', 'sbm@mail.com', '0a456084-e185-4350-baf7-336bf659c022', '9ba08d7a-5689-49bb-b7e3-fe778321ca4f', '2025-09-24 05:20:00.387091', '2025-10-29 19:31:46.318149'),
	('2dd4a8bc-4488-4386-9c10-ef5a12366553', 'John', 'Don', '$2b$10$RDHTO57hJwx00AR9CF/vduZKgqU79pXeiAmcHklDgcvSqKYOeN7Em', 'jd@gmail.com', 'f69acee4-46e3-4be5-a37f-559b193dfd8f', '9ba08d7a-5689-49bb-b7e3-fe778321ca4f', '2025-09-24 06:19:52.996290', '2025-10-29 19:53:15.000000'),
	('80d12f09-6c30-484f-a67b-2d059017c8a1', 'Sibu', 'Okesam', '$2b$10$4yeEGs8odXiOWI8o7yzZz.CJ2KmFX2rPs4.kWsoy3.Ec1bnpAi//K', 'sibu@gmail.com', 'g69acee4-46e3-4be5-a37f-559b193dfd8f', '9ba08d7a-5689-49bb-b7e3-fe778321ca4f', '2025-09-22 14:15:19.963536', '2025-10-29 19:32:53.668725'),
	('b7bd2c5f-995f-4ec3-8059-d1c2bbf2c792', 'Stacy', 'Blue', '$2b$10$4yeEGs8odXiOWI8o7yzZz.CJ2KmFX2rPs4.kWsoy3.Ec1bnpAi//K', 'sb@mail.com', 'c1feb29f-66a6-4190-92d8-7e0cdea74616', '9ba08d7a-5689-49bb-b7e3-fe778321ca4f', '2025-09-22 13:57:35.266269', '2025-10-19 12:58:22.166179'),
	('d64f9738-bf5b-4514-843c-ab61ce57825a', 'John', 'Tate', '12345', 'tate@mail.com', 'f69acee4-46e3-4be5-a37f-559b193dfd8f', '93215cc2-8162-4e2a-9d19-0b965d6cd15f', '2025-09-22 13:24:02.152571', '2025-09-22 13:24:02.152571'),
	('ee544faf-f79d-4bc1-b5d0-9d14546be409', 'Sibu', 'Siso', '12345', 'string@mail.com', 'c1feb29f-66a6-4190-92d8-7e0cdea74616', '93215cc2-8162-4e2a-9d19-0b965d6cd15f', '2025-09-22 13:19:17.445287', '2025-09-22 13:19:17.445287');

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
