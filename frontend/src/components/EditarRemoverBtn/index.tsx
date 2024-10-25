import { AiOutlineDelete } from "react-icons/ai"
import { FiEdit2 } from "react-icons/fi"
import './style.css'

interface Props {
    id?: number // Recebe o id 
    onEdit?: () => void // Chama a função de editar
    onDelete?: () => void // Chama a função de deletar

}
  
const EditarRemoverBtn: React.FC<Props> = ({ id, onEdit,onDelete }) =>{
    return (
        <div className="td-actions">
            <FiEdit2 color="#61BDE0" size={20} className="edit-icon" onClick={onEdit}/>
            {/* <AiOutlineDelete color="#C80000" size={20} className="delete-icon" onClick={onDelete}/> */}
        </div>
    )
}

export default EditarRemoverBtn