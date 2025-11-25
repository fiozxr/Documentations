
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
