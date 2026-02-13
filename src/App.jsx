
import React, { useState, useEffect } from "react";
import emailjs from '@emailjs/browser';
import './index.css';
import { motion, AnimatePresence } from 'framer-motion';
import CountUp from 'react-countup';
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
    Check, FileSpreadsheet, TrendingDown as ArrowDown, TrendingUp as ArrowUp, Folder, ChevronLeft, BarChart2, File, Lock, ChevronDown,
    Settings, Zap, Menu, User, EyeOff, ArrowRight
} from "lucide-react";

/// ========== MULTI-PROJECT CONFIGURATION ==========
const PROJECTS = {
    "sec-eoa-jubail": {
        id: "sec-eoa-jubail",
        name: "SEC-EOA Ph#3 Project- Jubail North & Jubail Residential Substations",
        shortName: "SEC-EOA Jubail",
        client: "Saudi Business Machines",
        contract: "Ritis 01 24 0953 001 R 05",
        endDate: new Date(2026, 2, 15),
        totalValue: 1466974.50,

        sheets: {
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
            documents: process.env.REACT_APP_DOCUMENTS_URL,
            documentUpload: process.env.REACT_APP_DOCUMENT_UPLOAD_URL,
            budgetCategories: process.env.REACT_APP_BUDGET_CATEGORIES_URL,
            budgetExpenses: process.env.REACT_APP_BUDGET_EXPENSES_URL,
            budgetCategoryAdd: process.env.REACT_APP_BUDGET_CATEGORY_ADD_URL,
            budgetExpenseAdd: process.env.REACT_APP_BUDGET_EXPENSE_ADD_URL,
        },

        images: {
            background: process.env.REACT_APP_PROJECT_BG_IMAGE || '/images/jubail-bg.jpg',
            logo: process.env.REACT_APP_COMPANY_LOGO || '/images/logo.png'
        }
    },

    "kingdom-gate": {
        id: "kingdom-gate",
        name: "Kingdom Gate Tower - Low Current Systems",
        shortName: "Kingdom Gate",
        client: "Al Fahd Investment - STS",
        contract: "SO-23_0941_001_R_08",
        endDate: new Date(2026, 2, 15),
        totalValue: 1645659,

        sheets: {
            tasks: process.env.REACT_APP_KG_TASKS_URL,
            team: process.env.REACT_APP_KG_TEAM_URL,
            budget: process.env.REACT_APP_KG_BUDGET_URL,
            materials: process.env.REACT_APP_KG_MATERIALS_URL,
            performance: process.env.REACT_APP_KG_PERFORMANCE_URL,
            photos: process.env.REACT_APP_KG_PHOTOS_URL,
            commentsRead: process.env.REACT_APP_KG_COMMENTS_READ_URL,
            commentsWrite: process.env.REACT_APP_KG_COMMENTS_WRITE_URL,
            invoices: process.env.REACT_APP_KG_INVOICES_URL,
            invoiceAdd: process.env.REACT_APP_KG_INVOICE_ADD_URL,
            photoUpload: process.env.REACT_APP_KG_PHOTO_UPLOAD_URL,
            clientAccount: process.env.REACT_APP_KG_CLIENT_ACCOUNT_URL,
            clientAccountWrite: process.env.REACT_APP_KG_CLIENT_ACCOUNT_WRITE_URL,
            paymentMilestones: process.env.REACT_APP_KG_PAYMENT_MILESTONES_URL || "",
            changeOrders: process.env.REACT_APP_KG_CHANGE_ORDERS_URL || "",
            cashFlow: process.env.REACT_APP_KG_CASH_FLOW_URL || "",

            documents: process.env.REACT_APP_KG_DOCUMENTS_URL,
            documentUpload: process.env.REACT_APP_KG_DOCUMENT_UPLOAD_URL,
            budgetCategories: process.env.REACT_APP_KG_BUDGET_CATEGORIES_URL,
            budgetExpenses: process.env.REACT_APP_KG_BUDGET_EXPENSES_URL,
            budgetCategoryAdd: process.env.REACT_APP_KG_BUDGET_CATEGORY_ADD_URL,
            budgetExpenseAdd: process.env.REACT_APP_KG_BUDGET_EXPENSE_ADD_URL,
        },

        images: {
            background: process.env.REACT_APP_KG_BG_IMAGE || '/images/kingdom-gate-bg.jpg',
            logo: process.env.REACT_APP_KG_LOGO || '/images/logo.png'
        }
    }
};

const DEFAULT_PROJECT = "sec-eoa-jubail";
// قائمة الفئات الممكنة للمستندات
const DOCUMENT_CATEGORIES = [
    "Contract", "Drawing", "Permit", "Test Report",
    "Warranty", "Change Order", "Meeting Minutes",
    "Submittal", "Invoice", "Photo", "Other"
];



