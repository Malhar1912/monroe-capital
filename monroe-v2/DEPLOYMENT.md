# Monroe v2 - Production Deployment Guide

## Pre-Deployment Checklist

- [ ] All environment variables configured
- [ ] Database backups configured
- [ ] SSL/TLS certificates ready
- [ ] Error logging configured
- [ ] Rate limiting implemented
- [ ] CORS properly restricted
- [ ] Authentication added
- [ ] Database migrations tested

---

## Deployment Options

### 1. Heroku (Easiest for Getting Started)

#### Backend Deployment

**Setup Heroku CLI:**
```bash
curl https://cli-assets.heroku.com/install.sh | sh
heroku login
```

**Create App:**
```bash
cd backend
heroku create monroe-api-prod
```

**Add PostgreSQL:**
```bash
heroku addons:create heroku-postgresql:hobby-dev
```

**Deploy:**
```bash
git push heroku main
```

**Set Environment Variables:**
```bash
heroku config:set SYMBOL=AAPL
heroku config:set LOG_LEVEL=INFO
```

**View Logs:**
```bash
heroku logs --tail
```

#### Frontend Deployment (Vercel)

**Deploy to Vercel:**
```bash
cd frontend
npm install -g vercel
vercel deploy
```

Set environment variable:
```
REACT_APP_API_URL=https://monroe-api-prod.herokuapp.com
```

---

### 2. AWS Deployment

#### Backend on EC2

**Launch Instance:**
1. AWS Console → EC2 → Launch Instance
2. Choose Ubuntu 22.04 LTS
3. Instance Type: t2.small or larger
4. Configure Security Groups (open ports 8000)

**Setup Backend:**
```bash
# SSH into instance
ssh -i your-key.pem ubuntu@your-instance-ip

# Update system
sudo apt update && sudo apt upgrade -y

# Install Python, pip, git
sudo apt install python3-pip python3-venv git -y

# Clone repository
git clone <repo-url>
cd monroe-v2/backend

# Setup Python environment
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Create .env file
nano .env
# Add your configuration

# Install and start supervisor
sudo pip install supervisor
sudo nano /etc/supervisor/conf.d/monroe.conf
```

**Supervisor Config (/etc/supervisor/conf.d/monroe.conf):**
```ini
[program:monroe]
directory=/home/ubuntu/monroe-v2/backend
command=/home/ubuntu/monroe-v2/backend/venv/bin/uvicorn app.main:app --host 0.0.0.0 --port 8000
autostart=true
autorestart=true
stderr_logfile=/var/log/monroe.err.log
stdout_logfile=/var/log/monroe.out.log
environment=DATABASE_URL="postgresql://...",SYMBOL="AAPL"
```

**Start Service:**
```bash
sudo supervisorctl reread
sudo supervisorctl update
sudo supervisorctl start monroe
```

#### RDS PostgreSQL

1. AWS Console → RDS → Create Database
2. Choose PostgreSQL 14
3. Multi-AZ deployment (recommended)
4. Configure subnet group and security groups
5. Save connection details

**Connect from Backend:**
```bash
# Test connection
psql -h your-rds-endpoint.rds.amazonaws.com -U postgres -d monroe

# Update .env
DATABASE_URL=postgresql://user:password@your-rds-endpoint:5432/monroe
```

#### Frontend on S3 + CloudFront

```bash
# Build frontend
cd frontend
npm run build

# Upload to S3
aws s3 sync dist/ s3://your-bucket-name/

# Create CloudFront distribution pointing to S3
```

---

### 3. DigitalOcean App Platform (Recommended for Beginners)

#### Create App

1. DigitalOcean Dashboard → Apps → Create App
2. Connect your GitHub repository
3. Configure build and run commands

**Backend:**
```
Build: pip install -r requirements.txt
Run: uvicorn app.main:app --host 0.0.0.0
```

**Frontend:**
```
Build: npm install && npm run build
Run: serve -s dist -l 3000
```

#### Configure Database

1. Create managed PostgreSQL database
2. Link to app
3. Set environment variables

---

### 4. Docker + Cloud Run (Google Cloud)

#### Build and Push to Container Registry

```bash
# Build images
docker build -t monroe-api:latest ./backend
docker build -t monroe-web:latest ./frontend

# Tag for Google Container Registry
docker tag monroe-api:latest gcr.io/your-project/monroe-api:latest
docker tag monroe-web:latest gcr.io/your-project/monroe-web:latest

# Push to registry
docker push gcr.io/your-project/monroe-api:latest
docker push gcr.io/your-project/monroe-web:latest

# Deploy to Cloud Run
gcloud run deploy monroe-api \
  --image gcr.io/your-project/monroe-api:latest \
  --platform managed \
  --region us-central1 \
  --set-env-vars DATABASE_URL=... \
  --allow-unauthenticated
```

---

## SSL/TLS Configuration

