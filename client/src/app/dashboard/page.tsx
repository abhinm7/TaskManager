'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import CreateTaskModal from '@/components/CreateTask/page';
import EditTaskModal from '@/components/EditTask/page';

interface Task {
    _id: string;
    title: string;
    description: string;
    status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
    createdAt: string;
}

export default function Dashboard() {
    const { user, logout } = useAuth();
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);

    // Intersecting State Variables
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [statusFilter, setStatusFilter] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);

    // Debounce the search input to prevent API spam
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(searchTerm);
            setPage(1);
        }, 500);
        return () => clearTimeout(handler);
    }, [searchTerm]);

    // Reset to page 1 when filter changes
    useEffect(() => {
        setPage(1);
    }, [statusFilter]);

    // The core fetch logic
    useEffect(() => {
        const fetchTasks = async () => {
            setLoading(true);
            try {
                const res = await api.get('/tasks', {
                    params: {
                        page,
                        limit: 5,
                        status: statusFilter || undefined,
                        search: debouncedSearch || undefined,
                    },
                });
                setTasks(res.data.tasks);
                setTotalPages(res.data.pagination.pages);
            } catch (error) {
                console.error('Failed to fetch tasks', error);
            } finally {
                setLoading(false);
            }
        };

        fetchTasks();
    }, [page, statusFilter, debouncedSearch]);

    const getStatusBadge = (status: string) => {
        const colors = {
            PENDING: 'bg-yellow-100 text-yellow-800',
            IN_PROGRESS: 'bg-blue-100 text-blue-800',
            COMPLETED: 'bg-green-100 text-green-800',
        };
        return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this task?')) return;

        try {
            await api.delete(`/tasks/${id}`);
            setTasks(tasks.filter(t => t._id !== id));
        } catch (error) {
            console.error('Failed to delete task', error);
            alert('Failed to delete task');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="mx-auto max-w-5xl">
                {/* Header */}

                <div className="mb-8 flex items-center justify-between rounded-lg bg-white p-6 shadow-sm">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Task Manager</h1>
                        <p className="text-sm text-gray-500">Welcome, {user?.email}</p>
                    </div>

                    <button
                        onClick={logout}
                        className="rounded bg-red-50 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-100"
                    >
                        Logout
                    </button>
                </div>

                {/* Controls: Search and Filter */}
                <div className="mb-6 flex text-gray-400 gap-4">
                    <input
                        type="text"
                        placeholder="Search tasks by title..."
                        className="flex-1 rounded-lg border p-3 shadow-sm focus:border-blue-500 focus:outline-none"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <select
                        className="rounded-lg border p-3 shadow-sm focus:border-blue-500 focus:outline-none"
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="">All Statuses</option>
                        <option value="PENDING">Pending</option>
                        <option value="IN_PROGRESS">In Progress</option>
                        <option value="COMPLETED">Completed</option>
                    </select>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="ml-4 rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                    >
                        + New Task
                    </button>
                </div>

                {/* Task List */}
                {loading ? (
                    <div className="text-center py-10 text-gray-500">Loading tasks...</div>
                ) : tasks.length === 0 ? (
                    <div className="text-center py-10 text-gray-500 bg-white rounded-lg shadow-sm">No tasks found.</div>
                ) : (
                    <div className="space-y-4">
                        {tasks.map((task) => (
                            <div key={task._id} className="rounded-lg bg-white p-6 shadow-sm flex justify-between items-start border-l-4 border-blue-500">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">{task.title}</h3>
                                    <p className="mt-1 text-gray-600">{task.description}</p>
                                    <p className="mt-2 text-xs text-gray-400">
                                        Created: {new Date(task.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                                <div>
                                    <div className="flex flex-col items-center gap-3">
                                        <span className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusBadge(task.status)}`}>
                                            {task.status.replace('_', ' ')}
                                        </span>
                                        <div className="flex gap-4">
                                            <button
                                                onClick={() => setEditingTask(task)}
                                                className="text-sm font-medium text-blue-600 hover:text-blue-800"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(task._id)}
                                                className="text-sm font-medium text-red-600 hover:text-red-800"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Pagination Controls */}
                {!loading && totalPages > 1 && (
                    <div className="mt-8 flex items-center justify-center gap-4">
                        <button
                            disabled={page === 1}
                            onClick={() => setPage(p => p - 1)}
                            className="rounded bg-white px-4 py-2 text-sm font-medium border shadow-sm disabled:opacity-50"
                        >
                            Previous
                        </button>
                        <span className="text-sm font-medium text-gray-700">
                            Page {page} of {totalPages}
                        </span>
                        <button
                            disabled={page === totalPages}
                            onClick={() => setPage(p => p + 1)}
                            className="rounded bg-white px-4 py-2 text-sm font-medium border shadow-sm disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>
            <CreateTaskModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={() => {
                    setPage(1);
                }}
            />
            <EditTaskModal
                task={editingTask}
                isOpen={!!editingTask}
                onClose={() => setEditingTask(null)}
                onSuccess={() => {
                    window.location.reload();
                }}
            />
        </div>
    );
}