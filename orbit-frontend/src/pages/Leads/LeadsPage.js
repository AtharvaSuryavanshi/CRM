import React, { useState, useEffect } from "react";
import Layout from "../../components/layout/Layout";
import LeadService from "../../services/leadService";
import AgentsService from "../../services/AgentsService";
import "./LeadsPage.css";

import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaEye,
  FaTimes,
  FaSearch,
  FaUser,
  FaUserCheck,
  FaExclamationCircle
} from "react-icons/fa";

// ─── STATUS BADGE ─────────────────────────────────────────────────────────────

const STATUS_COLORS = {
  NEW:        { bg: "#eff6ff", text: "#3b82f6", border: "#bfdbfe" },
  CONTACTED:  { bg: "#fffbeb", text: "#d97706", border: "#fde68a" },
  INTERESTED: { bg: "#faf5ff", text: "#8b5cf6", border: "#e9d5ff" },
  BOOKED:     { bg: "#ecfdf5", text: "#059669", border: "#a7f3d0" },
  LOST:       { bg: "#f8fafc", text: "#64748b", border: "#cbd5e1" },
};

const STATUS_LABELS = {
  NEW:        "New",
  CONTACTED:  "Contacted",
  INTERESTED: "Interested",
  BOOKED:     "Booked",
  LOST:       "Lost",
};

const PRIORITY_COLORS = {
  HIGH:   { bg: "#fef2f2", text: "#ef4444", border: "#fecaca" },
  MEDIUM: { bg: "#fffbeb", text: "#f59e0b", border: "#fde68a" },
  LOW:    { bg: "#f0fdf4", text: "#10b981", border: "#bbf7d0" },
};

function StatusBadge({ status }) {
  const colors = STATUS_COLORS[status] || { bg: "#f1f5f9", text: "#475569", border: "#e2e8f0" };
  const label = STATUS_LABELS[status] || status;
  return (
    <span
      className="status-pill-badge"
      style={{ background: colors.bg, color: colors.text, border: `1px solid ${colors.border}` }}
    >
      {label}
    </span>
  );
}

function PriorityBadge({ priority }) {
  const p = (priority || "MEDIUM").toUpperCase();
  const colors = PRIORITY_COLORS[p] || PRIORITY_COLORS.MEDIUM;
  return (
    <span
      className="priority-pill-badge"
      style={{ background: colors.bg, color: colors.text, border: `1px solid ${colors.border}` }}
    >
      {p}
    </span>
  );
}

// ─── EMPTY STATE ──────────────────────────────────────────────────────────────

function EmptyState({ onAdd }) {
  return (
    <div className="leads-empty glass-panel animate-scale-up">
      <div className="empty-icon-wrapper">
        <FaUser />
      </div>
      <h3>No leads yet</h3>
      <p>Start by adding your first lead to the pipeline.</p>
      <button className="primary-submit-btn" style={{ width: "auto" }} onClick={onAdd}>
        <FaPlus /> Add First Lead
      </button>
    </div>
  );
}

// ─── LEAD FORM MODAL (Add / Edit) ─────────────────────────────────────────────

const EMPTY_FORM = {
  name: "", email: "", phone: "",
  status: "NEW", source: "", notes: "",
  priority: "MEDIUM", agentId: ""
};

