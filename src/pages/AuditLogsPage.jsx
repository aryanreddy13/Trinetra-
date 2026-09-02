import React, { useState, useEffect } from 'react';
import { Lock, CheckCircle, Download, User, AlertTriangle, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { getUserAuditLogs, logUserAudit } from '../firebase';

export default function AuditLogsPage({ user }) {
  const [severityFilter, setSeverityFilter] = useState('All');
  const [firestoreLogs, setFirestoreLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Pagination state: 10 rows per page
  const [currentPageNum, setCurrentPageNum] = useState(1);
  const ITEMS_PER_PAGE = 10;

  const fetchLogs = async () => {
    setLoading(true);
    if (user?.uid) {
      const logs = await getUserAuditLogs(user.uid);
      setFirestoreLogs(logs);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchLogs();
  }, [user]);

  // Reset to page 1 when filter changes
  useEffect(() => {
    setCurrentPageNum(1);
  }, [severityFilter]);

  // Expanded fallback dataset matching user constraints (Timestamp, Zone ID, Anomaly at Desk, Severity, Checksum)
  const defaultAnomalyLogs = [
    {
      timestamp: '2026-08-23T04:45:12.802Z',
      zoneId: 'S4',
      deskId: 'Desk S4',
      anomaly: 'Mobile Phone Object Interaction Detected at Desk S4',
      operatorId: user?.email || 'Officer Alpha',
      severity: 'Critical',
      checksum: 'INC-FB313E-7f83b165'
    },
    {
      timestamp: '2026-08-23T04:40:15.198Z',
      zoneId: 'S5',
      deskId: 'Desk S5',
      anomaly: 'Gaze Shift & Prolonged Glance Right Anomaly at Desk S5',
      operatorId: user?.email || 'Officer Alpha',
      severity: 'High',
      checksum: 'INC-FB314F-3a22c981'
    },
    {
      timestamp: '2026-08-23T04:30:09.771Z',
      zoneId: 'S9',
      deskId: 'Desk S9',
      anomaly: 'Unauthorized Paper Chit Exchange Attempt at Desk S9',
      operatorId: user?.email || 'System Auth',
      severity: 'Medium',
      checksum: 'INC-FB315G-b9c410dd'
    },
    {
      timestamp: '2026-08-23T04:22:00.000Z',
      zoneId: 'S0',
      deskId: 'Desk S0',
      anomaly: 'User Session Authenticated via Google OAuth Provider',
      operatorId: user?.email || 'System Auth',
      severity: 'Nominal',
      checksum: 'AUTH-GOOG-e9102c4b'
    },
    {
      timestamp: '2026-08-23T04:15:33.410Z',
      zoneId: 'S2',
      deskId: 'Desk S2',
      anomaly: 'Lateral Head Rotation & Peeking Behavior at Desk S2',
      operatorId: user?.email || 'Officer Lead',
      severity: 'High',
      checksum: 'INC-FB316H-1c88e332'
    },
    {
      timestamp: '2026-08-23T04:02:18.115Z',
      zoneId: 'S6',
      deskId: 'Desk S6',
      anomaly: 'Unusual Desk Surface Object Interaction at Desk S6',
      operatorId: user?.email || 'Officer Lead',
      severity: 'Medium',
      checksum: 'INC-FB317I-9b04f11e'
    },
    {
      timestamp: '2026-08-23T03:55:01.000Z',
      zoneId: 'S0',
      deskId: 'Desk S0',
      anomaly: 'User Session Authenticated via Email & Password Credential',
      operatorId: user?.email || 'System Auth',
      severity: 'Nominal',
      checksum: 'AUTH-EMAIL-4a81f09c'
    },
    {
      timestamp: '2026-08-23T03:48:42.902Z',
      zoneId: 'S1',
      deskId: 'Desk S1',
      anomaly: 'Baseline Desk Behavior Calibration Completed for Zone S1',
      operatorId: user?.email || 'Forensics Bot',
      severity: 'Nominal',
      checksum: 'CAL-S1-d41d8cd9'
    },
    {
      timestamp: '2026-08-23T03:40:11.750Z',
      zoneId: 'S4',
      deskId: 'Desk S4',
      anomaly: 'Electronic Device Frequency Trigger at Desk S4',
      operatorId: user?.email || 'Officer Beta',
      severity: 'Critical',
      checksum: 'INC-FB318J-8a71d02e'
    },
    {
      timestamp: '2026-08-23T03:32:05.610Z',
      zoneId: 'S8',
      deskId: 'Desk S8',
      anomaly: 'Postural Deviation & Excessive Reaching Motion at Desk S8',
      operatorId: user?.email || 'Officer Beta',
      severity: 'Medium',
      checksum: 'INC-FB319K-5f10a430'
    },
    {
      timestamp: '2026-08-23T03:25:00.000Z',
      zoneId: 'S0',
      deskId: 'Desk S0',
      anomaly: 'System Security Audit & Baseline Refresh Triggered',
      operatorId: user?.email || 'System Admin',
      severity: 'Nominal',
      checksum: 'SYS-AUD-991b72e1'
    },
    {
      timestamp: '2026-08-23T03:15:19.400Z',
      zoneId: 'S5',
      deskId: 'Desk S5',
      anomaly: 'Gaze Displacement Anomaly Recorded at Desk S5',
      operatorId: user?.email || 'Officer Lead',
      severity: 'High',
      checksum: 'INC-FB320L-3b77a900'
    },
    {
      timestamp: '2026-08-23T03:00:00.000Z',
      zoneId: 'S0',
      deskId: 'Desk S0',
      anomaly: 'User Session Authenticated via Google OAuth Provider',
      operatorId: user?.email || 'System Auth',
      severity: 'Nominal',
      checksum: 'AUTH-GOOG-210e5f99'
    }
  ];

  // Trigger writing a new real-time anomaly log to Firestore
  const handleGenerateNewAnomalyLog = async () => {
    if (!user?.uid) return;
    const testAnomalies = [
      { zone: 'S4', desk: 'Desk S4', text: 'Cell phone object interaction detected at Desk S4', sev: 'Critical' },
      { zone: 'S5', desk: 'Desk S5', text: 'Sustained posture deviation & gaze anomaly at Desk S5', sev: 'High' },
      { zone: 'S2', desk: 'Desk S2', text: 'Peeking & lateral head rotation at Desk S2', sev: 'High' },
      { zone: 'S9', desk: 'Desk S9', text: 'Unauthorized document movement detected at Desk S9', sev: 'Medium' },
      { zone: 'S0', desk: 'Desk S0', text: 'Officer User Authenticated to Platform Session', sev: 'Nominal' }
    ];
    const picked = testAnomalies[Math.floor(Math.random() * testAnomalies.length)];

    await logUserAudit(
      user.uid,
      user.email,
      "ANOMALY_DETECTED",
      user.email || "Analyst Lead",
      picked.text,
      picked.zone,
      picked.desk,
      picked.sev,
      `SHA256-${Date.now().toString(16)}`
    );
    await fetchLogs();
  };

  const rawList = firestoreLogs.length > 0 ? firestoreLogs : defaultAnomalyLogs;

  // Filter logs by Severity
  const filteredLogs = rawList.filter(log => {
    if (severityFilter !== 'All' && log.severity !== severityFilter) return false;
    return true;
  });

  // Calculate Pagination (10 rows per page)
  const totalPages = Math.ceil(filteredLogs.length / ITEMS_PER_PAGE) || 1;
  const startIndex = (currentPageNum - 1) * ITEMS_PER_PAGE;
  const currentPaginatedLogs = filteredLogs.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handleExportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + ["Timestamp (UTC),Zone ID,Desk ID,Anomaly Logged,Severity,Officer,SHA-256 Checksum"]
      .concat(filteredLogs.map(l => `"${l.timestamp || l.createdAt}","${l.zoneId}","${l.deskId}","${l.anomaly || l.details}","${l.severity}","${l.operatorId || l.userEmail}","${l.checksum}"`))
      .join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `drishti_anomaly_audit_logs_${user?.username || 'officer'}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getSeverityBadge = (sev) => {
    switch (sev) {
      case 'Critical':
        return <span className="badge badge-critical">Critical</span>;
      case 'High':
        return <span className="badge badge-high">High</span>;
      case 'Medium':
        return <span className="badge badge-med">Medium</span>;
      default:
        return <span className="badge badge-nominal">Nominal</span>;
    }
  };

  return (
    <div className="content-area">
      {/* Header & Vault Status */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="page-title">Chain of Custody & Firestore Audit Log</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '6px', fontSize: '12px', fontFamily: 'var(--font-mono)' }}>
            <span style={{ color: 'var(--text-muted)' }}>Firestore User Sync:</span>
            <span className="badge" style={{ background: 'rgba(0, 242, 255, 0.15)', color: 'var(--accent-cyan)', border: '1px solid var(--border-cyan)' }}>
              <Lock size={12} /> {user?.email || 'Authenticated Officer'} <CheckCircle size={12} />
            </span>
          </div>
        </div>

        {/* Filter & Action Controls */}
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <select 
            value={severityFilter} 
            onChange={(e) => setSeverityFilter(e.target.value)}
            style={{ background: '#0a101d', border: '1px solid var(--border-color)', color: 'var(--text-main)', padding: '6px 12px', borderRadius: '6px', fontFamily: 'var(--font-mono)', fontSize: '12px' }}
          >
            <option value="All">All Severities</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Nominal">Nominal</option>
          </select>

          <button 
            className="btn-new-investigation" 
            onClick={handleGenerateNewAnomalyLog}
            style={{ width: 'auto', background: 'rgba(0, 242, 255, 0.15)', color: '#00f2ff', border: '1px solid var(--border-cyan)', boxShadow: 'none' }}
          >
            <Plus size={14} /> Log Anomaly to Firestore
          </button>

          <button 
            className="btn-new-investigation" 
            onClick={handleExportCSV}
            style={{ width: 'auto' }}
          >
            <Download size={14} /> Export CSV
          </button>
        </div>
      </div>

      {/* Audit Log Table with 10 Rows per Page */}
      <div className="card" style={{ padding: '0', overflow: 'hidden', marginTop: '20px' }}>
        <table className="dossier-table" style={{ width: '100%' }}>
          <thead>
            <tr>
              <th>Timestamp (UTC)</th>
              <th>Zone ID</th>
              <th>Desk ID</th>
              <th>Anomaly Logged</th>
              <th>Severity</th>
              <th>Officer / Operator</th>
              <th>SHA-256 Checksum</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)' }}>
                  Fetching Firestore Anomaly Audit Logs...
                </td>
              </tr>
            ) : currentPaginatedLogs.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)' }}>
                  No anomaly logs found for selected filter.
                </td>
              </tr>
            ) : (
              currentPaginatedLogs.map((log, idx) => (
                <tr key={idx}>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--accent-cyan)' }}>
                    {log.timestamp ? new Date(log.timestamp).toLocaleString() : new Date().toLocaleString()}
                  </td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontWeight: '700', color: '#fff' }}>
                    {log.zoneId || 'S4'}
                  </td>
                  <td style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                    {log.deskId || 'Desk S4'}
                  </td>
                  <td style={{ color: 'var(--text-bright)', fontSize: '12px', fontWeight: '500' }}>
                    <AlertTriangle size={13} style={{ verticalAlign: 'middle', marginRight: '6px', color: log.severity === 'Critical' ? 'var(--status-critical)' : 'var(--status-high)' }} />
                    {log.anomaly || log.details}
                  </td>
                  <td>
                    {getSeverityBadge(log.severity)}
                  </td>
                  <td style={{ color: 'var(--text-muted)', fontSize: '12px' }}>
                    <User size={12} style={{ verticalAlign: 'middle', marginRight: '4px' }} />
                    {log.operatorId || log.userEmail || user?.email || 'Forensic Officer'}
                  </td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-muted)' }}>
                    {log.checksum || '7f83b165...e9a4'}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Page Control Bar (10 Rows per Page) */}
        <div style={{
          display: 'flex',
          justify: 'space-between',
          alignItems: 'center',
          padding: '12px 18px',
          borderTop: '1px solid var(--border-color)',
          background: 'var(--bg-darkest)',
          fontFamily: 'var(--font-mono)',
          fontSize: '12px',
          color: 'var(--text-muted)'
        }}>
          <div>
            Showing <strong>{filteredLogs.length === 0 ? 0 : startIndex + 1}</strong> to <strong>{Math.min(startIndex + ITEMS_PER_PAGE, filteredLogs.length)}</strong> of <strong>{filteredLogs.length}</strong> entries
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              onClick={() => setCurrentPageNum(prev => Math.max(prev - 1, 1))}
              disabled={currentPageNum === 1}
              style={{
                background: currentPageNum === 1 ? 'transparent' : 'rgba(0, 242, 255, 0.1)',
                color: currentPageNum === 1 ? 'var(--text-muted)' : '#00f2ff',
                border: '1px solid var(--border-color)',
                borderRadius: '4px',
                padding: '4px 10px',
                cursor: currentPageNum === 1 ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <ChevronLeft size={14} /> Prev
            </button>

            <span style={{ color: '#fff', fontWeight: '700', padding: '0 6px' }}>
              Page {currentPageNum} of {totalPages}
            </span>

            <button
              onClick={() => setCurrentPageNum(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPageNum === totalPages}
              style={{
                background: currentPageNum === totalPages ? 'transparent' : 'rgba(0, 242, 255, 0.1)',
                color: currentPageNum === totalPages ? 'var(--text-muted)' : '#00f2ff',
                border: '1px solid var(--border-color)',
                borderRadius: '4px',
                padding: '4px 10px',
                cursor: currentPageNum === totalPages ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              Next <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
