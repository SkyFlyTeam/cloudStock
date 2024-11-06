import React from 'react';

interface Props{
    className: string;
    thisPage: number;
    lastPage: number;
    func: Function;
}

const Pagination: React.FC<Props> = ({className, thisPage, lastPage, func}) =>{

    let numbers = [];

    for (let x = 1; x <= lastPage; x++) {
        if (thisPage === x || x === lastPage || x === thisPage - 1 || x === thisPage + 1 || x === lastPage - 1){
            numbers.push(x);
        }
    };

    const pagNumbers = numbers.map(numb => {
        return <button onClick={() => func(numb)}> {`${numb}`} </button>
    })

    return (
        <div className={className}>
            <span>
            <button onClick={() => func(thisPage - 1)}> {'<<'} </button>
            {pagNumbers}
            <button onClick={() => func(thisPage - 1)}> {'>>'} </button>
            </span>
        </div>

    )
}

export default Pagination;