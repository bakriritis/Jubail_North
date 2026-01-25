import React, { useState } from "react";
import {
    BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area,
    XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid
} from "recharts";
import {
    Users, Calendar, Activity, CheckCircle, AlertTriangle,
    Sun, Moon, Download, Filter, TrendingUp, Clock,
    DollarSign, Target, AlertCircle, ChevronRight, UserCheck, Wrench
} from "lucide-react";

const projectName = "Jubail North Substation - Physical Security System";
const projectStart = new Date(2025, 1, 1);
const projectEndOriginal = new Date(2026, 0, 22);
const projectEndRevised = new Date(2026, 1, 10);

const tasksData = [
    { key: "RITIS-26", name: "Installation of access control system", type: "Epic", status: "DONE", progress: 100, dueDate: "30/May/25", owner: "Abdulrahim", risk: "Low" },
    { key: "RITIS-18", name: "Installation of indoor CCTV", type: "Epic", status: "DONE", progress: 100, dueDate: "30/Apr/25", owner: "Abdulrahim", risk: "Low" },
    { key: "RITIS-4", name: "Installation of outdoor CCTV", type: "Epic", status: "TO DO", progress: 55.6, dueDate: "22/Jan/26", owner: "Abdulrahim", risk: "High" },
    { key: "RITIS-11", name: "Installation of cameras", type: "Task", status: "IN PROGRESS", progress: 60, dueDate: "15/Jan/26", owner: "Abdulrahim", risk: "Medium" },
    { key: "RITIS-12", name: "Termination/cabling of outdoor cameras", type: "Task", status: "TO DO", progress: 40, dueDate: "20/Jan/26", owner: "Abdulrahim", risk: "Medium" },
    { key: "RITIS-6", name: "Installation of the sliding-gate", type: "Epic", status: "TO DO", progress: 40, dueDate: "22/Jan/26", owner: "Hani", risk: "High" },
    { key: "RITIS-14", name: "Prepare the foundations and fix the gate", type: "Task", status: "IN PROGRESS", progress: 50, dueDate: "15/Jan/26", owner: "Hani", risk: "Medium" },
    { key: "RITIS-15", name: "Pull required cable and make termination", type: "Task", status: "TO DO", progress: 30, dueDate: "13/Jan/26", owner: "Hani", risk: "Medium" },
    { key: "RITIS-1", name: "Fix the Foundations Of the Poles", type: "Task", status: "DONE", progress: 100, dueDate: "28/Nov/25", owner: "Hani", risk: "Low" },
    { key: "RITIS-8", name: "Supply FEC foundations", type: "Task", status: "DONE", progress: 100, dueDate: "28/Nov/25", owner: "Hani", risk: "Low" },
    { key: "RITIS-7", name: "Cable pulling for UTP and fiber optic", type: "Task", status: "IN PROGRESS", progress: 70, dueDate: "18/Jan/26", owner: "Abdulrahim", risk: "Medium" },
];

const teamMembers = {
    abdulrahim: { name: "Abdulrahim", members: ["Imran Khan", "Bilal", "Akash", "Abdul Jalil", "Ali"], count: 5, role: "Technical Team" },
    hani: { name: "Hani", members: ["Sheikh Bella", "Worker 1", "Worker 2", "Worker 3", "Worker 4"], count: 5, role: "Civil Team", outsource: 4 }
};

const budgetData = [
    { name: "CCTV", allocated: 4500, spent: 4200, remaining: 300 },
    { name: "Access Control", allocated: 7500, spent: 7400, remaining: 100 },
    { name: "Civil Works", allocated: 2200, spent: 1900, remaining: 300 },
    { name: "Logistics", allocated: 1200, spent: 1050, remaining: 150 },
];

const dailyExpenses = [
    { date: "20 Jan", amount: 450, category: "Materials" },
    { date: "21 Jan", amount: 320, category: "Labor" },
    { date: "22 Jan", amount: 580, category: "Equipment" },
    { date: "23 Jan", amount: 420, category: "Materials" },
    { date: "24 Jan", amount: 390, category: "Labor" },
    { date: "25 Jan", amount: 510, category: "Materials" },
];

const challenges = [
    { title: "Permits Delays", description: "Waiting for final permits approval", impact: "High", status: "Pending" },
    { title: "Access Cards Issuance", description: "Pending access control cards for testing", impact: "Medium", status: "In Progress" },
];

