import { FaRegEye } from "react-icons/fa";
import './style.css'

interface Props {
    id?: number // Recebe o id 
    onEdit?: () => void // Chama a função de editar
}
  
const OlhoSaida: React.FC<Props> = ({ id, onEdit }) =>{
    return (
        <div className="td-actions">
            <FaRegEye color="#61BDE0" size={20} className="edit-icon" onClick={onEdit}/>
        </div>
    )
}

export default OlhoSaida