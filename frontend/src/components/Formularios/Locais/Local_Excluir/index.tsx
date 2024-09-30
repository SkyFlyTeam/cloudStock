import { useState, useEffect, forwardRef, useImperativeHandle, Ref } from 'react';
import './style.css';
import { ApiException } from '../../../../config/apiException';
import { localServices } from '../../../../services/localServices';

interface Props {
    id: number  
    onSuccess: (message: string) => void
}

const Local_Excluir = forwardRef((props: Props, ref: Ref<{ submitForm: () => void }>) => {
    const [id, setId] = useState<number>(props.id)

  const eventoFormulario = async () => {

    const response = await localServices.deleteLocal(id)
    if (response instanceof ApiException) {
      console.error(response.message)
    } else {
      console.log("Fornecedor excluido com sucesso:", response)
      props.onSuccess('Fornecedor excluído com sucesso!')
    }
  }

  useImperativeHandle(ref, () => ({
    submitForm() {
      eventoFormulario()
    }
  }))


  return (
    <form>
        <p>Você tem certeza que deseja excluir este Local?</p>
    </form>
  )
})

export default Local_Excluir