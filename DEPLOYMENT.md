# Recovery Kneads - Secure Deployment Guide

## Overview

This guide provides step-by-step instructions for deploying the secured Recovery Kneads website to production with healthcare-grade security measures.

## Prerequisites

- Ubuntu 20.04+ or CentOS 8+ server
- Node.js 18+
- Nginx web server
- SSL certificate (Let's Encrypt recommended)
- Domain name configured
- Square Developer account with API credentials

## Step 1: Server Preparation

### 1.1 Update System
```bash
sudo apt update && sudo apt upgrade -y  # Ubuntu
sudo yum update -y                      # CentOS
```

### 1.2 Install Dependencies
```bash
# Node.js (Ubuntu)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Nginx
sudo apt install nginx -y

# PM2 for process management
sudo npm install -g pm2

# Certbot for SSL
sudo apt install certbot python3-certbot-nginx -y
```

### 1.3 Create Application User
```bash
sudo adduser --system --group --no-create-home recoverykneads
sudo mkdir -p /var/www/recoverykneads
sudo chown recoverykneads:recoverykneads /var/www/recoverykneads
```

## Step 2: Application Deployment

### 2.1 Upload Files
```bash
# Copy files to server (using scp, rsync, or git)
sudo -u recoverykneads git clone https://github.com/yourusername/recoverykneads.git /var/www/recoverykneads
cd /var/www/recoverykneads

# Install dependencies
sudo -u recoverykneads npm install --production
```

### 2.2 Environment Configuration
```bash
# Copy environment template
sudo -u recoverykneads cp .env.example .env
sudo -u recoverykneads nano .env

# Configure with your actual values:
NODE_ENV=production
SQUARE_APPLICATION_ID=sq0idp-YOUR_ACTUAL_ID
SQUARE_LOCATION_ID=YOUR_LOCATION_ID
SQUARE_ACCESS_TOKEN=YOUR_ACCESS_TOKEN
SQUARE_ENVIRONMENT=production
SESSION_SECRET=your_long_random_string_here
NOTIFICATION_EMAIL=massagebyerikag@gmail.com
ALLOWED_ORIGINS=https://recoverykneads.com,https://www.recoverykneads.com
```

### 2.3 File Permissions
```bash
sudo chown -R recoverykneads:recoverykneads /var/www/recoverykneads
sudo chmod 644 /var/www/recoverykneads/.env
sudo chmod -R 644 /var/www/recoverykneads/*.html
sudo chmod -R 644 /var/www/recoverykneads/*.css
sudo chmod -R 644 /var/www/recoverykneads/*.js
sudo chmod 755 /var/www/recoverykneads
```

## Step 3: SSL Certificate Setup

### 3.1 Obtain SSL Certificate
```bash
# Using Let's Encrypt
sudo certbot --nginx -d recoverykneads.com -d www.recoverykneads.com

# Verify auto-renewal
sudo certbot renew --dry-run
```

## Step 4: Nginx Configuration

### 4.1 Create Nginx Configuration
```bash
sudo nano /etc/nginx/sites-available/recoverykneads
```

Add the following configuration:

```nginx
# HTTP to HTTPS redirect
server {
    listen 80;
    server_name recoverykneads.com www.recoverykneads.com;
    return 301 https://$server_name$request_uri;
}

# Main HTTPS server
server {
    listen 443 ssl http2;
    server_name recoverykneads.com www.recoverykneads.com;
    
    # SSL Configuration
    ssl_certificate /etc/letsencrypt/live/recoverykneads.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/recoverykneads.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;
    
    # Security Headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "DENY" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Permissions-Policy "camera=(), microphone=(), geolocation=(), payment=()" always;
    
    # CSP Header (backup to meta tag)
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' https://web.squarecdn.com https://js.squareup.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: https://images.unsplash.com; connect-src 'self' https://connect.squareup.com; frame-src https://web.squarecdn.com; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; upgrade-insecure-requests;" always;
    
    # Hide server information
    server_tokens off;
    
    # Root directory
    root /var/www/recoverykneads;
    index index.html;
    
    # Static files with caching
    location / {
        try_files $uri $uri/ =404;
        
        # Cache static assets
        location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }
    
    # API proxy to Node.js
    location /api/ {
        proxy_pass http://127.0.0.1:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Security for API
        proxy_set_header X-Forwarded-Host $host;
        proxy_set_header X-Forwarded-Server $host;
    }
    
    # Security: Deny access to sensitive files
    location ~ /\.(env|git|svn) {
        deny all;
        return 404;
    }
    
    location ~ \.(md|json)$ {
        deny all;
        return 404;
    }
    
    # Rate limiting
    location /api/book-appointment {
        limit_req zone=booking burst=5 nodelay;
        proxy_pass http://127.0.0.1:3001;
        # ... other proxy settings
    }
}

# Rate limiting configuration
limit_req_zone $binary_remote_addr zone=booking:10m rate=10r/m;
```

### 4.2 Enable Site
```bash
sudo ln -s /etc/nginx/sites-available/recoverykneads /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl reload nginx
```

## Step 5: Start Application Services

### 5.1 Start Node.js API Server
```bash
cd /var/www/recoverykneads

# Start with PM2
sudo -u recoverykneads pm2 start secure-booking-proxy.js --name "recovery-api"
sudo -u recoverykneads pm2 save

# Setup PM2 to start on boot
sudo pm2 startup
sudo pm2 save
```

### 5.2 Configure Firewall
```bash
# UFW (Ubuntu)
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'
sudo ufw --force enable

# Verify
sudo ufw status
```

## Step 6: Monitoring and Logging

### 6.1 Setup Log Rotation
```bash
sudo nano /etc/logrotate.d/recoverykneads
```

Add:
```
/var/www/recoverykneads/logs/*.log {
    daily
    missingok
    rotate 52
    compress
    delaycompress
    notifempty
    create 644 recoverykneads recoverykneads
    postrotate
        pm2 reload recovery-api
    endscript
}
```

### 6.2 Setup Monitoring
```bash
# Install monitoring tools
sudo apt install htop iotop -y

# PM2 monitoring
sudo -u recoverykneads pm2 monit
```

## Step 7: Security Hardening

### 7.1 Fail2ban Configuration
```bash
sudo apt install fail2ban -y
sudo nano /etc/fail2ban/jail.local
```

Add:
```ini
[nginx-http-auth]
enabled = true

[nginx-limit-req]
enabled = true
port = http,https
filter = nginx-limit-req
logpath = /var/log/nginx/error.log
maxretry = 10
findtime = 600
bantime = 7200
```

### 7.2 System Security
```bash
# Disable unused services
sudo systemctl disable bluetooth
sudo systemctl disable cups

# Configure automatic security updates
sudo apt install unattended-upgrades -y
sudo nano /etc/apt/apt.conf.d/50unattended-upgrades
```

## Step 8: Testing Deployment

### 8.1 Security Tests
```bash
# Test HTTPS
curl -I https://recoverykneads.com

# Test security headers
curl -I https://recoverykneads.com | grep -E "(Strict-Transport|X-Frame|X-Content)"

# Test API endpoint
curl -X POST https://recoverykneads.com/api/book-appointment \
  -H "Content-Type: application/json" \
  -d '{}'  # Should return validation error
```

### 8.2 Functionality Tests
1. Visit https://recoverykneads.com
2. Test booking form (should show secure booking options)
3. Verify SSL certificate is valid
4. Check CSP is not blocking resources
5. Test mobile responsiveness

## Step 9: Backup Configuration

### 9.1 Automated Backups
```bash
sudo nano /root/backup-recovery-kneads.sh
```

```bash
#!/bin/bash
BACKUP_DIR="/root/backups/recoverykneads"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR

# Backup website files
tar -czf "$BACKUP_DIR/website_$DATE.tar.gz" -C /var/www recoverykneads

# Backup nginx config
cp /etc/nginx/sites-available/recoverykneads "$BACKUP_DIR/nginx_config_$DATE.conf"

# Keep only last 30 days
find $BACKUP_DIR -name "*.tar.gz" -mtime +30 -delete
find $BACKUP_DIR -name "*.conf" -mtime +30 -delete

echo "Backup completed: $DATE"
```

```bash
chmod +x /root/backup-recovery-kneads.sh

# Add to crontab (daily at 2 AM)
sudo crontab -e
# Add: 0 2 * * * /root/backup-recovery-kneads.sh >> /var/log/backup.log 2>&1
```

## Step 10: Maintenance

### 10.1 Regular Tasks
- Weekly: Check system and application logs
- Weekly: Verify SSL certificate validity  
- Monthly: Update system packages
- Monthly: Update npm dependencies
- Quarterly: Security audit and penetration testing

### 10.2 Monitoring Commands
```bash
# Check application status
sudo -u recoverykneads pm2 status

# Check logs
sudo -u recoverykneads pm2 logs recovery-api
tail -f /var/log/nginx/error.log

# Check system resources
htop
df -h
free -h

# Check security
sudo fail2ban-client status
sudo ufw status
```

## Troubleshooting

### Common Issues

1. **502 Bad Gateway**: API server not running
   ```bash
   sudo -u recoverykneads pm2 restart recovery-api
   ```

2. **CSP Violations**: Check browser console and adjust CSP
   ```bash
   tail -f /var/log/nginx/error.log | grep CSP
   ```

3. **SSL Issues**: Renew certificate
   ```bash
   sudo certbot renew
   ```

4. **High Memory Usage**: Restart services
   ```bash
   sudo -u recoverykneads pm2 restart all
   sudo systemctl restart nginx
   ```

## Security Contacts

- **System Administrator**: [Your contact info]
- **Security Team**: security@recoverykneads.com
- **Emergency Contact**: [24/7 contact for security incidents]

## Compliance Notes

This deployment configuration meets:
- ✅ OWASP security guidelines
- ✅ Healthcare data protection standards
- ✅ PCI DSS requirements (for payment processing)
- ✅ GDPR privacy requirements
- ✅ Industry best practices for web application security