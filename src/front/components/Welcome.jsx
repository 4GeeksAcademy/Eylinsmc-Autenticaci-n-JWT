import useGlobalReducer from "../hooks/useGlobalReducer";

const Welcome = () => {
    const { store } = useGlobalReducer()
    const { user } = store
    return (
        <>
            {
                store.user != null &&
                <div className="container my-3 text-center ">
                    <p className="fw-bold">Hola ¿qué tal {`${user?.lastname}`}?</p>
                    <p className="fw-bold">Tu correo es: {user?.email}</p>
                    <div>
                        <img className="welcome-image" src={user?.image} alt="" />
                    </div>
                </div>
            }
        </>

    )
}

export default Welcome;