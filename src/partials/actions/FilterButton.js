import React, { useState, useRef, useEffect } from 'react';
import Transition from '../../utils/Transition.js';

function FilterButton() {

  const [dropdownOpen, setDropdownOpen] = useState(false);

  const trigger = useRef(null);
  const dropdown = useRef(null);
  const filters = {
    chapter: [
      {
        Description: 'activities-alphabet'
      },
      {
        Description: 'activities-shapes'
      },
      {
        Description: 'activities-animals'
      }
    ],
    pathology: [
      {
        Description: 'Down Syndrome'
      },
      {
        Description: 'Dislexia'
      },
      {
        Description: 'Autism'
      },
      {
        Description: 'Cerebral Palsy'
      },
      {
        Description: 'Language Development Disorder'
      },
      {
        Description: 'Apraxia'
      },
      {
        Description: 'Apraxia'
      },
      {
        Description: 'Speech Delay'
      },
      {
        Description: 'Other'
      },
      {
        Description: 'Cleft Lip and Palate'
      },
      {
        Description: 'Hearing Disorder'
      }
    ]
  }

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }) => {
      if (!dropdownOpen || dropdown.current.contains(target) || trigger.current.contains(target)) return;
      setDropdownOpen(false);
    };
    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }) => {
      if (!dropdownOpen || keyCode !== 27) return;
      setDropdownOpen(false);
    };
    document.addEventListener('keydown', keyHandler);
    return () => document.removeEventListener('keydown', keyHandler);
  });

  const renderChapter = () => {

    const listItems = filters.pathology.map((item, index) => {
      return (
        <li className="py-1 px-3" key={index}>
          <label className="flex items-center">
            <input type="checkbox" className="form-checkbox chapter-checkbox" />
            <span className="text-sm font-medium ml-2">{item.Description}</span>
          </label>
        </li>
      )
    })

    return (
      <ul className="mb-4">
        {listItems}
      </ul>
    )
  }

  const renderPathology = () => {
    const listItems = filters.pathology.map((item, index) => {
      return (
        <li className="py-1 px-3" key={index}>
          <label className="flex items-center">
            <input type="checkbox" className="form-checkbox" />
            <span className="text-sm font-medium ml-2">{item.Description}</span>
          </label>
        </li>
      )
    })

    return (
      <ul className="mb-4">
        {listItems}
      </ul>
    )
  }
  

  return (
    <div className="relative inline-flex">
      <button
        ref={trigger}
        className="btn bg-white border-gray-200 hover:border-gray-300 text-gray-500 hover:text-gray-600"
        aria-haspopup="true"
        onClick={() => setDropdownOpen(!dropdownOpen)}
        aria-expanded={dropdownOpen}
      >
        <span className="sr-only">Filter</span><wbr />
        <svg className="w-4 h-4 fill-current" viewBox="0 0 16 16">
          <path d="M9 15H7a1 1 0 010-2h2a1 1 0 010 2zM11 11H5a1 1 0 010-2h6a1 1 0 010 2zM13 7H3a1 1 0 010-2h10a1 1 0 010 2zM15 3H1a1 1 0 010-2h14a1 1 0 010 2z" />
        </svg>
      </button>
      <Transition
        show={dropdownOpen}
        tag="div"
        className="origin-top-right z-10 absolute top-full left-0 right-auto md:left-auto md:right-0 min-w-56 bg-white border border-gray-200 pt-1.5 rounded shadow-lg overflow-hidden mt-1"
        enter="transition ease-out duration-200 transform"
        enterStart="opacity-0 -translate-y-2"
        enterEnd="opacity-100 translate-y-0"
        leave="transition ease-out duration-200"
        leaveStart="opacity-100"
        leaveEnd="opacity-0"
      >
        <div ref={dropdown}>
          <div className="text-xs font-semibold text-gray-400 uppercase pt-1.5 pb-2 px-4">Filtros</div>
          <h2 className="text-xs font-semibold text-gray-400 pt-1.5 pb-2 px-4">Todos</h2>
          <ul className="mb-4">
            <li className="py-1 px-3">
              <label className="flex items-center">
                <input type="checkbox" className="form-checkbox" />
                <span className="text-sm font-medium ml-2">Todos os alunos</span>
              </label>
            </li>
          </ul>
          <h2 className="text-xs font-semibold text-gray-400 pt-1.5 pb-2 px-4">Capítulos</h2>
          { renderChapter() }
          <h2 className="text-xs font-semibold text-gray-400 pt-1.5 pb-2 px-4">Patologia</h2>
          { renderPathology() }
          <div className="py-2 px-3 border-t border-gray-200 bg-gray-50">
            <ul className="flex items-center justify-between">
              <li>
                <button className="btn-xs bg-white border-gray-200 hover:border-gray-300 text-gray-500 hover:text-gray-600">Limpar</button>
              </li>
              <li>
                <button className="btn-xs bg-indigo-500 hover:bg-indigo-600 text-white" onClick={() => setDropdownOpen(false)} onBlur={() => setDropdownOpen(false)}>Aplicar</button>
              </li>
            </ul>
          </div>
        </div>
      </Transition>
    </div>
  );
}

export default FilterButton;
