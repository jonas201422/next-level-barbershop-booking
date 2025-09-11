# Next Level Barbershop – Booking Prototype

Ein statisches One-Page-Prototype für eine Friseursalon-Terminbuchung mit dunklem, modernem UI.

## Inhalte
- **index.html** – Landing Page mit großem Button zur Buchung.
- **booking.html** – separate Seite mit dem Terminbuchungs‑Flow.
- **.gitignore** – ignoriert Editor-/Systemdateien.
- **LICENSE (MIT)** – erlaubt Nutzung, Änderung, Weitergabe.
- **/.github/workflows/pages.yml** – optional: Auto-Deploy zu GitHub Pages (Actions).

## Lokale Vorschau
Einfach `index.html` im Browser öffnen (Doppelklick).

## Repository anlegen (erstes Mal)
1. Neues Repo auf GitHub erstellen (z. B. `next-level-barbershop-booking`), **ohne** README/License initialisieren.
2. In einem Terminal/Powershell im Projektordner ausführen:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Next Level Barbershop booking prototype"
   git branch -M main
   git remote add origin https://github.com/DEIN-USERNAME/next-level-barbershop-booking.git
   git push -u origin main
   ```

## GitHub Pages (2 Wege)

### A) Ohne Actions (einfach)
- GitHub → **Settings** → **Pages**.
- **Source**: `Deploy from a branch`.
- **Branch**: `main` / **Folder**: `/ (root)`.
- Speichern. Die Seite ist nach kurzer Zeit unter `https://DEIN-USERNAME.github.io/next-level-barbershop-booking/` erreichbar.

### B) Mit Actions (automatisch via Workflow)
- Lasse die Datei `/.github/workflows/pages.yml` im Repo.
- GitHub → **Settings** → **Pages** → **Source**: `GitHub Actions`.
- Jede Änderung auf `main` triggert einen Deploy.

## Spätere Änderungen pushen
```bash
git add -A
git commit -m "Update styles / booking flow"
git push
```

## Nächste Schritte (Empfehlungen)
- Bilder aus Data-URLs in `assets/` auslagern (bessere Wartbarkeit).
- Formulareingaben validieren und Backend/DB für Termine anbinden (z. B. Supabase/Firebase oder kleiner Node/Express-Server).
- DSGVO-Check (Impressum, Datenschutz, Cookies nur falls nötig).
- Preise/Leistungen-Sektion und „Team“-Karten nachpflegen.
