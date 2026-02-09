#!/bin/bash
# Save as: /root/auto_restart.sh

while true; do
    echo "$(date): Starting bot..."
    
    # Check if bot is already running
    if pgrep -f "bot.py" > /dev/null; then
        echo "$(date): Bot is already running. PID: $(pgrep -f "bot.py")"
        sleep 60
        continue
    fi
    
    # Start bot
    cd /root/allpdfbot
    source venv/bin/activate
    python bot.py 2>&1 | tee -a /root/bot.log
    
    EXIT_CODE=$?
    echo "$(date): Bot stopped with exit code: $EXIT_CODE"
    
    # Wait before restart
    sleep 10
    
    # If exit code is 0 (normal shutdown), don't restart
    if [ $EXIT_CODE -eq 0 ]; then
        echo "$(date): Normal shutdown, not restarting"
        break
    fi
    
    echo "$(date): Restarting in 5 seconds..."
    sleep 5
done
