# 🚗 AutoCyberAudit

> **Toolkit professionnel d'audit de sécurité pour véhicules connectés**

AutoCyberAudit est un framework de **pentest automobile** permettant d'évaluer la sécurité des véhicules connectés via **OBD-II, CAN Bus, Bluetooth, BLE, Wi-Fi, firmware et API télématiques**. Il génère automatiquement des rapports PDF professionnels conformes aux bonnes pratiques de cybersécurité automobile.

![Python](https://img.shields.io/badge/Python-3.10+-blue)
![Version](https://img.shields.io/badge/Version-3.0-success)
![Licence](https://img.shields.io/badge/Licence-MIT-green)
![Cybersécurité](https://img.shields.io/badge/Automotive-Cybersecurity-red)

---

# 📖 Présentation

Les véhicules modernes sont de véritables systèmes informatiques embarqués connectés via différents protocoles de communication.

**AutoCyberAudit** automatise les principales vérifications de sécurité afin d'identifier les vulnérabilités susceptibles d'affecter :

* les calculateurs (ECU)
* le réseau CAN Bus
* les interfaces OBD-II
* les communications Bluetooth/BLE
* les réseaux Wi-Fi embarqués
* les firmwares
* les API Cloud et télématiques

L'objectif est de fournir un **rapport clair, exploitable et professionnel** destiné aux chercheurs en cybersécurité, auditeurs et constructeurs automobiles.

---

# ✨ Fonctionnalités

## 🚘 Audit CAN Bus

* Analyse du trafic CAN
* Détection des calculateurs sensibles
* Identification des IDs critiques
* Détection de flood / DoS
* Analyse statistique du bus
* Vérification des messages sensibles

---

## 🔧 Audit OBD-II / UDS

Compatible avec :

* OBD-II
* ISO 14229 (UDS)

Contrôles réalisés :

* Lecture du VIN
* Lecture des DTC
* Détection des sessions de diagnostic
* Vérification des services UDS sensibles
* Contrôle du Security Access
* Informations ECU

---

## 📡 Audit Bluetooth / BLE

Analyse notamment :

* Adaptateurs ELM327
* Bluetooth Classic
* Bluetooth Low Energy
* Services GATT
* Profils SPP
* TPMS
* Commandes non authentifiées

---

## 📶 Audit Wi-Fi

Le module vérifie notamment :

* Réseaux ouverts
* WEP
* WPA
* WPA2
* WPA3
* Hotspots embarqués
* Sécurité du chiffrement

---

## 💾 Analyse Firmware

Recherche automatiquement :

* Clés privées
* Clés AWS
* API Keys
* JWT
* Mots de passe codés en dur
* URLs HTTP
* Adresses IP internes
* Variables de debug
* Endpoints de production
* Références CAN / UDS

---

## ☁️ Audit API Télématiques

Analyse :

* TLS
* Authentification
* Headers HTTP
* IDOR
* GraphQL
* Endpoints sensibles
* Commandes distantes
* Exposition des API

---

## 📄 Génération de rapports

À la fin de l'audit, AutoCyberAudit génère automatiquement :

* 📑 Rapport PDF professionnel
* 📄 Rapport JSON
* 📊 Résumé exécutif
* 📈 Statistiques par criticité
* ✅ Recommandations de remédiation
* 🕒 Journal des analyses

---

# 🛡️ Standards de cybersécurité

Le projet suit les recommandations de :

* ISO/SAE 21434
* UN R155
* AUTOSAR
* TARA
* OWASP API Security
* CWE
* CVSS

---

# ⚙️ Installation

## Cloner le dépôt

```bash
git clone https://github.com/votre-utilisateur/AutoCyberAudit.git

cd AutoCyberAudit
```

## Installer les dépendances

```bash
pip install python-can scapy bleak requests reportlab obd colorama
```

ou

```bash
pip install -r requirements.txt
```

---

# 🚀 Utilisation

## Mode Simulation

```bash
python automotive_pentest.py --connection simulation
```

---

## Connexion OBD-II

```bash
python automotive_pentest.py \
--connection obd \
--port /dev/ttyUSB0
```

---

## Connexion Bluetooth

```bash
python automotive_pentest.py \
--connection bluetooth \
--bt-address AA:BB:CC:DD:EE:FF
```

---

## Audit complet

```bash
python automotive_pentest.py \
--connection obd \
--modules can obd ble wifi api
```

---

## Analyse Firmware

```bash
python automotive_pentest.py \
--modules firmware \
--firmware firmware.bin
```

---

## Audit API

```bash
python automotive_pentest.py \
--modules api \
--api-url https://api.exemple.fr \
--api-token VOTRE_TOKEN
```

---

# 📋 Options disponibles

| Option         | Description                                    |
| -------------- | ---------------------------------------------- |
| `--connection` | Mode de connexion (obd, bluetooth, simulation) |
| `--modules`    | Modules à lancer                               |
| `--port`       | Port série OBD-II                              |
| `--bt-address` | Adresse Bluetooth                              |
| `--firmware`   | Firmware à analyser                            |
| `--api-url`    | URL de l'API                                   |
| `--api-token`  | Jeton Bearer                                   |
| `--vin`        | VIN du véhicule                                |
| `--output-pdf` | Emplacement du rapport PDF                     |

---

# 📁 Structure du projet

```
AutoCyberAudit/

│
├── automotive_pentest.py
├── README.md
├── requirements.txt
├── LICENSE
│
├── automotive_pentest_reports/
│      ├── rapport.pdf
│      ├── rapport.json
│      └── pentest.log
│
└── examples/
```

---

# 📊 Exemple de sortie

```
═══════════════════════════════════════

      RAPPORT D'AUDIT

═══════════════════════════════════════

CRITICAL : 3

HIGH     : 7

MEDIUM   : 5

LOW      : 2

INFO     : 4

Rapport PDF généré

Rapport JSON généré
```

---

# 👨‍💻 Cas d'utilisation

Ce projet s'adresse notamment aux :

* Chercheurs en cybersécurité
* Pentesters automobiles
* Auditeurs ISO 21434
* Équipes Red Team
* Équipes Blue Team
* Constructeurs automobiles
* Équipementiers (Tier 1 / Tier 2)
* Centres de R&D
* Universités
* Formateurs en cybersécurité

---

# ⚠️ Avertissement légal

**AutoCyberAudit est exclusivement destiné à des usages légitimes.**

Son utilisation est autorisée uniquement dans les cas suivants :

* votre propre véhicule ;
* un véhicule pour lequel vous disposez d'une autorisation écrite du propriétaire ;
* un environnement de laboratoire ou de test ;
* un programme de Bug Bounty officiellement autorisé.

Toute utilisation non autorisée peut constituer une infraction à la législation en vigueur. L'utilisateur est seul responsable de l'usage qu'il fait de cet outil.

---

# 🗺️ Feuille de route

Prochaines évolutions prévues :

* Support DoIP
* Support J1939
* Support LIN Bus
* Automotive Ethernet
* SOME/IP
* Analyse Secure Boot
* Validation OTA
* Dashboard Web
* Génération HTML
* Tableau de bord interactif
* Docker
* GitHub Actions
* Export SARIF
* Intégration CI/CD

---

# 🤝 Contribution

Les contributions sont les bienvenues !

1. Fork du projet
2. Création d'une branche
3. Commit de vos modifications
4. Push
5. Ouverture d'une Pull Request

---

# 📜 Licence

Ce projet est distribué sous licence **GNU**.

---

# 👤 Auteur

## AutoCyberAudit

**Framework professionnel d'audit de cybersécurité automobile**

Développé pour les chercheurs, auditeurs et professionnels de la sécurité des véhicules connectés.

---

⭐ **Si ce projet vous est utile, pensez à lui attribuer une étoile sur GitHub !**
