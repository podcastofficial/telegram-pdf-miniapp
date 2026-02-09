#!/bin/bash
BACKUP_DIR="/root/bot_backups"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR

# Backup bot files
tar -czf $BACKUP_DIR/bot_backup_$DATE.tar.gz \
    /root/allpdfbot/bot.py \
    /root/allpdfbot/bot_database.db \
    /etc/systemd/system/allpdfbot.service

echo "Backup created: $BACKUP_DIR/bot_backup_$DATE.tar.gz"

# Keep only last 7 backups
cd $BACKUP_DIR
ls -t | tail -n +8 | xargs rm -f
