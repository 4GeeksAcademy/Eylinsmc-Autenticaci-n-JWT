import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import useGlobalReducer from "../hooks/useGlobalReducer"
import { Toaster, toast } from "sonner"

const urlBase = import.meta.env.VITE_BACKEND_URL

const Tasks = () => {
    const [tasks, setTasks] = useState([])
    const [newTask, setNewTask] = useState("")
    const [isLoading, setIsLoading] = useState(true)
    const [isAdding, setIsAdding] = useState(false)
    const { store, dispatch } = useGlobalReducer()
    const navigate = useNavigate()

    useEffect(() => {
        if (!store.token) {
            navigate("/login")
            return
        }
        fetchTasks()
    }, [])

    const fetchTasks = async () => {
        try {
            const response = await fetch(`${urlBase}/tasks`, {
                headers: {
                    "Authorization": `Bearer ${store.token}`
                }
            })
            if (response.ok) {
                const data = await response.json()
                setTasks(data.tasks || [])
            }
        } catch (error) {
            console.log(error)
            toast.error("Error al cargar las tareas")
        } finally {
            setIsLoading(false)
        }
    }

    const handleAddTask = async (e) => {
        e.preventDefault()
        if (newTask.trim() === "") {
            toast.error("La tarea no puede estar vacía")
            return
        }

        setIsAdding(true)
        try {
            const response = await fetch(`${urlBase}/tasks`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${store.token}`
                },
                body: JSON.stringify({ title: newTask })
            })

            if (response.ok) {
                const data = await response.json()
                setTasks([...tasks, data.task])
                setNewTask("")
                toast.success("Tarea agregada exitosamente")
            }
        } catch (error) {
            console.log(error)
            toast.error("Error al agregar la tarea")
        } finally {
            setIsAdding(false)
        }
    }

    const handleToggleTask = async (taskId, completed) => {
        try {
            const response = await fetch(`${urlBase}/tasks/${taskId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${store.token}`
                },
                body: JSON.stringify({ completed: !completed })
            })

            if (response.ok) {
                setTasks(tasks.map(task => 
                    task.id === taskId ? { ...task, completed: !completed } : task
                ))
            }
        } catch (error) {
            console.log(error)
            toast.error("Error al actualizar la tarea")
        }
    }

    const handleDeleteTask = async (taskId) => {
        try {
            const response = await fetch(`${urlBase}/tasks/${taskId}`, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${store.token}`
                }
            })

            if (response.ok) {
                setTasks(tasks.filter(task => task.id !== taskId))
                toast.success("Tarea eliminada")
            }
        } catch (error) {
            console.log(error)
            toast.error("Error al eliminar la tarea")
        }
    }

    const handleLogout = () => {
        dispatch({ type: "LOGOUT" })
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        navigate("/login")
    }

    const completedTasks = tasks.filter(task => task.completed).length
    const totalTasks = tasks.length
    const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0

    return (
        <div className="min-vh-100" style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            padding: '20px'
        }}>
            <Toaster position="top-right" richColors />
            
            <div className="container py-4">
                {/* Header */}
                <div className="row mb-4">
                    <div className="col-12">
                        <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
                            <div className="text-white">
                                <h1 className="fw-bold mb-1">Mis Tareas</h1>
                                <p className="mb-0" style={{ opacity: 0.9 }}>
                                    Hola, {store.user?.lastname || "Usuario"}
                                </p>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="btn btn-light d-flex align-items-center gap-2"
                                style={{
                                    borderRadius: '12px',
                                    padding: '10px 20px',
                                    fontWeight: '600',
                                    border: 'none',
                                    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)'
                                }}
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                                    <polyline points="16 17 21 12 16 7"/>
                                    <line x1="21" y1="12" x2="9" y2="12"/>
                                </svg>
                                Cerrar sesión
                            </button>
                        </div>
                    </div>
                </div>

                <div className="row justify-content-center">
                    <div className="col-12 col-lg-10 col-xl-8">
                        {/* Stats Card */}
                        <div className="card border-0 shadow-lg mb-4" style={{
                            borderRadius: '20px',
                            background: 'rgba(255, 255, 255, 0.95)',
                            backdropFilter: 'blur(10px)'
                        }}>
                            <div className="card-body p-4">
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <h5 className="fw-bold mb-0" style={{ color: '#2d3748' }}>
                                        Progreso de hoy
                                    </h5>
                                    <span className="badge" style={{
                                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                        padding: '8px 16px',
                                        borderRadius: '10px',
                                        fontSize: '14px'
                                    }}>
                                        {completedTasks} de {totalTasks} completadas
                                    </span>
                                </div>
                                <div style={{
                                    height: '12px',
                                    background: '#e2e8f0',
                                    borderRadius: '10px',
                                    overflow: 'hidden'
                                }}>
                                    <div style={{
                                        height: '100%',
                                        width: `${progress}%`,
                                        background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
                                        transition: 'width 0.5s ease',
                                        borderRadius: '10px'
                                    }}></div>
                                </div>
                            </div>
                        </div>

                        {/* Add Task Card */}
                        <div className="card border-0 shadow-lg mb-4" style={{
                            borderRadius: '20px',
                            background: 'rgba(255, 255, 255, 0.95)',
                            backdropFilter: 'blur(10px)'
                        }}>
                            <div className="card-body p-4">
                                <h5 className="fw-bold mb-3" style={{ color: '#2d3748' }}>
                                    Nueva tarea
                                </h5>
                                <form onSubmit={handleAddTask} className="d-flex gap-2">
                                    <div className="flex-grow-1 position-relative">
                                        <span className="position-absolute top-50 translate-middle-y ms-3" style={{ color: '#a0aec0' }}>
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <line x1="12" y1="5" x2="12" y2="19"/>
                                                <line x1="5" y1="12" x2="19" y2="12"/>
                                            </svg>
                                        </span>
                                        <input
                                            type="text"
                                            className="form-control ps-5"
                                            placeholder="¿Qué necesitas hacer?"
                                            value={newTask}
                                            onChange={(e) => setNewTask(e.target.value)}
                                            disabled={isAdding}
                                            style={{
                                                padding: '12px 12px 12px 45px',
                                                border: '2px solid #e2e8f0',
                                                borderRadius: '12px',
                                                fontSize: '15px'
                                            }}
                                            onFocus={(e) => e.target.style.borderColor = '#667eea'}
                                            onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                                        />
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={isAdding}
                                        className="btn"
                                        style={{
                                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                            color: 'white',
                                            border: 'none',
                                            padding: '12px 30px',
                                            borderRadius: '12px',
                                            fontWeight: '600',
                                            whiteSpace: 'nowrap'
                                        }}
                                    >
                                        {isAdding ? "Agregando..." : "Agregar"}
                                    </button>
                                </form>
                            </div>
                        </div>

                        {/* Tasks List */}
                        <div className="card border-0 shadow-lg" style={{
                            borderRadius: '20px',
                            background: 'rgba(255, 255, 255, 0.95)',
                            backdropFilter: 'blur(10px)'
                        }}>
                            <div className="card-body p-4">
                                <h5 className="fw-bold mb-4" style={{ color: '#2d3748' }}>
                                    Todas las tareas
                                </h5>

                                {isLoading ? (
                                    <div className="text-center py-5">
                                        <div className="spinner-border" style={{ color: '#667eea' }} role="status">
                                            <span className="visually-hidden">Cargando...</span>
                                        </div>
                                    </div>
                                ) : tasks.length === 0 ? (
                                    <div className="text-center py-5">
                                        <div style={{
                                            width: '80px',
                                            height: '80px',
                                            background: 'linear-gradient(135deg, #e2e8f0 0%, #cbd5e0 100%)',
                                            borderRadius: '50%',
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            marginBottom: '20px'
                                        }}>
                                            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#a0aec0" strokeWidth="2">
                                                <path d="M9 11l3 3L22 4"/>
                                                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
                                            </svg>
                                        </div>
                                        <h5 className="text-muted mb-2">No hay tareas aún</h5>
                                        <p className="text-muted small mb-0">Comienza agregando tu primera tarea</p>
                                    </div>
                                ) : (
                                    <div className="d-flex flex-column gap-2">
                                        {tasks.map((task) => (
                                            <div
                                                key={task.id}
                                                className="d-flex align-items-center gap-3 p-3"
                                                style={{
                                                    background: task.completed ? '#f0fdf4' : '#ffffff',
                                                    border: `2px solid ${task.completed ? '#86efac' : '#e2e8f0'}`,
                                                    borderRadius: '12px',
                                                    transition: 'all 0.3s ease'
                                                }}
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={task.completed}
                                                    onChange={() => handleToggleTask(task.id, task.completed)}
                                                    style={{
                                                        width: '22px',
                                                        height: '22px',
                                                        cursor: 'pointer',
                                                        accentColor: '#667eea'
                                                    }}
                                                />
                                                <span
                                                    className="flex-grow-1"
                                                    style={{
                                                        textDecoration: task.completed ? 'line-through' : 'none',
                                                        color: task.completed ? '#6b7280' : '#2d3748',
                                                        fontSize: '15px'
                                                    }}
                                                >
                                                    {task.title}
                                                </span>
                                                <button
                                                    onClick={() => handleDeleteTask(task.id)}
                                                    className="btn btn-sm"
                                                    style={{
                                                        background: '#fee2e2',
                                                        border: 'none',
                                                        borderRadius: '8px',
                                                        padding: '6px 12px',
                                                        color: '#dc2626'
                                                    }}
                                                >
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                        <polyline points="3 6 5 6 21 6"/>
                                                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                                                    </svg>
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Tasks