function LeadModal({ lead, agents, onClose, onSave }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  const isEdit = Boolean(lead?.id);

  useEffect(() => {
    if (lead) {
      setForm({
        name: lead.name || "",
        email: lead.email || "",
        phone: lead.phone || "",
        status: lead.status || "NEW",
        source: lead.source || "",
        notes: lead.notes || "",
        priority: lead.priority || "MEDIUM",
        agentId: lead.agent?.id || ""
      });
    }
  }, [lead]);

  const validate = () => {
    const e = {};
    if (!form.name.trim())  e.name  = "Name is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Invalid email";
    return e;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSaving(true);
    try {
      const payload = {
        ...form,
        agent: form.agentId ? { id: parseInt(form.agentId) } : null
      };
      delete payload.agentId; // remove temp field
      await onSave(payload);
      onClose();
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay animate-fade-in" onClick={onClose}>
      <div className="modal-box glass-panel animate-scale-up" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{isEdit ? "Edit Lead Information" : "Create New Lead"}</h2>
          <button className="modal-close-btn" onClick={onClose}><FaTimes /></button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-row">
            <div className="form-group-custom">
              <label className="input-label-custom">Client Name *</label>
              <div className="input-box-custom">
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Full name"
                  className={errors.name ? "input-error" : ""}
                />
              </div>
              {errors.name && <span className="error-msg">{errors.name}</span>}
            </div>

            <div className="form-group-custom">
              <label className="input-label-custom">Email Address *</label>
              <div className="input-box-custom">
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="email@example.com"
                  className={errors.email ? "input-error" : ""}
                />
              </div>
              {errors.email && <span className="error-msg">{errors.email}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group-custom">
              <label className="input-label-custom">Phone Number</label>
              <div className="input-box-custom">
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="+91 XXXXX XXXXX"
                />
              </div>
            </div>

            <div className="form-group-custom">
              <label className="input-label-custom">Pipeline Status</label>
              <div className="input-box-custom select-wrapper">
                <select name="status" value={form.status} onChange={handleChange}>
                  {Object.keys(STATUS_COLORS).map((s) => (
                    <option key={s} value={s}>{STATUS_LABELS[s] || s}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group-custom">
              <label className="input-label-custom">Lead Priority</label>
              <div className="input-box-custom select-wrapper">
                <select name="priority" value={form.priority} onChange={handleChange}>
                  <option value="HIGH">High Priority</option>
                  <option value="MEDIUM">Medium Priority</option>
                  <option value="LOW">Low Priority</option>
                </select>
              </div>
            </div>

            <div className="form-group-custom">
              <label className="input-label-custom">Lead Source</label>
              <div className="input-box-custom select-wrapper">
                <select name="source" value={form.source} onChange={handleChange}>
                  <option value="">Select source</option>
                  <option value="Website">Website</option>
                  <option value="Referral">Referral</option>
                  <option value="Social Media">Social Media</option>
                  <option value="Cold Call">Cold Call</option>
                  <option value="Email Campaign">Email Campaign</option>
                  <option value="Walk-in">Walk-in</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
          </div>

          <div className="form-group-custom">
            <label className="input-label-custom">Assign Handling Agent</label>
            <div className="input-box-custom select-wrapper">
              <select name="agentId" value={form.agentId} onChange={handleChange}>
                <option value="">Select Agent (Unassigned)</option>
                {agents.map((ag) => (
                  <option key={ag.id} value={ag.id}>{ag.name} ({ag.email || "No email"})</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group-custom">
            <label className="input-label-custom">Notes / Property Preference</label>
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              placeholder="Add details on client property requirements, budget, etc..."
              rows={3}
              className="modal-textarea"
            />
          </div>

          <div className="modal-actions-panel">
            <button type="button" className="secondary-submit-btn" style={{ width: "auto" }} onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="primary-submit-btn" style={{ width: "auto" }} disabled={saving}>
              {saving ? "Saving changes..." : isEdit ? "Update Lead" : "Create Lead"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── VIEW MODAL ───────────────────────────────────────────────────────────────

function ViewModal({ lead, agents, onClose, onEdit, onAssignQuick }) {
  const [selectedAgentId, setSelectedAgentId] = useState(lead.agent?.id || "");
  const [assigning, setAssigning] = useState(false);

  const formatDate = (dt) =>
    dt ? new Date(dt).toLocaleString("en-IN", {
      day: "2-digit", month: "short", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    }) : "—";

  const handleAssignChange = async (e) => {
    const agentId = e.target.value;
    setSelectedAgentId(agentId);
    setAssigning(true);
    try {
      await onAssignQuick(lead.id, agentId);
    } catch (err) {
      alert("Failed to assign agent: " + err.message);
    } finally {
      setAssigning(false);
    }
  };

  return (
    <div className="modal-overlay animate-fade-in" onClick={onClose}>
      <div className="modal-box modal-view glass-panel animate-scale-up" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Client Inquiries & Details</h2>
          <button className="modal-close-btn" onClick={onClose}><FaTimes /></button>
        </div>

        <div className="view-profile-header">
          <div className="view-avatar">
            {lead.name?.charAt(0).toUpperCase()}
          </div>
          <div className="view-identity">
            <h3>{lead.name}</h3>
            <div className="view-badges">
              <StatusBadge status={lead.status} />
              <PriorityBadge priority={lead.priority} />
            </div>
          </div>
        </div>

        <div className="view-detail-grid">
          <div className="view-grid-item">
            <span className="view-item-lbl">Email Address</span>
            <span className="view-item-val">{lead.email || "—"}</span>
          </div>
          <div className="view-grid-item">
            <span className="view-item-lbl">Phone Number</span>
            <span className="view-item-val">{lead.phone || "—"}</span>
          </div>
          <div className="view-grid-item">
            <span className="view-item-lbl">Lead Source</span>
            <span className="view-item-val">{lead.source || "—"}</span>
          </div>
          <div className="view-grid-item">
            <span className="view-item-lbl">Registered On</span>
            <span className="view-item-val">{formatDate(lead.createdAt)}</span>
          </div>
        </div>

        <div className="agent-assign-section border-t border-b border-slate-100 py-4 my-4">
          <h4 className="text-sm font-bold text-slate-800 mb-2 flex items-center gap-2">
            <FaUserCheck className="text-indigo-600" />
            <span>Assigned Handling Agent</span>
          </h4>
          <div className="flex gap-4 items-center">
            <div className="input-box-custom select-wrapper" style={{ flexGrow: 1 }}>
              <select value={selectedAgentId} onChange={handleAssignChange} disabled={assigning}>
                <option value="">No Agent Assigned</option>
                {agents.map((ag) => (
                  <option key={ag.id} value={ag.id}>{ag.name}</option>
                ))}
              </select>
            </div>
            {assigning && <span className="text-xs text-indigo-600 font-semibold">Assigning...</span>}
          </div>
        </div>

        {lead.notes && (
          <div className="view-notes-box">
            <span className="view-item-lbl">Notes & Property Preferences</span>
            <p className="view-item-val notes-para">{lead.notes}</p>
          </div>
        )}

        <div className="modal-actions-panel mt-6">
          <button className="secondary-submit-btn" style={{ width: "auto" }} onClick={onClose}>Close</button>
          <button className="primary-submit-btn" style={{ width: "auto" }} onClick={() => { onClose(); onEdit(lead); }}>
            <FaEdit /> Edit Lead
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── DELETE CONFIRM ───────────────────────────────────────────────────────────

function DeleteConfirm({ lead, onClose, onConfirm }) {
  const [deleting, setDeleting] = useState(false);

  const handleConfirm = async () => {
    setDeleting(true);
    try { await onConfirm(); onClose(); }
    catch (err) { alert(err.message); setDeleting(false); }
  };

  return (
    <div className="modal-overlay animate-fade-in" onClick={onClose}>
      <div className="modal-box modal-confirm glass-panel animate-scale-up" onClick={(e) => e.stopPropagation()}>
        <div className="confirm-icon-wrapper">🗑️</div>
        <h2>Delete Lead File?</h2>
        <p>Are you sure you want to delete <strong>{lead.name}</strong> from your records? This action cannot be undone.</p>
        <div className="modal-actions-panel mt-6">
          <button className="secondary-submit-btn" style={{ width: "auto" }} onClick={onClose}>Cancel</button>
          <button className="btn-danger-submit" onClick={handleConfirm} disabled={deleting}>
            {deleting ? "Deleting file..." : "Yes, Delete Record"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────

function LeadsPage() {
  const [leads, setLeads]               = useState([]);
  const [agents, setAgents]             = useState([]);
  const [loading, setLoading]           = useState(true);
  const [search, setSearch]             = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [modal, setModal]               = useState(null);

  const fetchLeadsAndAgents = async () => {
    setLoading(true);
    try {
      const [leadsData, agentsData] = await Promise.all([
        LeadService.getAllLeads(),
        AgentsService.getAllAgents()
      ]);
      setLeads(Array.isArray(leadsData) ? leadsData : []);
      setAgents(Array.isArray(agentsData) ? agentsData : []);
    } catch (err) {
      console.error("LeadsPage loading error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchLeadsAndAgents(); }, []);

  // ── CRUD handlers ──
  const handleCreate = async (formData) => {
    const newLead = await LeadService.createLead(formData);
    setLeads((prev) => [newLead, ...prev]);
  };

  const handleUpdate = async (formData) => {
    const updated = await LeadService.updateLead(modal.lead.id, formData);
    setLeads((prev) => prev.map((l) => (l.id === updated.id ? updated : l)));
  };

  const handleDelete = async () => {
    await LeadService.deleteLead(modal.lead.id);
    setLeads((prev) => prev.filter((l) => l.id !== modal.lead.id));
  };

  const handleAssignQuick = async (leadId, agentId) => {
    if (agentId) {
      await LeadService.assignLead(leadId, parseInt(agentId));
    } else {
      // Clear assignment by updating lead agent to null
      const originalLead = leads.find((l) => l.id === leadId);
      if (originalLead) {
        const updatedPayload = {
          name: originalLead.name,
          email: originalLead.email,
          phone: originalLead.phone,
          status: originalLead.status,
          source: originalLead.source,
          notes: originalLead.notes,
          priority: originalLead.priority,
          agent: null
        };
        await LeadService.updateLead(leadId, updatedPayload);
      }
    }
    // Refresh leads list
    const data = await LeadService.getAllLeads();
    setLeads(Array.isArray(data) ? data : []);
  };

  // ── Filter & Search ──
  const filtered = leads.filter((l) => {
    const matchSearch =
      l.name?.toLowerCase().includes(search.toLowerCase()) ||
      l.email?.toLowerCase().includes(search.toLowerCase()) ||
      l.phone?.includes(search) ||
      l.agent?.name?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "All" || l.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const statusCounts = leads.reduce((acc, l) => {
    acc[l.status] = (acc[l.status] || 0) + 1;
    return acc;
  }, {});

  return (
    <Layout>
      <div className="leads-page-container">
        
        {/* Header section */}
        <div className="leads-header-flex">
          <div>
            <h1 className="leads-main-title">Client Leads</h1>
            <p className="leads-subtitle-detail">
              Manage client inquiries, contact priorities, and team assignments.
            </p>
          </div>
          <button className="primary-submit-btn" style={{ width: "auto" }} onClick={() => setModal({ type: "add" })}>
            <FaPlus /> Add New Lead
          </button>
        </div>

        {/* Status Filter Pills */}
        <div className="leads-filters-scroll">
          {["All", ...Object.keys(STATUS_COLORS)].map((s) => (
            <button
              key={s}
              className={`pill-filter-btn ${filterStatus === s ? "active" : ""}`}
              onClick={() => setFilterStatus(s)}
            >
              {s === "All" ? "All Leads" : (STATUS_LABELS[s] || s)}
              <span className="pill-item-count">
                {s === "All" ? leads.length : (statusCounts[s] || 0)}
              </span>
            </button>
          ))}
        </div>

        {/* Search & Actions Bar */}
        <div className="leads-utilities-bar glass-panel">
          <div className="search-box-bar">
            <FaSearch className="search-icon-svg" />
            <input
              type="text"
              placeholder="Search by client name, email, phone or assigned agent..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button className="clear-search-btn" onClick={() => setSearch("")}>
                <FaTimes />
              </button>
            )}
          </div>
        </div>

        {/* Leads Table / Grid Content */}
        {loading ? (
          <div className="leads-loading-wrapper glass-panel">
            <div className="leads-progress-spinner" />
            <p>Retrieving leads database...</p>
          </div>
        ) : leads.length === 0 ? (
          <EmptyState onAdd={() => setModal({ type: "add" })} />
        ) : (
          <div className="leads-datagrid-box glass-panel">
            <div className="table-responsive-box">
              <table className="leads-datagrid-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Client Identity</th>
                    <th>Contact Information</th>
                    <th>Priority</th>
                    <th>Pipeline Status</th>
                    <th>Assigned Agent</th>
                    <th>Created</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="no-matches-row">
                        <FaExclamationCircle />
                        <span>No records match your filters.</span>
                      </td>
                    </tr>
                  ) : (
                    filtered.map((lead, idx) => (
                      <tr key={lead.id} className="datagrid-hover-row">
                        <td className="row-number-col">{idx + 1}</td>
                        <td>
                          <div className="client-identity-cell">
                            <div className="client-avatar-circle">
                              {lead.name?.charAt(0).toUpperCase()}
                            </div>
                            <div className="client-name-details">
                              <span className="client-name-text">{lead.name}</span>
                              <span className="client-source-text">via {lead.source || "Direct Entry"}</span>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="contact-details-cell">
                            <span className="contact-email-text">{lead.email}</span>
                            <span className="contact-phone-text">{lead.phone || "No phone added"}</span>
                          </div>
                        </td>
                        <td>
                          <PriorityBadge priority={lead.priority} />
                        </td>
                        <td>
                          <StatusBadge status={lead.status} />
                        </td>
                        <td>
                          <div className="agent-column-flex">
                            {lead.agent ? (
                              <div className="assigned-agent-tag">
                                <div className="agent-mini-dot"></div>
                                <span>{lead.agent.name}</span>
                              </div>
                            ) : (
                              <span className="unassigned-text-lbl">Unassigned</span>
                            )}
                          </div>
                        </td>
                        <td className="date-created-col">
                          {lead.createdAt
                            ? new Date(lead.createdAt).toLocaleDateString("en-IN", {
                                day: "2-digit", month: "short", year: "numeric",
                              })
                            : "—"}
                        </td>
                        <td>
                          <div className="grid-action-buttons">
                            <button
                              className="action-icon-btn view-color"
                              title="View details"
                              onClick={() => setModal({ type: "view", lead })}
                            >
                              <FaEye />
                            </button>
                            <button
                              className="action-icon-btn edit-color"
                              title="Edit lead"
                              onClick={() => setModal({ type: "edit", lead })}
                            >
                              <FaEdit />
                            </button>
                            <button
                              className="action-icon-btn delete-color"
                              title="Delete lead"
                              onClick={() => setModal({ type: "delete", lead })}
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Modals Container */}
      {modal?.type === "add" && (
        <LeadModal lead={null} agents={agents} onClose={() => setModal(null)} onSave={handleCreate} />
      )}
      {modal?.type === "edit" && (
        <LeadModal lead={modal.lead} agents={agents} onClose={() => setModal(null)} onSave={handleUpdate} />
      )}
      {modal?.type === "view" && (
        <ViewModal
          lead={modal.lead}
          agents={agents}
          onClose={() => setModal(null)}
          onEdit={(lead) => setModal({ type: "edit", lead })}
          onAssignQuick={handleAssignQuick}
        />
      )}
      {modal?.type === "delete" && (
        <DeleteConfirm lead={modal.lead} onClose={() => setModal(null)} onConfirm={handleDelete} />
      )}
    </Layout>
  );
}

export default LeadsPage;
