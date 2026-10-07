import React, { useState, useMemo, useEffect } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Clock,
  Plus,
  X,
  Trash2,
  MapPin,
  AlertCircle,
  CheckCircle,
  MoreHorizontal
} from 'lucide-react';
import './LabCalendar.css';

// Helper to format Date to YYYY-MM-DD
export const formatDateKey = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

// Initial default lab reminders seed
const DEFAULT_REMINDERS = [
  {
    id: 'rem-1',
    title: 'EE4207 Embedded Systems Lab 04',
    date: '2026-10-10',
    time: '02:00 PM - 05:00 PM',
    location: 'EE Lab Room 204 (Bench 01-12)',
    category: 'lab',
    typeLabel: 'Lab Session',
    priority: 'high',
    notes: 'Bring STM32 boards and breadboards. Pre-lab simulation report due.'
  },
  {
    id: 'rem-2',
    title: 'Return Rigol DS1054Z Oscilloscope',
    date: '2026-10-13',
    time: 'Before 04:30 PM',
    location: 'Equipment Store / Counter A',
    category: 'loan',
    typeLabel: 'Equipment Due',
    priority: 'urgent',
    notes: 'Return 50MHz probes, ground clips, and power adapter in carrier box.'
  },
  {
    id: 'rem-3',
    title: 'DEIE Capstone Project Review 1',
    date: '2026-10-18',
    time: '09:00 AM - 12:00 PM',
    location: 'Conference Room DEIE-02',
    category: 'project',
    typeLabel: 'Project Review',
    priority: 'high',
    notes: 'Equipment return required prior to milestone evaluation.'
  },
  {
    id: 'rem-4',
    title: 'ESP32 IoT Sensor Prototype Milestone',
    date: '2026-10-22',
    time: '01:30 PM - 03:30 PM',
    location: 'Hardware Prototyping Lab',
    category: 'project',
    typeLabel: 'Milestone',
    priority: 'medium',
    notes: 'Demonstrate MQTT telemetry streaming to lab broker.'
  },
  {
    id: 'rem-5',
    title: 'Robotics Bench Component Re-check',
    date: '2026-10-25',
    time: '11:00 AM - 01:00 PM',
    location: 'Robotics Suite R1',
    category: 'lab',
    typeLabel: 'Lab Session',
    priority: 'medium',
    notes: 'Weekly motor driver and battery pack health check.'
  }
];

