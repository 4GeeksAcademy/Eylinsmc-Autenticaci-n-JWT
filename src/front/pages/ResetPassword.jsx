import { useState } from "react"
import { Link } from "react-router-dom"
import { Toaster, toast } from "sonner"

const urlBase = import.meta.env.VITE_BACKEND_URL

const ResetPassword = () => {
    const [email, setEmail] = useState({
        email: ""
    })
    const [isLoading, setIsLoading] = useState(false)
    const [emailSent, setEmailSent] = useState(false)

    const handleSubmit = async (event) => {
        event.preventDefault()

        if (email.email.trim() === "") {
            toast.error("Debe ingresar un correo válido")
            return
        }

        setIsLoading(true)

        try {
            const response = await fetch(`${urlBase}/reset-password`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(email)
            })

            if (response.ok) {
                setEmailSent(true)
                toast.success("¡Correo enviado! Revisa tu bandeja de entrada")
                setEmail({ email: "" })
            } else {
                toast.error("No se pudo enviar el correo. Intenta nuevamente")
            }

        } catch (error) {
            console.log(error)
            toast.error("Error al procesar la solicitud")
        } finally {
            setIsLoading(false)
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
                    <div className="col-12 col-md-10 col-lg-8 col-xl-6">
                        <div className="card shadow-lg border-0" style={{
                            borderRadius: '20px',
                            backdropFilter: 'blur(10px)',
                            backgroundColor: 'rgba(255, 255, 255, 0.95)'
                        }}>
                            <div className="card-body p-5">
                                {!emailSent ? (
                                    <>
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
                                                        <circle cx="12" cy="12" r="10"/>
                                                        <path d="M12 8v4"/>
                                                        <line x1="12" y1="16" x2="12.01" y2="16"/>
                                                    </svg>
                                                </div>
                                            </div>
                                            <h2 className="fw-bold mb-2" style={{ color: '#2d3748' }}>
                                                ¿Olvidaste tu contraseña?
                                            </h2>
                                            <p className="text-muted mb-0">
                                                No te preocupes, te enviaremos instrucciones para recuperarla
                                            </p>
                                        </div>

                                        {/* Form */}
                                        <form onSubmit={handleSubmit}>
                                            <div className="mb-4">
                                                <label htmlFor="btnRecoveryPassword" className="form-label fw-semibold" style={{ color: '#4a5568' }}>
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
                                                        className="form-control ps-5"
                                                        placeholder="usuario@ejemplo.com"
                                                        id="btnRecoveryPassword"
                                                        name="email"
                                                        value={email.email}
                                                        onChange={({ target }) => setEmail({ email: target.value })}
                                                        required
                                                        disabled={isLoading}
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
                                                disabled={isLoading}
                                                className="btn w-100 text-white fw-semibold"
                                                style={{
                                                    background: isLoading ? '#a0aec0' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                                    border: 'none',
                                                    padding: '14px',
                                                    borderRadius: '12px',
                                                    fontSize: '16px',
                                                    boxShadow: '0 8px 20px rgba(102, 126, 234, 0.3)',
                                                    transition: 'all 0.3s ease',
                                                    transform: 'translateY(0)',
                                                    cursor: isLoading ? 'not-allowed' : 'pointer'
                                                }}
                                                onMouseEnter={(e) => {
                                                    if (!isLoading) {
                                                        e.target.style.transform = 'translateY(-2px)'
                                                        e.target.style.boxShadow = '0 12px 25px rgba(102, 126, 234, 0.4)'
                                                    }
                                                }}
                                                onMouseLeave={(e) => {
                                                    if (!isLoading) {
                                                        e.target.style.transform = 'translateY(0)'
                                                        e.target.style.boxShadow = '0 8px 20px rgba(102, 126, 234, 0.3)'
                                                    }
                                                }}
                                            >
                                                {isLoading ? (
                                                    <>
                                                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                        Enviando...
                                                    </>
                                                ) : (
                                                    'Enviar instrucciones'
                                                )}
                                            </button>
                                        </form>
                                    </>
                                ) : (
                                    // Success Message
                                    <div className="text-center">
                                        <div className="mb-4">
                                            <div style={{
                                                width: '100px',
                                                height: '100px',
                                                background: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)',
                                                borderRadius: '50%',
                                                display: 'inline-flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                boxShadow: '0 10px 25px rgba(72, 187, 120, 0.3)'
                                            }}>
                                                <svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                                                    <polyline points="20 6 9 17 4 12"/>
                                                </svg>
                                            </div>
                                        </div>
                                        <h3 className="fw-bold mb-3" style={{ color: '#2d3748' }}>
                                            ¡Correo enviado!
                                        </h3>
                                        <p className="text-muted mb-4">
                                            Hemos enviado las instrucciones para recuperar tu contraseña a <strong>{email.email}</strong>. 
                                            Por favor, revisa tu bandeja de entrada y sigue los pasos indicados.
                                        </p>
                                        <div className="p-3 mb-4" style={{
                                            background: '#e6fffa',
                                            borderRadius: '12px',
                                            border: '1px solid #81e6d9'
                                        }}>
                                            <p className="mb-0 small" style={{ color: '#234e52' }}>
                                                <strong>Nota:</strong> Si no ves el correo, revisa tu carpeta de spam.
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => setEmailSent(false)}
                                            className="btn text-white fw-semibold"
                                            style={{
                                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                                border: 'none',
                                                padding: '12px 30px',
                                                borderRadius: '12px',
                                                fontSize: '14px'
                                            }}
                                        >
                                            Enviar nuevamente
                                        </button>
                                    </div>
                                )}

                                {/* Footer Link */}
                                <div className="text-center mt-4 pt-3" style={{
                                    borderTop: '1px solid #e2e8f0'
                                }}>
                                    <Link 
                                        to="/login" 
                                        className="text-decoration-none fw-semibold d-flex align-items-center justify-content-center gap-2"
                                        style={{ 
                                            color: '#667eea',
                                            fontSize: '14px',
                                            transition: 'color 0.3s ease'
                                        }}
                                        onMouseEnter={(e) => e.target.style.color = '#764ba2'}
                                        onMouseLeave={(e) => e.target.style.color = '#667eea'}
                                    >
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <line x1="19" y1="12" x2="5" y2="12"/>
                                            <polyline points="12 19 5 12 12 5"/>
                                        </svg>
                                        Volver al inicio de sesión
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

export default ResetPassword