import { useState, useEffect, useRef } from "react";

// ─── Design System Kyvra (navy/cyan) ─────────────────────────────────────────
const C = {
  navy:       "#0D1B2A",
  navyLight:  "#1E2D3D",
  navyMid:    "#162435",
  cyan:       "#00C2CB",
  cyanDim:    "rgba(0,194,203,0.15)",
  cyanBorder: "rgba(0,194,203,0.3)",
  white:      "#F0F4F8",
  gray:       "#8899AA",
  grayDim:    "rgba(136,153,170,0.15)",
  CRITICAL:   "#E53935",
  HIGH:       "#FB8C00",
  MEDIUM:     "#FDD835",
  LOW:        "#43A047",
  INFO:       "#1E88E5",
};

const SEV_ORDER = ["CRITICAL","HIGH","MEDIUM","LOW","INFO"];

// ─── Icônes SVG inline ────────────────────────────────────────────────────────
const Icon = {
  Obd: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="7" width="20" height="14" rx="2"/>
      <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
      <circle cx="12" cy="14" r="2"/><path d="M12 12v-2"/>
    </svg>
  ),
  Bluetooth: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="6.5 6.5 17.5 17.5 12 23 12 1 17.5 6.5 6.5 17.5"/>
    </svg>
  ),
  Can: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
    </svg>
  ),
  Wifi: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/>
      <path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><circle cx="12" cy="20" r="1" fill="currentColor"/>
    </svg>
  ),
  Chip: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="7" y="7" width="10" height="10" rx="1"/>
      <path d="M7 9H4M7 12H4M7 15H4M17 9h3M17 12h3M17 15h3M9 7V4M12 7V4M15 7V4M9 17v3M12 17v3M15 17v3"/>
    </svg>
  ),
  Api: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
    </svg>
  ),
  Uds: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <ellipse cx="12" cy="12" rx="10" ry="10"/><path d="M12 8v4l3 3"/>
    </svg>
  ),
  Pdf: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
      <line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
      <polyline points="10 9 9 9 8 9"/>
    </svg>
  ),
  Shield: () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
    </svg>
  ),
  Check: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  ),
  Alert: () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/>
      <line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
  ),
  Car: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M5 17H3a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-2"/>
      <rect x="7" y="17" width="10" height="4" rx="2"/>
      <path d="M5 9l2-4h10l2 4"/>
      <circle cx="7.5" cy="14.5" r="1.5" fill="currentColor"/>
      <circle cx="16.5" cy="14.5" r="1.5" fill="currentColor"/>
    </svg>
  ),
};

// ─── Demo findings ─────────────────────────────────────────────────────────────
const DEMO_FINDINGS = [
  { module: "CAN Bus", type: "CAN_SENSITIVE_ID",        severity: "CRITICAL", description: "ID 0x143 (Brake Control Module) détecté — data: 0a ff 00 01",     recommendation: "Filtrer les IDs critiques via un CAN gateway sécurisé" },
  { module: "OBD-II/UDS", type: "UDS_EXTENDED_SESSION_OPEN", severity: "HIGH",  description: "Session UDS étendue (0x10 0x03) acceptée sans authentification", recommendation: "Implémenter SecurityAccess (0x27) avant session étendue" },
  { module: "Bluetooth", type: "BLE_SERIAL_PORT_EXPOSED",    severity: "HIGH",  description: "Profil SPP (Serial Port) exposé sur AA:BB:CC:DD:EE:FF",          recommendation: "Désactiver SPP ou chiffrer le canal RFCOMM" },
  { module: "WiFi",      type: "WIFI_WEAK_CRYPTO",           severity: "CRITICAL", description: "Hotspot embarqué 'MyCarHotspot' sans chiffrement WPA2",      recommendation: "Configurer WPA3 ou WPA2-AES sur le modem embarqué" },
  { module: "Firmware",  type: "FIRMWARE_API_KEY",           severity: "HIGH",  description: "Clé API hardcodée @ offset 0x2A40 : sk_live_xxxxxxxx...",        recommendation: "Déplacer tous les secrets dans un HSM/TPM ou vault" },
  { module: "API Telematics", type: "API_UNAUTH_ENDPOINT",   severity: "CRITICAL", description: "POST /api/v1/remote/unlock accessible sans authentification", recommendation: "Protéger avec JWT + vérification de propriété du VIN" },
  { module: "API Telematics", type: "API_IDOR_VIN",         severity: "CRITICAL", description: "IDOR confirmé — VIN adjacent retourne données d'un autre véhicule", recommendation: "Valider la propriété du VIN côté serveur à chaque requête" },
  { module: "CAN Bus",   type: "CAN_DOS_PATTERN",            severity: "CRITICAL", description: "ID 0x7DF : 8 421 frames en 30s (moy=120) — flood OBD-II",   recommendation: "Implémenter rate-limiting et anomaly detection sur le CAN" },
  { module: "OBD-II/UDS", type: "OBD_VIN_EXPOSED",          severity: "MEDIUM",description: "VIN récupéré via OBD-II PID 0x902A sans authentification",       recommendation: "Journaliser les accès VIN, envisager une authentification" },
  { module: "Bluetooth", type: "BLE_TPMS_VISIBLE",           severity: "MEDIUM",description: "Capteur TPMS Continental visible — tracking géophysique possible",recommendation: "Activer la rotation d'adresse MAC BLE (Privacy Feature)" },
  { module: "Firmware",  type: "FIRMWARE_URL_HTTP",          severity: "MEDIUM",description: "URL http://update.factory.internal détectée dans le binaire",    recommendation: "Forcer HTTPS pour tous les endpoints de mise à jour" },
  { module: "API Telematics", type: "API_GRAPHQL_INTROSPECTION", severity: "MEDIUM", description: "Introspection GraphQL activée — schéma API complet exposé", recommendation: "Désactiver l'introspection GraphQL en production" },
  { module: "WiFi",      type: "WIFI_WPA1_ONLY",             severity: "HIGH",  description: "SSID 'CAR_DIAG_NET' utilise WPA1 uniquement (TKIP)",            recommendation: "Mettre à niveau vers WPA2-AES minimum" },
  { module: "CAN Bus",   type: "CAN_SENSITIVE_ID",           severity: "HIGH",  description: "ID 0x7E0 (ECU Engine) actif avec données non chiffrées",         recommendation: "Chiffrer les messages ECU critiques avec SecOC (AUTOSAR)" },
  { module: "OBD-II/UDS", type: "OBD_DTC_PRESENT",          severity: "MEDIUM",description: "3 codes DTC actifs : P0128, U0101, B1234 — anomalies détectées", recommendation: "Analyser chaque DTC, certains peuvent masquer des compromissions" },
  { module: "API Telematics", type: "API_MISSING_HEADERS",  severity: "MEDIUM",description: "Headers HSTS, CSP, X-Frame-Options absents sur l'API",           recommendation: "Ajouter les headers de sécurité HTTP sur le reverse proxy" },
];

