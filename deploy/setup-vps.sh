#!/usr/bin/env bash
# STAKEAI VPS setup for Ubuntu 22.04/24.04. Run as root:
#   bash setup-vps.sh www.stakeai.io
# Then copy the production env file to /opt/stakeai/.env and run: systemctl restart stakeai
set -euo pipefail

DOMAIN="${1:-www.stakeai.io}"
APP_DIR=/opt/stakeai
REPO=https://github.com/Stakeaitoken/STAKEAI.git

export DEBIAN_FRONTEND=noninteractive
apt-get update -y
apt-get install -y curl git ca-certificates ufw debian-keyring debian-archive-keyring apt-transport-https gpg

# Node.js 24
curl -fsSL https://deb.nodesource.com/setup_24.x | bash -
apt-get install -y nodejs

# Caddy (automatic HTTPS)
if ! command -v caddy >/dev/null; then
    curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
    curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' > /etc/apt/sources.list.d/caddy-stable.list
    apt-get update -y
    apt-get install -y caddy
fi

# App user and code
id stakeai >/dev/null 2>&1 || useradd --system --home "$APP_DIR" --shell /usr/sbin/nologin stakeai
if [ -d "$APP_DIR/.git" ]; then
    git -C "$APP_DIR" pull --ff-only
else
    git clone "$REPO" "$APP_DIR"
fi
cd "$APP_DIR"
npm ci --omit=dev
mkdir -p "$APP_DIR/data"
chown -R stakeai:stakeai "$APP_DIR"

# systemd service
cat > /etc/systemd/system/stakeai.service <<EOF
[Unit]
Description=STAKEAI platform
After=network.target

[Service]
User=stakeai
WorkingDirectory=$APP_DIR
EnvironmentFile=$APP_DIR/.env
ExecStart=/usr/bin/node server.mjs
Restart=always
RestartSec=3
NoNewPrivileges=true

[Install]
WantedBy=multi-user.target
EOF

# Caddy reverse proxy
cat > /etc/caddy/Caddyfile <<EOF
$DOMAIN {
    encode gzip
    reverse_proxy 127.0.0.1:3000
}
stakeai.io {
    redir https://$DOMAIN{uri} permanent
}
EOF

# Firewall
ufw allow OpenSSH
ufw allow 80/tcp
ufw allow 443/tcp
ufw --force enable

systemctl daemon-reload
systemctl enable stakeai caddy
systemctl restart caddy

if [ -f "$APP_DIR/.env" ]; then
    chown stakeai:stakeai "$APP_DIR/.env"
    chmod 600 "$APP_DIR/.env"
    systemctl restart stakeai
    echo "STAKEAI started. Check: systemctl status stakeai"
else
    echo "Setup done. Now copy your env file to $APP_DIR/.env and run: systemctl restart stakeai"
fi
