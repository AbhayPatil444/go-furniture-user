import { useState } from "react";
import AuthModal from "../../pages/auth/authModal";


const PleaseLogin =()=>{
    const [showModal, setShowModal] = useState(true);
    return(
        <div className="container py-5 text-center">
            <div style={{ fontSize: "3rem" }}>🔒</div>
            <h4>Please login to continue.</h4>
            <AuthModal show={showModal} onHide={() => setShowModal(false)} />
        </div>
    )
}

export default PleaseLogin;