const USERS = {
    "Khalid": {
        token: process.env.REACT_APP_ADMIN_TOKEN,  // ← من .env
        name: "Khalid Jehangir",
        position: "Operations Manager",
        department: "Operations",
        role: "ADMIN",
        email: "y.khan@alrammah.com.sa",
        phone: "+966541546402",
        avatar: process.env.REACT_APP_KHALID_PHOTO,
    },
    "bakri": {
        token: process.env.REACT_APP_PM_TOKEN,  // ← من .env
        name: "Bakri Mohammed",
        position: "Project Manager",
        department: "Project Management",
        role: "PM",
        email: "y.khan@alrammah.com.sa",
        phone: "+966541546402",
        avatar: process.env.REACT_APP_BAKRI_PHOTO,

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

// Company Information (add this after USERS constant)
const COMPANY_INFO = {
    name: "Al Rammah Trading & Contracting Est.",
    logo: process.env.REACT_APP_COMPANY_LOGO || '/images/logo.png',
    tagline: "Excellence in Project Management",
    address: "Dammam, Eastern Province, Saudi Arabia",
    phone: "+966 13 XXX XXXX",
    email: "info@alrammah.com.sa",
    website: "www.alrammah.com.sa",
    founded: "2010",
    projects: "150+",
    clients: "50+",
    employees: "200+"
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
    const [showPassword, setShowPassword] = useState(false);

    // UI
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchFocused, setSearchFocused] = useState(false);
    const [loginToken, setLoginToken] = useState("");
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
    const [uploadingCategory, setUploadingCategory] = useState(false);
    // في الـ State - أضف
    const [uploadingExpense, setUploadingExpense] = useState(false);
    const [selectedMonth, setSelectedMonth] = useState("all");
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    // ========== PROJECT STATE ==========
    const [currentProjectId, setCurrentProjectId] = useState(
        localStorage.getItem('selectedProject') || DEFAULT_PROJECT
    );
    const [switchingProject, setSwitchingProject] = useState(false);

    // ========== DYNAMIC PROJECT & SHEETS ==========
    const PROJECT =
        PROJECTS[currentProjectId] || PROJECTS[DEFAULT_PROJECT];

    const GOOGLE_SHEETS = PROJECT?.sheets || {};


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
    const [budgetCategories, setBudgetCategories] = useState([]);
    const [budgetExpenses, setBudgetExpenses] = useState([]);
    const [expandedCategory, setExpandedCategory] = useState(null);
    const [showAddCategoryModal, setShowAddCategoryModal] = useState(false);
    const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [materials, setMaterials] = useState([]);


    // ========== Functions ==========

    // Systems Health
    const systemsHealth = [...new Set(materials.map(m => m.system))].filter(Boolean).map(system => {
        const systemMaterials = materials.filter(m => m.system === system);
        const delivered = systemMaterials.filter(m => m.delivery_status === "Delivered").length;
        const total = systemMaterials.length;
        const completion = total > 0 ? Math.round((delivered / total) * 100) : 0;
        const status = completion === 100 ? "Delivered" : "Pending";

        return {
            system,
            completion,
            status,
            delivered,
            total
        };
    });
    const handleProjectChange = (newProjectId) => {
        setCurrentProjectId(newProjectId);
    };
    const [categoryForm, setCategoryForm] = useState({
        category_name: '',
        allocated: '',
        notes: ''
    });

    const [expenseForm, setExpenseForm] = useState({
        category_id: '',
        amount: '',
        recipient: '',
        invoice_no: '',
        expense_date: new Date().toISOString().split('T')[0],
        description: '',
        attachment: null
    });

    // Gantt Chart State
    const [ganttView, setGanttView] = useState("month"); // month, quarter, year
    const [ganttStartDate, setGanttStartDate] = useState(new Date(2026, 0, 1)); // Jan 1, 2026
    const [selectedTask, setSelectedTask] = useState(null);
    const [showTaskDetails, setShowTaskDetails] = useState(false);

    // Documentation State
    const [documentsData, setDocumentsData] = useState([]);
    useEffect(() => {
        console.log('documentsData updated:', documentsData);
    }, [documentsData]);

    const [showUploadModal, setShowUploadModal] = useState(false);
    const [documentFilter, setDocumentFilter] = useState("All");
    const [documentSearchTerm, setDocumentSearchTerm] = useState("");
    const [uploadForm, setUploadForm] = useState({
        file: null,
        category: "Contract",
        title: "",
        description: "",
        tags: ""
    });
    const [uploadingDocument, setUploadingDocument] = useState(false);

    // حساب Total Spent لكل بند
    const getCategorySpent = (categoryId) => {
        return budgetExpenses
            .filter(exp => exp.category_id === categoryId)
            .reduce((sum, exp) => sum + exp.amount, 0);
    };

    // حساب Remaining
    const getCategoryRemaining = (category) => {
        const spent = getCategorySpent(category.category_id);
        return category.allocated - spent;
    };

    // Get expenses لبند معين
    const getCategoryExpenses = (categoryId) => {
        return budgetExpenses.filter(exp => exp.category_id === categoryId);
    };

    //============AddBudget======================

    const addBudgetCategory = async () => {
        if (!categoryForm.category_name || !categoryForm.allocated) {
            alert("Please fill all required fields");
            return;
        }
        setUploadingCategory(true);

        try {
            const categoryId = `BDG-${Date.now()}`;

            const params = new URLSearchParams();
            params.append('category_id', categoryId);
            params.append('category_name', categoryForm.category_name);
            params.append('allocated', categoryForm.allocated);
            params.append('notes', categoryForm.notes);
            params.append('created_by', currentUser.name);
            params.append('created_date', new Date().toISOString());

            await fetch(GOOGLE_SHEETS.budgetCategoryAdd, {
                method: 'POST',
                mode: 'no-cors',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: params.toString()
            });

            alert("Budget category added successfully!");
            setShowAddCategoryModal(false);
            setCategoryForm({ category_name: '', allocated: '', notes: '' });
            setTimeout(fetchData, 2000);
        } catch (err) {
            console.error(err);
            alert("Failed to add category");
        }
    };

    //=================AddExpences================

    const addBudgetExpense = async () => {
        if (!expenseForm.category_id || !expenseForm.amount || !expenseForm.recipient) {
            alert("Please fill all required fields");
            return;
        }
        setUploadingExpense(true); // ← Loading state

        try {
            const expenseId = `EXP-${Date.now()}`;

            // Upload attachment if exists
            let attachmentUrl = null;
            if (expenseForm.attachment) {
                const reader = new FileReader();
                const base64Data = await new Promise((resolve) => {
                    reader.onload = (e) => resolve(e.target.result.split(',')[1]);
                    reader.readAsDataURL(expenseForm.attachment);
                });

                // Upload to Google Drive (using existing upload script)
                const uploadResponse = await fetch(GOOGLE_SHEETS.documentUpload, {
                    method: 'POST',
                    mode: 'no-cors',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        fileData: base64Data,
                        fileName: expenseForm.attachment.name,
                        mimeType: expenseForm.attachment.type,
                        category: 'Budget',
                        title: `Expense ${expenseId}`,
                        uploadedBy: currentUser.name
                    })
                });

                // Note: no-cors won't return data, so we'll save without URL for now
                // Or use a different upload method that returns the URL
            }

            const params = new URLSearchParams();
            params.append('expense_id', expenseId);
            params.append('category_id', expenseForm.category_id);
            params.append('amount', expenseForm.amount);
            params.append('recipient', expenseForm.recipient);
            params.append('invoice_no', expenseForm.invoice_no);
            params.append('expense_date', expenseForm.expense_date);
            params.append('description', expenseForm.description);
            params.append('attachment_url', attachmentUrl || '');
            params.append('added_by', currentUser.name);
            params.append('timestamp', new Date().toISOString());

            await fetch(GOOGLE_SHEETS.budgetExpenseAdd, {
                method: 'POST',
                mode: 'no-cors',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: params.toString()
            });

            alert("Expense added successfully!");
            setShowAddExpenseModal(false);
            setExpenseForm({
                category_id: '',
                amount: '',
                recipient: '',
                invoice_no: '',
                expense_date: new Date().toISOString().split('T')[0],
                description: '',
                attachment: null
            });
            setTimeout(fetchData, 2000);
        } catch (err) {
            console.error(err);
            alert("Failed to add expense");
        }
    };


    // ========== GANTT CHART FUNCTIONS ==========

    // Generate timeline dates based on view
    const getTimelineColumns = () => {
        const columns = [];
        const start = new Date(ganttStartDate);

        if (ganttView === "month") {
            // Show 6 months
            for (let i = 0; i < 6; i++) {
                const date = new Date(start);
                date.setMonth(start.getMonth() + i);
                columns.push({
                    label: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
                    date: new Date(date)
                });
            }
        } else if (ganttView === "quarter") {
            // Show 4 quarters
            for (let i = 0; i < 4; i++) {
                const date = new Date(start);
                date.setMonth(start.getMonth() + (i * 3));
                columns.push({
                    label: `Q${Math.floor(date.getMonth() / 3) + 1} ${date.getFullYear()}`,
                    date: new Date(date)
                });
            }
        } else {
            // Show 2 years
            for (let i = 0; i < 2; i++) {
                const date = new Date(start);
                date.setFullYear(start.getFullYear() + i);
                columns.push({
                    label: date.getFullYear().toString(),
                    date: new Date(date)
                });
            }
        }

        return columns;
    };

    // Calculate task position and width in timeline
    const getTaskBarStyle = (task, columns) => {
        if (!task.startDate || !task.deadlineDate) return null;

        const taskStart = new Date(task.startDate);
        const taskEnd = new Date(task.deadlineDate);
        const timelineStart = columns[0].date;
        const timelineEnd = new Date(columns[columns.length - 1].date);

        // Calculate if task is within visible timeline
        if (taskEnd < timelineStart || taskStart > timelineEnd) return null;

        const totalDays = (timelineEnd - timelineStart) / (1000 * 60 * 60 * 24);
        const taskStartDays = Math.max(0, (taskStart - timelineStart) / (1000 * 60 * 60 * 24));
        const taskDuration = (taskEnd - taskStart) / (1000 * 60 * 60 * 24);

        const left = (taskStartDays / totalDays) * 100;
        const width = (taskDuration / totalDays) * 100;

        return { left: `${left}%`, width: `${Math.max(width, 2)}%` };
    };

    // Get task color based on status
    const getTaskColor = (task) => {
        if (task.status === "Completed") return "bg-green-500";
        if (task.status === "In Progress") return "bg-blue-500";
        if (new Date(task.deadlineDate) < new Date()) return "bg-red-500";
        return "bg-gray-400";
    };

    // Navigate timeline
    const navigateTimeline = (direction) => {
        const newDate = new Date(ganttStartDate);

        if (ganttView === "month") {
            newDate.setMonth(newDate.getMonth() + (direction === "next" ? 6 : -6));
        } else if (ganttView === "quarter") {
            newDate.setMonth(newDate.getMonth() + (direction === "next" ? 12 : -12));
        } else {
            newDate.setFullYear(newDate.getFullYear() + (direction === "next" ? 2 : -2));
        }

        setGanttStartDate(newDate);
    };

    // Group tasks by system
    const groupedTasks = tasksData.reduce((groups, task) => {
        const system = task.system || "Other";
        if (!groups[system]) groups[system] = [];
        groups[system].push(task);
        return groups;
    }, {});

    // ========== DOCUMENTATION FUNCTIONS ==========

    // Delete document
    const deleteDocument = async (fileId) => {
        // تأكد من صلاحية الحذف
        if (!window.confirm("Are you sure you want to delete this document?")) return;

        try {
            // إعداد الباراميترات
            const params = new URLSearchParams();
            params.append("action", "delete");
            params.append("fileId", fileId);

            // استدعاء سكربت Google Apps Script
            const res = await fetch(GOOGLE_SHEETS.documentUpload, {
                method: "POST",
                mode: "no-cors", // نفس وضع upload
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: params.toString(),
            });

            // نطبع في الكونسل عشان نتاكد
            console.log("Delete response:", res);

            // إعادة تحميل البيانات بعد الحذف
            setTimeout(fetchData, 1000);

            alert("Document deleted successfully!");

        } catch (err) {
            console.error("Delete failed:", err);
            alert("Delete failed");
        }
    };


    // Upload document
    const uploadDocument = async () => {
        if (!uploadForm.file || !uploadForm.title) {
            alert("Please provide file and title");
            return;
        }

        setUploadingDocument(true);

        try {
            const reader = new FileReader();
            reader.onload = async (e) => {
                try {
                    const base64Data = e.target.result.split(',')[1];

                    const params = new URLSearchParams();
                    params.append('fileData', base64Data);
                    params.append('fileName', uploadForm.file.name);
                    params.append('mimeType', uploadForm.file.type);
                    params.append('category', uploadForm.category);
                    params.append('title', uploadForm.title);
                    params.append('description', uploadForm.description);
                    params.append('tags', uploadForm.tags);
                    params.append('uploadedBy', currentUser.name);
                    params.append('timestamp', new Date().toISOString());

                    await fetch(GOOGLE_SHEETS.documentUpload, {
                        method: 'POST',
                        mode: 'no-cors',
                        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                        body: params.toString()
                    });

                    alert("Document uploaded successfully!");
                    setShowUploadModal(false);
                    setUploadForm({
                        file: null,
                        category: "Contract",
                        title: "",
                        description: "",
                        tags: ""
                    });
                    setTimeout(fetchData, 2000);
                } catch (err) {
                    console.error(err);
                    alert("Upload failed");
                }
                setUploadingDocument(false);
            };
            reader.readAsDataURL(uploadForm.file);
        } catch (err) {
            console.error(err);
            alert("Upload error");
            setUploadingDocument(false);
        }
    };

    const filteredExpenses = budgetExpenses.filter(exp => {
        const date = new Date(exp.expense_date);

        const matchesYear = date.getFullYear() === Number(selectedYear);

        const matchesMonth =
            selectedMonth === "all" ||
            date.getMonth() === Number(selectedMonth);

        return matchesYear && matchesMonth;
    });
    const expenseChartData = budgetCategories.map(category => {
        const categoryExpenses = filteredExpenses.filter(
            exp => exp.category_id === category.category_id
        );

        const totalSpent = categoryExpenses.reduce(
            (sum, exp) => sum + Number(exp.amount),
            0
        );

        return {
            name: category.category_name,
            allocated: Number(category.allocated || 0), // ← مهم
            spent: totalSpent
        };
    }).filter(item => item.allocated > 0 || item.spent > 0);
    const topCategories = [...expenseChartData]
        .sort((a, b) => b.spent - a.spent)
        .slice(0, 5);



    // Filter documents
    const filteredDocuments = documentsData.filter(doc => {
        const matchesCategory = documentFilter === "All" || doc.category === documentFilter;
        const matchesSearch = !documentSearchTerm ||
            doc.title?.toLowerCase().includes(documentSearchTerm.toLowerCase()) ||
            doc.description?.toLowerCase().includes(documentSearchTerm.toLowerCase()) ||
            doc.tags?.toLowerCase().includes(documentSearchTerm.toLowerCase());

        return matchesCategory && matchesSearch;
    });

    // Get file icon based on type
    const getFileIcon = (fileName) => {
        const ext = fileName?.split('.').pop().toLowerCase();

        if (['pdf'].includes(ext)) return <FileText className="w-8 h-8 text-red-500" />;
        if (['doc', 'docx'].includes(ext)) return <FileText className="w-8 h-8 text-blue-500" />;
        if (['xls', 'xlsx'].includes(ext)) return <FileSpreadsheet className="w-8 h-8 text-green-500" />;
        if (['jpg', 'jpeg', 'png', 'gif'].includes(ext)) return <ImageIcon className="w-8 h-8 text-purple-500" />;
        if (['dwg', 'dxf'].includes(ext)) return <BarChart2 className="w-8 h-8 text-yellow-500" />;

        return <File className="w-8 h-8 text-gray-500" />;
    };

    // Format file size
    const formatFileSize = (bytes) => {
        if (!bytes) return "Unknown";
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    };

    // Document stats
    const documentStats = {
        total: documentsData.length,
        byCategory: DOCUMENT_CATEGORIES.reduce((acc, cat) => {
            acc[cat] = documentsData.filter(d => d.category === cat).length;
            return acc;
        }, {})
    };

    const renderGanttChart = () => {
        const columns = getTimelineColumns();
        const today = new Date();

        return (
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold flex items-center gap-2">
                            <BarChart2 className="w-6 h-6" />
                            Project Timeline
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">
                            Visual representation of all project tasks
                        </p>
                    </div>

                    {/* View Controls */}
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                            <button
                                onClick={() => setGanttView("month")}
                                className={`px-3 py-1 rounded ${ganttView === "month" ? "bg-white shadow" : ""}`}
                            >
                                Month
                            </button>
                            <button
                                onClick={() => setGanttView("quarter")}
                                className={`px-3 py-1 rounded ${ganttView === "quarter" ? "bg-white shadow" : ""}`}
                            >
                                Quarter
                            </button>
                            <button
                                onClick={() => setGanttView("year")}
                                className={`px-3 py-1 rounded ${ganttView === "year" ? "bg-white shadow" : ""}`}
                            >
                                Year
                            </button>
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => navigateTimeline("prev")}
                                className="p-2 hover:bg-gray-100 rounded"
                            >
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => navigateTimeline("next")}
                                className="p-2 hover:bg-gray-100 rounded"
                            >
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Legend */}
                <div className="flex items-center gap-6 text-sm">
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-green-500 rounded"></div>
                        <span>Completed</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-blue-500 rounded"></div>
                        <span>In Progress</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-gray-400 rounded"></div>
                        <span>Pending</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-red-500 rounded"></div>
                        <span>Overdue</span>
                    </div>
                </div>

                {/* Gantt Chart */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="overflow-x-auto">
                        <div className="min-w-[1200px]">
                            {/* Timeline Header */}
                            <div className="flex border-b bg-gray-50">
                                <div className="w-64 p-4 font-semibold border-r">Task / System</div>
                                <div className="flex-1 flex">
                                    {columns.map((col, i) => (
                                        <div
                                            key={i}
                                            className="flex-1 p-4 text-center font-semibold border-r last:border-r-0"
                                        >
                                            {col.label}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Tasks by System */}
                            {Object.entries(groupedTasks).map(([system, tasks]) => (
                                <div key={system} className="border-b">
                                    {/* System Header */}
                                    <div className="flex bg-gray-100">
                                        <div className="w-64 p-3 font-semibold border-r flex items-center gap-2">
                                            <ChevronRight className="w-4 h-4" />
                                            {system}
                                            <span className="text-xs text-gray-500 ml-auto">
                                                ({tasks.length} tasks)
                                            </span>
                                        </div>
                                        <div className="flex-1 relative">
                                            {/* Today marker */}
                                            {(() => {
                                                const style = getTaskBarStyle(
                                                    { startDate: today, deadlineDate: today },
                                                    columns
                                                );
                                                if (style) {
                                                    return (
                                                        <div
                                                            className="absolute top-0 bottom-0 w-0.5 bg-red-500 z-10"
                                                            style={{ left: style.left }}
                                                        >
                                                            <div className="absolute -top-1 -left-2 w-4 h-4 bg-red-500 rounded-full"></div>
                                                        </div>
                                                    );
                                                }
                                            })()}
                                        </div>
                                    </div>

                                    {/* Task Rows */}
                                    {tasks.map((task, taskIdx) => {
                                        const barStyle = getTaskBarStyle(task, columns);

                                        return (
                                            <div key={taskIdx} className="flex hover:bg-gray-50">
                                                <div className="w-64 p-3 border-r text-sm">
                                                    <div className="font-medium truncate">
                                                        {task.subTask || task.task || `Task ${taskIdx + 1}`}
                                                    </div>
                                                    <div className="text-xs text-gray-500 mt-1">
                                                        {task.assigned_to}
                                                    </div>
                                                </div>

                                                <div className="flex-1 relative p-2">
                                                    {/* Timeline grid */}
                                                    <div className="absolute inset-0 flex">
                                                        {columns.map((_, i) => (
                                                            <div
                                                                key={i}
                                                                className="flex-1 border-r last:border-r-0"
                                                            ></div>
                                                        ))}
                                                    </div>

                                                    {/* Task bar */}
                                                    {barStyle && (
                                                        <div
                                                            className={`absolute top-2 bottom-2 rounded cursor-pointer hover:opacity-80 transition-opacity ${getTaskColor(task)}`}
                                                            style={barStyle}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setSelectedTask(task);
                                                                setShowTaskDetails(true);
                                                            }}
                                                            title={`${task.subTask || task.task}\n${task.status}\n${new Date(task.startDate).toLocaleDateString()} - ${new Date(task.deadlineDate).toLocaleDateString()}`}
                                                        >
                                                            <div className="px-2 py-1 text-white text-xs font-medium truncate">
                                                                {task.progress}%
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            ))}

                            {/* Empty state */}
                            {Object.keys(groupedTasks).length === 0 && (
                                <div className="p-12 text-center text-gray-500">
                                    <Calendar className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                    <p>No tasks with dates available</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-4 gap-4">
                    <div className="bg-white p-4 rounded-lg shadow">
                        <div className="text-sm text-gray-600">Total Tasks</div>
                        <div className="text-2xl font-bold mt-1">{tasksData.length}</div>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow">
                        <div className="text-sm text-gray-600">Completed</div>
                        <div className="text-2xl font-bold mt-1 text-green-600">
                            {tasksData.filter(t => t.status === "Completed").length}
                        </div>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow">
                        <div className="text-sm text-gray-600">In Progress</div>
                        <div className="text-2xl font-bold mt-1 text-blue-600">
                            {tasksData.filter(t => t.status === "In Progress").length}
                        </div>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow">
                        <div className="text-sm text-gray-600">Overdue</div>
                        <div className="text-2xl font-bold mt-1 text-red-600">
                            {tasksData.filter(t =>
                                t.status !== "Completed" &&
                                new Date(t.deadlineDate) < new Date()
                            ).length}
                        </div>
                    </div>
                </div>
            </div>
        );

    };
    //==================RENDER: Budget View

    const renderBudget = () => {
        // Calculate totals
        const totalAllocated = budgetCategories.reduce((sum, cat) => sum + cat.allocated, 0);
        const totalSpent = budgetCategories.reduce((sum, cat) => sum + getCategorySpent(cat.category_id), 0);
        const totalRemaining = totalAllocated - totalSpent;

        return (
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold flex items-center gap-2">
                            <DollarSign className="w-6 h-6" />
                            Budget Management
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">
                            Track budget allocations and expenses
                        </p>
                    </div>

                    {hasPermission("all") && (
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowAddCategoryModal(true)}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            >
                                <Plus className="w-4 h-4" />
                                Add Budget Category
                            </button>
                            <button
                                onClick={() => setShowAddExpenseModal(true)}
                                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                            >
                                <Plus className="w-4 h-4" />
                                Add Expense
                            </button>
                        </div>
                    )}
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-lg shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Total Budget</p>
                                <p className="text-2xl font-bold text-gray-900 mt-1">
                                    {formatCurrency(totalAllocated)}
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                <Target className="w-6 h-6 text-blue-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Total Spent</p>
                                <p className="text-2xl font-bold text-orange-600 mt-1">
                                    {formatCurrency(totalSpent)}
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                                <TrendingUp className="w-6 h-6 text-orange-600" />
                            </div>
                        </div>
                        <div className="mt-2">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <span>{((totalSpent / totalAllocated) * 100).toFixed(1)}% of budget</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Remaining</p>
                                <p className={`text-2xl font-bold mt-1 ${totalRemaining >= 0 ? 'text-green-600' : 'text-red-600'
                                    }`}>
                                    {formatCurrency(totalRemaining)}
                                </p>
                            </div>
                            <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${totalRemaining >= 0 ? 'bg-green-100' : 'bg-red-100'
                                }`}>
                                <Wallet className={`w-6 h-6 ${totalRemaining >= 0 ? 'text-green-600' : 'text-red-600'
                                    }`} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Budget Categories with Expenses */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Category
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Allocated
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Spent
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Remaining
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {budgetCategories.map((category) => {
                                    const spent = getCategorySpent(category.category_id);
                                    const remaining = category.allocated - spent;
                                    const percentage = (spent / category.allocated) * 100;
                                    const expenses = getCategoryExpenses(category.category_id);
                                    const isExpanded = expandedCategory === category.category_id;

                                    return (
                                        <React.Fragment key={category.category_id}>
                                            {/* Category Row */}
                                            <tr className="hover:bg-gray-50">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={() => setExpandedCategory(
                                                                isExpanded ? null : category.category_id
                                                            )}
                                                            className="text-gray-400 hover:text-gray-600"
                                                        >
                                                            {isExpanded ? (
                                                                <ChevronDown className="w-5 h-5" />
                                                            ) : (
                                                                <ChevronRight className="w-5 h-5" />
                                                            )}
                                                        </button>
                                                        <div>
                                                            <div className="font-semibold text-gray-900">
                                                                {category.category_name}
                                                            </div>
                                                            {expenses.length > 0 && (
                                                                <div className="text-xs text-gray-500">
                                                                    {expenses.length} expense{expenses.length !== 1 ? 's' : ''}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-sm font-medium">
                                                    {formatCurrency(category.allocated)}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-orange-600 font-medium">
                                                    {formatCurrency(spent)}
                                                </td>
                                                <td className="px-6 py-4 text-sm font-medium">
                                                    <span className={remaining >= 0 ? 'text-green-600' : 'text-red-600'}>
                                                        {formatCurrency(remaining)}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="space-y-1">
                                                        <div className="flex items-center gap-2">
                                                            <div className="flex-1 bg-gray-200 rounded-full h-2">
                                                                <div
                                                                    className={`h-2 rounded-full ${percentage >= 90 ? 'bg-red-500' :
                                                                        percentage >= 75 ? 'bg-orange-500' :
                                                                            'bg-green-500'
                                                                        }`}
                                                                    style={{ width: `${Math.min(percentage, 100)}%` }}
                                                                ></div>
                                                            </div>
                                                            <span className="text-xs font-medium text-gray-600">
                                                                {percentage.toFixed(1)}%
                                                            </span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <button
                                                        onClick={() => {
                                                            setSelectedCategory(category);
                                                            setExpenseForm({
                                                                ...expenseForm,
                                                                category_id: category.category_id
                                                            });
                                                            setShowAddExpenseModal(true);
                                                        }}
                                                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                                                    >
                                                        Add Expense
                                                    </button>
                                                </td>
                                            </tr>

                                            {/* Expenses Rows (Nested) */}
                                            {isExpanded && expenses.map((expense, idx) => (
                                                <tr key={expense.expense_id} className="bg-gray-50">
                                                    <td className="px-6 py-3 pl-16">
                                                        <div className="flex items-center gap-2">
                                                            <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                                                            <div className="text-sm">
                                                                <div className="font-medium text-gray-700">
                                                                    {expense.description || 'Expense ' + (idx + 1)}
                                                                </div>
                                                                <div className="text-xs text-gray-500">
                                                                    {expense.invoice_no && `Invoice: ${expense.invoice_no} • `}
                                                                    {new Date(expense.expense_date).toLocaleDateString()}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-3 text-sm text-gray-600">
                                                        <div className="text-xs text-gray-500">Recipient:</div>
                                                        <div className="font-medium">{expense.recipient}</div>
                                                    </td>
                                                    <td className="px-6 py-3 text-sm font-medium text-orange-600">
                                                        {formatCurrency(expense.amount)}
                                                    </td>
                                                    <td className="px-6 py-3 text-sm text-gray-500">
                                                        -
                                                    </td>
                                                    <td className="px-6 py-3">
                                                        <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded">
                                                            Paid
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-3">
                                                        {expense.attachment_url ? (
                                                            <button
                                                                onClick={() => window.open(expense.attachment_url, '_blank')}
                                                                className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
                                                            >
                                                                <Eye className="w-4 h-4" />
                                                                View
                                                            </button>
                                                        ) : (
                                                            <span className="text-xs text-gray-400">No attachment</span>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </React.Fragment>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {/* Empty State */}
                    {budgetCategories.length === 0 && (
                        <div className="p-12 text-center">
                            <DollarSign className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                            <h3 className="text-lg font-semibold mb-2">No budget categories yet</h3>
                            <p className="text-gray-600 mb-4">
                                Start by adding your first budget category
                            </p>
                            {hasPermission("all") && (
                                <button
                                    onClick={() => setShowAddCategoryModal(true)}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                >
                                    Add Budget Category
                                </button>
                            )}
                        </div>
                    )}
                </div>

                {/* Add Category Modal */}
                {showAddCategoryModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg p-6 w-full max-w-md">
                            <h3 className="text-xl font-bold mb-4">Add Budget Category</h3>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Category Name *</label>
                                    <input
                                        type="text"
                                        placeholder="e.g., Materials, Labor, Equipment"
                                        value={categoryForm.category_name}
                                        onChange={(e) => setCategoryForm({ ...categoryForm, category_name: e.target.value })}
                                        className="w-full px-3 py-2 border rounded-lg"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">Allocated Amount (SAR) *</label>
                                    <input
                                        type="number"
                                        placeholder="0.00"
                                        value={categoryForm.allocated}
                                        onChange={(e) => setCategoryForm({ ...categoryForm, allocated: e.target.value })}
                                        className="w-full px-3 py-2 border rounded-lg"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">Notes</label>
                                    <textarea
                                        placeholder="Additional notes..."
                                        value={categoryForm.notes}
                                        onChange={(e) => setCategoryForm({ ...categoryForm, notes: e.target.value })}
                                        className="w-full px-3 py-2 border rounded-lg"
                                        rows="3"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-3 mt-6">
                                <button
                                    onClick={() => setShowAddCategoryModal(false)}
                                    className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={addBudgetCategory}
                                    disabled={uploadingCategory}
                                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {uploadingCategory ? (
                                        <>
                                            <RefreshCw className="w-4 h-4 animate-spin" />
                                            Adding...
                                        </>
                                    ) : (
                                        <>
                                            <Plus className="w-4 h-4" />
                                            Add Category
                                        </>
                                    )}
                                </button>

                            </div>
                        </div>
                    </div>
                )}

                {/* Add Expense Modal */}
                {showAddExpenseModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                            <h3 className="text-xl font-bold mb-4">Add Expense</h3>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium mb-2">Budget Category *</label>
                                    <select
                                        value={expenseForm.category_id}
                                        onChange={(e) => setExpenseForm({ ...expenseForm, category_id: e.target.value })}
                                        className="w-full px-3 py-2 border rounded-lg"
                                    >
                                        <option value="">Select category</option>
                                        {budgetCategories.map(cat => (
                                            <option key={cat.category_id} value={cat.category_id}>
                                                {cat.category_name} - Remaining: {formatCurrency(getCategoryRemaining(cat))}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">Amount (SAR) *</label>
                                    <input
                                        type="number"
                                        placeholder="0.00"
                                        value={expenseForm.amount}
                                        onChange={(e) => setExpenseForm({ ...expenseForm, amount: e.target.value })}
                                        className="w-full px-3 py-2 border rounded-lg"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">Recipient *</label>
                                    <input
                                        type="text"
                                        placeholder="Person/Company name"
                                        value={expenseForm.recipient}
                                        onChange={(e) => setExpenseForm({ ...expenseForm, recipient: e.target.value })}
                                        className="w-full px-3 py-2 border rounded-lg"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">Invoice Number</label>
                                    <input
                                        type="text"
                                        placeholder="INV-001"
                                        value={expenseForm.invoice_no}
                                        onChange={(e) => setExpenseForm({ ...expenseForm, invoice_no: e.target.value })}
                                        className="w-full px-3 py-2 border rounded-lg"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">Expense Date *</label>
                                    <input
                                        type="date"
                                        value={expenseForm.expense_date}
                                        onChange={(e) => setExpenseForm({ ...expenseForm, expense_date: e.target.value })}
                                        className="w-full px-3 py-2 border rounded-lg"
                                    />
                                </div>

                                <div className="col-span-2">
                                    <label className="block text-sm font-medium mb-2">Description</label>
                                    <textarea
                                        placeholder="What was this expense for?"
                                        value={expenseForm.description}
                                        onChange={(e) => setExpenseForm({ ...expenseForm, description: e.target.value })}
                                        className="w-full px-3 py-2 border rounded-lg"
                                        rows="2"
                                    />
                                </div>

                                <div className="col-span-2">
                                    <label className="block text-sm font-medium mb-2">
                                        Attachment (Invoice/Receipt)
                                    </label>
                                    <input
                                        type="file"
                                        accept="image/*,application/pdf"
                                        onChange={(e) => setExpenseForm({ ...expenseForm, attachment: e.target.files[0] })}
                                        className="w-full px-3 py-2 border rounded-lg"
                                    />
                                    {expenseForm.attachment && (
                                        <p className="text-sm text-gray-600 mt-1">
                                            Selected: {expenseForm.attachment.name}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="flex gap-3 mt-6">
                                <button
                                    onClick={() => {
                                        setShowAddExpenseModal(false);
                                        setExpenseForm({
                                            category_id: '',
                                            amount: '',
                                            recipient: '',
                                            invoice_no: '',
                                            expense_date: new Date().toISOString().split('T')[0],
                                            description: '',
                                            attachment: null
                                        });
                                    }}
                                    className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                {/* في Add Expense Modal - استبدل الـ Submit button */}

                                <button
                                    onClick={addBudgetExpense}
                                    disabled={uploadingExpense}
                                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {uploadingExpense ? (
                                        <>
                                            <RefreshCw className="w-4 h-4 animate-spin" />
                                            Uploading...
                                        </>
                                    ) : (
                                        <>
                                            <Plus className="w-4 h-4" />
                                            Add Expense
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    };


    // ========== RENDER: DOCUMENTATION VIEW ==========

    const renderDocumentation = () => {
        return (
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold flex items-center gap-2">
                            <Folder className="w-6 h-6" />
                            Document Management
                        </h2>
                        <p className="text-sm text-gray-500 mt-1">
                            Store and manage all project documents
                        </p>
                    </div>

                    {hasPermission("all") && (
                        <button
                            onClick={() => setShowUploadModal(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                            <Upload className="w-4 h-4" />
                            Upload Document
                        </button>
                    )}
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-4 gap-4">
                    <div className="bg-white p-4 rounded-lg shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-sm text-gray-600">Total Documents</div>
                                <div className="text-2xl font-bold mt-1">{documentStats.total}</div>
                            </div>
                            <FileText className="w-8 h-8 text-blue-500 opacity-50" />
                        </div>
                    </div>

                    <div className="bg-white p-4 rounded-lg shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-sm text-gray-600">Contracts</div>
                                <div className="text-2xl font-bold mt-1">{documentStats.byCategory.Contract || 0}</div>
                            </div>
                            <FileText className="w-8 h-8 text-green-500 opacity-50" />
                        </div>
                    </div>

                    <div className="bg-white p-4 rounded-lg shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-sm text-gray-600">Drawings</div>
                                <div className="text-2xl font-bold mt-1">{documentStats.byCategory.Drawing || 0}</div>
                            </div>
                            <BarChart2 className="w-8 h-8 text-yellow-500 opacity-50" />
                        </div>
                    </div>

                    <div className="bg-white p-4 rounded-lg shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="text-sm text-gray-600">Reports</div>
                                <div className="text-2xl font-bold mt-1">{documentStats.byCategory["Test Report"] || 0}</div>
                            </div>
                            <FileSpreadsheet className="w-8 h-8 text-purple-500 opacity-50" />
                        </div>
                    </div>
                </div>

                {/* Filters & Search */}
                <div className="bg-white p-4 rounded-lg shadow">
                    <div className="flex items-center gap-4">
                        {/* Category Filter */}
                        <div className="flex-1">
                            <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                                <Filter className="w-4 h-4" />
                                Category
                            </div>
                            <select
                                value={documentFilter}
                                onChange={(e) => setDocumentFilter(e.target.value)}
                                className="w-full px-3 py-2 border rounded-lg"
                            >
                                <option value="All">All Categories</option>
                                {DOCUMENT_CATEGORIES.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>

                        {/* Search */}
                        <div className="flex-1">
                            <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                                <Search className="w-4 h-4" />
                                Search
                            </div>
                            <input
                                type="text"
                                placeholder="Search documents..."
                                value={documentSearchTerm}
                                onChange={(e) => setDocumentSearchTerm(e.target.value)}
                                className="w-full px-3 py-2 border rounded-lg"
                            />
                        </div>
                    </div>
                </div>

                {/* Documents Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredDocuments.map((doc, idx) => (
                        <div key={idx} className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow">
                            <div className="p-4">
                                {/* Icon & Category */}
                                <div className="flex items-start justify-between mb-3">
                                    {getFileIcon(doc.fileName)}
                                    <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded">
                                        {doc.category}
                                    </span>
                                </div>

                                {/* Title */}
                                <h3 className="font-semibold text-lg mb-2 truncate">
                                    {doc.title}
                                </h3>

                                {/* Description */}
                                {doc.description && (
                                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                                        {doc.description}
                                    </p>
                                )}

                                {/* Meta info */}
                                <div className="space-y-1 text-xs text-gray-500 mb-3">
                                    <div>File: {doc.fileName}</div>
                                    <div>Size: {formatFileSize(doc.fileSize)}</div>
                                    <div>Uploaded: {new Date(doc.timestamp).toLocaleDateString()}</div>
                                    <div>By: {doc.uploadedBy}</div>
                                </div>

                                {/* Tags */}
                                {doc.tags && (
                                    <div className="flex flex-wrap gap-1 mb-3">
                                        {doc.tags.split(',').map((tag, i) => (
                                            <span key={i} className="text-xs px-2 py-0.5 bg-gray-100 rounded">
                                                {tag.trim()}
                                            </span>
                                        ))}
                                    </div>
                                )}

                                {/* Actions */}
                                <div className="flex items-center gap-2 pt-3 border-t">
                                    <button
                                        onClick={() => window.open(doc.fileUrl, '_blank')}
                                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 rounded hover:bg-blue-100"
                                    >
                                        <Eye className="w-4 h-4" />
                                        View
                                    </button>
                                    <button
                                        onClick={() => {
                                            const link = document.createElement('a');
                                            link.href = doc.fileUrl;
                                            link.download = doc.fileName;
                                            link.click();
                                        }}
                                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-green-50 text-green-600 rounded hover:bg-green-100"
                                    >
                                        <Download className="w-4 h-4" />
                                        Download
                                    </button>
                                    {hasPermission("all") && (
                                        <button onClick={() => deleteDocument(doc.fileId)}>
                                            <Trash2 className="w-4 h-4" />
                                        </button>

                                    )}


                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Empty State */}
                {filteredDocuments.length === 0 && (
                    <div className="bg-white rounded-lg shadow p-12 text-center">
                        <Folder className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                        <h3 className="text-lg font-semibold mb-2">No documents found</h3>
                        <p className="text-gray-600 mb-4">
                            {documentSearchTerm || documentFilter !== "All"
                                ? "Try adjusting your filters"
                                : "Upload your first document to get started"}
                        </p>
                        {hasPermission("all") && (
                            <button
                                onClick={() => setShowUploadModal(true)}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            >
                                Upload Document
                            </button>
                        )}
                    </div>
                )}

                {/* Upload Modal */}
                {showUploadModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg p-6 w-full max-w-md">
                            <h3 className="text-xl font-bold mb-4">Upload Document</h3>

                            <div className="space-y-4">
                                {/* File */}
                                <div>
                                    <label className="block text-sm font-medium mb-2">File *</label>
                                    <input
                                        type="file"
                                        onChange={(e) => setUploadForm({ ...uploadForm, file: e.target.files[0] })}
                                        className="w-full px-3 py-2 border rounded-lg"
                                    />
                                </div>

                                {/* Category */}
                                <div>
                                    <label className="block text-sm font-medium mb-2">Category *</label>
                                    <select
                                        value={uploadForm.category}
                                        onChange={(e) => setUploadForm({ ...uploadForm, category: e.target.value })}
                                        className="w-full px-3 py-2 border rounded-lg"
                                    >
                                        {DOCUMENT_CATEGORIES.map(cat => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Title */}
                                <div>
                                    <label className="block text-sm font-medium mb-2">Title *</label>
                                    <input
                                        type="text"
                                        placeholder="Document title"
                                        value={uploadForm.title}
                                        onChange={(e) => setUploadForm({ ...uploadForm, title: e.target.value })}
                                        className="w-full px-3 py-2 border rounded-lg"
                                    />
                                </div>

                                {/* Description */}
                                <div>
                                    <label className="block text-sm font-medium mb-2">Description</label>
                                    <textarea
                                        placeholder="Brief description..."
                                        value={uploadForm.description}
                                        onChange={(e) => setUploadForm({ ...uploadForm, description: e.target.value })}
                                        className="w-full px-3 py-2 border rounded-lg"
                                        rows="3"
                                    />
                                </div>

                                {/* Tags */}
                                <div>
                                    <label className="block text-sm font-medium mb-2">Tags (comma-separated)</label>
                                    <input
                                        type="text"
                                        placeholder="tag1, tag2, tag3"
                                        value={uploadForm.tags}
                                        onChange={(e) => setUploadForm({ ...uploadForm, tags: e.target.value })}
                                        className="w-full px-3 py-2 border rounded-lg"
                                    />
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3 mt-6">
                                <button
                                    onClick={() => setShowUploadModal(false)}
                                    className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50"
                                    disabled={uploadingDocument}
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={uploadDocument}
                                    disabled={uploadingDocument}
                                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                                >
                                    {uploadingDocument ? "Uploading..." : "Upload"}
                                </button>
                            </div>
                        </div>
                    </div>
                )}


            </div>
        );
    };

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

    //useEffect(() => {
    /// emailjs.init(process.env.REACT_APP_EMAILJS_PUBLIC_KEY);
    // }, []);

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
                fetch1(GOOGLE_SHEETS.budgetCategories, setBudgetCategories, data => data.map(d => ({
                    ...d,
                    allocated: Number(d.allocated) || 0



                }))),
                fetch1(GOOGLE_SHEETS.budgetExpenses, setBudgetExpenses, data => data.map(d => ({
                    ...d,
                    amount: Number(d.amount) || 0
                }))),
                fetch1(GOOGLE_SHEETS.documents, setDocumentsData),
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


    useEffect(() => {
        if (isLoggedIn && currentProjectId) {
            console.log('📊 Project changed to:', PROJECT.name);
            fetchData();
        }
    }, [currentProjectId]);

    // ========== PROJECT SELECTOR COMPONENT ==========
    const ProjectSelector = () => (
        <div className="relative">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Current Project
            </label>
            <select
                value={currentProjectId}
                onChange={(e) => {
                    const newProjectId = e.target.value;

                    if (window.confirm(`Switch to ${PROJECTS[newProjectId].shortName}?\n\nCurrent view will be cleared.`)) {
                        console.log('🔄 Switching to project:', newProjectId);

                        setSwitchingProject(true);
                        setCurrentProjectId(newProjectId);
                        localStorage.setItem('selectedProject', newProjectId);

                        // Clear all data
                        console.log('🗑️ Clearing data...');
                        setTasksData([]);
                        setTeamData([]);
                        setBudgetData([]);
                        setMaterialsData([]);
                        setPerformanceData([]);
                        setPhotosData([]);
                        setCommentsData([]);
                        setInvoicesData([]);
                        setClientAccountData([]);
                        setBudgetCategories([]);
                        setBudgetExpenses([]);
                        setDocumentsData([]);
                        setNotifications([]);
                        setPaymentMilestonesData([]);
                        setChangeOrdersData([]);
                        setCashFlowData([]);

                        // Refetch data
                        setTimeout(() => {
                            console.log('📥 Fetching new project data...');
                            fetchData();
                            setSwitchingProject(false);
                        }, 500);
                    }
                }}
                className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm ${darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white'
                    }`}
                disabled={switchingProject}
            >
                {Object.values(PROJECTS).map(project => (
                    <option key={project.id} value={project.id}>
                        {project.shortName}
                    </option>
                ))}
            </select>

            {/* Project Info Card */}
            <div className={`mt-2 p-3 rounded-lg text-xs ${darkMode ? 'bg-gray-700' : 'bg-blue-50'
                }`}>
                <div className="flex items-center justify-between mb-1">
                    <span className="text-gray-600 dark:text-gray-400">Client:</span>
                    <span className="font-medium text-xs">{PROJECT.client}</span>
                </div>
                <div className="flex items-center justify-between mb-1">
                    <span className="text-gray-600 dark:text-gray-400">Value:</span>
                    <span className="font-medium">
                        SAR {PROJECT.totalValue.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                        })}
                    </span>
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">End:</span>
                    <span className="font-medium">
                        {PROJECT.endDate.toLocaleDateString('en-US', {
                            month: 'short',
                            year: 'numeric'
                        })}
                    </span>
                </div>
            </div>
        </div>
    );

    // ========== PROJECT SWITCHING OVERLAY ==========
    const ProjectSwitchingOverlay = () => {
        if (!switchingProject) return null;

        return (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className={`p-6 rounded-lg shadow-xl ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                    <RefreshCw className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
                    <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-700'}`}>
                        Switching to {PROJECTS[currentProjectId]?.shortName}...
                    </p>
                    <p className={`text-sm mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        Loading project data...
                    </p>
                </div>
            </div>
        );
    };
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
        totalBudget: budgetCategories.reduce((sum, cat) => sum + cat.allocated, 0),
        totalSpent: budgetCategories.reduce((sum, cat) => sum + getCategorySpent(cat.category_id), 0),
        daysLeft: Math.ceil((PROJECT.endDate - new Date()) / 86400000),
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

    // ========== LOGIN PAGE مع Company Card ==========
    // ========== LOGIN PAGE مع Company Card ==========
    // ========== ENHANCED LOGIN PAGE ==========
    if (!isLoggedIn) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden">

                {/* Background */}
                <div className="absolute inset-0 overflow-hidden">
                    <div
                        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                        style={{
                            backgroundImage:
                                "url(https://images.unsplash.com/photo-1639322537228-f710d846310a)",
                            filter: "brightness(1.7) saturate(1.2)",
                        }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-900/90 via-blue-900/85 to-purple-900/90" />
                </div>

                {/* Main Content */}
                <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
                    <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">

                        {/* ================= LEFT SIDE ================= */}
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                            className="hidden lg:block"
                        >
                            <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">
                                {/* Company Card Content */}
                                <div className="text-center mb-8">
                                    <motion.div
                                        whileHover={{ scale: 1.05, rotate: 5 }}
                                        transition={{ type: "spring", stiffness: 300 }}
                                        className="w-32 h-32 mx-auto mb-6 bg-white rounded-2xl p-4 shadow-xl flex items-center justify-center relative overflow-hidden group"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-purple-600 opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
                                        <Briefcase className="w-20 h-20 text-blue-600 relative z-10" />
                                    </motion.div>
                                    <motion.h1
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.3 }}
                                        className="text-3xl font-bold text-white mb-2"
                                    >
                                        {COMPANY_INFO.name}
                                    </motion.h1>
                                    <motion.p
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.5 }}
                                        className="text-blue-200 text-lg"
                                    >
                                        {COMPANY_INFO.tagline}
                                    </motion.p>
                                </div>

                                {/* Company Stats */}
                                <div className="grid grid-cols-2 gap-4 mb-8">
                                    {[
                                        { value: COMPANY_INFO.projects, label: 'Projects', icon: Briefcase },
                                        { value: COMPANY_INFO.clients, label: 'Happy Clients', icon: Users },
                                        { value: COMPANY_INFO.employees, label: 'Employees', icon: Users },
                                        { value: COMPANY_INFO.founded, label: 'Established', icon: Calendar, isYear: true }
                                    ].map((stat, index) => (
                                        <motion.div
                                            key={index}
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: 0.6 + index * 0.1 }}
                                            whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.15)' }}
                                            className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center border border-white/20 cursor-pointer transition-all duration-300"
                                        >
                                            <div className="text-3xl font-bold text-white mb-1">
                                                {stat.isYear ? stat.value : <><CountUp end={parseInt(stat.value)} duration={2.5} />+</>}
                                            </div>
                                            <div className="text-blue-200 text-sm">{stat.label}</div>
                                        </motion.div>
                                    ))}
                                </div>

                                {/* Company Contact */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 1 }}
                                    className="space-y-3"
                                >
                                    {[
                                        { icon: MapPin, text: COMPANY_INFO.address },
                                        { icon: Phone, text: COMPANY_INFO.phone },
                                        { icon: Mail, text: COMPANY_INFO.email }
                                    ].map((contact, index) => (
                                        <motion.div
                                            key={index}
                                            whileHover={{ x: 5 }}
                                            className="flex items-center gap-3 text-white cursor-pointer"
                                        >
                                            <contact.icon size={18} className="text-blue-300" />
                                            <span className="text-sm">{contact.text}</span>
                                        </motion.div>
                                    ))}
                                </motion.div>
                            </div>
                        </motion.div>

                        {/* ================= RIGHT SIDE ================= */}
                        <div className="flex flex-col">

                            {/* Login Card */}
                            <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8">
                                <div className="text-center mb-8">
                                    <h3 className="text-3xl font-bold text-white mb-2">
                                        Welcome Back
                                    </h3>
                                    <p className="text-gray-300">
                                        Sign in to access your dashboard
                                    </p>
                                </div>

                                {loginError && (
                                    <div className="mb-6 p-4 bg-red-500/20 border border-red-500/50 rounded-xl flex items-center gap-3">
                                        <AlertCircle className="w-5 h-5 text-red-300 flex-shrink-0" />
                                        <p className="text-red-200 text-sm">{loginError}</p>
                                    </div>
                                )}

                                <form
                                    onSubmit={(e) => { e.preventDefault(); handleLogin(); }}
                                    className="space-y-6"
                                >
                                    {/* Username */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-200 mb-2">Username</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <Shield className="w-5 h-5 text-gray-400" />
                                            </div>
                                            <input
                                                type="text"
                                                value={loginForm.username}
                                                onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                                                className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                                placeholder="Enter your username"
                                                autoComplete="username"
                                                required
                                            />
                                        </div>
                                    </div>

                                    {/* Password */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-200 mb-2">Password</label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                                <Lock className="w-5 h-5 text-gray-400" />
                                            </div>
                                            <input
                                                type="password"
                                                value={loginForm.password}
                                                onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                                                className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                                placeholder="Enter your password"
                                                autoComplete="current-password"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl"
                                    >
                                        Sign In
                                    </button>
                                </form>
                            </div>

                            {/* Quick Access */}
                            <div className="mt-6 text-center">
                                <p className="text-gray-300 text-sm mb-3">Quick Access</p>
                                <div className="flex justify-center gap-3">
                                    {Object.entries(USERS).map(([key, user]) => (
                                        <button
                                            key={key}
                                            onClick={() => setLoginForm({ username: key, password: "" })}
                                            className="w-12 h-12 rounded-full bg-white/10 border border-white/20 overflow-hidden"
                                            title={user.name}
                                        >
                                            <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                                        </button>
                                    ))}
                                </div>
                            </div>

                        </div> {/* End RIGHT SIDE */}

                    </div> {/* End grid */}
                </div> {/* End Main Content */}

            </div>
        );
    }
    // ========== ADDITIONAL STATE (Add to your component) ==========
    // Add these state variables at the top of your component:
    // const [showPassword, setShowPassword] = useState(false);
    // const [loginError, setLoginError] = useState('');

    // ========== REQUIRED IMPORTS ==========
    // Make sure you have these imports:
    // import { User, Lock, Eye, EyeOff, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react';
    // import { AnimatePresence } from 'framer-motion';
    // ========== MAIN DASHBOARD ==========
    return (
        <div className={`min-h-screen ${theme.bg} transition-colors duration-300`}>
            {/* Project Switching Overlay */}
            <ProjectSwitchingOverlay />

            {/* ============ PROFESSIONAL HEADER ============ */}
            <div className={`${theme.card} border-b ${theme.border} sticky top-0 z-50 backdrop-blur-xl bg-opacity-95 shadow-lg`}>
                <div className="max-w-[1920px] mx-auto px-6 lg:px-8">

                    {/* Top Bar */}
                    <div className="flex items-center justify-between py-4">

                        {/* Left Section: Logo + Project Info */}
                        <div className="flex items-center gap-4">
                            {/* Logo */}
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                                className="relative group"
                            >
                                <div className="w-14 h-14 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 rounded-2xl flex items-center justify-center shadow-xl shadow-blue-500/20 group-hover:shadow-2xl group-hover:shadow-blue-500/40 transition-all duration-300 group-hover:scale-105">
                                    <Briefcase className="w-7 h-7 text-white" strokeWidth={2.5} />
                                </div>
                                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-gradient-to-br from-emerald-400 to-emerald-600 border-3 border-white dark:border-slate-900 rounded-full shadow-lg animate-pulse"></div>
                            </motion.div>

                            {/* Project Info */}
                            <div className="hidden lg:block">
                                <h1 className={`text-xl font-bold ${theme.text} tracking-tight`}>
                                    {PROJECT.shortName}
                                </h1>
                                <div className="flex items-center gap-3 mt-1">
                                    <span className={`text-sm ${theme.subtext}`}>{PROJECT.client}</span>
                                    <span className="w-1 h-1 rounded-full bg-slate-400"></span>
                                    <span className="px-2.5 py-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-xs font-semibold rounded-full shadow-sm">
                                        Active
                                    </span>
                                </div>
                            </div>

                            {/* Mobile Menu Toggle */}
                            <button
                                onClick={() => setShowMobileMenu(!showMobileMenu)}
                                className={`lg:hidden p-2.5 rounded-lg ${theme.hover} transition-colors`}
                            >
                                {showMobileMenu ? <X size={24} /> : <Menu size={24} />}
                            </button>
                        </div>

                        {/* Center Section: Project Selector */}
                        <div className="hidden xl:flex flex-1 max-w-md mx-8">
                            <ProjectSelector
                                currentProjectId={currentProjectId}
                                onProjectChange={handleProjectChange}
                                projects={PROJECTS}
                            />
                        </div>

                        {/* Right Section: Actions */}
                        <div className="flex items-center gap-2">

                            {/* Quick Stats */}
                            <div className="hidden 2xl:flex items-center gap-2">
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    className="px-4 py-2 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 dark:from-blue-900/20 dark:to-blue-800/20 dark:border-blue-800"
                                >
                                    <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">Tasks</p>
                                    <p className="text-lg font-bold text-blue-700 dark:text-blue-300">
                                        <CountUp end={stats.completed} duration={1} />/{stats.totalTasks}
                                    </p>
                                </motion.div>
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    className="px-4 py-2 rounded-xl bg-gradient-to-br from-green-50 to-green-100 border border-green-200 dark:from-green-900/20 dark:to-green-800/20 dark:border-green-800"
                                >
                                    <p className="text-xs text-green-600 dark:text-green-400 font-medium">Team</p>
                                    <p className="text-lg font-bold text-green-700 dark:text-green-300">
                                        <CountUp end={teamData.length} duration={1} />
                                    </p>
                                </motion.div>
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    className="px-4 py-2 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 dark:from-purple-900/20 dark:to-purple-800/20 dark:border-purple-800"
                                >
                                    <p className="text-xs text-purple-600 dark:text-purple-400 font-medium">Budget</p>
                                    <p className="text-lg font-bold text-purple-700 dark:text-purple-300">
                                        <CountUp end={Math.round((stats.totalSpent / stats.totalBudget) * 100)} duration={1} />%
                                    </p>
                                </motion.div>
                            </div>

                            {/* Divider */}
                            <div className={`hidden 2xl:block w-px h-10 ${darkMode ? 'bg-slate-700' : 'bg-slate-200'}`}></div>

                            {/* Auto Refresh */}
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setAutoRefresh(!autoRefresh)}
                                className={`p-3 rounded-xl transition-all duration-300 ${autoRefresh
                                    ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40'
                                    : `${theme.input} ${theme.text} ${theme.hover} border ${theme.border}`
                                    }`}
                                title="Auto-refresh every 30s"
                            >
                                <RefreshCw size={18} className={autoRefresh ? 'animate-spin' : ''} strokeWidth={2.5} />
                            </motion.button>

                            {/* Notifications */}
                            <div className="relative">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setShowNotifications(!showNotifications)}
                                    className={`p-3 rounded-xl relative transition-all duration-200 ${theme.input} ${theme.hover} border ${theme.border}`}
                                >
                                    <Bell size={18} className={theme.text} strokeWidth={2.5} />
                                    {notifications.length > 0 && (
                                        <>
                                            <span className="absolute top-1 right-1 w-5 h-5 bg-gradient-to-r from-red-500 to-rose-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-lg z-10">
                                                {notifications.length}
                                            </span>
                                            <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 rounded-full animate-ping opacity-75"></span>
                                        </>
                                    )}
                                </motion.button>

                                {/* Notifications Dropdown */}
                                <AnimatePresence>
                                    {showNotifications && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                            transition={{ duration: 0.2 }}
                                            className={`absolute right-0 mt-3 w-96 ${theme.card} rounded-2xl shadow-2xl border ${theme.border} overflow-hidden z-50`}
                                        >
                                            <div className="p-5 bg-gradient-to-r from-blue-600 to-indigo-600">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <h3 className="font-bold text-white text-lg">Notifications</h3>
                                                        <p className="text-blue-100 text-sm mt-0.5">{notifications.length} unread messages</p>
                                                    </div>
                                                    <button className="p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors">
                                                        <Settings size={18} className="text-white" />
                                                    </button>
                                                </div>
                                            </div>

                                            {notifications.length === 0 ? (
                                                <div className="p-12 text-center">
                                                    <Bell className={`w-16 h-16 mx-auto ${theme.subtext} opacity-30`} />
                                                    <p className={`${theme.subtext} mt-3 text-sm`}>No new notifications</p>
                                                </div>
                                            ) : (
                                                <div className="max-h-[400px] overflow-y-auto">
                                                    {notifications.map((notif, idx) => {
                                                        const Icon = notif.icon;
                                                        return (
                                                            <motion.div
                                                                key={notif.id}
                                                                initial={{ opacity: 0, x: -20 }}
                                                                animate={{ opacity: 1, x: 0 }}
                                                                transition={{ delay: idx * 0.05 }}
                                                                className={`p-4 border-b ${theme.border} ${theme.hover} cursor-pointer transition-colors group ${idx === notifications.length - 1 ? 'border-b-0' : ''}`}
                                                            >
                                                                <div className="flex items-start gap-3">
                                                                    <div className={`p-2 rounded-lg bg-${notif.color}-100 dark:bg-${notif.color}-900/30 group-hover:scale-110 transition-transform`}>
                                                                        <Icon size={18} className={`text-${notif.color}-600 dark:text-${notif.color}-400`} />
                                                                    </div>
                                                                    <div className="flex-1 min-w-0">
                                                                        <p className={`text-sm ${theme.text} font-medium`}>{notif.message}</p>
                                                                        <p className={`text-xs ${theme.subtext} mt-1 flex items-center gap-1`}>
                                                                            <Clock size={12} />
                                                                            {notif.time}
                                                                        </p>
                                                                    </div>
                                                                    {notif.priority === 'high' && (
                                                                        <span className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs font-semibold rounded-full">
                                                                            Urgent
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            </motion.div>
                                                        );
                                                    })}
                                                </div>
                                            )}

                                            <div className={`p-3 border-t ${theme.border} bg-slate-50 dark:bg-slate-800/50`}>
                                                <button className="w-full text-center text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors">
                                                    View all notifications
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Settings */}
                            <motion.button
                                whileHover={{ scale: 1.05, rotate: 90 }}
                                whileTap={{ scale: 0.95 }}
                                className={`hidden md:flex p-3 rounded-xl transition-all duration-200 ${theme.input} ${theme.hover} border ${theme.border}`}
                            >
                                <Settings size={18} className={theme.text} strokeWidth={2.5} />
                            </motion.button>

                            {/* Theme Toggle */}
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95, rotate: 180 }}
                                onClick={() => setDarkMode(!darkMode)}
                                className={`p-3 rounded-xl transition-all duration-200 ${theme.input} ${theme.hover} border ${theme.border}`}
                            >
                                {darkMode ?
                                    <Sun size={18} className="text-amber-500" strokeWidth={2.5} /> :
                                    <Moon size={18} className="text-slate-700" strokeWidth={2.5} />
                                }
                            </motion.button>

                            {/* Divider */}
                            <div className={`w-px h-10 ${darkMode ? 'bg-slate-700' : 'bg-slate-200'}`}></div>

                            {/* User Menu */}
                            <div className="relative">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => setShowUserMenu(!showUserMenu)}
                                    className={`flex items-center gap-3 p-2 pr-4 rounded-xl transition-all duration-200 ${theme.hover} border ${theme.border}`}
                                >
                                    <div className="relative">
                                        <img
                                            src={currentUser.avatar}
                                            alt={currentUser.name}
                                            className="w-10 h-10 rounded-xl ring-2 ring-blue-500 object-cover shadow-md"
                                        />
                                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white dark:border-slate-800 rounded-full"></div>
                                    </div>
                                    <div className="text-left hidden xl:block">
                                        <p className={`text-sm font-semibold ${theme.text} leading-tight`}>{currentUser.name}</p>
                                        <p className={`text-xs ${theme.subtext} leading-tight`}>{currentUser.position}</p>
                                    </div>
                                    <ChevronDown size={16} className={`${theme.subtext} transition-transform ${showUserMenu ? 'rotate-180' : ''}`} />
                                </motion.button>

                                {/* User Dropdown */}
                                <AnimatePresence>
                                    {showUserMenu && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                            transition={{ duration: 0.2 }}
                                            className={`absolute right-0 mt-3 w-64 ${theme.card} rounded-2xl shadow-2xl border ${theme.border} overflow-hidden z-50`}
                                        >
                                            <div className="p-4 bg-gradient-to-r from-blue-600 to-indigo-600">
                                                <div className="flex items-center gap-3">
                                                    <img src={currentUser.avatar} alt="" className="w-12 h-12 rounded-xl border-2 border-white" />
                                                    <div>
                                                        <p className="text-white font-semibold">{currentUser.name}</p>
                                                        <p className="text-blue-100 text-xs">{currentUser.department}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="p-2">
                                                <button className={`w-full flex items-center gap-3 p-3 rounded-lg ${theme.hover} transition-colors`}>
                                                    <Settings size={18} className={theme.text} />
                                                    <span className={`text-sm font-medium ${theme.text}`}>Settings</span>
                                                </button>
                                                <button className={`w-full flex items-center gap-3 p-3 rounded-lg ${theme.hover} transition-colors`}>
                                                    <Users size={18} className={theme.text} />
                                                    <span className={`text-sm font-medium ${theme.text}`}>Switch Project</span>
                                                </button>
                                            </div>

                                            <div className={`p-2 border-t ${theme.border}`}>
                                                <button
                                                    onClick={handleLogout}
                                                    className="w-full flex items-center gap-3 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                                                >
                                                    <LogOut size={18} />
                                                    <span className="text-sm font-semibold">Logout</span>
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>



                    {/* Navigation Tabs */}
                    <div className="relative -mb-px">
                        <div className="flex gap-1 overflow-x-auto scrollbar-hide pb-3">
                            {["Overview", "Tasks", "Team", "Materials", "Photos", "Invoices", "Client Account", "Comments", "Timeline", "Documents", "Expenses Management"].map((item, idx) => {
                                const icons = {
                                    "Overview": TrendingUp,
                                    "Tasks": CheckCircle,
                                    "Team": Users,
                                    "Materials": Package,
                                    "Photos": ImageIcon,
                                    "Invoices": Receipt,
                                    "Client Account": Wallet,
                                    "Comments": MessageSquare,
                                    "Timeline": Calendar,
                                    "Documents": FileText,
                                    "Expenses Management": DollarSign
                                };
                                const Icon = icons[item];

                                return (
                                    <motion.button
                                        key={idx}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setView(item)}
                                        className={`group relative flex items-center gap-2 px-5 py-3 rounded-t-xl font-semibold whitespace-nowrap transition-all duration-200 ${view === item
                                            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/20'
                                            : `${theme.text} ${theme.hover}`
                                            }`}
                                    >
                                        <Icon size={16} strokeWidth={2.5} className={view === item ? 'text-white' : theme.subtext} />
                                        <span>{item}</span>
                                        {view === item && (
                                            <motion.div
                                                layoutId="activeTab"
                                                className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-white rounded-t-full"
                                            ></motion.div>
                                        )}
                                    </motion.button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {showMobileMenu && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className={`lg:hidden ${theme.bg} border-b ${theme.border} overflow-hidden`}
                    >
                        <div className="p-4 space-y-2">
                            {["Overview", "Tasks", "Team", "Materials", "Photos", "Invoices", "Client Account", "Comments", "Timeline", "Documents", "Expenses Management"].map((item, idx) => {
                                const icons = {
                                    "Overview": TrendingUp,
                                    "Tasks": CheckCircle,
                                    "Team": Users,
                                    "Materials": Package,
                                    "Photos": ImageIcon,
                                    "Invoices": Receipt,
                                    "Client Account": Wallet,
                                    "Comments": MessageSquare,
                                    "Timeline": Calendar,
                                    "Documents": FileText,
                                    "Expenses Management": DollarSign
                                };
                                const Icon = icons[item];

                                return (
                                    <motion.button
                                        key={idx}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: idx * 0.05 }}
                                        onClick={() => {
                                            setView(item);
                                            setShowMobileMenu(false);
                                        }}
                                        className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all ${view === item
                                            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white'
                                            : `${theme.hover} ${theme.text}`
                                            }`}
                                    >
                                        <Icon size={18} />
                                        <span className="font-medium">{item}</span>
                                    </motion.button>
                                );
                            })}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* CONTENT */}
            <div className="max-w-7xl mx-auto px-4 py-6">
                {/* OVERVIEW */}
                {view === "Overview" && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="space-y-6"
                    >
                        {/* Stats Grid - 6 Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {/* Tasks Completed */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.1 }}
                                whileHover={{ scale: 1.05, y: -5 }}
                                className={`${theme.card} rounded-2xl p-6 border ${theme.border} shadow-lg hover:shadow-2xl transition-all duration-300 relative overflow-hidden`}
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-400/20 to-emerald-600/20 rounded-full blur-3xl"></div>
                                <div className="relative z-10">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="p-3 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 rounded-xl">
                                            <CheckCircle className="text-green-600 dark:text-green-400" size={28} />
                                        </div>
                                        <span className="text-xs font-bold text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30 px-3 py-1 rounded-full">
                                            +12%
                                        </span>
                                    </div>
                                    <h3 className={`text-4xl font-bold ${theme.text} mb-2`}>
                                        <CountUp end={stats.completed} duration={2} />/
                                        <CountUp end={stats.totalTasks} duration={2} />
                                    </h3>
                                    <p className={`text-sm ${theme.subtext} mb-4`}>Tasks Completed</p>
                                    <div className="flex items-center gap-2">
                                        <div className="flex-1 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${stats.avgProgress}%` }}
                                                transition={{ duration: 1, delay: 0.5 }}
                                                className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"
                                            ></motion.div>
                                        </div>
                                        <span className="text-xs font-bold text-green-600">
                                            <CountUp end={stats.avgProgress} duration={1} />%
                                        </span>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Active Team Members */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.2 }}
                                whileHover={{ scale: 1.05, y: -5 }}
                                className={`${theme.card} rounded-2xl p-6 border ${theme.border} shadow-lg hover:shadow-2xl transition-all duration-300 relative overflow-hidden`}
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-blue-600/20 rounded-full blur-3xl"></div>
                                <div className="relative z-10">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="p-3 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 rounded-xl">
                                            <Users className="text-blue-600 dark:text-blue-400" size={28} />
                                        </div>
                                        <Zap className="text-blue-500" size={20} />
                                    </div>
                                    <h3 className={`text-4xl font-bold ${theme.text} mb-2`}>
                                        <CountUp end={teamData.length} duration={2} />
                                    </h3>
                                    <p className={`text-sm ${theme.subtext}`}>Active Team Members</p>
                                </div>
                            </motion.div>

                            {/* Budget Spent */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.3 }}
                                whileHover={{ scale: 1.05, y: -5 }}
                                className={`${theme.card} rounded-2xl p-6 border ${theme.border} shadow-lg hover:shadow-2xl transition-all duration-300 relative overflow-hidden`}
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-400/20 to-purple-600/20 rounded-full blur-3xl"></div>
                                <div className="relative z-10">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="p-3 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30 rounded-xl">
                                            <DollarSign className="text-purple-600 dark:text-purple-400" size={28} />
                                        </div>
                                        <span className={`text-xs font-bold px-3 py-1 rounded-full ${(stats.totalSpent / stats.totalBudget) * 100 > 80 ? 'text-red-600 bg-red-100 dark:bg-red-900/30' : 'text-purple-600 bg-purple-100 dark:bg-purple-900/30'}`}>
                                            <CountUp end={Math.round((stats.totalSpent / stats.totalBudget) * 100)} duration={1} />%
                                        </span>
                                    </div>
                                    <h3 className={`text-3xl font-bold ${theme.text} mb-2`}>SAR <CountUp end={stats.totalSpent} duration={2} separator="," /></h3>
                                    <p className={`text-sm ${theme.subtext} mb-4`}>of {formatCurrency(stats.totalBudget)} spent</p>
                                    <div className="flex items-center gap-2">
                                        <div className="flex-1 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${(stats.totalSpent / stats.totalBudget) * 100}%` }}
                                                transition={{ duration: 1, delay: 0.5 }}
                                                className={`h-full ${(stats.totalSpent / stats.totalBudget) * 100 > 80 ? 'bg-gradient-to-r from-red-500 to-rose-500' : 'bg-gradient-to-r from-purple-500 to-pink-500'}`}
                                            ></motion.div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Client Balance */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.4 }}
                                whileHover={{ scale: 1.05, y: -5 }}
                                className={`${theme.card} rounded-2xl p-6 border ${theme.border} shadow-lg hover:shadow-2xl transition-all duration-300 relative overflow-hidden`}
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-400/20 to-orange-600/20 rounded-full blur-3xl"></div>
                                <div className="relative z-10">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="p-3 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/30 dark:to-orange-800/30 rounded-xl">
                                            <Wallet className="text-orange-600 dark:text-orange-400" size={28} />
                                        </div>
                                        <TrendingUp className={stats.clientBalance >= 0 ? 'text-green-500' : 'text-red-500'} size={20} />
                                    </div>
                                    <h3 className={`text-3xl font-bold ${stats.clientBalance >= 0 ? 'text-green-600' : 'text-red-600'} mb-2`}>
                                        SAR <CountUp end={Math.abs(stats.clientBalance)} duration={2} separator="," />
                                    </h3>
                                    <p className={`text-sm ${theme.subtext}`}>Client {stats.clientBalance >= 0 ? 'Receivable' : 'Payable'}</p>
                                </div>
                            </motion.div>

                            {/* Total Invoiced */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.5 }}
                                whileHover={{ scale: 1.05, y: -5 }}
                                className={`${theme.card} rounded-2xl p-6 border ${theme.border} shadow-lg hover:shadow-2xl transition-all duration-300 relative overflow-hidden`}
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-400/20 to-indigo-600/20 rounded-full blur-3xl"></div>
                                <div className="relative z-10">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="p-3 bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/30 dark:to-indigo-800/30 rounded-xl">
                                            <TrendingUp className="text-indigo-600 dark:text-indigo-400" size={28} />
                                        </div>
                                        <Receipt className="text-indigo-500" size={20} />
                                    </div>
                                    <h3 className={`text-3xl font-bold ${theme.text} mb-2`}>
                                        {formatCurrency(stats.totalInvoiced)}
                                    </h3>
                                    <p className={`text-sm ${theme.subtext}`}>To client</p>
                                </div>
                            </motion.div>

                            {/* Total Received */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.6 }}
                                whileHover={{ scale: 1.05, y: -5 }}
                                className={`${theme.card} rounded-2xl p-6 border ${theme.border} shadow-lg hover:shadow-2xl transition-all duration-300 relative overflow-hidden`}
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-teal-400/20 to-teal-600/20 rounded-full blur-3xl"></div>
                                <div className="relative z-10">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="p-3 bg-gradient-to-br from-teal-50 to-teal-100 dark:from-teal-900/30 dark:to-teal-800/30 rounded-xl">
                                            <TrendingDown className="text-teal-600 dark:text-teal-400" size={28} />
                                        </div>
                                        <CheckCircle className="text-teal-500" size={20} />
                                    </div>
                                    <h3 className={`text-3xl font-bold ${theme.text} mb-2`}>
                                        {formatCurrency(stats.totalReceived)}
                                    </h3>
                                    <p className={`text-sm ${theme.subtext}`}>From client</p>
                                </div>
                            </motion.div>
                        </div>

                        {/* Filters */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.7 }}
                            className="flex gap-4 mb-6"
                        >
                            <select
                                value={selectedMonth}
                                onChange={(e) => setSelectedMonth(e.target.value)}
                                className={`px-4 py-2 rounded-xl border ${theme.border} ${theme.card} font-medium focus:ring-2 focus:ring-blue-500 outline-none`}
                            >
                                <option value="all">All Months</option>
                                {[...Array(12)].map((_, i) => (
                                    <option key={i} value={i}>
                                        {new Date(0, i).toLocaleString('default', { month: 'long' })}
                                    </option>
                                ))}
                            </select>

                            <input
                                type="number"
                                value={selectedYear}
                                onChange={(e) => setSelectedYear(e.target.value)}
                                className={`px-4 py-2 rounded-xl border ${theme.border} ${theme.card} w-32 font-medium focus:ring-2 focus:ring-blue-500 outline-none`}
                            />
                        </motion.div>

                        {/* Charts Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8 }}
                            className={`${theme.card} rounded-2xl p-6 shadow-lg border ${theme.border}`}
                        >
                            <h2 className={`text-2xl font-bold ${theme.text} mb-6 flex items-center gap-2`}>
                                <BarChart2 size={28} className="text-purple-600" />
                                Expense Overview
                            </h2>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl">
                                    <h3 className={`text-lg font-semibold ${theme.text} mb-4`}>Budget Allocation</h3>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <BarChart data={expenseChartData}>
                                            <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#334155' : '#e2e8f0'} />
                                            <XAxis dataKey="name" stroke={darkMode ? '#94a3b8' : '#64748b'} />
                                            <YAxis stroke={darkMode ? '#94a3b8' : '#64748b'} />
                                            <Tooltip
                                                formatter={(value) => formatCurrency(value)}
                                                contentStyle={{
                                                    backgroundColor: darkMode ? '#1e293b' : '#ffffff',
                                                    border: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`,
                                                    borderRadius: '12px',
                                                    padding: '12px'
                                                }}
                                            />
                                            <Legend />
                                            <Bar dataKey="allocated" fill="#3b82f6" name="Allocated" radius={[8, 8, 0, 0]} />
                                            <Bar dataKey="spent" fill="#8b5cf6" name="Spent" radius={[8, 8, 0, 0]} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>

                                <div className="p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl">
                                    <h3 className={`text-lg font-semibold ${theme.text} mb-4`}>Spending Distribution</h3>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <PieChart>
                                            <Pie
                                                data={expenseChartData}
                                                dataKey="spent"
                                                nameKey="name"
                                                outerRadius={100}
                                                fill="#3b82f6"
                                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                            >
                                                {expenseChartData.map((entry, index) => {
                                                    const colors = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#ef4444'];
                                                    return <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />;
                                                })}
                                            </Pie>
                                            <Tooltip
                                                formatter={(value) => formatCurrency(value)}
                                                contentStyle={{
                                                    backgroundColor: darkMode ? '#1e293b' : '#ffffff',
                                                    border: `1px solid ${darkMode ? '#334155' : '#e2e8f0'}`,
                                                    borderRadius: '12px',
                                                    padding: '12px'
                                                }}
                                            />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
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

            {view === "Timeline" && renderGanttChart()}
            {view === "Documents" && renderDocumentation()}
            {view === "Expenses Management" && renderBudget()}

            {/* Task Details Modal */}
            {showTaskDetails && selectedTask && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-lg">
                        <h3 className="text-xl font-bold mb-4">Task Details</h3>

                        <div className="space-y-3">
                            <div>
                                <div className="text-sm text-gray-600">Task</div>
                                <div className="font-semibold">{selectedTask.subTask || selectedTask.task}</div>
                            </div>

                            <div>
                                <div className="text-sm text-gray-600">System</div>
                                <div>{selectedTask.system}</div>
                            </div>

                            <div>
                                <div className="text-sm text-gray-600">Status</div>
                                <div>
                                    <span className={`px-2 py-1 rounded text-sm ${selectedTask.status === "Completed" ? "bg-green-100 text-green-700" :
                                        selectedTask.status === "In Progress" ? "bg-blue-100 text-blue-700" :
                                            "bg-gray-100 text-gray-700"
                                        }`}>
                                        {selectedTask.status}
                                    </span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <div className="text-sm text-gray-600">Start Date</div>
                                    <div>{new Date(selectedTask.startDate).toLocaleDateString()}</div>
                                </div>
                                <div>
                                    <div className="text-sm text-gray-600">End Date</div>
                                    <div>{new Date(selectedTask.deadlineDate).toLocaleDateString()}</div>
                                </div>
                            </div>

                            <div>
                                <div className="text-sm text-gray-600">Assigned To</div>
                                <div>{selectedTask.assigned_to}</div>
                            </div>

                            <div>
                                <div className="text-sm text-gray-600">Progress</div>
                                <div className="flex items-center gap-3">
                                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                                        <div
                                            className="bg-blue-600 h-2 rounded-full"
                                            style={{ width: `${selectedTask.progress || 0}%` }}
                                        ></div>
                                    </div>
                                    <span className="font-semibold">{selectedTask.progress || 0}%</span>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={() => setShowTaskDetails(false)}
                            className="w-full mt-6 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
                        >
                            Close
                        </button>
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