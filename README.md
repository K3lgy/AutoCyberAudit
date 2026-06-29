# 🚗🔒 AutoCyberAudit

**Toolkit de pentest automobile** — audit de sécurité pour véhicules connectés (CAN Bus, OBD-II/UDS, Bluetooth/BLE, WiFi embarqué, firmware/OTA, API Telematics) avec génération de rapport PDF professionnel et dashboard web interactif.

![version](https://img.shields.io/badge/version-3.0.0-00C2CB)
![license](https://img.shields.io/badge/license-MIT-blue)
![python](https://img.shields.io/badge/python-3.9%2B-yellow)

---

## ⚠️ AVERTISSEMENT — À LIRE AVANT TOUTE UTILISATION

> **Cet outil doit être utilisé avec parcimonie, et uniquement avec l'accord explicite du propriétaire du véhicule.**

AutoCyberAudit interagit avec des systèmes embarqués critiques (freinage, direction, moteur, bus CAN) et avec des interfaces sans fil (Bluetooth, WiFi, API cloud) qui peuvent avoir un impact réel sur la sécurité et le fonctionnement du véhicule. Une mauvaise utilisation peut :

- perturber ou interrompre des fonctions véhicule (y compris des fonctions de sécurité) ;
- générer un trafic CAN anormal pouvant déclencher des comportements imprévus des calculateurs (ECU) ;
- exposer des données personnelles ou de localisation du propriétaire ;
- constituer une infraction pénale en l'absence d'autorisation.

**Conditions d'utilisation strictes :**

1. ✅ Vous testez **votre propre véhicule**, ou
2. ✅ Vous disposez d'une **autorisation écrite explicite du propriétaire** du véhicule, ou
3. ✅ Vous travaillez dans un **environnement de lab / banc de test homologué** (ex : bus `vcan0` virtuel), ou
4. ✅ Vous opérez dans le cadre d'un **programme de Bug Bounty autorisé par le constructeur**.

En l'absence de l'une de ces conditions, **n'utilisez pas cet outil**. En France, l'accès ou le maintien frauduleux dans un système de traitement automatisé de données est sanctionné par l'article 323-1 du Code pénal ; des dispositions équivalentes existent dans la plupart des juridictions. L'outil intègre volontairement une **passerelle de consentement obligatoire** (voir plus bas) — elle ne dispense en rien de l'obligation légale et éthique d'obtenir un accord préalable.

**Utilisez cet outil avec parcimonie :** privilégiez les scans courts et ciblés plutôt que des audits prolongés, évitez de répéter les tests de flood/DoS sur un véhicule réel, et ne testez jamais des fonctions de sécurité critique (freinage, direction, airbags) sur un véhicule en circulation ou occupé.

Les auteurs et contributeurs de ce projet ne sauraient être tenus responsables d'une utilisation non conforme à ces conditions.

---

## 📋 Sommaire

- [Présentation](#-présentation)
- [Fonctionnalités](#-fonctionnalités)
- [Architecture du projet](#-architecture-du-projet)
- [Installation](#-installation)
- [Utilisation — CLI Python](#-utilisation--cli-python)
- [Utilisation — Dashboard React](#-utilisation--dashboard-react)
- [Modules d'audit](#-modules-daudit)
- [Exemple de rapport](#-exemple-de-rapport)
- [Conformité et références normatives](#-conformité-et-références-normatives)
- [Limitations connues](#-limitations-connues)
- [Contribuer](#-contribuer)
- [Licence](#-licence)

---

## 🎯 Présentation

AutoCyberAudit (Kyvra Security Platform) est un toolkit de test d'intrusion pensé pour l'écosystème automobile connecté. Il combine :

- un **script Python en ligne de commande** (`automotive_pentest.py`) qui se connecte au véhicule (OBD-II / Bluetooth / CAN) ou tourne en mode simulation, exécute une série de modules d'audit, et génère un rapport PDF + un export JSON ;
- un **dashboard React** (`AutoCyberAuditVehicle.jsx`) offrant une interface visuelle pour piloter une session d'audit, suivre la progression en temps réel, consulter les findings et visualiser le rapport.

Chaque session démarre obligatoirement par une **étape de consentement** qui enregistre l'identité de l'auditeur, l'organisation et le périmètre autorisé avant de lancer le moindre test.

---

## ✨ Fonctionnalités

- 🔌 Connexion **OBD-II** (adaptateur ELM327 USB/Bluetooth) ou **Bluetooth Classic/BLE** natif
- 🚌 Sniffing et analyse du **bus CAN** (`python-can` / `socketcan`), détection d'IDs sensibles et de patterns de flood (DoS)
- 🛡️ Sondage des services **UDS** (Unified Diagnostic Services) et détection de sessions étendues sans `SecurityAccess`
- 📡 Scan **BLE/Bluetooth Classic** : profils exposés (SPP, HID...), capteurs TPMS visibles, commandes non authentifiées
- 📶 Détection des réseaux **WiFi embarqués** faibles (ouverts, WEP, WPA1 uniquement)
- 🧩 Analyse statique de **firmware/OTA** : recherche de clés privées, tokens, API keys, mots de passe, URLs internes hardcodées
- ☁️ Audit de l'**API Telematics/Cloud** : TLS, headers de sécurité HTTP, endpoints non authentifiés, IDOR sur VIN, introspection GraphQL
- 📄 Génération automatique d'un **rapport PDF professionnel** (mise en page Kyvra navy/cyan) et d'un **export JSON** brut
- 🖥️ **Dashboard React** avec sélection des modules, suivi de progression en direct, table de findings filtrable et aperçu du rapport
- 🔐 **Passerelle de consentement obligatoire** avant tout lancement d'audit (CLI et interface web)

---

## 🗂️ Architecture du projet

```
.
├── automotive_pentest.py          # CLI Python — moteur d'audit + génération PDF
├── AutoCyberAuditVehicle.jsx      # Dashboard React — pilotage visuel d'une session
└── automotive_pentest_reports/    # Généré à l'exécution : PDF, JSON, logs, consentements
    ├── automotive_pentest_<timestamp>.pdf
    ├── automotive_pentest_<timestamp>.json
    ├── consent_audit.json
    └── pentest.log
```

| Composant | Rôle |
|---|---|
| `ConnectionManager` | Gère la connexion OBD-II / Bluetooth Classic / BLE au véhicule |
| `CANBusAuditor` | Sniffe le bus CAN, détecte IDs sensibles et patterns de flood |
| `OBDUDSAuditor` | Sonde les services UDS, teste l'ouverture de session étendue |
| `BluetoothAuditor` | Scanne BLE/Bluetooth Classic, identifie profils exposés et capteurs TPMS |
| `WiFiAuditor` | Sniffe les réseaux WiFi embarqués (mode monitor) |
| `FirmwareAnalyzer` | Analyse statique d'un binaire firmware/OTA à la recherche de secrets |
| `TelematicsAPIAuditor` | Audit boîte noire de l'API cloud du véhicule |
| `PDFReportGenerator` | Compile l'ensemble des findings en rapport PDF |

---

## ⚙️ Installation

### Prérequis

- Python 3.9+
- (Optionnel mais recommandé) un environnement Linux pour le support `socketcan` natif
- Pour les tests en lab sans véhicule réel : module noyau `vcan` (`modprobe vcan`)

### Dépendances Python

```bash
pip install python-can scapy bleak requests colorama reportlab obd
```

> Certaines dépendances sont optionnelles : l'outil détecte automatiquement les bibliothèques absentes et désactive le module correspondant (avec un finding `INFO` explicite) plutôt que de planter.

| Bibliothèque | Module concerné | Notes |
|---|---|---|
| `python-can` | CAN Bus | nécessite une interface `socketcan` (réelle ou `vcan0`) |
| `scapy` | WiFi | nécessite une interface en mode monitor + droits root |
| `bleak` | Bluetooth BLE | multiplateforme |
| `obd` (python-obd) | OBD-II | pour adaptateurs ELM327 |
| `requests` | API Telematics | — |
| `reportlab` | Génération PDF | — |
| `colorama` | Affichage console | optionnel, fallback sans couleurs |
| `PyBluez2` | Bluetooth Classic | requis uniquement pour `--connection bluetooth` sur socket RFCOMM natif |

### Dashboard React

Le fichier `AutoCyberAuditVehicle.jsx` est un composant React autonome (hooks `useState`/`useEffect`/`useRef`, sans dépendance externe). Il peut être intégré dans n'importe quel projet React/Vite/Next.js existant :

```bash
npm install react react-dom
```

Puis importez et montez le composant `<AutoCyberAuditVehicle />` dans votre application.

---

## 🚀 Utilisation — CLI Python

### Étape obligatoire : consentement éthique

Au lancement, le script affiche systématiquement un écran de consentement et demande :
- la confirmation explicite que vous disposez des autorisations nécessaires,
- le périmètre de l'audit (VIN, lab, programme bug bounty, client),
- le nom de l'auditeur et l'organisation.

Ces informations sont horodatées et enregistrées dans `automotive_pentest_reports/consent_audit.json`. **Sans confirmation, le script s'arrête.**

### Exemples de commandes

```bash
# Connexion OBD-II via adaptateur USB ELM327
python automotive_pentest.py --connection obd --port /dev/ttyUSB0

# Connexion via adaptateur OBD-II Bluetooth
python automotive_pentest.py --connection bluetooth --bt-address AA:BB:CC:DD:EE:FF

# Audit ciblé avec plusieurs modules + API Telematics
python automotive_pentest.py --connection obd --modules can obd ble wifi api \
       --api-url https://api.mycar.com --api-token eyJ... --vin WAUZZZ4G4FN123456

# Analyse statique d'un firmware uniquement (aucune connexion véhicule requise)
python automotive_pentest.py --modules firmware --firmware ./update.bin

# Mode simulation — démonstration / formation, sans véhicule physique
python automotive_pentest.py --connection simulation --modules can ble wifi
```

### Options principales

| Option | Description | Défaut |
|---|---|---|
| `--connection` | `obd` \| `bluetooth` \| `can` \| `simulation` | `simulation` |
| `--port` | Port série OBD-II (`/dev/ttyUSB0`, `COM3`) | — |
| `--bt-address` | Adresse MAC Bluetooth (`AA:BB:CC:DD:EE:FF`) | — |
| `--bt-port` | Port RFCOMM Bluetooth | `1` |
| `--modules` | Sous-ensemble parmi `can obd ble wifi firmware api` | `can ble wifi` |
| `--can-iface` | Interface CAN (`vcan0`, `can0`...) | `vcan0` |
| `--wifi-iface` | Interface WiFi en mode monitor | `wlan0mon` |
| `--duration` | Durée des scans en secondes | `30` |
| `--firmware` | Chemin du fichier firmware/binaire à analyser | — |
| `--api-url` | URL de base de l'API Telematics | — |
| `--api-token` | Bearer token pour l'API | — |
| `--vin` | VIN du véhicule (17 caractères), utilisé pour le test IDOR | — |
| `--output-pdf` | Chemin de sortie du rapport PDF | auto-généré |

### Sorties générées

Chaque exécution produit, dans `automotive_pentest_reports/` :
- un **rapport PDF** détaillé (synthèse + tableau de findings + détail par module) ;
- un **export JSON** brut (consentement, infos véhicule, findings complets) ;
- un fichier de **log** (`pentest.log`).

---

## 🖥️ Utilisation — Dashboard React

Le composant `AutoCyberAuditVehicle.jsx` reproduit le flux du CLI dans une interface web :

1. **Connexion véhicule** — choix du mode (OBD-II USB, Bluetooth, Simulation Lab) et configuration des paramètres de connexion.
2. **Sélection des modules** — CAN, UDS, BLE, WiFi, Firmware, API.
3. **Configuration** — VIN, URL d'API Telematics, durée des scans.
4. **Modale de consentement** — obligatoire avant le lancement : périmètre/VIN/lab, nom de l'auditeur, organisation. Le bouton de lancement reste désactivé tant que les champs requis ne sont pas remplis.
5. **Suivi en temps réel** — barre de progression, module en cours, log d'exécution.
6. **Onglet Findings** — table filtrable par sévérité/module.
7. **Onglet Rapport** — aperçu structuré du rapport final (équivalent du PDF généré côté CLI).

> Le dashboard inclut un jeu de **findings de démonstration** (`DEMO_FINDINGS`) permettant de visualiser l'interface sans connexion réelle à un véhicule — utile pour les démos, la formation ou les tests d'intégration front-end.

---

## 🧪 Modules d'audit

| Module | Type de findings détectés | Sévérité max |
|---|---|---|
| **CAN Bus** | IDs sensibles connus (freinage, direction, moteur, ABS...), patterns de flood/DoS | CRITICAL |
| **OBD-II/UDS** | Session diagnostic étendue ouverte sans `SecurityAccess` (SID 0x27), VIN exposé sans auth, DTC actifs | HIGH |
| **Bluetooth/BLE** | Profils exposés sans chiffrement (SPP, HID), capteurs TPMS visibles (tracking), commandes acceptées sans authentification | HIGH |
| **WiFi embarqué** | Réseaux ouverts ou WEP, WPA1 uniquement | CRITICAL |
| **Firmware/OTA** | Clés privées RSA, clés AWS, API keys, JWT, mots de passe, URLs HTTP/IP internes, flags de debug hardcodés | CRITICAL |
| **API Telematics** | Absence de TLS, headers de sécurité manquants, endpoints sensibles accessibles sans authentification, IDOR sur VIN, introspection GraphQL | CRITICAL |

Les niveaux de sévérité suivent l'échelle : `CRITICAL > HIGH > MEDIUM > LOW > INFO`.

---

## 📑 Exemple de rapport

Le rapport PDF généré comprend :
- une page de couverture (véhicule, VIN, auditeur, organisation, date, ID de session) ;
- un résumé exécutif avec comptage par sévérité ;
- un tableau récapitulatif de toutes les vulnérabilités ;
- le détail de chaque finding par module, avec description, recommandation de remédiation et horodatage.

*(Un exemple anonymisé est disponible dans ce dépôt sous `rapport_audit_autocyberaudit.pdf` — généré en environnement de lab, à titre d'illustration uniquement.)*

---

## 📐 Conformité et références normatives

AutoCyberAudit s'inspire des référentiels suivants pour structurer ses tests et ses recommandations :

- **ISO/SAE 21434** — Ingénierie de la cybersécurité automobile
- **UN R155** — Règlement ONU sur le système de management de la cybersécurité (CSMS)
- **AUTOSAR SecOC** — Communication sécurisée on-board
- **TARA** (Threat Analysis and Risk Assessment)

Ces références sont citées à titre méthodologique ; l'outil ne constitue **pas** un outil de certification de conformité.

---

## 🚧 Limitations connues

- Les modules CAN et WiFi nécessitent un accès matériel bas niveau (`socketcan`, mode monitor) généralement indisponible sous Windows/macOS sans configuration spécifique.
- Le module WiFi nécessite des **droits root** pour le mode monitor.
- L'analyse firmware est basée sur des **expressions régulières** (détection de patterns) : elle peut générer des faux positifs/négatifs et ne remplace pas une rétro-ingénierie complète.
- L'audit de l'API Telematics est une approche **boîte noire** non exhaustive ; un audit de sécurité applicatif complet (SAST/DAST, revue de code) reste recommandé en complément.
- Le mode `simulation` ne reproduit pas fidèlement un environnement véhicule réel — il est destiné à la démonstration et à la formation.

---

## 🤝 Contribuer

Les contributions sont bienvenues (nouveaux modules, nouvelles signatures de détection, corrections de bugs, traductions). Merci d'ouvrir une *issue* pour discuter d'un changement majeur avant de soumettre une *pull request*.

Toute contribution doit conserver la passerelle de consentement éthique et les avertissements présents dans ce README et dans le code.

---

## 📄 Licence

GNU — voir le fichier `LICENSE`.

---

<p align="center">
  <i>AutoCyberAudit — Kyvra Security Platform · À utiliser de manière responsable, avec parcimonie, et uniquement avec l'accord du propriétaire du véhicule.</i>
</p>
