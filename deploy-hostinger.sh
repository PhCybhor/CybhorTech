#!/usr/bin/env bash
# Publica a página institucional em domains/cybhor.tech/public_html na Hostinger.
# Uso: ./deploy-hostinger.sh
# Requer: chave SSH ~/.ssh/hostinger_cybhorpdv e o site cybhor.tech criado no hPanel.

set -euo pipefail

ROOT="$(cd "$(dirname "$0")" && pwd)"
KEY="${HOSTINGER_SSH_KEY_FILE:-$HOME/.ssh/hostinger_cybhorpdv}"
HOST="${HOSTINGER_HOST:-45.152.44.56}"
USER="${HOSTINGER_USER:-u812914256}"
PORT="${HOSTINGER_PORT:-65002}"
REMOTE="${USER}@${HOST}:domains/cybhor.tech/public_html/"

TMP="$(mktemp -d)"
cleanup() { rm -rf "$TMP"; }
trap cleanup EXIT

# Gera as páginas a partir do casco compartilhado (build.py)
python3 "$ROOT/build.py"

cp "$ROOT"/*.html "$ROOT/site.css" "$ROOT/site.js" "$ROOT/pesquisa.js" "$TMP/"
cp -R "$ROOT/img" "$TMP/"
# Não publicar o gerador nem o plano interno no site público
rm -f "$TMP/plano-interno.html" "$TMP/build.py" 2>/dev/null || true
cat > "$TMP/.htaccess" <<'EOF'
Options -Indexes
DirectoryIndex index.html
<IfModule mod_headers.c>
  Header set X-Content-Type-Options "nosniff"
  Header set X-Frame-Options "DENY"
  Header set Referrer-Policy "strict-origin-when-cross-origin"
</IfModule>
EOF

ssh -i "$KEY" -o IdentitiesOnly=yes -o BatchMode=yes -p "$PORT" "${USER}@${HOST}" \
  "mkdir -p ~/domains/cybhor.tech/public_html"

rsync -rltz --delete --exclude '.well-known' --chmod=D755,F644 \
  -e "ssh -i ${KEY} -o IdentitiesOnly=yes -p ${PORT}" \
  "$TMP/" "$REMOTE"

echo "Publicado em ${REMOTE}"
echo "Confira https://cybhor.tech (o site precisa estar ativo no hPanel)."
