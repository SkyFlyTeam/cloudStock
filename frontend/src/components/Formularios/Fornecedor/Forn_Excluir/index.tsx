import { useState, forwardRef, useImperativeHandle, Ref } from 'react';
import { ApiException } from '../../../../config/apiException';
import { fornecedorServices } from '../../../../services/fornecedorServices';

interface Props {
  id: number  
  onSuccess: (message: string) => void
}

const Forn_Excluir = forwardRef((props: Props, ref: Ref<{ submitForm: () => void }>) => {
    const [id, setId] = useState<number>(props.id)

  const eventoFormulario = async () => {

    const response = await fornecedorServices.deleteFornecedor(id)
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
        <p>Você tem certeza que deseja excluir este fornecedor?</p>
    </form>
  )
})

export default Forn_Excluir