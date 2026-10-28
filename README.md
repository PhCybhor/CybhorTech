# Cybhor Tech — site institucional

Site estático de https://cybhor.tech  
Separado do repositório do CybhorPDV.

## Desenvolvimento

```bash
python3 build.py          # gera as páginas HTML
python3 -m http.server 8791
```

## Publicar na Hostinger

```bash
./deploy-hostinger.sh
```

Requer chave SSH `~/.ssh/hostinger_cybhorpdv`.
