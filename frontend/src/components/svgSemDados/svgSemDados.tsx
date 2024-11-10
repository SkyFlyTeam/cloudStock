import React from "react";
import svgSemDados from "./svgSemDados.svg";

type SvgSemDadosProps = {
    data: any[];
};

const SvgSemDados: React.FC<SvgSemDadosProps> = ({ data }) => {
    return data.length === 0 ? (
        <center>
            <img 
                src={svgSemDados}
                alt="Nenhum produto disponível" 
                style={{ width: "35%" }}
            />
            <p>Nenhum produto encontrado.</p>
        </center>
    ) : null;
};

export { SvgSemDados };
