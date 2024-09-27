import { AiOutlineDelete } from "react-icons/ai"
import { FiEdit2 } from "react-icons/fi"
import './style.css'

const EditarRemoverBtn: React.FC = () => {
    return (
        <div className="td-actions">
            <FiEdit2 color="#61BDE0" size={20} className="edit-icon"/>
            <AiOutlineDelete color="#C80000" size={20} className="delete-icon" />
        </div>
    )
}

export default EditarRemoverBtn