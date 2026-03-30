import { useSelector } from "react-redux";
import PleaseLogin from "../../components/home/PleaseLogin";


const ProtectedRoute = ({ children }) => {
  const userEmail = useSelector((state) => state.auth.userEmail);
  
  if (!userEmail) return <PleaseLogin />;

  return children;
};

export default ProtectedRoute;