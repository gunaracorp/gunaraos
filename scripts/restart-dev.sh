#!/bin/bash
# Restart bersih dev server GUNARA OS + tunggu Ready
cd /home/z/my-project
pkill -9 -f "next dev" 2>/dev/null
pkill -9 -f "next-server" 2>/dev/null
sleep 1
rm -rf .next
setsid nohup bun run dev > /dev/null 2>&1 < /dev/null &
echo "dev server starting (pid $!)"
for i in $(seq 1 60); do
  sleep 5
  if rg -q "Ready in" dev.log 2>/dev/null; then echo "READY after ~$((i*5))s"; break; fi
done
rg "Ready in|Error" dev.log 2>/dev/null | tail -3
