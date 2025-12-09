import React from "react"
import useGlobalReducer from "../hooks/useGlobalReducer.jsx"
import { Link } from "react-router-dom"

export const Home = () => {
	const { store } = useGlobalReducer()

	return (
		<div className="min-vh-100 d-flex align-items-center" style={{
			background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
			position: 'relative',
			overflow: 'hidden'
		}}>
			{/* Decorative circles */}
			<div style={{
				position: 'absolute',
				width: '500px',
				height: '500px',
				borderRadius: '50%',
				background: 'rgba(255, 255, 255, 0.1)',
				top: '-200px',
				right: '-200px',
				filter: 'blur(80px)'
			}}></div>
			<div style={{
				position: 'absolute',
				width: '400px',
				height: '400px',
				borderRadius: '50%',
				background: 'rgba(255, 255, 255, 0.1)',
				bottom: '-150px',
				left: '-150px',
				filter: 'blur(80px)'
			}}></div>

			<div className="container position-relative" style={{ zIndex: 1 }}>
				<div className="row justify-content-center">
					<div className="col-12 col-lg-10 col-xl-8">
						<div className="text-center text-white mb-5">
							{/* Hero Icon */}
							<div className="mb-4">
								<div style={{
									width: '120px',
									height: '120px',
									background: 'rgba(255, 255, 255, 0.2)',
									backdropFilter: 'blur(10px)',
									borderRadius: '30px',
									display: 'inline-flex',
									alignItems: 'center',
									justifyContent: 'center',
									boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
									animation: 'float 3s ease-in-out infinite'
								}}>
									<svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
										<path d="M9 11l3 3L22 4" />
										<path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
									</svg>
								</div>
							</div>

							{/* Main Title */}
							<h1 className="display-3 fw-bold mb-4" style={{
								textShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
								animation: 'fadeInUp 0.8s ease-out'
							}}>
								Gestiona tus tareas
								<br />
								<span style={{
									background: 'linear-gradient(90deg, #fff 0%, rgba(255,255,255,0.8) 100%)',
									WebkitBackgroundClip: 'text',
									WebkitTextFillColor: 'transparent'
								}}>
									de forma inteligente
								</span>
							</h1>

							{/* Subtitle */}
							<p className="lead mb-5" style={{
								fontSize: '1.25rem',
								opacity: 0.95,
								maxWidth: '700px',
								margin: '0 auto 2rem',
								textShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
								animation: 'fadeInUp 0.8s ease-out 0.2s both'
							}}>
								Organiza tu día a día, mantén el control de tus proyectos y aumenta tu productividad con nuestra plataforma de gestión de tareas.
							</p>

							{/* CTA Buttons */}
							<div className="d-flex flex-column flex-sm-row gap-3 justify-content-center mb-5" style={{
								animation: 'fadeInUp 0.8s ease-out 0.4s both'
							}}>
								{!store.token ? (
									<>
										<Link
											to="/register"
											className="btn btn-lg px-5 py-3 text-decoration-none"
											style={{
												background: 'white',
												color: '#667eea',
												border: 'none',
												borderRadius: '15px',
												fontSize: '1.1rem',
												fontWeight: '600',
												boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
												transition: 'all 0.3s ease',
												transform: 'translateY(0)'
											}}
											onMouseEnter={(e) => {
												e.target.style.transform = 'translateY(-3px)'
												e.target.style.boxShadow = '0 15px 35px rgba(0, 0, 0, 0.3)'
											}}
											onMouseLeave={(e) => {
												e.target.style.transform = 'translateY(0)'
												e.target.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.2)'
											}}
										>
											Comenzar gratis
										</Link>
										<Link
											to="/login"
											className="btn btn-lg px-5 py-3 text-decoration-none"
											style={{
												background: 'rgba(255, 255, 255, 0.2)',
												backdropFilter: 'blur(10px)',
												color: 'white',
												border: '2px solid rgba(255, 255, 255, 0.3)',
												borderRadius: '15px',
												fontSize: '1.1rem',
												fontWeight: '600',
												transition: 'all 0.3s ease'
											}}
											onMouseEnter={(e) => {
												e.target.style.background = 'rgba(255, 255, 255, 0.3)'
												e.target.style.borderColor = 'rgba(255, 255, 255, 0.5)'
											}}
											onMouseLeave={(e) => {
												e.target.style.background = 'rgba(255, 255, 255, 0.2)'
												e.target.style.borderColor = 'rgba(255, 255, 255, 0.3)'
											}}
										>
											Iniciar sesión
										</Link>
									</>
								) : (
									<Link
										to="/tasks"
										className="btn btn-lg px-5 py-3 text-decoration-none"
										style={{
											background: 'white',
											color: '#667eea',
											border: 'none',
											borderRadius: '15px',
											fontSize: '1.1rem',
											fontWeight: '600',
											boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)',
											transition: 'all 0.3s ease',
											transform: 'translateY(0)'
										}}
										onMouseEnter={(e) => {
											e.target.style.transform = 'translateY(-3px)'
											e.target.style.boxShadow = '0 15px 35px rgba(0, 0, 0, 0.3)'
										}}
										onMouseLeave={(e) => {
											e.target.style.transform = 'translateY(0)'
											e.target.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.2)'
										}}
									>
										Ver mis tareas
									</Link>
								)}
							</div>

							{/* Features */}
							<div className="row g-4 mt-5" style={{
								animation: 'fadeInUp 0.8s ease-out 0.6s both'
							}}>
								<div className="col-12 col-md-4">
									<div className="p-4" style={{
										background: 'rgba(255, 255, 255, 0.15)',
										backdropFilter: 'blur(10px)',
										borderRadius: '20px',
										border: '1px solid rgba(255, 255, 255, 0.2)'
									}}>
										<div className="mb-3">
											<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
												<circle cx="12" cy="12" r="10" />
												<polyline points="12 6 12 12 16 14" />
											</svg>
										</div>
										<h5 className="fw-bold mb-2">Organización simple</h5>
										<p className="mb-0" style={{ opacity: 0.9, fontSize: '0.95rem' }}>
											Crea y organiza tareas de manera intuitiva
										</p>
									</div>
								</div>

								<div className="col-12 col-md-4">
									<div className="p-4" style={{
										background: 'rgba(255, 255, 255, 0.15)',
										backdropFilter: 'blur(10px)',
										borderRadius: '20px',
										border: '1px solid rgba(255, 255, 255, 0.2)'
									}}>
										<div className="mb-3">
											<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
												<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
												<circle cx="9" cy="7" r="4" />
												<path d="M23 21v-2a4 4 0 0 0-3-3.87" />
												<path d="M16 3.13a4 4 0 0 1 0 7.75" />
											</svg>
										</div>
										<h5 className="fw-bold mb-2">Acceso seguro</h5>
										<p className="mb-0" style={{ opacity: 0.9, fontSize: '0.95rem' }}>
											Tu información protegida con autenticación JWT
										</p>
									</div>
								</div>

								<div className="col-12 col-md-4">
									<div className="p-4" style={{
										background: 'rgba(255, 255, 255, 0.15)',
										backdropFilter: 'blur(10px)',
										borderRadius: '20px',
										border: '1px solid rgba(255, 255, 255, 0.2)'
									}}>
										<div className="mb-3">
											<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
												<polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
											</svg>
										</div>
										<h5 className="fw-bold mb-2">Máxima productividad</h5>
										<p className="mb-0" style={{ opacity: 0.9, fontSize: '0.95rem' }}>
											Mantén el foco en lo que realmente importa
										</p>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* CSS Animations */}
			<style>{`
                @keyframes float {
                    0%, 100% {
                        transform: translateY(0px);
                    }
                    50% {
                        transform: translateY(-20px);
                    }
                }

                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}</style>
		</div>
	)
}