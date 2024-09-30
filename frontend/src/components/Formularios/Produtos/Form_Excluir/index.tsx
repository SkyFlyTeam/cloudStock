import { useState, forwardRef, useImperativeHandle, Ref } from 'react';
import { ApiException } from '../../../../config/apiException';
import { produtoServices } from '../../../../services/produtoServices';

interface Props {
    id: number
    onSuccess: (message: string) => void
}

const ProdutoExcluir = forwardRef((props: Props, ref: Ref<{ submitForm: () => void }>) => {
    const [id, setId] = useState<number>(props.id)

    const eventoFormulario = async () => {

        const response = await produtoServices.deleteProduto(id)
        console.log(response)
        if (response instanceof ApiException) {

            console.log("Form_Excluirr:")
            console.log(id)
            console.log(props.id)
            console.error(response.message)
        } else {
            console.log("Produto excluido com sucesso:", response)
            props.onSuccess('Produto excluído com sucesso!')
        }
    }

    useImperativeHandle(ref, () => ({
        submitForm() {
            eventoFormulario()
        }
    }))


    return (
        <form>
            <p>Você tem certeza que deseja excluir este produto?</p>
        </form>
    )
})

export default ProdutoExcluir