import React, { useState, useEffect } from "react";
import emailjs from '@emailjs/browser';
import {
    BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area, LineChart, Line,
    XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid,
    RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from "recharts";
import {
    Users, Calendar, Activity, CheckCircle, AlertTriangle, TrendingUp, TrendingDown,
    Sun, Moon, Download, Filter, Clock, DollarSign, Target, AlertCircle,
    ChevronRight, MessageSquare, Award, FileText, Shield, Search, Bell, LogOut, Send,
    MapPin, Phone, Mail, Briefcase, Star, RefreshCw, Upload, Receipt, Wallet,
    Plus, Eye, Edit, Trash2, Package, Image as ImageIcon, CreditCard, X,
    Check, FileSpreadsheet, TrendingDown as ArrowDown, TrendingUp as ArrowUp
} from "lucide-react";

// ========== CONFIGURATION ==========
const GOOGLE_SHEETS = {
    tasks: process.env.REACT_APP_TASKS_URL,
    team: process.env.REACT_APP_TEAM_URL,
    budget: process.env.REACT_APP_BUDGET_URL,
    materials: process.env.REACT_APP_MATERIALS_URL,
    performance: process.env.REACT_APP_PERFORMANCE_URL,
    photos: process.env.REACT_APP_PHOTOS_URL,
    commentsRead: process.env.REACT_APP_COMMENTS_READ_URL,
    commentsWrite: process.env.REACT_APP_COMMENTS_WRITE_URL,
    invoices: process.env.REACT_APP_INVOICES_URL,
    invoiceAdd: process.env.REACT_APP_INVOICE_ADD_URL,
    photoUpload: process.env.REACT_APP_PHOTO_UPLOAD_URL,
    clientAccount: process.env.REACT_APP_CLIENT_ACCOUNT_URL,
    clientAccountWrite: process.env.REACT_APP_CLIENT_ACCOUNT_WRITE_URL,
    paymentMilestones: process.env.REACT_APP_PAYMENT_MILESTONES_URL || "",
    changeOrders: process.env.REACT_APP_CHANGE_ORDERS_URL || "",
    cashFlow: process.env.REACT_APP_CASH_FLOW_URL || "",
};

const PROJECT = {
    name: "SEC-EOA Ph#3 Project- Jubail North & Jubail Residential Substations",
    client: "Saudi Business Machines ",
    contract: "Ritis 01 24 0953 001 R 05",
    // start: new Date(2025, 2, 1),
    end: new Date(2026, 2, 15),
    totalValue: 1645659
};

const USERS = {
    "Khalid": {
        token: process.env.REACT_APP_ADMIN_TOKEN,  // ← من .env
        name: "Khalid Jehangir",
        position: "Operations Manager",
        department: "Operations",
        role: "ADMIN",
        email: "y.khan@alrammah.com.sa",
        phone: "+966541546402",
        avatar: "/avatars/khalid.jpg",
    },
    "bakri": {
        token: process.env.REACT_APP_PM_TOKEN,  // ← من .env
        name: "Bakri Mohammed",
        position: "Project Manager",
        department: "Project Management",
        role: "PM",
        email: "y.khan@alrammah.com.sa",
        phone: "+966541546402",
        avatar: "/avatars/Bakri.jpg",

    },
    "Rahim": {
        token: process.env.REACT_APP_REPORTER_TOKEN,  // ← من .env
        name: "Rahim Khan",
        position: "Supervisor",
        department: "Operation",
        role: "Reporter",
        email: "viewer@project.com",
        phone: "",
        avatar: "https://ui-avatars.com/api/?name=Rahim+Khan&background=gray&color=fff&size=200"
    }
};

const PERMISSIONS = {
    ADMIN: ["all"],
    PM: ["all"],
    VIEWER: ["view_all"]
};


let sessionTimer;

// Helper: Check if notification was sent recently
const wasNotificationSent = (notificationId, hoursThreshold = 24) => {
    const sentNotifications = JSON.parse(localStorage.getItem('sentNotifications') || '{}');
    const lastSent = sentNotifications[notificationId];

    if (!lastSent) return false;

    const hoursSinceLastSent = (Date.now() - lastSent) / (1000 * 60 * 60);
    return hoursSinceLastSent < hoursThreshold;
};

// Helper: Mark notification as sent
const markNotificationSent = (notificationId) => {
    const sentNotifications = JSON.parse(localStorage.getItem('sentNotifications') || '{}');
    sentNotifications[notificationId] = Date.now();

    // Clean old entries (older than 30 days)
    const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
    Object.keys(sentNotifications).forEach(key => {
        if (sentNotifications[key] < thirtyDaysAgo) {
            delete sentNotifications[key];
        }
    });

    localStorage.setItem('sentNotifications', JSON.stringify(sentNotifications));
};

// Helper: Generate unique ID for notification
const generateNotificationId = (type, identifier, date = null) => {
    const dateStr = date ? new Date(date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0];
    return `${type}-${identifier}-${dateStr}`;
};

export default function App() {
    // Auth
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [loginForm, setLoginForm] = useState({ username: "", password: "" });
    const [loginError, setLoginError] = useState("");

    // UI
    const [emailQueue, setEmailQueue] = useState([]);
    const [isProcessingEmails, setIsProcessingEmails] = useState(false);
    const [view, setView] = useState("Overview");
    const [darkMode, setDarkMode] = useState(false);
    const [loading, setLoading] = useState(true);
    const [autoRefresh, setAutoRefresh] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedSystem, setSelectedSystem] = useState("All");
    const [showFilters, setShowFilters] = useState(false);
    const [filterStatus, setFilterStatus] = useState("All");
    const [filterOwner, setFilterOwner] = useState("All");
    const [modalPhoto, setModalPhoto] = useState(null);

    // Data
    const [tasksData, setTasksData] = useState([]);
    const [teamData, setTeamData] = useState([]);
    const [budgetData, setBudgetData] = useState([]);
    const [materialsData, setMaterialsData] = useState([]);
    const [performanceData, setPerformanceData] = useState([]);
    const [photosData, setPhotosData] = useState([]);
    const [commentsData, setCommentsData] = useState([]);
    const [notifications, setNotifications] = useState([]);
    const [invoicesData, setInvoicesData] = useState([]);
    const [clientAccountData, setClientAccountData] = useState([]);
    const [paymentMilestonesData, setPaymentMilestonesData] = useState([]);
    const [changeOrdersData, setChangeOrdersData] = useState([]);
    const [cashFlowData, setCashFlowData] = useState([]);

    // Forms
    const [newComment, setNewComment] = useState("");
    const [commentPriority, setCommentPriority] = useState("Medium");
    const [submittingComment, setSubmittingComment] = useState(false);
    const [photoUploadForm, setPhotoUploadForm] = useState({ file: null, system: "", description: "" });
    const [uploadingPhoto, setUploadingPhoto] = useState(false);
    const [invoiceForm, setInvoiceForm] = useState({
        invoiceNumber: "",
        vendor: "",
        amount: "",
        category: "",
        issueDate: "",
        dueDate: "",
        status: "Pending",
        description: ""
    });
    const [showInvoiceModal, setShowInvoiceModal] = useState(false);
    const [submittingInvoice, setSubmittingInvoice] = useState(false);

    // Client Account Forms
    const [clientTransactionForm, setClientTransactionForm] = useState({
        type: "invoice", // invoice, payment, adjustment
        amount: "",
        description: "",
        referenceNumber: "",
        date: new Date().toISOString().split('T')[0]
    });
    const [showClientTransactionModal, setShowClientTransactionModal] = useState(false);
    const [submittingClientTransaction, setSubmittingClientTransaction] = useState(false);

    // ========== UTILS ==========
    const parseCSV = (text) => {
        const lines = text.split("\n").filter(l => l.trim());
        if (!lines.length) return [];
        const headers = lines[0].split(",").map(h => h.trim());
        return lines.slice(1).map(line => {
            const values = line.split(",");
            return headers.reduce((obj, header, i) => ({ ...obj, [header]: values[i]?.trim() || "" }), {});
        });
    };

    const hasPermission = (perm) => {
        if (!currentUser) return false;
        return PERMISSIONS[currentUser.role]?.includes(perm) || PERMISSIONS[currentUser.role]?.includes("all");
    };

    // ========== ENHANCED EMAIL SENDER ==========
    const sendEmail = async (type, subject, message, notificationId = null) => {
        // Check if already sent recently
        if (notificationId && wasNotificationSent(notificationId, 24)) {
            console.log(`⏭️ Skipping ${notificationId} - already sent within 24 hours`);
            return false;
        }

        try {
            await emailjs.send(
                process.env.REACT_APP_EMAILJS_SERVICE_ID,
                process.env.REACT_APP_EMAILJS_TEMPLATE_ID,
                {
                    to_email: currentUser?.email || "k.jehangir@alrammah.com.sa",
                    subject: subject,
                    message: message,
                    type: type,
                    project_name: PROJECT.name,
                    timestamp: new Date().toLocaleString()
                },
                process.env.REACT_APP_EMAILJS_PUBLIC_KEY
            );

            console.log(`✅ Email sent: ${subject}`);

            // Mark as sent
            if (notificationId) {
                markNotificationSent(notificationId);
            }

            return true;
        } catch (err) {
            console.error('❌ Email failed:', err);
            return false;
        }
    };


    const formatCurrency = (amount) => {
        return `SAR ${Number(amount || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    };

    // ========== SESSION ==========
    const startSession = () => {
        clearTimeout(sessionTimer);
        sessionTimer = setTimeout(() => {
            handleLogout();
            alert("Session expired due to inactivity");
        }, 30 * 60 * 1000);
    };

    useEffect(() => {
        const reset = () => startSession();
        window.addEventListener("mousemove", reset);
        window.addEventListener("keydown", reset);
        return () => {
            window.removeEventListener("mousemove", reset);
            window.removeEventListener("keydown", reset);
            clearTimeout(sessionTimer);
        };
    }, []);

    useEffect(() => {
        emailjs.init(process.env.REACT_APP_EMAILJS_PUBLIC_KEY);
    }, []);

    useEffect(() => {
        if (budgetData.length || tasksData.length || invoicesData.length) {
            generateNotifications();
        }
    }, [budgetData, tasksData, invoicesData]);

    useEffect(() => {
        const saved = localStorage.getItem("currentUser");
        if (saved) {
            try {
                const userData = JSON.parse(saved);
                setCurrentUser(userData);
                setIsLoggedIn(true);
            } catch (e) {
                console.error("Failed to parse saved user", e);
                localStorage.removeItem("currentUser");
            }
        }
    }, []);

    // ========== DATA FETCHING ==========
    const fetchData = async () => {
        if (!isLoggedIn) return;
        setLoading(true);
        try {
            const fetch1 = async (url, setter, transform = d => d) => {
                if (!url) return;
                try {
                    const res = await fetch(url);
                    const text = await res.text();
                    setter(transform(parseCSV(text)));
                } catch (err) {
                    console.error(`Failed to fetch from ${url}:`, err);
                }
            };

            await Promise.all([
                fetch1(GOOGLE_SHEETS.tasks, setTasksData),
                fetch1(GOOGLE_SHEETS.team, setTeamData),
                fetch1(GOOGLE_SHEETS.budget, setBudgetData, data => data.map(d => ({
                    ...d,
                    allocated: Number(d.allocated) || 0,
                    spent: Number(d.spent) || 0,
                    remaining: Number(d.remaining) || 0
                }))),
                fetch1(GOOGLE_SHEETS.materials, setMaterialsData),
                fetch1(GOOGLE_SHEETS.performance, setPerformanceData, data => data.map(d => ({
                    ...d,
                    productivity: Number(d.productivity) || 0,
                    quality: Number(d.quality) || 0,
                    teamwork: Number(d.teamwork) || 0,
                    reliability: Number(d.reliability) || 0
                }))),
                fetch1(GOOGLE_SHEETS.photos, setPhotosData),
                fetch1(GOOGLE_SHEETS.commentsRead, setCommentsData),
                fetch1(GOOGLE_SHEETS.invoices, setInvoicesData, data => data.map(d => ({
                    ...d,
                    amount: Number(d.amount) || 0
                }))),
                fetch1(GOOGLE_SHEETS.clientAccount, setClientAccountData, data => data.map(d => ({
                    ...d,
                    amount: Number(d.amount) || 0,
                    debit: Number(d.debit) || 0,
                    credit: Number(d.credit) || 0,
                    balance: Number(d.balance) || 0
                }))),
                fetch1(GOOGLE_SHEETS.paymentMilestones, setPaymentMilestonesData),
                fetch1(GOOGLE_SHEETS.changeOrders, setChangeOrdersData),
                fetch1(GOOGLE_SHEETS.cashFlow, setCashFlowData, data => data.map(d => ({
                    ...d,
                    income: Number(d.income) || 0,
                    expenses: Number(d.expenses) || 0
                })))
            ]);

            setTimeout(generateNotifications, 500);
        } catch (err) {
            console.error("Fetch error:", err);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, [isLoggedIn]);

    useEffect(() => {
        if (autoRefresh && isLoggedIn) {
            const int = setInterval(fetchData, 30000);
            return () => clearInterval(int);
        }
    }, [autoRefresh, isLoggedIn]);

    // ========== EMAIL QUEUE PROCESSOR ==========
    const processEmailQueue = async () => {
        if (isProcessingEmails || emailQueue.length === 0) return;

        setIsProcessingEmails(true);

        // Process one email at a time with delay
        for (const emailData of emailQueue) {
            await sendEmail(
                emailData.type,
                emailData.subject,
                emailData.message,
                emailData.notificationId
            );

            // Delay between emails to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 1000));
        }

        setEmailQueue([]);
        setIsProcessingEmails(false);
    };

    // Process queue when it changes
    useEffect(() => {
        if (emailQueue.length > 0 && !isProcessingEmails) {
            processEmailQueue();
        }
    }, [emailQueue, isProcessingEmails]);

    // ========== SMART NOTIFICATIONS ==========

    const generateNotifications = () => {
        const notifs = [];
        const emailsToSend = [];
        const today = new Date();

        console.log('🔔 Generating notifications...');

        // ========== BUDGET ALERTS ==========
        budgetData.forEach(item => {
            if (item.allocated > 0) {
                const pct = (item.spent / item.allocated) * 100;

                // Alert at 80%, 90%, 95%
                let shouldAlert = false;
                let alertLevel = '';

                if (pct >= 95) {
                    shouldAlert = true;
                    alertLevel = 'CRITICAL-95';
                } else if (pct >= 90) {
                    shouldAlert = true;
                    alertLevel = 'HIGH-90';
                } else if (pct >= 80) {
                    shouldAlert = true;
                    alertLevel = 'WARNING-80';
                }

                if (shouldAlert) {
                    const notifId = generateNotificationId('budget', `${item.name}-${alertLevel}`);

                    notifs.push({
                        id: notifId,
                        type: pct >= 95 ? "error" : pct >= 90 ? "warning" : "info",
                        message: `${pct >= 95 ? '🚨' : '⚠️'} Budget: ${item.name} at ${pct.toFixed(0)}%`,
                        time: "now",
                        priority: pct >= 95 ? "critical" : pct >= 90 ? "high" : "medium"
                    });

                    // Only send email if not sent in last 24 hours
                    if (!wasNotificationSent(notifId, 24)) {
                        emailsToSend.push({
                            type: 'budget',
                            subject: `${pct >= 95 ? '🚨 CRITICAL' : '⚠️'} Budget Alert: ${item.name}`,
                            message: `
Budget Category: ${item.name}
Allocated: SAR ${item.allocated.toLocaleString()}
Spent: SAR ${item.spent.toLocaleString()} (${pct.toFixed(1)}%)
Remaining: SAR ${(item.allocated - item.spent).toLocaleString()}

${pct >= 95 ? '⚡ IMMEDIATE ACTION REQUIRED!' : pct >= 90 ? '⚠️ Action needed soon' : '📊 Monitor closely'}

Project: ${PROJECT.name}
Time: ${new Date().toLocaleString()}
`,
                            notificationId: notifId
                        });
                    }
                }
            }
        });

        // ========== TASK DEADLINES ==========
        tasksData.forEach(task => {
            if (task.deadlineDate && task.status !== "Completed") {
                const deadline = new Date(task.deadlineDate);
                const diffDays = Math.ceil((deadline - today) / (1000 * 60 * 60 * 24));

                // Alert for tasks due in 7, 3, 1 days or overdue
                if (diffDays <= 7 && diffDays >= 0) {
                    const notifId = generateNotificationId('task-due', task.id, task.deadlineDate);

                    notifs.push({
                        id: notifId,
                        type: diffDays <= 1 ? "error" : "warning",
                        message: `⏰ Task "${task.subTask || task.system}" due in ${diffDays} day${diffDays !== 1 ? 's' : ''}`,
                        time: "now",
                        priority: diffDays <= 1 ? "high" : "medium"
                    });

                    // Send email for critical deadlines (1, 3, 7 days)
                    if ([1, 3, 7].includes(diffDays) && !wasNotificationSent(notifId, 24)) {
                        emailsToSend.push({
                            type: 'task-deadline',
                            subject: `⏰ Task Due ${diffDays === 1 ? 'TOMORROW' : `in ${diffDays} days`}`,
                            message: `
Task: ${task.subTask || task.system}
System: ${task.system}
Assigned to: ${task.assigned_to}
Deadline: ${new Date(task.deadlineDate).toLocaleDateString()}
Days remaining: ${diffDays}
Status: ${task.status}

${diffDays === 1 ? '⚡ DUE TOMORROW - URGENT!' : `📅 ${diffDays} days left`}

Project: ${PROJECT.name}
`,
                            notificationId: notifId
                        });
                    }
                } else if (diffDays < 0) {
                    const notifId = generateNotificationId('task-overdue', task.id, task.deadlineDate);

                    notifs.push({
                        id: notifId,
                        type: "error",
                        message: `🚨 OVERDUE: "${task.subTask || task.system}" by ${Math.abs(diffDays)} day${Math.abs(diffDays) !== 1 ? 's' : ''}`,
                        time: "now",
                        priority: "critical"
                    });

                    // Send overdue email daily
                    if (!wasNotificationSent(notifId, 24)) {
                        emailsToSend.push({
                            type: 'task-overdue',
                            subject: `🚨 OVERDUE TASK: ${task.subTask || task.system}`,
                            message: `
⚠️ TASK OVERDUE ALERT

Task: ${task.subTask || task.system}
System: ${task.system}
Assigned to: ${task.assigned_to}
Was due: ${new Date(task.deadlineDate).toLocaleDateString()}
Overdue by: ${Math.abs(diffDays)} day${Math.abs(diffDays) !== 1 ? 's' : ''}
Current status: ${task.status}

🚨 IMMEDIATE ACTION REQUIRED!

Project: ${PROJECT.name}
`,
                            notificationId: notifId
                        });
                    }
                }
            }
        });

        // ========== INVOICE ALERTS ==========
        invoicesData.forEach(invoice => {
            if (invoice.status === "Pending" && invoice.dueDate) {
                const dueDate = new Date(invoice.dueDate);
                const diffDays = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));

                if (diffDays <= 7 && diffDays >= 0) {
                    const notifId = generateNotificationId('invoice-due', invoice.invoiceNumber, invoice.dueDate);

                    notifs.push({
                        id: notifId,
                        type: diffDays <= 3 ? "warning" : "info",
                        message: `💰 Invoice ${invoice.invoiceNumber} due in ${diffDays} day${diffDays !== 1 ? 's' : ''}`,
                        time: "now",
                        priority: diffDays <= 3 ? "high" : "medium"
                    });

                    // Email at 7, 3, 1 days
                    if ([1, 3, 7].includes(diffDays) && !wasNotificationSent(notifId, 24)) {
                        emailsToSend.push({
                            type: 'invoice',
                            subject: `💰 Invoice Due ${diffDays === 1 ? 'Tomorrow' : `in ${diffDays} days`}`,
                            message: `
Invoice: ${invoice.invoiceNumber}
Vendor: ${invoice.vendor}
Amount: SAR ${Number(invoice.amount).toLocaleString()}
Category: ${invoice.category}
Due Date: ${new Date(invoice.dueDate).toLocaleDateString()}
Days remaining: ${diffDays}

${diffDays === 1 ? '⚡ Payment due tomorrow!' : `📅 ${diffDays} days to payment`}

Project: ${PROJECT.name}
`,
                            notificationId: notifId
                        });
                    }
                } else if (diffDays < 0) {
                    const notifId = generateNotificationId('invoice-overdue', invoice.invoiceNumber, invoice.dueDate);

                    notifs.push({
                        id: notifId,
                        type: "error",
                        message: `🚨 Invoice ${invoice.invoiceNumber} overdue by ${Math.abs(diffDays)} day${Math.abs(diffDays) !== 1 ? 's' : ''}`,
                        time: "now",
                        priority: "critical"
                    });

                    // Daily overdue reminder
                    if (!wasNotificationSent(notifId, 24)) {
                        emailsToSend.push({
                            type: 'invoice-overdue',
                            subject: `🚨 OVERDUE INVOICE: ${invoice.invoiceNumber}`,
                            message: `
⚠️ OVERDUE PAYMENT ALERT

Invoice: ${invoice.invoiceNumber}
Vendor: ${invoice.vendor}
Amount: SAR ${Number(invoice.amount).toLocaleString()}
Was due: ${new Date(invoice.dueDate).toLocaleDateString()}
Overdue by: ${Math.abs(diffDays)} day${Math.abs(diffDays) !== 1 ? 's' : ''}

🚨 PAYMENT REQUIRED URGENTLY!

Project: ${PROJECT.name}
`,
                            notificationId: notifId
                        });
                    }
                }
            }
        });

        // ========== NEW COMMENT ALERT ==========
        // Check for new comments in last hour
        const oneHourAgo = Date.now() - (60 * 60 * 1000);
        const recentComments = commentsData.filter(comment => {
            if (comment.timestamp) {
                const commentTime = new Date(comment.timestamp).getTime();
                return commentTime > oneHourAgo;
            }
            return false;
        });

        recentComments.forEach(comment => {
            const notifId = generateNotificationId('comment', comment.timestamp);

            notifs.push({
                id: notifId,
                type: "info",
                message: `💬 New comment from ${comment.username}: ${comment.comment.substring(0, 50)}...`,
                time: "now",
                priority: comment.priority === "High" ? "high" : "low"
            });

            // Send email for high priority comments only
            if (comment.priority === "High" && !wasNotificationSent(notifId, 1)) {
                emailsToSend.push({
                    type: 'comment',
                    subject: `💬 New High Priority Comment`,
                    message: `
New Comment Posted:

From: ${comment.username} (${comment.position})
Department: ${comment.department}
Priority: ${comment.priority}

Comment:
"${comment.comment}"

Time: ${comment.timestamp}
Project: ${PROJECT.name}
`,
                    notificationId: notifId
                });
            }
        });

        // ========== MATERIALS DELIVERY PENDING ==========
        const pendingMaterials = materialsData.filter(m => m.delivery_status !== "Delivered");
        if (pendingMaterials.length > 0) {
            const notifId = generateNotificationId('materials-pending', today.toISOString().split('T')[0]);

            notifs.push({
                id: notifId,
                type: "info",
                message: `📦 ${pendingMaterials.length} material${pendingMaterials.length !== 1 ? 's' : ''} pending delivery`,
                time: "now",
                priority: "low"
            });

            // Weekly reminder (every Monday)
            if (today.getDay() === 1 && !wasNotificationSent(notifId, 168)) { // 168 hours = 1 week
                const systemSummary = {};
                pendingMaterials.forEach(m => {
                    if (!systemSummary[m.system]) {
                        systemSummary[m.system] = 0;
                    }
                    systemSummary[m.system]++;
                });

                const summaryText = Object.entries(systemSummary)
                    .map(([system, count]) => `  - ${system}: ${count} item${count !== 1 ? 's' : ''}`)
                    .join('\n');

                emailsToSend.push({
                    type: 'materials',
                    subject: '📦 Weekly Materials Status Update',
                    message: `
Pending Materials Summary:

Total pending: ${pendingMaterials.length} items

By System:
${summaryText}

Please coordinate with suppliers for delivery updates.

Project: ${PROJECT.name}
`,
                    notificationId: notifId
                });
            }
        }

        // Update notifications state
        setNotifications(notifs);

        // Queue emails for sending
        if (emailsToSend.length > 0) {
            console.log(`📧 Queuing ${emailsToSend.length} email(s) for sending...`);
            setEmailQueue(prev => [...prev, ...emailsToSend]);
        } else {
            console.log('✅ No new emails to send');
        }
    };

    // ========== MODIFIED USEEFFECTS ==========

    // Initialize EmailJS once
    useEffect(() => {
        emailjs.init(process.env.REACT_APP_EMAILJS_PUBLIC_KEY);
    }, []);

    // Generate notifications ONLY when data changes AND user is logged in
    useEffect(() => {
        if (isLoggedIn && (budgetData.length || tasksData.length || invoicesData.length)) {
            // Debounce to avoid multiple calls
            const timer = setTimeout(() => {
                generateNotifications();
            }, 1000);

            return () => clearTimeout(timer);
        }
    }, [budgetData, tasksData, invoicesData, commentsData, materialsData, isLoggedIn]);
    // ========== AUTH ==========

    /**
     * دالة تسجيل الدخول
     * تعتمد على مقارنة المدخلات بالبيانات المخزنة في كائن USERS
     * والتي تستمد قيمها الآن من ملف .env.local
     */
    const handleLogin = () => {
        // console.log("الPassword القادم من الملف هو:", process.env.REACT_APP_BAKRI_PASS);
        // 1. تصفية الأخطاء السابقة
        setLoginError("");

        // 2. البحث عن المستخدم في الكائن
        const user = USERS[loginForm.username];

        // 3. التحقق من صحة البيانات
        // نتحقق من وجود المستخدم، ووجود التوكن، ومطابقته لما كتبه المستخدم
        if (user && user.token && user.token === loginForm.password) {

            // تجهيز بيانات المستخدم للجلسة (بدون كلمة المرور لزيادة الأمان)
            const userData = {
                username: loginForm.username,
                name: user.name,
                role: user.role,
                department: user.department,
                position: user.position,
                avatar: user.avatar,
                // لا نضع الـ token هنا إلا إذا كنت تحتاجه فعلياً في مكان آخر
            };

            // 4. تحديث حالة التطبيق
            setCurrentUser(userData);
            setIsLoggedIn(true);

            // 5. بدء الجلسة وتخزين البيانات محلياً
            if (typeof startSession === 'function') startSession();
            localStorage.setItem("currentUser", JSON.stringify(userData));

        } else {
            // 6. في حال فشل الدخول
            setLoginError("Invalid username or password");
        }
    };

    /**
     * دالة تسجيل الخروج
     * تقوم بتنظيف كافة البيانات المخزنة وإنهاء الجلسة
     */
    const handleLogout = () => {
        setIsLoggedIn(false);
        setCurrentUser(null);

        // تنظيف البيانات المحلية
        localStorage.removeItem("currentUser");

        // إعادة تعيين نموذج الدخول
        setLoginForm({ username: "", password: "" });

        // إيقاف أي مؤقت جلسة نشط
        if (typeof sessionTimer !== 'undefined') {
            clearTimeout(sessionTimer);
        }
    };

    // ========== ACTIONS ==========
    const submitComment = async () => {
        if (!newComment.trim()) return;
        setSubmittingComment(true);

        try {
            const params = new URLSearchParams();
            params.append('username', currentUser.name);
            params.append('position', currentUser.position);
            params.append('comment', newComment);
            params.append('department', currentUser.department);
            params.append('avatar', currentUser.avatar);
            params.append('priority', commentPriority);

            await fetch(GOOGLE_SHEETS.commentsWrite, {
                method: 'POST',
                mode: 'no-cors',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: params.toString()
            });

            alert("Comment submitted successfully!");
            setNewComment("");
            setTimeout(fetchData, 2000);
        } catch (err) {
            console.error(err);
            alert("Failed to submit comment");
        } finally {
            setSubmittingComment(false);
        }
    };

    const uploadPhoto = async () => {
        if (!photoUploadForm.file || !photoUploadForm.system) {
            alert("Please select a file and system");
            return;
        }

        if (!GOOGLE_SHEETS.photoUpload) {
            alert("Photo upload URL is missing!");
            return;
        }

        setUploadingPhoto(true);

        try {
            const reader = new FileReader();

            reader.onload = async (e) => {
                try {
                    const base64Data = e.target.result.split(',')[1];

                    await fetch(GOOGLE_SHEETS.photoUpload, {
                        method: 'POST',
                        mode: 'no-cors',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            fileData: base64Data,
                            fileName: photoUploadForm.file.name,
                            mimeType: photoUploadForm.file.type,
                            system: photoUploadForm.system,
                            description: photoUploadForm.description || "No description",
                            uploadedBy: currentUser.name,
                            timestamp: new Date().toISOString()
                        })
                    });

                    alert("Photo uploaded successfully!");
                    setPhotoUploadForm({ file: null, system: "", description: "" });

                    setTimeout(() => {
                        fetchData();
                        setUploadingPhoto(false);
                    }, 2000);

                } catch (innerErr) {
                    console.error("Fetch error:", innerErr);
                    alert("Upload failed. Check your internet connection.");
                    setUploadingPhoto(false);
                }
            };

            reader.onerror = () => {
                alert("Error reading file");
                setUploadingPhoto(false);
            };

            reader.readAsDataURL(photoUploadForm.file);

        } catch (err) {
            console.error("Photo upload error:", err);
            alert("An unexpected error occurred.");
            setUploadingPhoto(false);
        }
    };

    const addInvoice = async () => {
        // Validate all required fields
        if (!invoiceForm.invoiceNumber || !invoiceForm.vendor || !invoiceForm.amount ||
            !invoiceForm.category || !invoiceForm.issueDate || !invoiceForm.dueDate) {
            alert("Please fill all required fields");
            return;
        }

        setSubmittingInvoice(true);
        try {
            const params = new URLSearchParams();
            params.append('invoiceNumber', invoiceForm.invoiceNumber);
            params.append('vendor', invoiceForm.vendor);
            params.append('amount', invoiceForm.amount);
            params.append('category', invoiceForm.category);
            params.append('issueDate', invoiceForm.issueDate);
            params.append('dueDate', invoiceForm.dueDate);
            params.append('status', invoiceForm.status);
            params.append('description', invoiceForm.description || '');
            params.append('addedBy', currentUser.name);
            params.append('timestamp', new Date().toISOString());

            await fetch(GOOGLE_SHEETS.invoiceAdd, {
                method: 'POST',
                mode: 'no-cors',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: params.toString()
            });

            alert("Invoice added successfully!");
            setShowInvoiceModal(false);
            setInvoiceForm({
                invoiceNumber: "",
                vendor: "",
                amount: "",
                category: "",
                issueDate: "",
                dueDate: "",
                status: "Pending",
                description: ""
            });
            setTimeout(fetchData, 2000);
        } catch (err) {
            console.error("Invoice submission error:", err);
            alert("Failed to add invoice. Please try again.");
        }
        setSubmittingInvoice(false);
    };

    const addClientTransaction = async () => {
        if (!clientTransactionForm.amount || !clientTransactionForm.description) {
            alert("Please fill all required fields");
            return;
        }

        setSubmittingClientTransaction(true);
        try {
            const params = new URLSearchParams();
            params.append('type', clientTransactionForm.type);
            params.append('amount', clientTransactionForm.amount);
            params.append('description', clientTransactionForm.description);
            params.append('referenceNumber', clientTransactionForm.referenceNumber || '');
            params.append('date', clientTransactionForm.date);
            params.append('addedBy', currentUser.name);
            params.append('timestamp', new Date().toISOString());

            await fetch(GOOGLE_SHEETS.clientAccountWrite, {
                method: 'POST',
                mode: 'no-cors',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: params.toString()
            });

            alert("Transaction added successfully!");
            setShowClientTransactionModal(false);
            setClientTransactionForm({
                type: "invoice",
                amount: "",
                description: "",
                referenceNumber: "",
                date: new Date().toISOString().split('T')[0]
            });
            setTimeout(fetchData, 2000);
        } catch (err) {
            console.error("Client transaction error:", err);
            alert("Failed to add transaction. Please try again.");
        }
        setSubmittingClientTransaction(false);
    };

    // ========== HELPER: GET TEAM MEMBER INFO ==========
    const getTeamMemberInfo = (username) => {
        const userInfo = Object.values(USERS).find(u => u.name === username);
        if (userInfo) return userInfo;

        const teamMember = teamData.find(t => t.name === username);
        if (teamMember) {
            return {
                name: teamMember.name,
                position: teamMember.role || "Team Member",
                department: teamMember.department || "Project Team",
                avatar: teamMember.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(teamMember.name)}&background=random&color=fff&size=200`,
                email: teamMember.email,
                phone: teamMember.phone
            };
        }

        return {
            name: username,
            position: "Team Member",
            department: "Project Team",
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(username)}&background=random&color=fff&size=200`,
            email: "",
            phone: ""
        };
    };

    // ========== STATS ==========
    const stats = {
        totalTasks: tasksData.length,
        completed: tasksData.filter(t => t.status === "Completed").length,
        inProgress: tasksData.filter(t => t.status === "In Progress").length,
        pending: tasksData.filter(t => t.status === "Pending" || t.status === "Not Started").length,
        avgProgress: tasksData.length ? Math.round((tasksData.filter(t => t.status === "Completed").length / tasksData.length) * 100) : 0,
        totalBudget: budgetData.reduce((s, c) => s + c.allocated, 0),
        totalSpent: budgetData.reduce((s, c) => s + c.spent, 0),
        daysLeft: Math.ceil((PROJECT.end - new Date()) / 86400000),
        invoicesTotal: invoicesData.reduce((s, i) => s + (Number(i.amount) || 0), 0),
        invoicesPaid: invoicesData.filter(i => i.status === "Paid").length,
        invoicesPending: invoicesData.filter(i => i.status === "Pending").length,
        changeOrdersTotal: changeOrdersData.reduce((s, c) => s + (Number(c.amount) || 0), 0),
        clientBalance: clientAccountData.length > 0 ? clientAccountData[clientAccountData.length - 1].balance : 0,
        totalInvoiced: clientAccountData.filter(t => t.type === "invoice").reduce((s, t) => s + Number(t.debit || 0), 0),

        totalReceived: clientAccountData.filter(t => t.type === "payment").reduce((s, t) => s + Number(t.credit || 0), 0),

    };

    const theme = darkMode
        ? { bg: "bg-gray-900", card: "bg-gray-800", text: "text-gray-100", border: "border-gray-700", hover: "hover:bg-gray-700" }
        : { bg: "bg-gradient-to-br from-gray-50 to-blue-50", card: "bg-white", text: "text-gray-900", border: "border-gray-200", hover: "hover:bg-gray-50" };

    // ========== COMPONENTS ==========
    const StatCard = ({ icon: Icon, title, value, subtitle, color, trend }) => (
        <div className={`${theme.card} rounded-xl p-6 shadow-lg border ${theme.border} hover:scale-105 transition-all cursor-pointer`}>
            <div className="flex justify-between mb-4">
                <div className={`p-3 rounded-lg bg-gradient-to-br ${color}`}>
                    <Icon className="text-white" size={24} />
                </div>
                {trend && (
                    <span className={`text-sm font-bold ${trend.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
                        {trend.startsWith('+') ? <TrendingUp size={14} className="inline" /> : <TrendingDown size={14} className="inline" />}
                        {trend}
                    </span>
                )}
            </div>
            <h3 className="text-gray-500 text-sm font-medium uppercase">{title}</h3>
            <p className={`text-3xl font-bold ${theme.text}`}>{value}</p>
            {subtitle && <p className="text-gray-400 text-xs mt-1">{subtitle}</p>}
        </div>
    );

    const SystemHealthCard = ({ system, total, completed, progress }) => (
        <div className={`${theme.card} rounded-xl p-4 border ${theme.border} hover:shadow-lg transition-all`}>
            <div className="flex justify-between items-center mb-3">
                <h4 className="font-bold text-sm">{system}</h4>
                <span className="text-lg font-bold text-blue-600">{progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all" style={{ width: `${progress}%` }} />
            </div>
            <div className="flex justify-between text-xs text-gray-500">
                <span>✓ {completed}</span>
                <span>Total {total}</span>
            </div>
        </div>
    );

    // ========== LOGIN SCREEN ==========
    if (!isLoggedIn) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
                    <div className="text-center mb-8">
                        <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                            <Shield className="text-white" size={40} />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">Project Dashboard</h1>
                        <p className="text-gray-600 text-sm">{PROJECT.name}</p>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-2 text-gray-700">Username</label>
                            <input
                                type="text"
                                value={loginForm.username}
                                onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                placeholder="Enter username"
                                autoComplete="username"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2 text-gray-700">Password</label>
                            <input
                                type="password"
                                value={loginForm.password}
                                onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                                placeholder="Enter password"
                                autoComplete="current-password"
                            />
                        </div>
                        {loginError && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center gap-2">
                                <AlertCircle size={20} />
                                <span className="text-sm">{loginError}</span>
                            </div>
                        )}
                        <button
                            onClick={handleLogin}
                            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transform hover:scale-[1.02] transition-all"
                        >
                            Login
                        </button>
                    </div>
                    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-600 font-semibold mb-2"></p>
                        <div className="space-y-1 text-xs text-gray-700">
                            <p> <span className="font-mono bg-white px-2 py-0.5 rounded"></span></p>
                            <p><span className="font-mono bg-white px-2 py-0.5 rounded"></span></p>
                            <p><span className="font-mono bg-white px-2 py-0.5 rounded"></span></p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-20 h-20 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-2xl font-bold text-white mb-2">Loading Dashboard...</p>
                    <p className="text-white/80 text-sm">Fetching latest data from Google Sheets</p>
                </div>
            </div>
        );
    }

    // Calculate system health for overview
    const systemsHealth = [...new Set(tasksData.map(t => t.system))].filter(Boolean).map(sys => {
        const sysTasks = tasksData.filter(t => t.system === sys);
        const completed = sysTasks.filter(t => t.status === "Completed").length;
        return {
            system: sys,
            total: sysTasks.length,
            completed,
            progress: sysTasks.length ? Math.round((completed / sysTasks.length) * 100) : 0
        };
    });
    //console.log(process.env.REACT_APP_KHALID_PHOTO)

    // ========== MAIN DASHBOARD ==========
    return (

        <div className={`min-h-screen ${theme.bg} ${theme.text}`}>
            {/* HEADER */}
            <div className={`${theme.card} border-b ${theme.border} sticky top-0 z-40 shadow-lg`}>
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                                <Activity className="text-white" size={24} />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold">{PROJECT.name}</h1>
                                <p className="text-sm text-gray-500">{PROJECT.client}</p>
                            </div>
                        </div>


                        <div className="flex items-center gap-3">
                            <button
                                onClick={() => setAutoRefresh(!autoRefresh)}
                                className={`p-2 rounded-lg ${autoRefresh ? 'bg-green-500 text-white' : 'bg-gray-200'}`}
                                title="Auto-refresh every 30s"
                            >
                                <RefreshCw size={20} className={autoRefresh ? 'animate-spin' : ''} />
                            </button>

                            <div className="relative">
                                <button
                                    onClick={() => setShowNotifications(!showNotifications)}
                                    className="p-2 rounded-lg bg-gray-200 relative"
                                >
                                    <Bell size={20} />
                                    {notifications.length > 0 && (
                                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                            {notifications.length}
                                        </span>
                                    )}
                                </button>

                                {showNotifications && (
                                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border max-h-96 overflow-y-auto">
                                        <div className="p-4 border-b">
                                            <h3 className="font-bold">Notifications</h3>
                                        </div>
                                        {notifications.length === 0 ? (
                                            <div className="p-4 text-center text-gray-500">
                                                No notifications
                                            </div>
                                        ) : (
                                            <div className="divide-y">
                                                {notifications.map(notif => (
                                                    <div key={notif.id} className={`p-4 ${notif.priority === 'high' ? 'bg-red-50' : ''}`}>
                                                        <p className="text-sm">{notif.message}</p>
                                                        <p className="text-xs text-gray-400 mt-1">{notif.time}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            <button onClick={() => setDarkMode(!darkMode)} className="p-2 rounded-lg bg-gray-200">
                                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
                            </button>

                            <div className="flex items-center gap-3 border-l pl-3">


                                <img src={currentUser.avatar} alt={currentUser.name} className="w-10 h-10 rounded-full" />
                                <div className="text-sm">
                                    <p className="font-semibold">{currentUser.name}</p>
                                    <p className="text-xs text-gray-500">{currentUser.position}</p>
                                </div>
                                <button onClick={handleLogout} className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200">
                                    <LogOut size={18} />
                                </button>
                            </div>
                        </div>
                    </div>
                    <div>



                    </div>

                    {/* NAVIGATION */}
                    <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
                        {["Overview", "Tasks", "Team", "Budget", "Materials", "Photos", "Invoices", "Client Account", "Comments"].map(v => (
                            <button
                                key={v}
                                onClick={() => setView(v)}
                                className={`px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition-all ${view === v
                                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                                    : `${theme.card} ${theme.hover}`
                                    }`}
                            >
                                {v}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* CONTENT */}
            <div className="max-w-7xl mx-auto px-4 py-6">
                {/* OVERVIEW */}
                {view === "Overview" && (
                    <div className="space-y-6">
                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <StatCard
                                icon={CheckCircle}
                                title="Tasks Completed"
                                value={`${stats.completed}/${stats.totalTasks}`}
                                subtitle={`${stats.avgProgress}% Progress`}
                                color="from-green-400 to-emerald-600"
                                trend={`+${stats.avgProgress}%`}
                            />
                            <StatCard
                                icon={Activity}
                                title="In Progress"
                                value={stats.inProgress}
                                subtitle={`${stats.pending} Pending`}
                                color="from-blue-400 to-blue-600"
                            />
                            <StatCard
                                icon={DollarSign}
                                title="Budget Spent"
                                value={formatCurrency(stats.totalSpent)}
                                subtitle={`of ${formatCurrency(stats.totalBudget)}`}
                                color="from-purple-400 to-purple-600"
                                trend={`${Math.round((stats.totalSpent / stats.totalBudget) * 100)}%`}
                            />
                            <StatCard
                                icon={Calendar}
                                title="Days Remaining"
                                value={stats.daysLeft}
                                subtitle={`Until ${PROJECT.end.toLocaleDateString()}`}
                                color="from-orange-400 to-red-600"
                            />
                            <StatCard
                                icon={Receipt}
                                title="Total Invoices"
                                value={formatCurrency(stats.invoicesTotal)}
                                subtitle={`${stats.invoicesPaid} Paid, ${stats.invoicesPending} Pending`}
                                color="from-cyan-400 to-cyan-600"
                            />
                            <StatCard
                                icon={Wallet}
                                title="Client Balance"
                                value={formatCurrency(stats.clientBalance)}
                                subtitle={`${stats.clientBalance >= 0 ? 'Credit' : 'Debit'}`}
                                color={stats.clientBalance >= 0 ? "from-green-400 to-green-600" : "from-red-400 to-red-600"}
                                trend={stats.clientBalance >= 0 ? '+' : '-'}
                            />
                            <StatCard
                                icon={TrendingUp}
                                title="Total Invoiced"
                                value={formatCurrency(stats.totalInvoiced)}
                                subtitle="To client"
                                color="from-indigo-400 to-indigo-600"
                            />
                            <StatCard
                                icon={TrendingDown}
                                title="Total Received"
                                value={formatCurrency(stats.totalReceived)}
                                subtitle="From client"
                                color="from-teal-400 to-teal-600"
                            />
                        </div>

                        {/* Systems Health */}
                        <div className={`${theme.card} rounded-xl p-6 shadow-lg border ${theme.border}`}>
                            <h2 className="text-2xl font-bold mb-6">Systems Health</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {systemsHealth.map(sys => (
                                    <SystemHealthCard key={sys.system} {...sys} />
                                ))}
                            </div>
                        </div>

                        {/* Budget Overview Chart */}
                        <div className={`${theme.card} rounded-xl p-6 shadow-lg border ${theme.border}`}>
                            <h2 className="text-2xl font-bold mb-6">Budget Overview</h2>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={budgetData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip formatter={(value) => formatCurrency(value)} />
                                    <Legend />
                                    <Bar dataKey="allocated" fill="#3b82f6" name="Allocated" />
                                    <Bar dataKey="spent" fill="#8b5cf6" name="Spent" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                )}

                {/* BUDGET */}
                {view === "Budget" && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className={`${theme.card} p-6 rounded-xl shadow-lg border ${theme.border}`}>
                                <h3 className="text-sm text-gray-500 mb-1">Total Budget</h3>
                                <p className="text-3xl font-bold text-blue-600">SAR {stats.totalBudget.toLocaleString()}</p>
                            </div>
                            <div className={`${theme.card} p-6 rounded-xl shadow-lg border ${theme.border}`}>
                                <h3 className="text-sm text-gray-500 mb-1">Total Spent</h3>
                                <p className="text-3xl font-bold text-red-500">SAR {stats.totalSpent.toLocaleString()}</p>
                            </div>
                            <div className={`${theme.card} p-6 rounded-xl shadow-lg border ${theme.border}`}>
                                <h3 className="text-sm text-gray-500 mb-1">Remaining</h3>
                                <p className="text-3xl font-bold text-green-600">SAR {(stats.totalBudget - stats.totalSpent).toLocaleString()}</p>
                            </div>
                        </div>

                        <div className={`${theme.card} rounded-xl shadow-lg border ${theme.border} overflow-x-auto`}>
                            <table className="w-full">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="px-4 py-3 text-left">Category</th>
                                        <th className="px-4 py-3 text-right">Allocated</th>
                                        <th className="px-4 py-3 text-right">Spent</th>
                                        <th className="px-4 py-3 text-right">Remaining</th>
                                        <th className="px-4 py-3 text-center">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {budgetData.map((item, i) => {
                                        const pct = (item.spent / item.allocated) * 100;
                                        return (
                                            <tr key={i} className="border-b hover:bg-gray-50">
                                                <td className="px-4 py-3 font-medium">{item.name}</td>
                                                <td className="px-4 py-3 text-right">SAR {item.allocated.toLocaleString()}</td>
                                                <td className="px-4 py-3 text-right text-red-600">SAR {item.spent.toLocaleString()}</td>
                                                <td className="px-4 py-3 text-right font-semibold text-green-600">
                                                    SAR {(item.allocated - item.spent).toLocaleString()}
                                                </td>
                                                <td className="px-4 py-3 text-center">
                                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${pct >= 90 ? "bg-red-100 text-red-700" : pct >= 80 ? "bg-orange-100 text-orange-700" : "bg-green-100 text-green-700"
                                                        }`}>
                                                        {pct.toFixed(0)}%
                                                    </span>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}


                {/* INVOICES */}
                {view === "Invoices" && (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h2 className="text-3xl font-bold">Invoices Management</h2>
                            {hasPermission('all') && (
                                <button
                                    onClick={() => setShowInvoiceModal(true)}
                                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold flex items-center gap-2 hover:shadow-lg"
                                >
                                    <Plus size={20} />
                                    Add Invoice
                                </button>
                            )}
                        </div>

                        {/* Invoices Table */}
                        <div className={`${theme.card} rounded-xl shadow-lg border ${theme.border} overflow-hidden`}>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                                        <tr>
                                            <th className="px-6 py-4 text-left font-semibold">Invoice #</th>
                                            <th className="px-6 py-4 text-left font-semibold">Vendor</th>
                                            <th className="px-6 py-4 text-left font-semibold">Category</th>
                                            <th className="px-6 py-4 text-right font-semibold">Amount</th>
                                            <th className="px-6 py-4 text-left font-semibold">Issue Date</th>
                                            <th className="px-6 py-4 text-left font-semibold">Due Date</th>
                                            <th className="px-6 py-4 text-center font-semibold">Status</th>
                                            <th className="px-6 py-4 text-left font-semibold">Description</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {invoicesData.length === 0 ? (
                                            <tr>
                                                <td colSpan="8" className="px-6 py-12 text-center text-gray-500">
                                                    No invoices found. Click "Add Invoice" to create one.
                                                </td>
                                            </tr>
                                        ) : (
                                            invoicesData.map((invoice, i) => (
                                                <tr key={i} className={theme.hover}>
                                                    <td className="px-6 py-4 font-mono text-sm">{invoice.invoiceNumber}</td>
                                                    <td className="px-6 py-4">{invoice.vendor}</td>
                                                    <td className="px-6 py-4">
                                                        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
                                                            {invoice.category}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-right font-bold">{formatCurrency(invoice.amount)}</td>
                                                    <td className="px-6 py-4 text-sm text-gray-600">{invoice.issueDate}</td>
                                                    <td className="px-6 py-4 text-sm text-gray-600">{invoice.dueDate}</td>
                                                    <td className="px-6 py-4 text-center">
                                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${invoice.status === "Paid"
                                                            ? "bg-green-100 text-green-800"
                                                            : invoice.status === "Pending"
                                                                ? "bg-yellow-100 text-yellow-800"
                                                                : "bg-red-100 text-red-800"
                                                            }`}>
                                                            {invoice.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-600">{invoice.description || '-'}</td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                    <tfoot className="bg-gray-50">
                                        <tr>
                                            <td colSpan="3" className="px-6 py-4 font-bold text-right">Total:</td>
                                            <td className="px-6 py-4 text-right font-bold text-lg">{formatCurrency(stats.invoicesTotal)}</td>
                                            <td colSpan="4"></td>
                                        </tr>
                                    </tfoot>
                                </table>
                            </div>
                        </div>

                        {/* Invoice Summary Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className={`${theme.card} rounded-xl p-6 shadow-lg border ${theme.border}`}>
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-green-100 rounded-lg">
                                        <Check className="text-green-600" size={24} />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 uppercase">Paid Invoices</p>
                                        <p className="text-2xl font-bold">{stats.invoicesPaid}</p>
                                    </div>
                                </div>
                            </div>
                            <div className={`${theme.card} rounded-xl p-6 shadow-lg border ${theme.border}`}>
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-yellow-100 rounded-lg">
                                        <Clock className="text-yellow-600" size={24} />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 uppercase">Pending Invoices</p>
                                        <p className="text-2xl font-bold">{stats.invoicesPending}</p>
                                    </div>
                                </div>
                            </div>
                            <div className={`${theme.card} rounded-xl p-6 shadow-lg border ${theme.border}`}>
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-blue-100 rounded-lg">
                                        <DollarSign className="text-blue-600" size={24} />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 uppercase">Total Amount</p>
                                        <p className="text-2xl font-bold">{formatCurrency(stats.invoicesTotal)}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                {/* TASKS */}
                {view === "Tasks" && (
                    <div className="space-y-6">
                        {/* Filters */}
                        <div className={`${theme.card} rounded-xl p-6 shadow-lg border ${theme.border}`}>
                            <button onClick={() => setShowFilters(!showFilters)} className="flex items-center gap-2 font-semibold mb-4">
                                <Filter size={20} />Filters
                                <ChevronRight className={`transition-transform ${showFilters ? "rotate-90" : ""}`} size={20} />
                            </button>
                            {showFilters && (
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <select onChange={(e) => setFilterStatus(e.target.value)} className={`px-4 py-2 rounded-lg border ${theme.border} ${theme.card}`}>
                                        <option>All Status</option>
                                        <option>Completed</option>
                                        <option>In Progress</option>
                                        <option>Pending</option>
                                    </select>
                                    <select onChange={(e) => setFilterOwner(e.target.value)} className={`px-4 py-2 rounded-lg border ${theme.border} ${theme.card}`}>
                                        <option>All Owners</option>
                                        {[...new Set(tasksData.map(t => t.assigned_to))].filter(Boolean).map(o => <option key={o}>{o}</option>)}
                                    </select>
                                    <button onClick={() => { setFilterStatus("All"); setFilterOwner("All"); }}
                                        className="px-4 py-2 bg-gray-200 rounded-lg font-medium">
                                        Reset
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Tasks Table */}
                        <div className={`${theme.card} rounded-xl shadow-lg border ${theme.border} overflow-x-auto`}>
                            <table className="w-full">
                                <thead className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase">ID</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase">Block</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase">System</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase">Task</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase">Assigned</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase">Progress</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase">Status</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold uppercase">Deadline</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {tasksData
                                        .filter(t => filterStatus === "All" || t.status === filterStatus)
                                        .filter(t => filterOwner === "All" || t.assigned_to === filterOwner)
                                        .filter(t => !searchTerm || t.subTask?.toLowerCase().includes(searchTerm.toLowerCase()))
                                        .map((task, i) => {
                                            const today = new Date();
                                            const deadline = new Date(task.deadlineDate);
                                            const days = Math.ceil((deadline - today) / 86400000);
                                            const isUrgent = days <= 3 && days >= 0;

                                            return (
                                                <tr key={i} className={`${theme.hover}`}>
                                                    <td className="px-6 py-4 font-mono text-sm font-bold">{task.id}</td>
                                                    <td className="px-6 py-4">{task.block}</td>
                                                    <td className="px-6 py-4 font-medium">{task.system}</td>
                                                    <td className="px-6 py-4 text-sm">{task.subTask}</td>
                                                    <td className="px-6 py-4">
                                                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">
                                                            {task.assigned_to}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 min-w-[200px]">
                                                        <div className="flex items-center gap-3">
                                                            <div className="flex-1 bg-gray-200 rounded-full h-3">
                                                                <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full" style={{ width: `${task.progress}%` }} />
                                                            </div>
                                                            <span className="text-sm font-bold">{task.progress}%</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${task.status === "Completed" ? "bg-green-100 text-green-800" :
                                                            task.status === "In Progress" ? "bg-blue-100 text-blue-800" : "bg-orange-100 text-orange-800"
                                                            }`}>
                                                            {task.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        {isUrgent ? (
                                                            <span className="px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full animate-pulse">
                                                                ⚠️ {days}d left
                                                            </span>
                                                        ) : (
                                                            <span className="text-sm">{task.deadlineDate}</span>
                                                        )}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}


                {/* CLIENT ACCOUNT */}
                {view === "Client Account" && (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <div>
                                <h2 className="text-3xl font-bold">Client Account Statement</h2>
                                <p className="text-gray-500 mt-1">{PROJECT.client}</p>
                            </div>
                            {hasPermission('all') && (
                                <button
                                    onClick={() => setShowClientTransactionModal(true)}
                                    className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-semibold flex items-center gap-2 hover:shadow-lg"
                                >
                                    <Plus size={20} />
                                    Add Transaction
                                </button>
                            )}
                        </div>

                        {/* Account Summary */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <div className={`${theme.card} rounded-xl p-6 shadow-lg border ${theme.border}`}>
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-blue-100 rounded-lg">
                                        <FileText className="text-blue-600" size={24} />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 uppercase">Total Invoiced</p>
                                        <p className="text-2xl font-bold text-blue-600">{formatCurrency(stats.totalInvoiced)}</p>
                                    </div>
                                </div>
                            </div>
                            <div className={`${theme.card} rounded-xl p-6 shadow-lg border ${theme.border}`}>
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-green-100 rounded-lg">
                                        <ArrowDown className="text-green-600" size={24} />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 uppercase">Total Received</p>
                                        <p className="text-2xl font-bold text-green-600">{formatCurrency(stats.totalReceived)}</p>
                                    </div>
                                </div>
                            </div>
                            <div className={`${theme.card} rounded-xl p-6 shadow-lg border ${theme.border}`}>
                                <div className="flex items-center gap-4">
                                    <div className={`p-3 rounded-lg ${stats.clientBalance >= 0 ? 'bg-green-100' : 'bg-red-100'}`}>
                                        <Wallet className={stats.clientBalance >= 0 ? 'text-green-600' : 'text-red-600'} size={24} />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 uppercase">Current Balance</p>
                                        <p className={`text-2xl font-bold ${stats.clientBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                            {formatCurrency(Math.abs(stats.clientBalance))}
                                        </p>
                                        <p className="text-xs text-gray-400">{stats.clientBalance >= 0 ? 'Receivable' : 'Payable'}</p>
                                    </div>
                                </div>
                            </div>
                            <div className={`${theme.card} rounded-xl p-6 shadow-lg border ${theme.border}`}>
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-purple-100 rounded-lg">
                                        <FileSpreadsheet className="text-purple-600" size={24} />
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 uppercase">Transactions</p>
                                        <p className="text-2xl font-bold">{clientAccountData.length}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Transactions Table */}
                        <div className={`${theme.card} rounded-xl shadow-lg border ${theme.border} overflow-hidden`}>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gradient-to-r from-green-600 to-emerald-600 text-white">
                                        <tr>
                                            <th className="px-6 py-4 text-left font-semibold">Date</th>
                                            <th className="px-6 py-4 text-left font-semibold">Type</th>
                                            <th className="px-6 py-4 text-left font-semibold">Description</th>
                                            <th className="px-6 py-4 text-left font-semibold">Reference</th>
                                            <th className="px-6 py-4 text-right font-semibold">Debit (Dr)</th>
                                            <th className="px-6 py-4 text-right font-semibold">Credit (Cr)</th>
                                            <th className="px-6 py-4 text-right font-semibold">Balance</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {clientAccountData.length === 0 ? (
                                            <tr>
                                                <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                                                    No transactions found. Click "Add Transaction" to create one.
                                                </td>
                                            </tr>
                                        ) : (
                                            clientAccountData.map((trans, i) => (
                                                <tr key={i} className={theme.hover}>
                                                    <td className="px-6 py-4 text-sm">{trans.date}</td>
                                                    <td className="px-6 py-4">
                                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${trans.type === "invoice"
                                                            ? "bg-blue-100 text-blue-800"
                                                            : trans.type === "payment"
                                                                ? "bg-green-100 text-green-800"
                                                                : "bg-gray-100 text-gray-800"
                                                            }`}>
                                                            {trans.type.charAt(0).toUpperCase() + trans.type.slice(1)}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4">{trans.description}</td>
                                                    <td className="px-6 py-4 font-mono text-sm text-gray-600">{trans.referenceNumber || '-'}</td>
                                                    <td className="px-6 py-4 text-right font-semibold text-red-600">
                                                        {trans.debit > 0 ? formatCurrency(trans.debit) : '-'}
                                                    </td>
                                                    <td className="px-6 py-4 text-right font-semibold text-green-600">
                                                        {trans.credit > 0 ? formatCurrency(trans.credit) : '-'}
                                                    </td>
                                                    <td className={`px-6 py-4 text-right font-bold ${trans.balance >= 0 ? 'text-green-600' : 'text-red-600'
                                                        }`}>
                                                        {formatCurrency(Math.abs(trans.balance))}
                                                        <span className="text-xs ml-1">{trans.balance >= 0 ? 'Dr' : 'Cr'}</span>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Account Summary Chart */}
                        {clientAccountData.length > 0 && (
                            <div className={`${theme.card} rounded-xl p-6 shadow-lg border ${theme.border}`}>
                                <h3 className="text-xl font-bold mb-4">Balance Trend</h3>
                                <ResponsiveContainer width="100%" height={300}>
                                    <LineChart data={clientAccountData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="date" />
                                        <YAxis />
                                        <Tooltip formatter={(value) => formatCurrency(value)} />
                                        <Legend />
                                        <Line type="monotone" dataKey="balance" stroke="#10b981" strokeWidth={2} name="Balance" />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        )}
                    </div>
                )}
                {/* TEAM */}
                {view === "Team" && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {teamData.map((member, i) => (
                            <div key={i} className={`${theme.card} rounded-xl p-6 shadow-lg border ${theme.border}`}>
                                <div className="flex items-start gap-4 mb-6">
                                    <div className="relative">
                                        {member.image ? (
                                            <img src={member.image} alt={member.name} className="w-24 h-24 rounded-full object-cover border-4 border-blue-500" />
                                        ) : (
                                            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-3xl border-4 border-blue-500">
                                                {member.name?.split(" ").map(n => n[0]).join("")}
                                            </div>
                                        )}
                                        <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-2xl font-bold mb-1">{member.name}</h3>
                                        <p className="text-blue-600 font-semibold mb-2">{member.role}</p>
                                        <div className="flex flex-wrap gap-2">
                                            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold flex items-center gap-1">
                                                <Mail size={12} />{member.email}
                                            </span>
                                            {member.phone && (
                                                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold flex items-center gap-1">
                                                    <Phone size={12} />{member.phone}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                {member.skills && (
                                    <div className="mb-4">
                                        <p className="text-sm font-semibold mb-2 flex items-center gap-2">
                                            <Award size={16} className="text-yellow-500" />Skills:
                                        </p>
                                        <div className="flex flex-wrap gap-2">
                                            {member.skills.split(",").map((skill, idx) => (
                                                <span key={idx} className="px-3 py-1 bg-purple-50 text-purple-700 rounded-lg text-xs font-medium">
                                                    {skill.trim()}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                {member.systems && (
                                    <div className="mb-4">
                                        <p className="text-sm font-semibold mb-2 flex items-center gap-2">
                                            <Briefcase size={16} className="text-blue-500" />Systems:
                                        </p>
                                        <div className="flex flex-wrap gap-2">
                                            {member.systems.split(",").map((sys, idx) => (
                                                <span key={idx} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-semibold">
                                                    {sys.trim()}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                <div className="pt-4 border-t">
                                    <p className="text-sm font-semibold mb-2">Performance:</p>
                                    <div className="w-full bg-gray-200 h-3 rounded-full">
                                        <div className="h-3 rounded-full bg-gradient-to-r from-green-400 to-blue-500" style={{ width: `${member.performanceScore || 0}%` }} />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}


                {/* PHOTOS */}
                {view === "Photos" && (
                    <div className="space-y-6">
                        {hasPermission('upload') && (
                            <div className={`${theme.card} rounded-xl p-6 shadow-lg border ${theme.border}`}>
                                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                                    <Upload className="text-blue-600" size={24} />Upload Photo
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <input type="file" accept="image/*" onChange={(e) => setPhotoUploadForm({ ...photoUploadForm, file: e.target.files[0] })}
                                        className={`px-4 py-2 rounded-lg border ${theme.border} ${theme.card}`} />
                                    <select value={photoUploadForm.system} onChange={(e) => setPhotoUploadForm({ ...photoUploadForm, system: e.target.value })}
                                        className={`px-4 py-2 rounded-lg border ${theme.border} ${theme.card}`}>
                                        <option value="">Select System</option>
                                        {[...new Set(tasksData.map(t => t.system))].filter(Boolean).map(s => <option key={s}>{s}</option>)}
                                    </select>
                                    <input type="text" placeholder="Description" value={photoUploadForm.description}
                                        onChange={(e) => setPhotoUploadForm({ ...photoUploadForm, description: e.target.value })}
                                        className={`px-4 py-2 rounded-lg border ${theme.border} ${theme.card}`} />
                                </div>
                                <button onClick={uploadPhoto} disabled={!photoUploadForm.file || !photoUploadForm.system || uploadingPhoto}
                                    className="mt-4 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold disabled:opacity-50">
                                    {uploadingPhoto ? 'Uploading...' : 'Upload Photo'}
                                </button>
                            </div>
                        )}

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {photosData.map((photo, i) => (
                                <div key={i} className="border rounded-lg overflow-hidden shadow hover:shadow-lg cursor-pointer transition"
                                    onClick={() => setModalPhoto(photo)}>
                                    {photo.photoUrl ? (
                                        <img
                                            src={photo.photoUrl}
                                            alt={photo.description || 'Photo'}
                                            className="w-full h-48 object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                                            <span className="text-gray-400">No Image</span>
                                        </div>
                                    )}
                                    <div className="p-3 bg-white">
                                        <h4 className="font-semibold">{photo.system}</h4>
                                        <p className="text-sm text-gray-600 truncate">{photo.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {modalPhoto && (
                            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
                                onClick={() => setModalPhoto(null)}>
                                <div className="bg-white rounded-lg max-w-3xl w-full" onClick={(e) => e.stopPropagation()}>
                                    {modalPhoto.photoUrl ? (
                                        <img
                                            src={modalPhoto.photoUrl}
                                            alt={modalPhoto.description}
                                            className="w-full object-contain max-h-96"
                                        />
                                    ) : (
                                        <div className="w-full h-96 bg-gray-200 flex items-center justify-center">
                                            <span className="text-gray-400">No Image</span>
                                        </div>
                                    )}
                                    <div className="p-4">
                                        <h4 className="font-bold text-lg">{modalPhoto.system}</h4>
                                        <p className="text-gray-700">{modalPhoto.description}</p>
                                        {modalPhoto.photoUrl && (
                                            <a href={modalPhoto.photoUrl} target="_blank" rel="noopener noreferrer"
                                                className="text-blue-500 text-sm mt-2 inline-block">
                                                Open in new tab
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
            {/* COMMENTS SECTION */}
            {view === "Comments" && (
                <div className="max-w-4xl mx-auto space-y-8 p-4">
                    {/* Add Comment Card */}
                    <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-700">
                        <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-slate-800 dark:text-white">
                            <MessageSquare className="text-blue-500" size={24} /> Post New Comment
                        </h3>
                        <textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 focus:ring-2 focus:ring-blue-500 outline-none transition-all min-h-[100px]"
                            placeholder="Write your comment here..."
                        />
                        <div className="flex flex-wrap justify-between items-center mt-4 gap-4">
                            <select
                                value={commentPriority}
                                onChange={(e) => setCommentPriority(e.target.value)}
                                className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-sm outline-none font-medium"
                            >
                                <option value="Low">Low Priority</option>
                                <option value="Medium">Medium Priority</option>
                                <option value="High">High Priority</option>
                            </select>
                            <button
                                onClick={submitComment}
                                disabled={submittingComment || !newComment.trim()}
                                className="px-8 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold flex items-center gap-2 disabled:opacity-50 transition-all shadow-md shadow-blue-200 dark:shadow-none"
                            >
                                {submittingComment ? "Sending..." : <><Send size={18} /> Post Comment</>}
                            </button>
                        </div>
                    </div>

                    {/* List of Comments */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold px-2 text-slate-700 dark:text-slate-300">Recent Updates</h3>
                        {commentsData.length === 0 ? (
                            <div className="text-center py-12 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700">
                                <p className="text-slate-400">No comments found yet.</p>
                            </div>
                        ) : (
                            commentsData.map((c, i) => (
                                <div
                                    key={i}
                                    className="bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-md transition-shadow"
                                >
                                    <div className="flex items-start gap-4">
                                        {/* Avatar */}
                                        <img
                                            src={c.avatar || `https://ui-avatars.com/api/?name=${c.username}&background=random`}
                                            alt={c.username}
                                            className="w-12 h-12 rounded-full ring-2 ring-slate-100 dark:ring-slate-700 object-cover"
                                        />

                                        <div className="flex-1">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h4 className="font-bold text-slate-900 dark:text-white">{c.username}</h4>
                                                    <p className="text-[11px] text-slate-500 font-semibold uppercase tracking-wider">
                                                        {c.position} • {c.department}
                                                    </p>
                                                </div>
                                                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${c.priority === "High" ? "bg-red-100 text-red-600" :
                                                    c.priority === "Low" ? "bg-green-100 text-green-600" :
                                                        "bg-amber-100 text-amber-600"
                                                    }`}>
                                                    {c.priority}
                                                </span>
                                            </div>

                                            <p className="mt-3 text-slate-700 dark:text-slate-300 leading-relaxed text-sm">
                                                {c.comment}
                                            </p>

                                            <div className="mt-4 pt-3 border-t border-slate-50 dark:border-slate-700 flex justify-end">
                                                <span className="text-[10px] text-slate-400 font-mono italic">
                                                    {/* Date formatting for English locale */}
                                                    {c.timestamp && !isNaN(Date.parse(c.timestamp))
                                                        ? new Date(c.timestamp).toLocaleString('en-US', {
                                                            day: 'numeric',
                                                            month: 'short',
                                                            year: 'numeric',
                                                            hour: '2-digit',
                                                            minute: '2-digit',
                                                            hour12: true
                                                        })
                                                        : c.timestamp}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
            {/* MATERIALS */}
            {view === "Materials" && (
                <div className="space-y-6">
                    <div className="flex gap-4">
                        <select value={selectedSystem} onChange={(e) => setSelectedSystem(e.target.value)}
                            className={`flex-1 px-4 py-2 rounded-lg border ${theme.border} ${theme.card}`}>
                            <option>All Systems</option>
                            {[...new Set(materialsData.map(m => m.system))].filter(Boolean).map(s => <option key={s}>{s}</option>)}
                        </select>
                        <input type="text" placeholder="Search material..." value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className={`flex-1 px-4 py-2 rounded-lg border ${theme.border} ${theme.card}`} />
                    </div>

                    {[...new Set(materialsData.filter(m => selectedSystem === "All" || m.system === selectedSystem).map(m => m.system))].map(system => {
                        const sysMats = materialsData.filter(m => m.system === system &&
                            (m.material.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                (m.part_number || "").toLowerCase().includes(searchTerm.toLowerCase())));
                        if (!sysMats.length) return null;
                        const delivered = sysMats.every(m => m.delivery_status === "Delivered");

                        return (
                            <div key={system} className={`rounded-xl shadow-xl border-2 ${delivered ? "border-green-400" : "border-red-400"}`}>
                                <div className={`flex justify-between px-6 py-4 rounded-t-xl ${delivered ? "bg-green-50" : "bg-red-50"}`}>
                                    <h3 className="text-xl font-bold">{system}</h3>
                                    <span className={`px-4 py-1 rounded-full text-sm font-semibold ${delivered ? "bg-green-600 text-white" : "bg-red-600 text-white"}`}>
                                        {delivered ? "Delivered" : "Not Delivered"}
                                    </span>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-gray-100">
                                            <tr>
                                                <th className="px-4 py-3 text-left">Part Number</th>
                                                <th className="px-4 py-3 text-left">Material</th>
                                                <th className="px-4 py-3 text-center">Unit</th>
                                                <th className="px-4 py-3 text-right">Quantity</th>
                                                <th className="px-4 py-3 text-center">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {sysMats.map((mat, i) => (
                                                <tr key={i} className="border-b hover:bg-gray-50">
                                                    <td className="px-4 py-3 font-medium">{mat.part_number || "-"}</td>
                                                    <td className="px-4 py-3">{mat.material}</td>
                                                    <td className="px-4 py-3 text-center">{mat.unit}</td>
                                                    <td className="px-4 py-3 text-right">{mat.quantity}</td>
                                                    <td className="px-4 py-3 text-center">
                                                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${mat.delivery_status === "Delivered" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                                                            }`}>
                                                            {mat.delivery_status}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}


            {/* INVOICE MODAL */}
            {showInvoiceModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className={`${theme.card} rounded-xl max-w-2xl w-full p-6`}>
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-2xl font-bold">Add New Invoice</h3>
                            <button onClick={() => setShowInvoiceModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                                <X size={24} />
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">Invoice Number *</label>
                                <input
                                    type="text"
                                    value={invoiceForm.invoiceNumber}
                                    onChange={(e) => setInvoiceForm({ ...invoiceForm, invoiceNumber: e.target.value })}
                                    className="w-full px-4 py-2 border rounded-lg"
                                    placeholder="INV-001"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Vendor *</label>
                                <input
                                    type="text"
                                    value={invoiceForm.vendor}
                                    onChange={(e) => setInvoiceForm({ ...invoiceForm, vendor: e.target.value })}
                                    className="w-full px-4 py-2 border rounded-lg"
                                    placeholder="Vendor Name"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Amount (SAR) *</label>
                                <input
                                    type="number"
                                    value={invoiceForm.amount}
                                    onChange={(e) => setInvoiceForm({ ...invoiceForm, amount: e.target.value })}
                                    className="w-full px-4 py-2 border rounded-lg"
                                    placeholder="10000"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Category *</label>
                                <select
                                    value={invoiceForm.category}
                                    onChange={(e) => setInvoiceForm({ ...invoiceForm, category: e.target.value })}
                                    className="w-full px-4 py-2 border rounded-lg"
                                >
                                    <option value="">Select Category</option>
                                    <option value="Materials">Materials</option>
                                    <option value="Labor">Labor</option>
                                    <option value="Equipment">Equipment</option>
                                    <option value="Subcontractor">Subcontractor</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Issue Date *</label>
                                <input
                                    type="date"
                                    value={invoiceForm.issueDate}
                                    onChange={(e) => setInvoiceForm({ ...invoiceForm, issueDate: e.target.value })}
                                    className="w-full px-4 py-2 border rounded-lg"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Due Date *</label>
                                <input
                                    type="date"
                                    value={invoiceForm.dueDate}
                                    onChange={(e) => setInvoiceForm({ ...invoiceForm, dueDate: e.target.value })}
                                    className="w-full px-4 py-2 border rounded-lg"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Status</label>
                                <select
                                    value={invoiceForm.status}
                                    onChange={(e) => setInvoiceForm({ ...invoiceForm, status: e.target.value })}
                                    className="w-full px-4 py-2 border rounded-lg"
                                >
                                    <option value="Pending">Pending</option>
                                    <option value="Paid">Paid</option>
                                    <option value="Overdue">Overdue</option>
                                </select>
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium mb-2">Description</label>
                                <textarea
                                    value={invoiceForm.description}
                                    onChange={(e) => setInvoiceForm({ ...invoiceForm, description: e.target.value })}
                                    className="w-full px-4 py-2 border rounded-lg"
                                    rows="3"
                                    placeholder="Additional details about this invoice..."
                                />
                            </div>
                        </div>

                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={addInvoice}
                                disabled={submittingInvoice}
                                className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold disabled:opacity-50"
                            >
                                {submittingInvoice ? 'Adding...' : 'Add Invoice'}
                            </button>
                            <button
                                onClick={() => setShowInvoiceModal(false)}
                                className="px-6 py-3 bg-gray-200 rounded-lg font-semibold"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* CLIENT TRANSACTION MODAL */}
            {showClientTransactionModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className={`${theme.card} rounded-xl max-w-2xl w-full p-6`}>
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-2xl font-bold">Add Client Transaction</h3>
                            <button onClick={() => setShowClientTransactionModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                                <X size={24} />
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">Transaction Type *</label>
                                <select
                                    value={clientTransactionForm.type}
                                    onChange={(e) => setClientTransactionForm({ ...clientTransactionForm, type: e.target.value })}
                                    className="w-full px-4 py-2 border rounded-lg"
                                >
                                    <option value="invoice">Invoice (Debit)</option>
                                    <option value="payment">Payment (Credit)</option>
                                    <option value="adjustment">Adjustment</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Amount (SAR) *</label>
                                <input
                                    type="number"
                                    value={clientTransactionForm.amount}
                                    onChange={(e) => setClientTransactionForm({ ...clientTransactionForm, amount: e.target.value })}
                                    className="w-full px-4 py-2 border rounded-lg"
                                    placeholder="10000"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Reference Number</label>
                                <input
                                    type="text"
                                    value={clientTransactionForm.referenceNumber}
                                    onChange={(e) => setClientTransactionForm({ ...clientTransactionForm, referenceNumber: e.target.value })}
                                    className="w-full px-4 py-2 border rounded-lg"
                                    placeholder="REF-001"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Date *</label>
                                <input
                                    type="date"
                                    value={clientTransactionForm.date}
                                    onChange={(e) => setClientTransactionForm({ ...clientTransactionForm, date: e.target.value })}
                                    className="w-full px-4 py-2 border rounded-lg"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium mb-2">Description *</label>
                                <textarea
                                    value={clientTransactionForm.description}
                                    onChange={(e) => setClientTransactionForm({ ...clientTransactionForm, description: e.target.value })}
                                    className="w-full px-4 py-2 border rounded-lg"
                                    rows="3"
                                    placeholder="Details about this transaction..."
                                />
                            </div>
                        </div>

                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={addClientTransaction}
                                disabled={submittingClientTransaction}
                                className="flex-1 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-semibold disabled:opacity-50"
                            >
                                {submittingClientTransaction ? 'Adding...' : 'Add Transaction'}
                            </button>
                            <button
                                onClick={() => setShowClientTransactionModal(false)}
                                className="px-6 py-3 bg-gray-200 rounded-lg font-semibold"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}