### Using Let's Encrypt with Nginx

**Install Nginx:**
```bash
sudo apt install nginx -y
```

**Nginx Config (/etc/nginx/sites-available/default):**
```nginx
server {
    listen 80;
    server_name monroe.example.com;
    
    location / {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # WebSocket support
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

**Install Certbot:**
```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d monroe.example.com
```

---

## Environment Variables for Production

```env
# Database
DATABASE_URL=postgresql://user:password@prod-db:5432/monroe

# App
SYMBOL=SPY
LOG_LEVEL=INFO

# Security
SECRET_KEY=your-secret-key-here
ALLOWED_HOSTS=monroe.example.com

# Optional
SENTRY_DSN=your-sentry-dsn
```

---

## Monitoring & Logging

### Sentry (Error Tracking)

**Backend Setup:**
```bash
pip install sentry-sdk
```

**In app/main.py:**
```python
import sentry_sdk

sentry_sdk.init(
    dsn=os.getenv("SENTRY_DSN"),
    traces_sample_rate=1.0
)
```

### CloudWatch (AWS Logging)

```python
import watchtower
import logging

logging.basicConfig(
    level=logging.INFO,
    handlers=[
        watchtower.CloudWatchLogHandler()
    ]
)
```

### UptimeRobot (Status Monitoring)

1. Create new monitor
2. Set to check `https://api.monroe.example.com/api/health`
3. Interval: 5 minutes
4. Get alerts if down

---

## Database Backups

### Automated PostgreSQL Backups

**Backup Script (backup.sh):**
```bash
#!/bin/bash
BACKUP_DIR="/backups/monroe"
DB_NAME="monroe"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR
pg_dump $DB_NAME | gzip > $BACKUP_DIR/monroe_$TIMESTAMP.sql.gz

# Upload to S3
aws s3 cp $BACKUP_DIR/monroe_$TIMESTAMP.sql.gz s3://your-bucket/backups/
```

**Cron Job (daily at 2 AM):**
```bash
0 2 * * * /home/ubuntu/backup.sh
```

---

## Performance Optimization

### Database Query Optimization
```python
# Add indexes to models
class Trade(Base):
    __tablename__ = "trades"
    
    id = Column(Integer, primary_key=True, index=True)
    symbol = Column(String, index=True)  # Add index
    created_at = Column(DateTime, index=True)  # Add index
```

### Caching Strategy
```python
# Redis caching for prices
import redis
r = redis.Redis(host='localhost', port=6379, db=0)

price_cache = r.get(f"price:{symbol}")
if not price_cache:
    price = latest_price(symbol)
    r.setex(f"price:{symbol}", 60, price)  # Cache for 60 seconds
```

### Connection Pooling
```python
# In db.py
engine = create_engine(
    DATABASE_URL,
    pool_size=20,
    max_overflow=40,
    pool_recycle=3600,
    pool_pre_ping=True
)
```

---

## Rollback Strategy

### Keep Previous Versions

```bash
# Tag releases
git tag -a v2.0.0 -m "Production release 2.0.0"
git push origin v2.0.0

# Checkout previous version
git checkout v1.9.0
docker build -t monroe-api:v1.9.0 .
docker run monroe-api:v1.9.0
```

---

## Cost Optimization

| Service | Provider | Cost | Notes |
|---------|----------|------|-------|
| API Hosting | Heroku | $7/mo | Easiest setup |
| API Hosting | DigitalOcean | $5/mo | Droplet |
| Database | AWS RDS | $15/mo | Multi-AZ |
| Database | Supabase | $0-25/mo | PostgreSQL |
| Frontend | Vercel | Free | Next.js optimized |
| Domain | Namecheap | $1-3/yr | Domain only |

---

## Incident Response

### If Backend is Down

1. Check logs: `heroku logs --tail`
2. Check database: `pg_isready`
3. Restart: `heroku restart`
4. Check errors: View Sentry dashboard

### If Database is Down

1. Check connection: `psql -h host -d db`
2. Restore from backup: `psql < backup.sql`
3. Update .env DATABASE_URL
4. Restart backend

---

## Post-Deployment

- ✅ Test all endpoints
- ✅ Monitor error logs
- ✅ Check WebSocket connections
- ✅ Verify database backups
- ✅ Setup monitoring alerts
- ✅ Document any issues
- ✅ Plan maintenance window

---

## Security Best Practices

1. **Never commit secrets** - Use environment variables
2. **Keep dependencies updated** - Run `pip list --outdated`
3. **Enable HTTPS everywhere** - SSL/TLS required
4. **Implement rate limiting** - Prevent abuse
5. **Add authentication** - API key or OAuth
6. **Monitor logs** - Catch suspicious activity
7. **Regular backups** - Daily minimum
8. **Update OS** - Security patches

---

**Deployment Success! 🚀**

For questions or issues, check logs and review this guide.
