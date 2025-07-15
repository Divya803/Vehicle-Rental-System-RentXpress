import React, { useEffect } from 'react'
import './Table.css'

export default function Table(props) {
    useEffect(() => {
        const table = document.querySelector('.table-body');
      
        if(!table.classList.contains('restart')) {
            table.classList.add('restart');
        }
        
        setTimeout(() => {
            if(table.classList.contains('restart')) {
                table.classList.remove('restart'); 
            } 
        }, 500);    
        
    }, [props.restart]);

    return (
        <div className='table-container' style={props.style}>
            { props.tableTop }
            <table className='main-table' id={props.id}>
                <thead className='table-head'>
                    { props.children[0] }
                </thead>
                <tbody className={`table-body ${(props.hover) ? 'hover' : ''}`}>
                    { props.children.slice(1) }
                </tbody>
            </table>

            { props.children[1].length === 0 && <p className='empty-message'>{ props.emptyMessage }</p> }
        </div>
    )
}



export function TableRow(props) {
    return (
        <tr className={`table-row ${props.isSelected ? 'selected' : ''}`} onClick={props.onClick}>
            {props.data && props.data.map((cell, index) => (
                <td key={index} className={`${props.classes && props.classes[index]}`}>
                    {cell}
                </td>
            ))}
        </tr>
    );
}

