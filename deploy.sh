#!/bin/bash
set -e

# ==============================================================================
# Deploy: FreeSpeech Web (SvelteKit client for freespeechaac.com)
# ==============================================================================
#
# Service:        freespeech-web
# Runtime:        Node (adapter-node) — runs the Vite/SvelteKit build output
# Branch:         master
# Port:           5105
# Working Dir:    /opt/freespeech
# Systemd Unit:   /etc/systemd/system/freespeech-web.service
# Nginx Config:   /etc/nginx/sites-available/freespeechaac.com
# URL:            https://www.freespeechaac.com
# Env File:       /opt/freespeech/.env
#
# Dependencies:   freespeech-api (https://api.freespeechaac.com)
#
# NOTE: "npm run build" here is the Vite/SvelteKit build (adapter-node) — it is
#       SAFE to run. The service runs the compiled output via `node build`, so a
#       build + restart is REQUIRED for changes to go live (editing src/ alone
#       does nothing until rebuilt).
# ==============================================================================

CYAN='\033[0;36m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BOLD='\033[1m'
NC='\033[0m'

SERVICE="freespeech-web"
BRANCH="master"
PORT=5105
REPO_DIR="/opt/freespeech"

echo ""
echo -e "${BOLD}========================================${NC}"
echo -e "${BOLD}  Deploying: ${CYAN}freespeech-web${NC}"
echo -e "${BOLD}  Branch:    ${CYAN}${BRANCH}${NC}"
echo -e "${BOLD}  Port:      ${CYAN}${PORT}${NC}"
echo -e "${BOLD}  URL:       ${CYAN}https://www.freespeechaac.com${NC}"
echo -e "${BOLD}========================================${NC}"
echo ""

cd "$REPO_DIR"

# Step 1: Pull
echo -e "${YELLOW}[1/4] Pulling latest changes from origin/${BRANCH}...${NC}"
git pull origin "$BRANCH"
echo ""

# Step 2: Install deps
echo -e "${YELLOW}[2/4] Installing dependencies...${NC}"
npm install
echo ""

# Step 3: Build (Vite / SvelteKit adapter-node — safe)
echo -e "${YELLOW}[3/4] Building (Vite / SvelteKit)...${NC}"
npm run build
echo ""

# Step 4: Restart service + reload nginx
echo -e "${YELLOW}[4/4] Restarting ${SERVICE} and reloading nginx...${NC}"
systemctl restart "$SERVICE"
systemctl reload nginx
echo ""

# Verify
echo -e "${YELLOW}Verifying service health...${NC}"
sleep 3

if systemctl is-active --quiet "$SERVICE"; then
    echo -e "  ${GREEN}Service is active${NC}"
else
    echo -e "  ${RED}Service is NOT running!${NC}"
    echo ""
    echo -e "${RED}Recent logs:${NC}"
    journalctl -u "$SERVICE" -n 30 --no-pager
    exit 1
fi

CODE=$(curl -s -o /dev/null -w "%{http_code}" "http://127.0.0.1:${PORT}/" || true)
if [ "$CODE" = "200" ]; then
    echo -e "  ${GREEN}HTTP check OK (127.0.0.1:${PORT} -> ${CODE})${NC}"
else
    echo -e "  ${RED}HTTP check FAILED (127.0.0.1:${PORT} -> ${CODE})${NC}"
    echo ""
    echo -e "${RED}Recent logs:${NC}"
    journalctl -u "$SERVICE" -n 30 --no-pager
    exit 1
fi

echo ""
echo -e "${CYAN}Recent logs:${NC}"
journalctl -u "$SERVICE" -n 10 --no-pager
echo ""

echo -e "${GREEN}${BOLD}Deploy complete: freespeech-web${NC}"
echo -e "${CYAN}  URL:  https://www.freespeechaac.com${NC}"
echo -e "${CYAN}  Logs: journalctl -u ${SERVICE} -f${NC}"
echo ""
