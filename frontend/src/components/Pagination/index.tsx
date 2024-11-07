import React from 'react';
import './Pagination.css'

interface Props{
    className: string;
    thisPage: number;
    lastPage: number;
    func: Function;
}

const Pagination: React.FC<Props> = ({className, thisPage, lastPage, func}) =>{

    let numbers = [];

    for (let x = 1; x <= lastPage; x++) {
        if (thisPage === x || x === lastPage || x === thisPage - 1 || x === thisPage + 1 || x === lastPage - 1 
            || x === 1 || x === thisPage + 2 || x === lastPage - 2 || x === thisPage - 2){
            numbers.push(x);
        }
    };

    const pagNumbers = numbers.map(numb => {
        if (numb === thisPage){ return <button className='Active' onClick={() => func(numb)}> {`${numb}`} </button> }
        else return <button onClick={() => func(numb)}> {`${numb}`} </button>
    })

    return (
        <div className={className}>
            <span>
            <button className='ChangeBtn' onClick={() => func(thisPage - 1)}> {'<<'} </button>
            {pagNumbers}
            <button className='ChangeBtn' onClick={() => func(thisPage + 1)}> {'>>'} </button>
            </span>
        </div>

    )
}

export default Pagination;