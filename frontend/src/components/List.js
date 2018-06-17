import React from 'react'

export const List = ({
  i,
  title,
  items,
  handleAddClick,
  handleInputChange,
  value,
  type,
  placeholder
}) => {
  const listItems = items.map((item) => (
    <li className="list-group-item" key={`${item}-${Math.random()}`}>
      {item}
    </li>
  ))
  return (
    <div>
      <ul className="list-group">
        <h4 className="text-center">
          {title}
        </h4>
        {listItems}
        <div className="input-group mb-3">
          <input
            value={value}
            type={type}
            className="form-control"
            placeholder={placeholder}
            onChange={(e) => handleInputChange(e, i)()}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleAddClick(i)()
              }
            }}
          />
          <div className="input-group-append">
            <button
              className="btn btn-dark"
              type="button"
              onClick={handleAddClick(i)}
            >
              +
            </button>
          </div>
        </div>
      </ul>
    </div>
  )
}
