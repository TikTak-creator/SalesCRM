-- ==============================================================================
-- Sales CRM Enterprise Database Schema
-- Target: MySQL 8.0+ / 8.4 LTS
-- Database: sales_crm_db
-- ==============================================================================

CREATE DATABASE IF NOT EXISTS `sales_crm_db`
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE `sales_crm_db`;

-- 1. Table: Users (Employees, Managers & Admins)
CREATE TABLE IF NOT EXISTS `Users` (
    `Id` INT NOT NULL AUTO_INCREMENT,
    `FullName` VARCHAR(100) NOT NULL,
    `Email` VARCHAR(120) NOT NULL,
    `PasswordHash` VARCHAR(255) NOT NULL,
    `Role` INT NOT NULL DEFAULT 3 COMMENT '1: Admin, 2: Manager, 3: SalesRep',
    `AvatarUrl` VARCHAR(255) DEFAULT NULL,
    `MonthlyQuota` DECIMAL(18, 2) NOT NULL DEFAULT 50000.00,
    `PhoneNumber` VARCHAR(30) DEFAULT NULL,
    `Department` VARCHAR(100) NOT NULL DEFAULT 'Direct Sales',
    `IsActive` TINYINT(1) NOT NULL DEFAULT 1,
    `CreatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`Id`),
    UNIQUE KEY `UX_Users_Email` (`Email`),
    KEY `IX_Users_Role` (`Role`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Table: Clients (Accounts / Corporate Customers)
CREATE TABLE IF NOT EXISTS `Clients` (
    `Id` INT NOT NULL AUTO_INCREMENT,
    `CompanyName` VARCHAR(120) NOT NULL,
    `ContactPerson` VARCHAR(100) NOT NULL,
    `Email` VARCHAR(120) DEFAULT NULL,
    `Phone` VARCHAR(30) DEFAULT NULL,
    `Industry` VARCHAR(80) NOT NULL DEFAULT 'Technology',
    `Region` VARCHAR(80) NOT NULL DEFAULT 'North America',
    `Status` INT NOT NULL DEFAULT 1 COMMENT '1: Lead, 2: Active, 3: Prospect, 4: Churned',
    `AssignedUserId` INT DEFAULT NULL,
    `Notes` VARCHAR(1000) DEFAULT NULL,
    `CreatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`Id`),
    KEY `IX_Clients_AssignedUserId` (`AssignedUserId`),
    KEY `IX_Clients_Industry` (`Industry`),
    KEY `IX_Clients_Status` (`Status`),
    CONSTRAINT `FK_Clients_Users` FOREIGN KEY (`AssignedUserId`) REFERENCES `Users` (`Id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Table: Deals (Opportunities / Sales Pipeline)
CREATE TABLE IF NOT EXISTS `Deals` (
    `Id` INT NOT NULL AUTO_INCREMENT,
    `Title` VARCHAR(150) NOT NULL,
    `ClientId` INT NOT NULL,
    `AssignedUserId` INT NOT NULL,
    `Amount` DECIMAL(18, 2) NOT NULL DEFAULT 0.00,
    `Stage` INT NOT NULL DEFAULT 1 COMMENT '1: Lead, 2: Contacted, 3: ProposalSent, 4: Negotiation, 5: Won, 6: Lost',
    `Probability` INT NOT NULL DEFAULT 20,
    `Priority` INT NOT NULL DEFAULT 2 COMMENT '1: Low, 2: Medium, 3: High, 4: Urgent',
    `ExpectedCloseDate` DATETIME DEFAULT NULL,
    `ClosedAt` DATETIME DEFAULT NULL,
    `Description` VARCHAR(1000) DEFAULT NULL,
    `CreatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `UpdatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (`Id`),
    KEY `IX_Deals_ClientId` (`ClientId`),
    KEY `IX_Deals_AssignedUserId` (`AssignedUserId`),
    KEY `IX_Deals_Stage` (`Stage`),
    CONSTRAINT `FK_Deals_Clients` FOREIGN KEY (`ClientId`) REFERENCES `Clients` (`Id`) ON DELETE CASCADE,
    CONSTRAINT `FK_Deals_Users` FOREIGN KEY (`AssignedUserId`) REFERENCES `Users` (`Id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Table: DealActivities (Interaction Timeline)
CREATE TABLE IF NOT EXISTS `DealActivities` (
    `Id` INT NOT NULL AUTO_INCREMENT,
    `DealId` INT NOT NULL,
    `UserId` INT NOT NULL,
    `Type` INT NOT NULL DEFAULT 4 COMMENT '1: Call, 2: Meeting, 3: Email, 4: Note, 5: StageChange',
    `Description` VARCHAR(1000) NOT NULL,
    `Timestamp` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`Id`),
    KEY `IX_DealActivities_DealId` (`DealId`),
    KEY `IX_DealActivities_UserId` (`UserId`),
    CONSTRAINT `FK_DealActivities_Deals` FOREIGN KEY (`DealId`) REFERENCES `Deals` (`Id`) ON DELETE CASCADE,
    CONSTRAINT `FK_DealActivities_Users` FOREIGN KEY (`UserId`) REFERENCES `Users` (`Id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Table: SaleRecords (Closed Won Ledger & Invoicing)
CREATE TABLE IF NOT EXISTS `SaleRecords` (
    `Id` INT NOT NULL AUTO_INCREMENT,
    `DealId` INT DEFAULT NULL,
    `ClientId` INT NOT NULL,
    `SalesRepId` INT NOT NULL,
    `Amount` DECIMAL(18, 2) NOT NULL,
    `ClosedDate` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `PaymentMethod` VARCHAR(50) NOT NULL DEFAULT 'Wire Transfer',
    `InvoiceNumber` VARCHAR(50) NOT NULL,
    `Notes` VARCHAR(500) DEFAULT NULL,
    PRIMARY KEY (`Id`),
    KEY `IX_SaleRecords_DealId` (`DealId`),
    KEY `IX_SaleRecords_ClientId` (`ClientId`),
    KEY `IX_SaleRecords_SalesRepId` (`SalesRepId`),
    KEY `IX_SaleRecords_ClosedDate` (`ClosedDate`),
    CONSTRAINT `FK_SaleRecords_Deals` FOREIGN KEY (`DealId`) REFERENCES `Deals` (`Id`) ON DELETE SET NULL,
    CONSTRAINT `FK_SaleRecords_Clients` FOREIGN KEY (`ClientId`) REFERENCES `Clients` (`Id`) ON DELETE RESTRICT,
    CONSTRAINT `FK_SaleRecords_Users` FOREIGN KEY (`SalesRepId`) REFERENCES `Users` (`Id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