export default function LabCalendar({ activeLoans = [], user = {} }) {
  // Current view date (year & month displayed in calendar)
  // Default to October 2026 to match project data context, but user can freely slide to any month/year
  const [viewDate, setViewDate] = useState(() => new Date(2026, 9, 1));
  
  // Selected date for day view inspection
  const [selectedDate, setSelectedDate] = useState(() => new Date(2026, 9, 10));

  // Slide direction for smooth CSS transition ('slide-left' or 'slide-right')
  const [slideDirection, setSlideDirection] = useState('slide-right');
  const [animateKey, setAnimateKey] = useState(0);

  // Reminders state with localStorage persistence
  const [reminders, setReminders] = useState(() => {
    try {
      const saved = localStorage.getItem('electro_lab_reminders');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Could not read reminders from localStorage', e);
    }
    return DEFAULT_REMINDERS;
  });

  // Modal controls
  const [showFullModal, setShowFullModal] = useState(false);
  const [modalTab, setModalTab] = useState('list'); // 'list' | 'create'
  const [filterCategory, setFilterCategory] = useState('all');

  // New reminder form state
  const [newReminder, setNewReminder] = useState({
    title: '',
    date: formatDateKey(selectedDate),
    time: '10:00 AM - 12:00 PM',
    location: 'EE Main Lab',
    category: 'lab',
    priority: 'medium',
    notes: ''
  });

  // Sync reminders back to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('electro_lab_reminders', JSON.stringify(reminders));
    } catch (e) {
      console.warn('Could not save reminders', e);
    }
  }, [reminders]);

  // Combine user custom reminders with loan return reminders dynamically
  const allEvents = useMemo(() => {
    const list = [...reminders];

    // Automatically map active loans as return deadline reminders
    if (activeLoans && activeLoans.length > 0) {
      activeLoans.forEach((loan) => {
        // Only add if not duplicate
        const loanRemId = `loan-auto-${loan.id}`;
        if (!list.some((r) => r.id === loanRemId)) {
          // If dueText is like "in 3 days" or similar, map to a reasonable date
          let dueDay = 10;
          if (typeof loan.dueText === 'string') {
            const match = loan.dueText.match(/\d+/);
            if (match) {
              dueDay = Math.min(28, 10 + parseInt(match[0], 10));
            }
          }
          const loanDate = `2026-10-${String(dueDay).padStart(2, '0')}`;

          list.push({
            id: loanRemId,
            title: `Return: ${loan.title}`,
            date: loanDate,
            time: '5:00 PM',
            location: 'EE Equipment Counter',
            category: 'loan',
            typeLabel: 'Equipment Loan Due',
            priority: loan.status === 'Due Soon' ? 'urgent' : 'high',
            notes: `Project: ${loan.project || 'General'}. Check all parts before return.`
          });
        }
      });
    }

    return list;
  }, [reminders, activeLoans]);

  // Map events by dateKey (YYYY-MM-DD) for fast lookup
  const eventsByDate = useMemo(() => {
    const map = {};
    allEvents.forEach((ev) => {
      if (!map[ev.date]) {
        map[ev.date] = [];
      }
      map[ev.date].push(ev);
    });
    return map;
  }, [allEvents]);

  // Slide to previous month
  const handlePrevMonth = () => {
    setSlideDirection('slide-left');
    setAnimateKey((prev) => prev + 1);
    setViewDate((prev) => {
      const newD = new Date(prev);
      newD.setMonth(prev.getMonth() - 1);
      return newD;
    });
  };

  // Slide to next month
  const handleNextMonth = () => {
    setSlideDirection('slide-right');
    setAnimateKey((prev) => prev + 1);
    setViewDate((prev) => {
      const newD = new Date(prev);
      newD.setMonth(prev.getMonth() + 1);
      return newD;
    });
  };

  // Jump to today
  const handleJumpToday = () => {
    const today = new Date();
    setSlideDirection(today > viewDate ? 'slide-right' : 'slide-left');
    setAnimateKey((prev) => prev + 1);
    setViewDate(new Date(today.getFullYear(), today.getMonth(), 1));
    setSelectedDate(today);
  };

  // Month & Year title display (e.g., "October 2026")
  const monthYearLabel = useMemo(() => {
    return viewDate.toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric'
    });
  }, [viewDate]);

  // Generate 35 or 42 grid cells for the currently viewed month
  const calendarDays = useMemo(() => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();

    // First day of current month (0: Sun, 1: Mon, ... 6: Sat)
    const firstDayIndex = new Date(year, month, 1).getDay();

    // Total days in current month
    const daysInCurrentMonth = new Date(year, month + 1, 0).getDate();

    // Total days in previous month
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    const todayStr = formatDateKey(new Date());
    const selectedStr = formatDateKey(selectedDate);

    const cells = [];

    // 1. Trailing days from previous month
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const dayNum = daysInPrevMonth - i;
      const prevDate = new Date(year, month - 1, dayNum);
      const key = formatDateKey(prevDate);
      cells.push({
        date: prevDate,
        dateKey: key,
        dayNumber: dayNum,
        isOtherMonth: true,
        isToday: key === todayStr,
        isSelected: key === selectedStr,
        events: eventsByDate[key] || []
      });
    }

    // 2. Days in current month
    for (let d = 1; d <= daysInCurrentMonth; d++) {
      const cellDate = new Date(year, month, d);
      const key = formatDateKey(cellDate);
      cells.push({
        date: cellDate,
        dateKey: key,
        dayNumber: d,
        isOtherMonth: false,
        isToday: key === todayStr,
        isSelected: key === selectedStr,
        events: eventsByDate[key] || []
      });
    }

    // 3. Leading days for next month to complete standard 35 or 42 grid cells
    const remaining = (cells.length % 7 === 0) ? 0 : 7 - (cells.length % 7);
    const targetTotal = cells.length + remaining < 35 ? 35 : cells.length + remaining;
    const nextDaysNeeded = targetTotal - cells.length;

    for (let nextD = 1; nextD <= nextDaysNeeded; nextD++) {
      const nextDate = new Date(year, month + 1, nextD);
      const key = formatDateKey(nextDate);
      cells.push({
        date: nextDate,
        dateKey: key,
        dayNumber: nextD,
        isOtherMonth: true,
        isToday: key === todayStr,
        isSelected: key === selectedStr,
        events: eventsByDate[key] || []
      });
    }

    return cells;
  }, [viewDate, selectedDate, eventsByDate]);

  // Selected date key and its list of reminders
  const selectedDateKey = useMemo(() => formatDateKey(selectedDate), [selectedDate]);
  const selectedDayEvents = useMemo(() => {
    return eventsByDate[selectedDateKey] || [];
  }, [eventsByDate, selectedDateKey]);

  // Formatted label for the selected date
  const selectedDateLabel = useMemo(() => {
    return selectedDate.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }, [selectedDate]);

  // Handle cell click
  const handleDateClick = (cell) => {
    setSelectedDate(cell.date);
    // If user clicked another month's day, smoothly navigate viewDate to that month
    if (cell.isOtherMonth) {
      setSlideDirection(cell.date > viewDate ? 'slide-right' : 'slide-left');
      setAnimateKey((prev) => prev + 1);
      setViewDate(new Date(cell.date.getFullYear(), cell.date.getMonth(), 1));
    }
  };

  // Create new reminder
  const handleCreateReminder = (e) => {
    e.preventDefault();
    if (!newReminder.title.trim()) return;

    const item = {
      id: `rem-custom-${Date.now()}`,
      title: newReminder.title.trim(),
      date: newReminder.date,
      time: newReminder.time || 'All Day',
      location: newReminder.location || 'EE Lab',
      category: newReminder.category,
      typeLabel:
        newReminder.category === 'lab'
          ? 'Lab Session'
          : newReminder.category === 'loan'
          ? 'Equipment Due'
          : newReminder.category === 'project'
          ? 'Project Milestone'
          : 'Personal Reminder',
      priority: newReminder.priority,
      notes: newReminder.notes
    };

    setReminders([item, ...reminders]);
    // Switch to view that date
    const [y, m, d] = newReminder.date.split('-').map(Number);
    const addedDate = new Date(y, m - 1, d);
    setSelectedDate(addedDate);
    setViewDate(new Date(y, m - 1, 1));
    setModalTab('list');
    setShowFullModal(false);

    // Reset form
    setNewReminder({
      title: '',
      date: formatDateKey(addedDate),
      time: '10:00 AM - 12:00 PM',
      location: 'EE Main Lab',
      category: 'lab',
      priority: 'medium',
      notes: ''
    });
  };

  // Delete reminder
  const handleDeleteReminder = (id) => {
    setReminders((prev) => prev.filter((r) => r.id !== id));
  };

  // Filtered list for the modal
  const filteredModalEvents = useMemo(() => {
    if (filterCategory === 'all') return allEvents;
    return allEvents.filter((ev) => ev.category === filterCategory);
  }, [allEvents, filterCategory]);

  return (
    <div className="widget-box interactive-calendar-widget">
      {/* 1. Header with Month Title & Slide Nav Buttons */}
      <div className="widget-header calendar-header">
        <div className="cal-title-group">
          <h3 className="widget-title">Upcoming Lab</h3>
          <span className="cal-month-indicator">{monthYearLabel}</span>
        </div>

        <div className="calendar-nav-buttons">
          <button
            className="cal-today-badge"
            onClick={handleJumpToday}
            title="Jump to Today"
          >
            Today
          </button>
          <button
            className="cal-nav-btn"
            onClick={handlePrevMonth}
            title="Previous Month"
            aria-label="Previous Month"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            className="cal-nav-btn"
            onClick={handleNextMonth}
            title="Next Month"
            aria-label="Next Month"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* 2. Days of Week Header */}
      <div className="calendar-week-header">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => (
          <div key={d} className="cal-day-label">
            {d}
          </div>
        ))}
      </div>

      {/* 3. Dynamic Month Days Grid with Animated Sliding Transition */}
      <div
        key={animateKey}
        className={`calendar-grid ${slideDirection === 'slide-right' ? 'slide-in-right' : 'slide-in-left'}`}
      >
        {calendarDays.map((cell) => {
          const hasEvents = cell.events.length > 0;
          return (
            <div
              key={cell.dateKey}
              className={`cal-date-cell ${cell.isOtherMonth ? 'other-month' : ''} ${
                cell.isSelected ? 'active' : ''
              } ${cell.isToday ? 'is-today' : ''} ${hasEvents ? 'has-events' : ''}`}
              onClick={() => handleDateClick(cell)}
              title={`${cell.dateKey}${hasEvents ? ` (${cell.events.length} reminders)` : ''}`}
            >
              <span className="cal-date-number">{cell.dayNumber}</span>

              {/* Event indicator dots */}
              {hasEvents && (
                <div className="cal-event-dots">
                  {cell.events.slice(0, 3).map((ev, idx) => (
                    <span
                      key={idx}
                      className={`event-dot dot-${ev.category || 'lab'}`}
                    />
                  ))}
                  {cell.events.length > 3 && (
                    <span className="event-dot-more">+{cell.events.length - 3}</span>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* 4. Selected Day Reminders Preview Drawer */}
      <div className="selected-day-preview">
        <div className="day-preview-header">
          <div className="day-preview-title">
            <CalendarIcon size={14} className="preview-calendar-icon" />
            <span>{selectedDateLabel}</span>
          </div>
          <button
            className="btn-quick-add"
            onClick={() => {
              setNewReminder((prev) => ({ ...prev, date: selectedDateKey }));
              setModalTab('create');
              setShowFullModal(true);
            }}
            title="Add reminder for this date"
          >
            <Plus size={13} />
            <span>Add</span>
          </button>
        </div>

        {selectedDayEvents.length > 0 ? (
          <div className="day-events-list">
            {selectedDayEvents.map((ev) => (
              <div key={ev.id} className={`day-event-item item-${ev.category || 'lab'}`}>
                <div className="event-item-top">
                  <span className={`event-badge badge-${ev.category}`}>
                    {ev.typeLabel || 'Lab Reminder'}
                  </span>
                  <span className="event-time">
                    <Clock size={11} /> {ev.time}
                  </span>
                </div>
                <div className="event-title">{ev.title}</div>
                {ev.location && (
                  <div className="event-location">
                    <MapPin size={11} /> {ev.location}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="no-events-box">
            <span className="no-events-text">No lab sessions or deadlines on this day.</span>
          </div>
        )}
      </div>

      {/* 5. View More Outlined Pill Button */}
      <button
        className="btn-view-more"
        onClick={() => {
          setModalTab('list');
          setShowFullModal(true);
        }}
      >
        View all lab schedules & reminders
      </button>

      {/* ====================================================================
          FULL MODAL: Reminders Manager & Schedule Timeline
          ==================================================================== */}
      {showFullModal && (
        <div className="modal-overlay" onClick={() => setShowFullModal(false)}>
          <div className="modal-card calendar-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div className="cal-modal-icon">
                  <CalendarIcon size={20} />
                </div>
                <div>
                  <h3 className="modal-title">Lab Schedule & Reminders</h3>
                  <p className="modal-subtitle">
                    Manage upcoming laboratory sessions, evaluations, and equipment returns
                  </p>
                </div>
              </div>
              <button
                className="modal-close-btn"
                onClick={() => setShowFullModal(false)}
                title="Close"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Tabs */}
            <div className="cal-modal-tabs">
              <button
                className={`cal-tab-btn ${modalTab === 'list' ? 'active' : ''}`}
                onClick={() => setModalTab('list')}
              >
                All Reminders ({allEvents.length})
              </button>
              <button
                className={`cal-tab-btn ${modalTab === 'create' ? 'active' : ''}`}
                onClick={() => setModalTab('create')}
              >
                + Schedule New Reminder
              </button>
            </div>

            {/* Tab 1: Reminders List */}
            {modalTab === 'list' && (
              <div className="modal-body">
                {/* Filter tags */}
                <div className="modal-filter-pills">
                  {['all', 'lab', 'loan', 'project', 'personal'].map((cat) => (
                    <button
                      key={cat}
                      className={`filter-pill ${filterCategory === cat ? 'active' : ''}`}
                      onClick={() => setFilterCategory(cat)}
                    >
                      {cat === 'all'
                        ? 'All'
                        : cat === 'lab'
                        ? '🔬 Lab Sessions'
                        : cat === 'loan'
                        ? '⚡ Equipment Loans'
                        : cat === 'project'
                        ? '📂 Projects'
                        : '📌 Personal'}
                    </button>
                  ))}
                </div>

                <div className="modal-reminders-scroll">
                  {filteredModalEvents.length > 0 ? (
                    filteredModalEvents.map((item) => (
                      <div key={item.id} className={`modal-reminder-card cat-${item.category}`}>
                        <div className="modal-rem-header">
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span className={`event-badge badge-${item.category}`}>
                              {item.typeLabel || 'Reminder'}
                            </span>
                            {item.priority === 'urgent' && (
                              <span className="priority-badge urgent">Urgent</span>
                            )}
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span className="rem-date-pill">
                              <CalendarIcon size={12} /> {item.date}
                            </span>
                            {item.id.startsWith('rem-custom') && (
                              <button
                                className="rem-del-btn"
                                onClick={() => handleDeleteReminder(item.id)}
                                title="Delete reminder"
                              >
                                <Trash2 size={14} />
                              </button>
                            )}
                          </div>
                        </div>

                        <div className="rem-card-title">{item.title}</div>

                        <div className="rem-card-meta">
                          {item.time && (
                            <span className="rem-meta-item">
                              <Clock size={13} /> {item.time}
                            </span>
                          )}
                          {item.location && (
                            <span className="rem-meta-item">
                              <MapPin size={13} /> {item.location}
                            </span>
                          )}
                        </div>

                        {item.notes && <div className="rem-card-notes">{item.notes}</div>}
                      </div>
                    ))
                  ) : (
                    <div className="empty-reminders-state">
                      <AlertCircle size={32} style={{ color: 'var(--text-subtle)' }} />
                      <p>No reminders found in this category.</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Tab 2: Create New Reminder Form */}
            {modalTab === 'create' && (
              <form onSubmit={handleCreateReminder}>
                <div className="modal-body">
                  <div className="form-group">
                    <label className="form-label">Reminder / Event Title</label>
                    <input
                      type="text"
                      required
                      className="form-input"
                      placeholder="e.g. EE4207 Lab Viva, Return Oscilloscope Probes, FPGA Demo"
                      value={newReminder.title}
                      onChange={(e) => setNewReminder({ ...newReminder, title: e.target.value })}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div className="form-group">
                      <label className="form-label">Date</label>
                      <input
                        type="date"
                        required
                        className="form-input"
                        value={newReminder.date}
                        onChange={(e) => setNewReminder({ ...newReminder, date: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Time / Window</label>
                      <input
                        type="text"
                        className="form-input"
                        placeholder="e.g. 02:00 PM - 05:00 PM"
                        value={newReminder.time}
                        onChange={(e) => setNewReminder({ ...newReminder, time: e.target.value })}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div className="form-group">
                      <label className="form-label">Category</label>
                      <select
                        className="form-select"
                        value={newReminder.category}
                        onChange={(e) =>
                          setNewReminder({ ...newReminder, category: e.target.value })
                        }
                      >
                        <option value="lab">🔬 Lab Session</option>
                        <option value="loan">⚡ Equipment Return Due</option>
                        <option value="project">📂 Project Evaluation</option>
                        <option value="personal">📌 Personal Reminder</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label className="form-label">Priority</label>
                      <select
                        className="form-select"
                        value={newReminder.priority}
                        onChange={(e) =>
                          setNewReminder({ ...newReminder, priority: e.target.value })
                        }
                      >
                        <option value="medium">Normal Priority</option>
                        <option value="high">High Priority</option>
                        <option value="urgent">Urgent / Due Soon</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Location / Lab Room</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. EE Lab Room 204, Bench 4"
                      value={newReminder.location}
                      onChange={(e) =>
                        setNewReminder({ ...newReminder, location: e.target.value })
                      }
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Notes / Instructions</label>
                    <textarea
                      className="form-input"
                      rows="2"
                      placeholder="e.g. Complete schematic review before session, check test leads"
                      value={newReminder.notes}
                      onChange={(e) => setNewReminder({ ...newReminder, notes: e.target.value })}
                    />
                  </div>
                </div>

                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => setModalTab('list')}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-submit">
                    Save Reminder
                  </button>
                </div>
              </form>
            )}

            {modalTab === 'list' && (
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setShowFullModal(false)}
                >
                  Close
                </button>
                <button
                  type="button"
                  className="btn-submit"
                  onClick={() => setModalTab('create')}
                >
                  + Add Reminder
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
