import { useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Toaster, toast } from "sonner"

const initialUserState = {
    lastname: "",
    email: "",
    avatar: null,
    password: ""
}

const urlBase = import.meta.env.VITE_BACKEND_URL

const Register = () => {
    const [user, setUser] = useState(initialUserState)
    const [previewImage, setPreviewImage] = useState(null)
    const fileInputRef = useRef(null)
    const navigate = useNavigate()

    const handleFileChange = (event) => {
        const file = event.target.files[0]

        if (file) {
            setUser({
                ...user,
                avatar: file
            })

            // Crear preview de la imagen
            const reader = new FileReader()
            reader.onloadend = () => {
                setPreviewImage(reader.result)
            }
            reader.readAsDataURL(file)
        }
    }

    const handleChange = ({ target }) => {
        setUser({
            ...user,
            [target.name]: target.value
        })
    }

    const handleSubmit = async (event) => {
        event.preventDefault()

        const formData = new FormData()
        formData.append("lastname", user.lastname)
        formData.append("email", user.email)
        formData.append("password", user.password)
        formData.append("avatar", user.avatar)

        const response = await fetch(`${urlBase}/register`, {
            method: "POST",
            body: formData
        })

        if (response.ok) {
            toast.success("¡Registro exitoso! Redirigiendo...")
            setUser(initialUserState)
            setPreviewImage(null)
            fileInputRef.current.value = null

            setTimeout(() => {
                navigate("/login")
            }, 1500)

        } else if (response.status == 409) {
            toast.error("El usuario ya existe")
        } else {
            toast.error("Error al registrar usuario, intente nuevamente")
        }
    }

    return (
        <div className="min-vh-100 d-flex align-items-center justify-content-center" style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            padding: '20px'
        }}>
            <Toaster position="top-right" richColors />
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-12 col-md-10 col-lg-8 col-xl-7">
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
                                                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                                                <circle cx="8.5" cy="7" r="4"/>
                                                <line x1="20" y1="8" x2="20" y2="14"/>
                                                <line x1="23" y1="11" x2="17" y2="11"/>
                                            </svg>
                                        </div>
                                    </div>
                                    <h2 className="fw-bold mb-2" style={{ color: '#2d3748' }}>
                                        Crear cuenta nueva
                                    </h2>
                                    <p className="text-muted mb-0">
                                        Únete a nuestra plataforma de tareas
                                    </p>
                                </div>

                                {/* Form */}
                                <form onSubmit={handleSubmit}>
                                    {/* Avatar Upload con Preview */}
                                    <div className="mb-4 text-center">
                                        <div className="mb-3">
                                            {previewImage ? (
                                                <div style={{
                                                    width: '100px',
                                                    height: '100px',
                                                    margin: '0 auto',
                                                    borderRadius: '50%',
                                                    overflow: 'hidden',
                                                    border: '4px solid #667eea',
                                                    boxShadow: '0 5px 15px rgba(102, 126, 234, 0.3)'
                                                }}>
                                                    <img 
                                                        src={previewImage} 
                                                        alt="Preview" 
                                                        style={{ 
                                                            width: '100%', 
                                                            height: '100%', 
                                                            objectFit: 'cover' 
                                                        }} 
                                                    />
                                                </div>
                                            ) : (
                                                <div style={{
                                                    width: '100px',
                                                    height: '100px',
                                                    margin: '0 auto',
                                                    borderRadius: '50%',
                                                    background: 'linear-gradient(135deg, #e2e8f0 0%, #cbd5e0 100%)',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center'
                                                }}>
                                                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#a0aec0" strokeWidth="2">
                                                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                                                        <circle cx="12" cy="7" r="4"/>
                                                    </svg>
                                                </div>
                                            )}
                                        </div>
                                        <label 
                                            htmlFor="txtAvatar" 
                                            className="btn btn-sm"
                                            style={{
                                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                                color: 'white',
                                                border: 'none',
                                                padding: '8px 20px',
                                                borderRadius: '10px',
                                                fontSize: '14px',
                                                cursor: 'pointer',
                                                fontWeight: '600'
                                            }}
                                        >
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '5px', verticalAlign: 'middle' }}>
                                                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                                                <polyline points="17 8 12 3 7 8"/>
                                                <line x1="12" y1="3" x2="12" y2="15"/>
                                            </svg>
                                            Subir avatar
                                        </label>
                                        <input
                                            type="file"
                                            className="d-none"
                                            id="txtAvatar"
                                            name="avatar"
                                            accept="image/*"
                                            ref={fileInputRef}
                                            onChange={handleFileChange}
                                        />
                                    </div>

                                    {/* Nombre Completo */}
                                    <div className="mb-4">
                                        <label htmlFor="txtLastname" className="form-label fw-semibold" style={{ color: '#4a5568' }}>
                                            Nombre completo
                                        </label>
                                        <div className="position-relative">
                                            <span className="position-absolute top-50 translate-middle-y ms-3" style={{ color: '#a0aec0' }}>
                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                                                    <circle cx="12" cy="7" r="4"/>
                                                </svg>
                                            </span>
                                            <input
                                                type="text"
                                                placeholder="John Doe"
                                                className="form-control ps-5"
                                                id="txtLastname"
                                                name="lastname"
                                                onChange={handleChange}
                                                value={user.lastname}
                                                required
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

                                    {/* Correo */}
                                    <div className="mb-4">
                                        <label htmlFor="txtEmail" className="form-label fw-semibold" style={{ color: '#4a5568' }}>
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
                                                id="txtEmail"
                                                name="email"
                                                onChange={handleChange}
                                                value={user.email}
                                                required
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

                                    {/* Contraseña */}
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
                                                value={user.password}
                                                required
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
                                        Crear cuenta
                                    </button>
                                </form>

                                {/* Footer Link */}
                                <div className="text-center mt-4 pt-3" style={{
                                    borderTop: '1px solid #e2e8f0'
                                }}>
                                    <span className="text-muted" style={{ fontSize: '14px' }}>
                                        ¿Ya tienes una cuenta?{' '}
                                    </span>
                                    <Link 
                                        to="/login" 
                                        className="text-decoration-none fw-semibold"
                                        style={{ 
                                            color: '#667eea',
                                            fontSize: '14px',
                                            transition: 'color 0.3s ease'
                                        }}
                                        onMouseEnter={(e) => e.target.style.color = '#764ba2'}
                                        onMouseLeave={(e) => e.target.style.color = '#667eea'}
                                    >
                                        Iniciar sesión
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

export default Register;