const timelineData = [
    { date: "01 Feb", planned: 5, actual: 5 },
    { date: "01 Mar", planned: 15, actual: 15 },
    { date: "01 Apr", planned: 25, actual: 28 },
    { date: "01 May", planned: 35, actual: 38 },
    { date: "01 Jun", planned: 45, actual: 48 },
    { date: "01 Jul", planned: 55, actual: 58 },
    { date: "01 Aug", planned: 62, actual: 65 },
    { date: "01 Sep", planned: 68, actual: 70 },
    { date: "01 Oct", planned: 74, actual: 75 },
    { date: "01 Nov", planned: 80, actual: 80 },
    { date: "01 Dec", planned: 86, actual: 85 },
    { date: "01 Jan", planned: 92, actual: 88 },
    { date: "25 Jan", planned: 95, actual: 89 },
    { date: "10 Feb", planned: 100, actual: 100 },
];

export default function App() {
    const [view, setView] = useState("Overview");
    const [darkMode, setDarkMode] = useState(false);
    const [filterStatus, setFilterStatus] = useState("All");
    const [filterOwner, setFilterOwner] = useState("All");
    const [showFilters, setShowFilters] = useState(false);

    const filteredTasks = tasksData.filter(task => {
        const statusMatch = filterStatus === "All" || task.status === filterStatus;
        const ownerMatch = filterOwner === "All" || task.owner === filterOwner;
        return statusMatch && ownerMatch;
    });

    const totalTasks = tasksData.length;
    const completedTasks = tasksData.filter(t => t.status === "DONE").length;
    const inProgressTasks = tasksData.filter(t => t.status === "IN PROGRESS").length;
    const avgProgress = tasksData.reduce((sum, t) => sum + t.progress, 0) / totalTasks;

    const totalBudget = budgetData.reduce((sum, c) => sum + c.allocated, 0);
    const totalSpent = budgetData.reduce((sum, c) => sum + c.spent, 0);
    const budgetRemaining = totalBudget - totalSpent;

    const daysOverdue = Math.ceil((new Date() - projectEndOriginal) / (1000 * 60 * 60 * 24));
    const daysToNewDeadline = Math.ceil((projectEndRevised - new Date()) / (1000 * 60 * 60 * 24));
    const totalManpower = teamMembers.abdulrahim.count + teamMembers.hani.count;

    const theme = darkMode
        ? { bg: "bg-gray-900", card: "bg-gray-800", text: "text-gray-100", border: "border-gray-700", hover: "hover:bg-gray-700" }
        : { bg: "bg-gradient-to-br from-gray-50 to-blue-50", card: "bg-white", text: "text-gray-900", border: "border-gray-200", hover: "hover:bg-gray-50" };

    const StatCard = ({ icon: Icon, title, value, subtitle, color, trend, alert }) => (
        <div className={`${theme.card} rounded-xl p-6 shadow-lg border ${theme.border} transform transition-all hover:scale-105 hover:shadow-xl relative`}>
            {alert && <AlertCircle className="absolute top-2 right-2 text-red-500" size={20} />}
            <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-lg bg-gradient-to-br ${color}`}>
                    <Icon className="text-white" size={24} />
                </div>
                {trend && <div className={`text-sm font-medium ${trend.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>{trend}</div>}
            </div>
            <h3 className="text-gray-500 text-sm font-medium mb-1">{title}</h3>
            <p className={`text-3xl font-bold ${theme.text} mb-1`}>{value}</p>
            {subtitle && <p className="text-gray-400 text-xs">{subtitle}</p>}
        </div>
    );

    const StatusBadge = ({ status }) => {
        const colors = { DONE: "bg-green-500", "IN PROGRESS": "bg-blue-500", "TO DO": "bg-orange-500" };
        return <span className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${colors[status]}`}>{status}</span>;
    };

    const RiskBadge = ({ risk }) => {
        const colors = { Low: "bg-green-100 text-green-800", Medium: "bg-yellow-100 text-yellow-800", High: "bg-red-100 text-red-800" };
        return <span className={`px-3 py-1 rounded-full text-xs font-semibold ${colors[risk]}`}>{risk}</span>;
    };

    return (
        <div className={`min-h-screen ${theme.bg} ${theme.text}`}>
            {/* Header */}
            <div className={`${theme.card} shadow-lg border-b ${theme.border}`}>
                <div className="max-w-7xl mx-auto px-6 py-6">
                    <div className="flex items-center justify-between flex-wrap gap-4">
                        <div>
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">{projectName}</h1>
                            <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-500">
                                <span className="flex items-center gap-1"><Calendar size={14} />Start: {projectStart.toLocaleDateString()}</span>
                                <span className="flex items-center gap-1 line-through text-red-500">Original: {projectEndOriginal.toLocaleDateString()}</span>
                                <span className="flex items-center gap-1 text-blue-600 font-semibold"><Clock size={14} />Revised: {projectEndRevised.toLocaleDateString()} ({daysToNewDeadline} days)</span>
                            </div>
                            <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 bg-red-100 text-red-700 rounded-lg text-sm">
                                <AlertTriangle size={14} />
                                <span>Project extended due to delays - New deadline: Feb 10, 2026</span>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <button onClick={() => setDarkMode(!darkMode)} className={`p-3 rounded-lg ${theme.card} border ${theme.border}`}>
                                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
                            </button>
                            <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold flex items-center gap-2">
                                <Download size={20} />Export PDF
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="max-w-7xl mx-auto px-6 mt-6">
                <div className="flex gap-2 border-b border-gray-300">
                    {["Overview", "Tasks", "Team", "Budget", "Challenges"].map(tab => (
                        <button key={tab} onClick={() => setView(tab)}
                            className={`px-6 py-3 font-semibold border-b-2 ${view === tab ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500"}`}>
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-6 py-8">
                {view === "Overview" && (
                    <div className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <StatCard icon={Target} title="Overall Progress" value={`${avgProgress.toFixed(1)}%`} subtitle={`${completedTasks}/${totalTasks} completed`} color="from-blue-500 to-blue-600" trend="+3%" />
                            <StatCard icon={DollarSign} title="Budget Spent" value={`$${totalSpent.toLocaleString()}`} subtitle={`$${budgetRemaining.toLocaleString()} remaining`} color="from-green-500 to-green-600" />
                            <StatCard icon={AlertTriangle} title="Active Challenges" value={challenges.filter(c => c.status !== "Resolved").length} subtitle="Permits & Cards" color="from-orange-500 to-red-600" alert />
                            <StatCard icon={Users} title="Team Members" value={totalManpower} subtitle={`${teamMembers.hani.outsource} outsourced`} color="from-purple-500 to-purple-600" />
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className={`${theme.card} rounded-xl p-6 shadow-lg border ${theme.border} lg:col-span-2`}>
                                <h3 className="text-xl font-bold flex items-center gap-2 mb-6"><Calendar className="text-purple-600" size={24} />Timeline - Planned vs Actual</h3>
                                <ResponsiveContainer width="100%" height={350}>
                                    <AreaChart data={timelineData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="date" angle={-30} textAnchor="end" height={80} />
                                        <YAxis domain={[0, 100]} />
                                        <Tooltip />
                                        <Legend />
                                        <Area type="monotone" dataKey="planned" stroke="#94a3b8" fill="#cbd5e1" fillOpacity={0.3} name="Planned" />
                                        <Area type="monotone" dataKey="actual" stroke="#10b981" fill="#10b981" fillOpacity={0.5} name="Actual" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>

                            <div className={`${theme.card} rounded-xl p-6 shadow-lg border ${theme.border}`}>
                                <h3 className="text-xl font-bold flex items-center gap-2 mb-6"><Activity className="text-blue-600" size={24} />Task Status</h3>
                                <ResponsiveContainer width="100%" height={300}>
                                    <PieChart>
                                        <Pie data={[
                                            { name: "Done", value: completedTasks, color: "#10b981" },
                                            { name: "In Progress", value: inProgressTasks, color: "#3b82f6" },
                                            { name: "To Do", value: totalTasks - completedTasks - inProgressTasks, color: "#f59e0b" }
                                        ]} dataKey="value" cx="50%" cy="50%" outerRadius={100} label={({ name, value }) => `${name}: ${value}`}>
                                            {[completedTasks, inProgressTasks, totalTasks - completedTasks - inProgressTasks].map((_, i) =>
                                                <Cell key={i} fill={["#10b981", "#3b82f6", "#f59e0b"][i]} />
                                            )}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>

                            <div className={`${theme.card} rounded-xl p-6 shadow-lg border ${theme.border}`}>
                                <h3 className="text-xl font-bold flex items-center gap-2 mb-6"><DollarSign className="text-green-600" size={24} />Daily Expenses</h3>
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={dailyExpenses}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="date" />
                                        <YAxis />
                                        <Tooltip />
                                        <Bar dataKey="amount" fill="#10b981" radius={[8, 8, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                )}

                {view === "Tasks" && (
                    <div className="space-y-6">
                        <div className={`${theme.card} rounded-xl p-6 shadow-lg border ${theme.border}`}>
                            <button onClick={() => setShowFilters(!showFilters)} className="flex items-center gap-2 text-lg font-semibold mb-4">
                                <Filter size={20} />Filters<ChevronRight className={`transform ${showFilters ? "rotate-90" : ""}`} size={20} />
                            </button>
                            {showFilters && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Status</label>
                                        <select onChange={e => setFilterStatus(e.target.value)} className={`w-full px-4 py-2 rounded-lg border ${theme.border} ${theme.card}`}>
                                            <option>All</option><option>DONE</option><option>IN PROGRESS</option><option>TO DO</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Owner</label>
                                        <select onChange={e => setFilterOwner(e.target.value)} className={`w-full px-4 py-2 rounded-lg border ${theme.border} ${theme.card}`}>
                                            <option>All</option><option>Abdulrahim</option><option>Hani</option>
                                        </select>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className={`${theme.card} rounded-xl shadow-lg border ${theme.border} overflow-hidden`}>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-4 text-left text-xs font-semibold uppercase">Key</th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold uppercase">Task</th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold uppercase">Type</th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold uppercase">Owner</th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold uppercase">Progress</th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold uppercase">Status</th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold uppercase">Due</th>
                                            <th className="px-6 py-4 text-left text-xs font-semibold uppercase">Risk</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {filteredTasks.map(task => (
                                            <tr key={task.key} className={theme.hover}>
                                                <td className="px-6 py-4 font-mono text-sm">{task.key}</td>
                                                <td className="px-6 py-4 font-medium">{task.name}</td>
                                                <td className="px-6 py-4"><span className={`px-2 py-1 rounded text-xs ${task.type === 'Epic' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>{task.type}</span></td>
                                                <td className="px-6 py-4">{task.owner}</td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                                                            <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full" style={{ width: `${task.progress}%` }} />
                                                        </div>
                                                        <span className="text-sm font-semibold">{task.progress}%</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4"><StatusBadge status={task.status} /></td>
                                                <td className="px-6 py-4 text-sm">{task.dueDate}</td>
                                                <td className="px-6 py-4"><RiskBadge risk={task.risk} /></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {view === "Team" && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {Object.values(teamMembers).map(team => (
                            <div key={team.name} className={`${theme.card} rounded-xl p-6 shadow-lg border ${theme.border}`}>
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-xl font-bold flex items-center gap-2"><UserCheck size={24} className="text-blue-600" />{team.name}'s Team</h3>
                                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">{team.count} Members</span>
                                </div>
                                <p className="text-gray-500 mb-4">{team.role}</p>
                                <div className="space-y-3">
                                    {team.members.map((member, i) => (
                                        <div key={member} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">{member.charAt(0)}</div>
                                            <div className="flex-1">
                                                <p className="font-medium">{member}</p>
                                                {team.outsource && i >= team.count - team.outsource && <span className="text-xs text-gray-500">Outsourced</span>}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {view === "Budget" && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <StatCard icon={DollarSign} title="Total Budget" value={`$${totalBudget.toLocaleString()}`} color="from-blue-500 to-blue-600" />
                            <StatCard icon={CheckCircle} title="Total Spent" value={`$${totalSpent.toLocaleString()}`} subtitle={`${((totalSpent / totalBudget) * 100).toFixed(1)}% used`} color="from-green-500 to-green-600" />
                            <StatCard icon={AlertCircle} title="Remaining" value={`$${budgetRemaining.toLocaleString()}`} color="from-purple-500 to-purple-600" />
                        </div>

                        <div className={`${theme.card} rounded-xl p-6 shadow-lg border ${theme.border}`}>
                            <h3 className="text-xl font-bold mb-6">Budget Breakdown</h3>
                            <div className="space-y-4">
                                {budgetData.map(item => (
                                    <div key={item.name}>
                                        <div className="flex justify-between mb-2">
                                            <span className="font-medium">{item.name}</span>
                                            <span className="text-sm">${item.spent.toLocaleString()} / ${item.allocated.toLocaleString()}</span>
                                        </div>
                                        <div className="bg-gray-200 rounded-full h-3">
                                            <div className="h-3 rounded-full bg-gradient-to-r from-blue-500 to-purple-600" style={{ width: `${(item.spent / item.allocated) * 100}%` }} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {view === "Challenges" && (
                    <div className="space-y-6">
                        {challenges.map((challenge, i) => (
                            <div key={i} className={`${theme.card} rounded-xl p-6 shadow-lg border ${theme.border}`}>
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-start gap-3">
                                        <AlertTriangle className={challenge.impact === "High" ? "text-red-500" : "text-yellow-500"} size={24} />
                                        <div>
                                            <h3 className="text-xl font-bold mb-2">{challenge.title}</h3>
                                            <p className="text-gray-600 mb-3">{challenge.description}</p>
                                            <div className="flex gap-3">
                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${challenge.impact === "High" ? "bg-red-100 text-red-800" : "bg-yellow-100 text-yellow-800"}`}>
                                                    {challenge.impact} Impact
                                                </span>
                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${challenge.status === "Pending" ? "bg-orange-100 text-orange-800" : "bg-blue-100 text-blue-800"}`}>
                                                    {challenge.status}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}