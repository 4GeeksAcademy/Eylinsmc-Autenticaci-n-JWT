import { Link, NavLink, useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";

export const Navbar = () => {
	const { store, dispatch } = useGlobalReducer()
	const navigate = useNavigate()

	const logout = () => {
		dispatch({ type: "SET_TOKEN", payload: null })
		dispatch({ type: "SET_USER", payload: null })
		localStorage.removeItem("token")
		localStorage.removeItem("user")
		navigate("/")
	}

	return (
		<nav className="navbar navbar-expand-lg" style={{
			background: 'rgba(255, 255, 255, 0.95)',
			backdropFilter: 'blur(10px)',
			boxShadow: '0 2px 20px rgba(0, 0, 0, 0.08)',
			borderBottom: '1px solid rgba(102, 126, 234, 0.1)'
		}}>
			<div className="container-fluid px-4">
				{/* Brand */}
				<Link 
					to="/" 
					className="navbar-brand fw-bold d-flex align-items-center gap-2"
					style={{
						color: '#667eea',
						fontSize: '1.5rem',
						textDecoration: 'none'
					}}
				>
					<div style={{
						width: '40px',
						height: '40px',
						background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
						borderRadius: '10px',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center'
					}}>
						<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
							<path d="M9 11l3 3L22 4"/>
							<path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
						</svg>
					</div>
					<span style={{
						background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
						WebkitBackgroundClip: 'text',
						WebkitTextFillColor: 'transparent'
					}}>
						TaskFlow
					</span>
				</Link>

				{/* Toggler for mobile */}
				<button 
					className="navbar-toggler border-0" 
					type="button" 
					data-bs-toggle="collapse" 
					data-bs-target="#navbarNav" 
					aria-controls="navbarNav" 
					aria-expanded="false" 
					aria-label="Toggle navigation"
					style={{
						padding: '8px 12px',
						borderRadius: '10px',
						background: 'rgba(102, 126, 234, 0.1)'
					}}
				>
					<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#667eea" strokeWidth="2">
						<line x1="3" y1="12" x2="21" y2="12"/>
						<line x1="3" y1="6" x2="21" y2="6"/>
						<line x1="3" y1="18" x2="21" y2="18"/>
					</svg>
				</button>

				<div className="collapse navbar-collapse" id="navbarNav">
					{/* Navigation Links */}
					<ul className="navbar-nav mx-auto mb-2 mb-lg-0">
						<li className="nav-item">
							<NavLink
								to="/"
								end
								className={({ isActive }) => `nav-link px-3 py-2 mx-1 fw-semibold`}
								style={({ isActive }) => ({
									color: isActive ? '#667eea' : '#4a5568',
									background: isActive ? 'rgba(102, 126, 234, 0.1)' : 'transparent',
									borderRadius: '10px',
									transition: 'all 0.3s ease',
									position: 'relative'
								})}
							>
								<div className="d-flex align-items-center gap-2">
									<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
										<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
										<polyline points="9 22 9 12 15 12 15 22"/>
									</svg>
									Inicio
								</div>
							</NavLink>
						</li>
						
						{store.token && (
							<li className="nav-item">
								<NavLink
									to="/todos"
									className={({ isActive }) => `nav-link px-3 py-2 mx-1 fw-semibold`}
									style={({ isActive }) => ({
										color: isActive ? '#667eea' : '#4a5568',
										background: isActive ? 'rgba(102, 126, 234, 0.1)' : 'transparent',
										borderRadius: '10px',
										transition: 'all 0.3s ease'
									})}
								>
									<div className="d-flex align-items-center gap-2">
										<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
											<path d="M9 11l3 3L22 4"/>
											<path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
										</svg>
										Lista de tareas
									</div>
								</NavLink>
							</li>
						)}
					</ul>

					{/* User Section */}
					<div className="d-flex align-items-center gap-3">
						{store.token ? (
							<>
								{/* User Info */}
								<div className="d-none d-lg-flex align-items-center gap-2 px-3 py-2" style={{
									background: 'rgba(102, 126, 234, 0.1)',
									borderRadius: '12px'
								}}>
									<div style={{
										width: '32px',
										height: '32px',
										borderRadius: '50%',
										background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center',
										color: 'white',
										fontWeight: '600',
										fontSize: '14px'
									}}>
										{store.user?.lastname?.charAt(0)?.toUpperCase() || 'U'}
									</div>
									<span className="fw-semibold" style={{ color: '#2d3748', fontSize: '14px' }}>
										{store.user?.lastname || 'Usuario'}
									</span>
								</div>

								{/* Logout Button */}
								<button
									className="btn d-flex align-items-center gap-2 fw-semibold"
									onClick={logout}
									style={{
										background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
										color: 'white',
										border: 'none',
										padding: '10px 20px',
										borderRadius: '12px',
										transition: 'all 0.3s ease',
										transform: 'translateY(0)',
										boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)'
									}}
									onMouseEnter={(e) => {
										e.target.style.transform = 'translateY(-2px)'
										e.target.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.4)'
									}}
									onMouseLeave={(e) => {
										e.target.style.transform = 'translateY(0)'
										e.target.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.3)'
									}}
								>
									<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
										<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
										<polyline points="16 17 21 12 16 7"/>
										<line x1="21" y1="12" x2="9" y2="12"/>
									</svg>
									<span className="d-none d-sm-inline">Cerrar sesión</span>
								</button>
							</>
						) : (
							<div className="d-flex gap-2">
								<NavLink
									to="/login"
									className="btn fw-semibold"
									style={{
										color: '#667eea',
										border: '2px solid #667eea',
										padding: '10px 20px',
										borderRadius: '12px',
										transition: 'all 0.3s ease',
										textDecoration: 'none',
										background: 'transparent'
									}}
									onMouseEnter={(e) => {
										e.target.style.background = 'rgba(102, 126, 234, 0.1)'
									}}
									onMouseLeave={(e) => {
										e.target.style.background = 'transparent'
									}}
								>
									Iniciar sesión
								</NavLink>
								<NavLink
									to="/register"
									className="btn fw-semibold d-none d-sm-inline-block"
									style={{
										background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
										color: 'white',
										border: 'none',
										padding: '10px 20px',
										borderRadius: '12px',
										transition: 'all 0.3s ease',
										textDecoration: 'none',
										boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)'
									}}
									onMouseEnter={(e) => {
										e.target.style.transform = 'translateY(-2px)'
										e.target.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.4)'
									}}
									onMouseLeave={(e) => {
										e.target.style.transform = 'translateY(0)'
										e.target.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.3)'
									}}
								>
									Registrarse
								</NavLink>
							</div>
						)}
					</div>
				</div>
			</div>
		</nav>
	);
};