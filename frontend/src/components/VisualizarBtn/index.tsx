import { AiOutlineDelete } from "react-icons/ai"
import { FiEdit2 } from "react-icons/fi"
import './style.css'
import { IoAddCircleOutline } from "react-icons/io5"
import { FaRegEye } from "react-icons/fa6"

interface Props {
    id?: number // Recebe o id 
    onView?: () => void // Chama a função de ver

}
  
const VisualizarBtn: React.FC<Props> = ({ id, onView }) =>{
    return (
        <div className="td-actions">
            <FaRegEye color="#61BDE0" size={20} className="view-icon" onClick={onView}/>
        </div>
    )
}

export default VisualizarBtn