// ─── Utils ────────────────────────────────────────────────────────────────────
const SEV_COLOR = (s) => C[s] || C.INFO;

const SevBadge = ({ sev }) => (
  <span style={{
    display: "inline-flex", alignItems: "center", gap: 4,
    padding: "2px 8px", borderRadius: 4, fontSize: 10, fontWeight: 700,
    letterSpacing: 1, textTransform: "uppercase",
    background: SEV_COLOR(sev) + "22",
    color: SEV_COLOR(sev),
    border: `1px solid ${SEV_COLOR(sev)}44`,
  }}>{sev}</span>
);

// ─── Composant Connexion ──────────────────────────────────────────────────────
function ConnectionPanel({ connMode, setConnMode, connConfig, setConnConfig,
                           connState, onConnect, onDisconnect, vehicleInfo }) {
  const modes = [
    { id: "obd",        label: "OBD-II (USB)",   Icon: Icon.Obd },
    { id: "bluetooth",  label: "Bluetooth",       Icon: Icon.Bluetooth },
    { id: "simulation", label: "Simulation Lab",  Icon: Icon.Car },
  ];

  return (
    <div style={{ background: C.navyLight, borderRadius: 10, padding: 24,
                  border: `1px solid ${C.cyanBorder}` }}>
      <h3 style={{ color: C.cyan, fontSize: 13, fontWeight: 700, marginBottom: 16,
                   letterSpacing: 2, textTransform: "uppercase" }}>
        Connexion Véhicule
      </h3>

      {/* Sélecteur de mode */}
      <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
        {modes.map(({ id, label, Icon: Ic }) => (
          <button key={id} onClick={() => { setConnMode(id); onDisconnect(); }}
            style={{
              flex: 1, padding: "10px 8px", borderRadius: 8, border: "none", cursor: "pointer",
              display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
              background: connMode === id ? C.cyanDim : C.navyMid,
              color: connMode === id ? C.cyan : C.gray,
              outline: connMode === id ? `1.5px solid ${C.cyan}` : "none",
              transition: "all .2s",
            }}>
            <Ic />
            <span style={{ fontSize: 10, fontWeight: 600 }}>{label}</span>
          </button>
        ))}
      </div>

      {/* Paramètres OBD */}
      {connMode === "obd" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <label style={{ color: C.gray, fontSize: 11 }}>Port série
            <input value={connConfig.port || "/dev/ttyUSB0"}
              onChange={e => setConnConfig(p => ({...p, port: e.target.value}))}
              style={inputStyle} placeholder="/dev/ttyUSB0 ou COM3" />
          </label>
          <label style={{ color: C.gray, fontSize: 11 }}>Baudrate
            <select value={connConfig.baudrate || "38400"}
              onChange={e => setConnConfig(p => ({...p, baudrate: e.target.value}))}
              style={{...inputStyle, background: C.navy}}>
              {["9600","19200","38400","57600","115200"].map(b =>
                <option key={b} value={b}>{b}</option>)}
            </select>
          </label>
        </div>
      )}

      {/* Paramètres Bluetooth */}
      {connMode === "bluetooth" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <label style={{ color: C.gray, fontSize: 11 }}>Adresse Bluetooth
            <input value={connConfig.btAddress || ""}
              onChange={e => setConnConfig(p => ({...p, btAddress: e.target.value}))}
              style={inputStyle} placeholder="AA:BB:CC:DD:EE:FF" />
          </label>
          <label style={{ color: C.gray, fontSize: 11 }}>Protocole
            <select value={connConfig.btProto || "rfcomm"}
              onChange={e => setConnConfig(p => ({...p, btProto: e.target.value}))}
              style={{...inputStyle, background: C.navy}}>
              <option value="rfcomm">RFCOMM / SPP (ELM327 BT)</option>
              <option value="ble">BLE (GATT)</option>
            </select>
          </label>
        </div>
      )}

      {connMode === "simulation" && (
        <p style={{ color: C.gray, fontSize: 11, margin: 0, lineHeight: 1.6 }}>
          Mode laboratoire — aucun adaptateur requis.<br/>
          Les modules s'exécutent sur des interfaces virtuelles (vcan0).
        </p>
      )}

      {/* Bouton connexion */}
      <button onClick={connState === "connected" ? onDisconnect : onConnect}
        style={{
          width: "100%", marginTop: 16, padding: "11px 0",
          borderRadius: 8, border: "none", cursor: "pointer", fontWeight: 700,
          fontSize: 13, letterSpacing: 1,
          background: connState === "connected"
            ? "rgba(229,57,53,0.15)" : C.cyanDim,
          color: connState === "connected" ? C.CRITICAL : C.cyan,
          outline: `1px solid ${connState === "connected" ? C.CRITICAL : C.cyan}44`,
          transition: "all .2s",
        }}>
        {connState === "connecting" ? "Connexion..." :
         connState === "connected"  ? "✕  Déconnecter" :
         "⚡  Connecter"}
      </button>

      {/* Status */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 12 }}>
        <div style={{
          width: 8, height: 8, borderRadius: "50%",
          background: connState === "connected" ? C.LOW :
                      connState === "connecting" ? C.MEDIUM : C.gray,
          boxShadow: connState === "connected" ? `0 0 8px ${C.LOW}` : "none",
        }}/>
        <span style={{ color: C.gray, fontSize: 11 }}>
          {connState === "connected"  ? "Connecté" :
           connState === "connecting" ? "Connexion en cours..." : "Déconnecté"}
        </span>
      </div>

      {/* Infos véhicule */}
      {vehicleInfo && Object.keys(vehicleInfo).length > 0 && (
        <div style={{ marginTop: 16, padding: 12, background: C.navy,
                      borderRadius: 8, border: `1px solid ${C.cyanBorder}` }}>
          <p style={{ color: C.cyan, fontSize: 10, fontWeight: 700,
                      letterSpacing: 1, textTransform: "uppercase", margin: "0 0 8px" }}>
            Véhicule détecté
          </p>
          {Object.entries(vehicleInfo).map(([k, v]) => (
            <div key={k} style={{ display: "flex", justifyContent: "space-between",
                                   marginBottom: 4 }}>
              <span style={{ color: C.gray, fontSize: 10 }}>{k}</span>
              <span style={{ color: C.white, fontSize: 10, fontFamily: "monospace" }}>
                {v}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Sélecteur de modules ─────────────────────────────────────────────────────
const MODULES = [
  { id: "can",      label: "CAN Bus",      subtitle: "ISO 11898",     Icon: Icon.Can },
  { id: "obd",      label: "OBD-II / UDS", subtitle: "ISO 14229",     Icon: Icon.Uds },
  { id: "ble",      label: "Bluetooth BLE", subtitle: "TPMS / SPP",   Icon: Icon.Bluetooth },
  { id: "wifi",     label: "WiFi Embarqué", subtitle: "802.11",        Icon: Icon.Wifi },
  { id: "firmware", label: "Firmware / OTA","subtitle": "Statique",    Icon: Icon.Chip },
  { id: "api",      label: "API Telematics","subtitle": "Cloud / REST", Icon: Icon.Api },
];

function ModuleSelector({ selected, setSelected }) {
  const toggle = id =>
    setSelected(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );

  return (
    <div style={{ background: C.navyLight, borderRadius: 10, padding: 24,
                  border: `1px solid ${C.cyanBorder}` }}>
      <h3 style={{ color: C.cyan, fontSize: 13, fontWeight: 700, marginBottom: 16,
                   letterSpacing: 2, textTransform: "uppercase" }}>
        Modules d'Audit
      </h3>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
        {MODULES.map(({ id, label, subtitle, Icon: Ic }) => {
          const on = selected.includes(id);
          return (
            <button key={id} onClick={() => toggle(id)}
              style={{
                padding: "12px 10px", borderRadius: 8, border: "none",
                cursor: "pointer", textAlign: "left", transition: "all .2s",
                background: on ? C.cyanDim : C.navyMid,
                outline: on ? `1.5px solid ${C.cyan}` : "none",
              }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ color: on ? C.cyan : C.gray }}><Ic /></span>
                <div>
                  <div style={{ color: on ? C.white : C.gray, fontSize: 11,
                                fontWeight: 600 }}>{label}</div>
                  <div style={{ color: C.gray, fontSize: 9 }}>{subtitle}</div>
                </div>
                {on && (
                  <span style={{ marginLeft: "auto", color: C.cyan }}><Icon.Check /></span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Barre de progression d'audit ────────────────────────────────────────────
function AuditProgress({ running, progress, currentModule, log }) {
  const logRef = useRef(null);
  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight;
  }, [log]);

  return (
    <div style={{ background: C.navyLight, borderRadius: 10, padding: 24,
                  border: `1px solid ${C.cyanBorder}` }}>
      <h3 style={{ color: C.cyan, fontSize: 13, fontWeight: 700, marginBottom: 16,
                   letterSpacing: 2, textTransform: "uppercase" }}>
        Progression
      </h3>

      {/* Barre */}
      <div style={{ height: 6, background: C.navyMid, borderRadius: 3, marginBottom: 8 }}>
        <div style={{
          height: "100%", borderRadius: 3, transition: "width .5s",
          width: `${progress}%`,
          background: `linear-gradient(90deg, ${C.cyan}, #00e8f0)`,
          boxShadow: `0 0 8px ${C.cyan}88`,
        }}/>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between",
                    color: C.gray, fontSize: 10, marginBottom: 16 }}>
        <span>{currentModule || (running ? "Initialisation..." : "En attente")}</span>
        <span>{progress}%</span>
      </div>

      {/* Log terminal */}
      <div ref={logRef} style={{
        background: C.navy, borderRadius: 8, padding: 12, height: 160,
        overflowY: "auto", fontFamily: "monospace", fontSize: 10,
        border: `1px solid ${C.navyMid}`,
      }}>
        {log.length === 0
          ? <span style={{ color: C.gray }}>En attente du lancement...</span>
          : log.map((l, i) => (
            <div key={i} style={{
              color: l.type === "error" ? C.CRITICAL :
                     l.type === "warn"  ? C.HIGH :
                     l.type === "ok"    ? C.LOW : C.gray,
              marginBottom: 2, lineHeight: 1.4,
            }}>
              <span style={{ color: C.navyLight }}>
                [{new Date(l.ts).toLocaleTimeString()}]&nbsp;
              </span>
              {l.msg}
            </div>
          ))
        }
      </div>
    </div>
  );
}

// ─── Tableau des findings ─────────────────────────────────────────────────────
function FindingsTable({ findings, filter, setFilter }) {
  const counts = SEV_ORDER.reduce((acc, s) => {
    acc[s] = findings.filter(f => f.severity === s).length;
    return acc;
  }, {});

  const filtered = filter === "ALL"
    ? findings
    : findings.filter(f => f.severity === filter);

  return (
    <div style={{ background: C.navyLight, borderRadius: 10, padding: 24,
                  border: `1px solid ${C.cyanBorder}` }}>
      {/* En-tête + filtres */}
      <div style={{ display: "flex", alignItems: "center",
                    flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
        <h3 style={{ color: C.cyan, fontSize: 13, fontWeight: 700, margin: 0,
                     letterSpacing: 2, textTransform: "uppercase", flex: "0 0 auto" }}>
          Vulnérabilités ({findings.length})
        </h3>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {["ALL", ...SEV_ORDER].map(s => {
            const cnt = s === "ALL" ? findings.length : counts[s];
            if (s !== "ALL" && !cnt) return null;
            return (
              <button key={s} onClick={() => setFilter(s)}
                style={{
                  padding: "3px 10px", borderRadius: 12, border: "none",
                  cursor: "pointer", fontSize: 10, fontWeight: 700,
                  background: filter === s
                    ? (s === "ALL" ? C.cyanDim : SEV_COLOR(s) + "33")
                    : C.navyMid,
                  color: filter === s
                    ? (s === "ALL" ? C.cyan : SEV_COLOR(s))
                    : C.gray,
                  outline: filter === s
                    ? `1px solid ${s === "ALL" ? C.cyan : SEV_COLOR(s)}66`
                    : "none",
                }}>
                {s} {cnt > 0 && <span>({cnt})</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tableau */}
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
          <thead>
            <tr style={{ background: C.navyMid }}>
              {["Sévérité","Module","Type","Description","Recommandation"].map(h => (
                <th key={h} style={{ padding: "8px 10px", textAlign: "left",
                                     color: C.gray, fontWeight: 600, fontSize: 10,
                                     letterSpacing: 1, textTransform: "uppercase",
                                     borderBottom: `1px solid ${C.navyMid}` }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0
              ? <tr><td colSpan={5} style={{ padding: 24, textAlign: "center",
                                              color: C.gray, fontSize: 12 }}>
                  Aucun finding {filter !== "ALL" ? `de niveau ${filter}` : ""}
                </td></tr>
              : filtered.map((f, i) => (
                <tr key={i} style={{
                  background: i % 2 === 0 ? "transparent" : C.navyMid + "66",
                  borderBottom: `1px solid ${C.navyMid}`,
                }}>
                  <td style={{ padding: "8px 10px" }}>
                    <SevBadge sev={f.severity} />
                  </td>
                  <td style={{ padding: "8px 10px", color: C.gray, fontSize: 10 }}>
                    {f.module}
                  </td>
                  <td style={{ padding: "8px 10px", color: C.cyan,
                                fontFamily: "monospace", fontSize: 9 }}>
                    {f.type}
                  </td>
                  <td style={{ padding: "8px 10px", color: C.white, maxWidth: 280 }}>
                    {f.description}
                  </td>
                  <td style={{ padding: "8px 10px", color: C.gray,
                                fontSize: 10, maxWidth: 220 }}>
                    {f.recommendation}
                  </td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Résumé sévérité ──────────────────────────────────────────────────────────
function SeveritySummary({ findings }) {
  const counts = SEV_ORDER.reduce((acc, s) => {
    acc[s] = findings.filter(f => f.severity === s).length;
    return acc;
  }, {});
  const total = findings.length;

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 8 }}>
      {SEV_ORDER.map(s => (
        <div key={s} style={{
          background: C.navyLight, borderRadius: 10, padding: "14px 10px",
          border: counts[s] > 0
            ? `1px solid ${SEV_COLOR(s)}44`
            : `1px solid ${C.navyMid}`,
          textAlign: "center",
        }}>
          <div style={{
            fontSize: 24, fontWeight: 800, lineHeight: 1,
            color: counts[s] > 0 ? SEV_COLOR(s) : C.gray,
            fontFamily: "monospace",
          }}>
            {counts[s]}
          </div>
          <div style={{ color: C.gray, fontSize: 9, fontWeight: 700,
                        letterSpacing: 1, marginTop: 4, textTransform: "uppercase" }}>
            {s}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Générateur de rapport (Claude API) ──────────────────────────────────────
function ReportPanel({ findings, vehicleInfo, consent }) {
  const [status, setStatus] = useState("idle");
  const [analysisText, setAnalysisText] = useState("");

  const generateAnalysis = async () => {
    setStatus("loading");
    setAnalysisText("");
    try {
      const prompt = `Tu es un expert en cybersécurité automobile (ISO/SAE 21434, UN R155, AUTOSAR SecOC).
      
Voici les résultats d'un pentest de véhicule connecté :
- VIN : ${vehicleInfo?.VIN || "Non renseigné"}
- Périmètre : ${consent?.scope || "Audit complet"}
- Nombre de findings : ${findings.length}
- Sévérités : ${SEV_ORDER.map(s => `${s}:${findings.filter(f=>f.severity===s).length}`).join(", ")}

Principaux findings CRITICAL/HIGH :
${findings.filter(f => ["CRITICAL","HIGH"].includes(f.severity)).slice(0,8).map(f =>
  `• [${f.severity}] ${f.type} — ${f.description}`
).join("\n")}

Rédige en français :
1. Un résumé exécutif en 3 phrases
2. Les 3 risques prioritaires avec impact métier
3. Un plan de remédiation en 5 actions concrètes et priorisées
4. La posture de conformité UN R155/ISO 21434

Sois précis, technique, et concis.`;

      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-6",
          max_tokens: 1000,
          messages: [{ role: "user", content: prompt }],
        }),
      });
      const data = await res.json();
      const text = data.content?.map(b => b.text || "").join("") || "";
      setAnalysisText(text);
      setStatus("done");
    } catch (e) {
      setAnalysisText("Erreur lors de la génération de l'analyse.");
      setStatus("error");
    }
  };

  return (
    <div style={{ background: C.navyLight, borderRadius: 10, padding: 24,
                  border: `1px solid ${C.cyanBorder}` }}>
      <h3 style={{ color: C.cyan, fontSize: 13, fontWeight: 700, marginBottom: 16,
                   letterSpacing: 2, textTransform: "uppercase" }}>
        Rapport & Analyse IA
      </h3>

      <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
        <button onClick={generateAnalysis} disabled={status === "loading" || findings.length === 0}
          style={{
            padding: "10px 18px", borderRadius: 8, border: "none", cursor: "pointer",
            background: C.cyanDim, color: C.cyan, fontWeight: 700, fontSize: 12,
            outline: `1px solid ${C.cyanBorder}`,
            opacity: status === "loading" || findings.length === 0 ? 0.5 : 1,
          }}>
          {status === "loading" ? "⏳ Génération..." : "🤖 Analyse IA (Claude)"}
        </button>

        <button onClick={() => window.print()}
          style={{
            padding: "10px 18px", borderRadius: 8, border: "none", cursor: "pointer",
            background: C.grayDim, color: C.gray, fontWeight: 700, fontSize: 12,
            display: "flex", alignItems: "center", gap: 8,
            outline: `1px solid ${C.gray}33`,
          }}>
          <Icon.Pdf /> Exporter PDF
        </button>
      </div>

      {/* Instruction PDF Python */}
      <div style={{ padding: 12, background: C.navy, borderRadius: 8,
                    border: `1px solid ${C.navyMid}`, marginBottom: 16 }}>
        <p style={{ color: C.gray, fontSize: 10, margin: 0, lineHeight: 1.7,
                    fontFamily: "monospace" }}>
          # Rapport PDF complet (ReportLab) via CLI :<br/>
          python automotive_pentest_v2.py --connection obd --port /dev/ttyUSB0<br/>
          &nbsp;&nbsp;--modules can obd ble wifi firmware api<br/>
          &nbsp;&nbsp;--output-pdf ./rapport_audit.pdf
        </p>
      </div>

      {/* Analyse IA */}
      {analysisText && (
        <div style={{ padding: 16, background: C.navy, borderRadius: 8,
                      border: `1px solid ${C.cyanBorder}`,
                      maxHeight: 400, overflowY: "auto" }}>
          <p style={{ color: C.cyan, fontSize: 10, fontWeight: 700,
                      letterSpacing: 1, textTransform: "uppercase", margin: "0 0 12px" }}>
            Analyse IA — AutoCyberAudit
          </p>
          <div style={{ color: C.white, fontSize: 11, lineHeight: 1.75,
                        whiteSpace: "pre-wrap" }}>
            {analysisText}
          </div>
        </div>
      )}

      {findings.length === 0 && (
        <p style={{ color: C.gray, fontSize: 11, margin: 0 }}>
          Lancez un audit pour générer le rapport.
        </p>
      )}
    </div>
  );
}

// ─── Styles partagés ──────────────────────────────────────────────────────────
const inputStyle = {
  display: "block", width: "100%", marginTop: 4,
  padding: "8px 10px", borderRadius: 6,
  background: C.navy, border: `1px solid ${C.navyMid}`,
  color: C.white, fontSize: 11, fontFamily: "monospace",
  outline: "none", boxSizing: "border-box",
};

// ─── App principale ───────────────────────────────────────────────────────────
export default function AutoCyberAuditVehicle() {
  // Connexion
  const [connMode,   setConnMode]   = useState("obd");
  const [connConfig, setConnConfig] = useState({ port: "/dev/ttyUSB0", baudrate: "38400" });
  const [connState,  setConnState]  = useState("disconnected");
  const [vehicleInfo,setVehicleInfo]= useState({});

  // Audit
  const [selectedMods, setSelectedMods] = useState(["can","obd","ble","wifi","api"]);
  const [auditState,   setAuditState]   = useState("idle");
  const [progress,     setProgress]     = useState(0);
  const [currentMod,   setCurrentMod]   = useState("");
  const [auditLog,     setAuditLog]     = useState([]);
  const [findings,     setFindings]     = useState([]);
  const [filter,       setFilter]       = useState("ALL");

  // Config
  const [vin,          setVin]          = useState("");
  const [apiUrl,       setApiUrl]       = useState("");
  const [duration,     setDuration]     = useState(30);
  const [consent,      setConsent]      = useState(null);
  const [showConsent,  setShowConsent]  = useState(false);
  const [consentForm,  setConsentForm]  = useState({ scope: "", auditor: "", company: "" });
  const [activeTab,    setActiveTab]    = useState("audit");

  const addLog = (msg, type = "info") =>
    setAuditLog(prev => [...prev, { msg, type, ts: Date.now() }]);

  // ── Connexion simulée ──────────────────────────────────────────────────────
  const handleConnect = () => {
    setConnState("connecting");
    addLog(`Connexion ${connMode === "obd" ? "OBD-II" : connMode === "bluetooth" ? "Bluetooth" : "Simulation"}...`);
    setTimeout(() => {
      setConnState("connected");
      addLog("Connexion établie", "ok");
      if (connMode === "simulation") {
        const info = {
          "Mode":  "Simulation Lab",
          "CAN":   "vcan0 (virtuel)",
          "BLE":   "Scan actif",
        };
        setVehicleInfo(info);
        addLog("Interface virtuelle vcan0 prête", "ok");
      } else if (connMode === "obd") {
        const info = {
          "VIN":          vin || "WBA3A5G59ENP26705",
          "Port":         connConfig.port,
          "Protocole":    "ISO 15765-4 CAN",
          "RPM":          "820 tr/min",
          "Vitesse":      "0 km/h",
          "Carburant":    "74%",
          "DTC actifs":   "2",
        };
        setVehicleInfo(info);
        addLog(`VIN récupéré : ${info.VIN}`, "ok");
        addLog("2 codes DTC actifs détectés", "warn");
      } else if (connMode === "bluetooth") {
        const info = {
          "Adresse BT":  connConfig.btAddress || "00:1A:7D:DA:71:13",
          "Protocole":   connConfig.btProto === "ble" ? "BLE GATT" : "RFCOMM SPP",
          "ELM327":      "v2.1",
          "VIN":         vin || "WBA3A5G59ENP26705",
        };
        setVehicleInfo(info);
        addLog(`ELM327 BT détecté — ${info["Protocole"]}`, "ok");
      }
    }, 1800);
  };

  const handleDisconnect = () => {
    setConnState("disconnected");
    setVehicleInfo({});
    addLog("Déconnecté");
  };

  // ── Lancement audit ────────────────────────────────────────────────────────
  const handleStartAudit = () => {
    if (!consent) { setShowConsent(true); return; }
    if (selectedMods.length === 0) return;

    setFindings([]);
    setAuditState("running");
    setProgress(0);
    setAuditLog([]);

    const totalSteps = selectedMods.length;
    let step = 0;

    const runNextModule = () => {
      if (step >= totalSteps) {
        setAuditState("done");
        setProgress(100);
        setCurrentMod("");
        addLog(`Audit terminé — ${findings.length + DEMO_FINDINGS.length} findings`, "ok");

        // Injection findings demo filtrés sur modules sélectionnés
        const modMap = {
          can: "CAN Bus", obd: "OBD-II/UDS", ble: "Bluetooth",
          wifi: "WiFi", firmware: "Firmware / OTA", api: "API Telematics"
        };
        const modLabels = selectedMods.map(m => modMap[m]);
        const relevant  = DEMO_FINDINGS.filter(f => modLabels.includes(f.module));
        setFindings(relevant);
        return;
      }

      const mod     = selectedMods[step];
      const modLabels = { can:"CAN Bus",obd:"OBD-II/UDS",ble:"Bluetooth",
                          wifi:"WiFi",firmware:"Firmware",api:"API Telematics" };
      const label   = modLabels[mod] || mod;
      setCurrentMod(`Module ${label}...`);
      addLog(`▶ Démarrage module ${label}`);

      // Logs réalistes par module
      const modLogs = {
        can:      [["Écoute passive bus CAN sur vcan0...", "info"],
                   ["ID 0x143 (Brake Control Module) détecté !", "warn"],
                   ["DoS suspecté ID 0x7DF : 8421 frames", "error"],
                   ["ID 0x7E0 (ECU Engine) actif", "warn"]],
        obd:      [["Envoi PID 0x0902 (VIN)...", "info"],
                   ["VIN récupéré via OBD-II sans auth", "warn"],
                   ["Session UDS étendue acceptée sans SecurityAccess !", "error"],
                   ["2 DTC actifs : P0128, U0101", "warn"]],
        ble:      [["Scan BLE 15s...", "info"],
                   ["SPP exposé : AA:BB:CC:DD:EE:FF", "error"],
                   ["TPMS Continental détecté (tracking possible)", "warn"]],
        wifi:     [["Mode monitor wlan0mon...", "info"],
                   ["SSID 'MyCarHotspot' sans WPA2 !", "error"],
                   ["'CAR_DIAG_NET' en WPA1 uniquement", "warn"]],
        firmware: [["Analyse binaire firmware.bin...", "info"],
                   ["Clé API hardcodée @ 0x2A40", "error"],
                   ["URL http:// détectée @ 0x1F80", "warn"]],
        api:      [["Test endpoints API...", "info"],
                   ["/api/v1/remote/unlock accessible sans auth !", "error"],
                   ["IDOR VIN confirmé", "error"],
                   ["GraphQL introspection ouverte", "warn"]],
      };

      let logIdx = 0;
      const logs = modLogs[mod] || [];
      const logTimer = setInterval(() => {
        if (logIdx < logs.length) {
          addLog(logs[logIdx][0], logs[logIdx][1]);
          logIdx++;
        } else {
          clearInterval(logTimer);
        }
      }, 600);

      setTimeout(() => {
        step++;
        setProgress(Math.round((step / totalSteps) * 100));
        addLog(`✓ Module ${label} terminé`, "ok");
        runNextModule();
      }, Math.max(2500, logs.length * 650));
    };

    runNextModule();
  };

  // ── Consentement ──────────────────────────────────────────────────────────
  const handleConsentSubmit = () => {
    if (!consentForm.scope || !consentForm.auditor) return;
    const c = {
      ...consentForm,
      timestamp: new Date().toISOString(),
      session_hash: Math.random().toString(36).slice(2, 14),
      tool_version: "3.0.0",
    };
    setConsent(c);
    setShowConsent(false);
    setTimeout(() => handleStartAudit(), 100);
  };

  // ─── Rendu ────────────────────────────────────────────────────────────────
  const tabs = [
    { id: "audit",    label: "Audit" },
    { id: "findings", label: `Findings (${findings.length})` },
    { id: "report",   label: "Rapport" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: C.navy, color: C.white,
                  fontFamily: "'Inter', 'Helvetica Neue', sans-serif", padding: 24 }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
        <div style={{ color: C.cyan }}><Icon.Shield /></div>
        <div>
          <h1 style={{ margin: 0, fontSize: 20, fontWeight: 800, letterSpacing: -0.5 }}>
            Auto<span style={{ color: C.cyan }}>CyberAudit</span>
          </h1>
          <p style={{ margin: 0, fontSize: 10, color: C.gray, letterSpacing: 1 }}>
            VEHICLE SECURITY ASSESSMENT — ISO/SAE 21434 · UN R155
          </p>
        </div>
        <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
          {connState === "connected" && (
            <div style={{ display: "flex", alignItems: "center", gap: 6,
                          padding: "4px 12px", borderRadius: 20,
                          background: C.LOW + "22", border: `1px solid ${C.LOW}44` }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%",
                            background: C.LOW, boxShadow: `0 0 6px ${C.LOW}` }}/>
              <span style={{ color: C.LOW, fontSize: 10, fontWeight: 700 }}>
                {connMode.toUpperCase()} CONNECTÉ
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Onglets */}
      <div style={{ display: "flex", gap: 2, marginBottom: 20,
                    borderBottom: `1px solid ${C.navyMid}`, paddingBottom: 0 }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)}
            style={{
              padding: "8px 20px", border: "none", cursor: "pointer",
              background: "transparent", fontSize: 12, fontWeight: 600,
              color: activeTab === t.id ? C.cyan : C.gray,
              borderBottom: `2px solid ${activeTab === t.id ? C.cyan : "transparent"}`,
              marginBottom: -1, transition: "all .2s",
            }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* ── TAB AUDIT ──────────────────────────────────────────────────────── */}
      {activeTab === "audit" && (
        <div style={{ display: "grid", gridTemplateColumns: "320px 1fr", gap: 16 }}>

          {/* Colonne gauche */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <ConnectionPanel
              connMode={connMode} setConnMode={setConnMode}
              connConfig={connConfig} setConnConfig={setConnConfig}
              connState={connState}
              onConnect={handleConnect} onDisconnect={handleDisconnect}
              vehicleInfo={vehicleInfo}
            />
            <ModuleSelector selected={selectedMods} setSelected={setSelectedMods} />

            {/* Config VIN / API */}
            <div style={{ background: C.navyLight, borderRadius: 10, padding: 20,
                          border: `1px solid ${C.cyanBorder}` }}>
              <h3 style={{ color: C.cyan, fontSize: 13, fontWeight: 700, marginBottom: 14,
                           letterSpacing: 2, textTransform: "uppercase" }}>
                Configuration
              </h3>
              <label style={{ color: C.gray, fontSize: 11 }}>VIN (17 car.)
                <input value={vin} onChange={e => setVin(e.target.value.toUpperCase())}
                  style={inputStyle} placeholder="WBAVB13576PT29522" maxLength={17}/>
              </label>
              {selectedMods.includes("api") && (
                <label style={{ color: C.gray, fontSize: 11, display: "block", marginTop: 10 }}>
                  URL API Telematics
                  <input value={apiUrl} onChange={e => setApiUrl(e.target.value)}
                    style={inputStyle} placeholder="https://api.mycar.com"/>
                </label>
              )}
              <label style={{ color: C.gray, fontSize: 11, display: "block", marginTop: 10 }}>
                Durée des scans (sec.)
                <input type="number" min={10} max={300} value={duration}
                  onChange={e => setDuration(+e.target.value)} style={inputStyle}/>
              </label>
            </div>
          </div>

          {/* Colonne droite */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {/* Bouton lancement */}
            <button
              onClick={handleStartAudit}
              disabled={auditState === "running" || selectedMods.length === 0}
              style={{
                padding: "16px 0", borderRadius: 10, border: "none",
                cursor: auditState === "running" ? "not-allowed" : "pointer",
                background: auditState === "running"
                  ? C.navyMid
                  : `linear-gradient(135deg, ${C.cyanDim}, rgba(0,194,203,0.25))`,
                color: auditState === "running" ? C.gray : C.cyan,
                fontSize: 15, fontWeight: 800, letterSpacing: 1,
                outline: `1.5px solid ${auditState === "running" ? C.navyMid : C.cyan}66`,
                transition: "all .2s",
              }}>
              {auditState === "running"
                ? "⏳  Audit en cours..."
                : auditState === "done"
                ? "🔁  Relancer l'audit"
                : "▶  Lancer l'audit"}
            </button>

            {/* Résumé */}
            {findings.length > 0 && <SeveritySummary findings={findings} />}

            {/* Progression */}
            <AuditProgress
              running={auditState === "running"}
              progress={progress}
              currentModule={currentMod}
              log={auditLog}
            />
          </div>
        </div>
      )}

      {/* ── TAB FINDINGS ───────────────────────────────────────────────────── */}
      {activeTab === "findings" && (
        <FindingsTable findings={findings} filter={filter} setFilter={setFilter} />
      )}

      {/* ── TAB RAPPORT ────────────────────────────────────────────────────── */}
      {activeTab === "report" && (
        <ReportPanel findings={findings} vehicleInfo={vehicleInfo} consent={consent} />
      )}

      {/* ── MODAL CONSENTEMENT ─────────────────────────────────────────────── */}
      {showConsent && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(13,27,42,0.92)",
          display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100
        }}>
          <div style={{
            background: C.navyLight, borderRadius: 14, padding: 32, maxWidth: 480, width: "90%",
            border: `1px solid ${C.cyanBorder}`,
          }}>
            <div style={{ color: C.CRITICAL, marginBottom: 12, fontSize: 18 }}>⚠</div>
            <h2 style={{ color: C.white, fontSize: 16, fontWeight: 800, margin: "0 0 8px" }}>
              Consentement Éthique
            </h2>
            <p style={{ color: C.gray, fontSize: 11, margin: "0 0 20px", lineHeight: 1.6 }}>
              Cet outil est réservé aux tests sur votre propre véhicule ou avec autorisation
              écrite du propriétaire. Toute utilisation non autorisée constitue une infraction
              pénale (Art. 323-1 CP).
            </p>

            {[
              { label: "Périmètre / VIN / Lab", key: "scope", placeholder: "Ex: BMW X5 WBA... ou Lab vcan0" },
              { label: "Nom de l'auditeur",      key: "auditor", placeholder: "Jean Dupont" },
              { label: "Organisation",           key: "company", placeholder: "Kyvra Security" },
            ].map(({ label, key, placeholder }) => (
              <label key={key} style={{ color: C.gray, fontSize: 11, display: "block", marginBottom: 12 }}>
                {label} {key !== "company" && <span style={{ color: C.CRITICAL }}>*</span>}
                <input
                  value={consentForm[key]}
                  onChange={e => setConsentForm(p => ({...p, [key]: e.target.value}))}
                  style={inputStyle} placeholder={placeholder}
                />
              </label>
            ))}

            <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
              <button onClick={() => setShowConsent(false)}
                style={{ flex: 1, padding: 11, borderRadius: 8, border: "none",
                         cursor: "pointer", background: C.navyMid, color: C.gray,
                         fontWeight: 700, fontSize: 12 }}>
                Annuler
              </button>
              <button
                onClick={handleConsentSubmit}
                disabled={!consentForm.scope || !consentForm.auditor}
                style={{
                  flex: 2, padding: 11, borderRadius: 8, border: "none",
                  cursor: "pointer", background: C.cyanDim, color: C.cyan,
                  fontWeight: 800, fontSize: 12,
                  outline: `1px solid ${C.cyanBorder}`,
                  opacity: !consentForm.scope || !consentForm.auditor ? 0.5 : 1,
                }}>
                ✓ Je confirme — Lancer l'audit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
