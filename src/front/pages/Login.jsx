import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import useGlobalReducer from "../hooks/useGlobalReducer"

const initialUserState = {
    email: "",
    password: ""
}

const urlBase = import.meta.env.VITE_BACKEND_URL

const Login = () => {
    const [user, setUser] = useState(initialUserState)
    const { dispatch } = useGlobalReducer()
    const navigate = useNavigate()

    const handleChange = ({ target }) => {
        const { name, value } = target
        setUser({
            ...user,
            [name]: value
        })
    }

    const handleSubmit = async (event) => {
        event.preventDefault()
        try {
            const response = await fetch(`${urlBase}/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(user)
            })
            const data = await response.json()

            if (response.ok) {
                dispatch({ type: "SET_TOKEN", payload: data.token })

                const responseUser = await fetch(`${urlBase}/me`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${data.token}`
                    }
                })

                const dataUser = await responseUser.json()
                dispatch({
                    type: "SET_USER",
                    payload: dataUser.user
                })

                localStorage.setItem("token", data.token)
                localStorage.setItem("user", JSON.stringify(dataUser.user))

                navigate("/")
            }
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className="min-vh-100 d-flex align-items-center justify-content-center" style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            padding: '20px'
        }}>
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-12 col-md-10 col-lg-8 col-xl-6">
                        <div className="card shadow-lg border-0" style={{
                            borderRadius: '20px',
                            backdropFilter: 'blur(10px)',
                            backgroundColor: 'rgba(255, 255, 255, 0.95)'
                        }}>
                            <div className="card-body p-5">
                                {/* Header */}
                                <div className="text-center mb-4">
                                    <div className="mb-3">
                                        <div style={{
                                            width: '80px',
                                            height: '80px',
                                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                            borderRadius: '20px',
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            boxShadow: '0 10px 25px rgba(102, 126, 234, 0.3)'
                                        }}>
                                            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                                                <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                                                <path d="M2 17l10 5 10-5"/>
                                                <path d="M2 12l10 5 10-5"/>
                                            </svg>
                                        </div>
                                    </div>
                                    <h2 className="fw-bold mb-2" style={{ color: '#2d3748' }}>
                                        Bienvenido de vuelta
                                    </h2>
                                    <p className="text-muted mb-0">
                                        Ingresa tus credenciales para continuar
                                    </p>
                                </div>

                                {/* Form */}
                                <form onSubmit={handleSubmit}>
                                    <div className="mb-4">
                                        <label htmlFor="btnEmail" className="form-label fw-semibold" style={{ color: '#4a5568' }}>
                                            Correo electrónico
                                        </label>
                                        <div className="position-relative">
                                            <span className="position-absolute top-50 translate-middle-y ms-3" style={{ color: '#a0aec0' }}>
                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                                                    <polyline points="22,6 12,13 2,6"/>
                                                </svg>
                                            </span>
                                            <input
                                                type="email"
                                                placeholder="usuario@ejemplo.com"
                                                className="form-control ps-5"
                                                id="btnEmail"
                                                name="email"
                                                onChange={handleChange}
                                                style={{
                                                    padding: '12px 12px 12px 45px',
                                                    border: '2px solid #e2e8f0',
                                                    borderRadius: '12px',
                                                    fontSize: '15px',
                                                    transition: 'all 0.3s ease'
                                                }}
                                                onFocus={(e) => e.target.style.borderColor = '#667eea'}
                                                onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                                            />
                                        </div>
                                    </div>

                                    <div className="mb-4">
                                        <label htmlFor="btnPassword" className="form-label fw-semibold" style={{ color: '#4a5568' }}>
                                            Contraseña
                                        </label>
                                        <div className="position-relative">
                                            <span className="position-absolute top-50 translate-middle-y ms-3" style={{ color: '#a0aec0' }}>
                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                                                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                                                </svg>
                                            </span>
                                            <input
                                                type="password"
                                                placeholder="••••••••"
                                                className="form-control ps-5"
                                                id="btnPassword"
                                                name="password"
                                                onChange={handleChange}
                                                style={{
                                                    padding: '12px 12px 12px 45px',
                                                    border: '2px solid #e2e8f0',
                                                    borderRadius: '12px',
                                                    fontSize: '15px',
                                                    transition: 'all 0.3s ease'
                                                }}
                                                onFocus={(e) => e.target.style.borderColor = '#667eea'}
                                                onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                                            />
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        className="btn w-100 text-white fw-semibold"
                                        style={{
                                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                            border: 'none',
                                            padding: '14px',
                                            borderRadius: '12px',
                                            fontSize: '16px',
                                            boxShadow: '0 8px 20px rgba(102, 126, 234, 0.3)',
                                            transition: 'all 0.3s ease',
                                            transform: 'translateY(0)'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.target.style.transform = 'translateY(-2px)'
                                            e.target.style.boxShadow = '0 12px 25px rgba(102, 126, 234, 0.4)'
                                        }}
                                        onMouseLeave={(e) => {
                                            e.target.style.transform = 'translateY(0)'
                                            e.target.style.boxShadow = '0 8px 20px rgba(102, 126, 234, 0.3)'
                                        }}
                                    >
                                        Iniciar Sesión
                                    </button>
                                </form>

                                {/* Footer Links */}
                                <div className="d-flex justify-content-between align-items-center mt-4 pt-3" style={{
                                    borderTop: '1px solid #e2e8f0'
                                }}>
                                    <Link 
                                        to="/register" 
                                        className="text-decoration-none fw-semibold"
                                        style={{ 
                                            color: '#667eea',
                                            fontSize: '14px',
                                            transition: 'color 0.3s ease'
                                        }}
                                        onMouseEnter={(e) => e.target.style.color = '#764ba2'}
                                        onMouseLeave={(e) => e.target.style.color = '#667eea'}
                                    >
                                        Crear cuenta
                                    </Link>

                                    <Link 
                                        to="/recovery-password" 
                                        className="text-decoration-none fw-semibold"
                                        style={{ 
                                            color: '#667eea',
                                            fontSize: '14px',
                                            transition: 'color 0.3s ease'
                                        }}
                                        onMouseEnter={(e) => e.target.style.color = '#764ba2'}
                                        onMouseLeave={(e) => e.target.style.color = '#667eea'}
                                    >
                                        ¿Olvidaste tu contraseña?
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login