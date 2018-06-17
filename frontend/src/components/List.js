import React from 'react'

export const List = ({
  i,
  title,
  items,
  handleAddClick,
  handleInputChange,
  handleListItemChange,
  handleListItemDelete,
  value,
  type,
  placeholder
}) => {
  const listItems = items.map((item, j) => (
    <li className="list-group-item" key={`${j}`}>
      <div className="row">
        <div
          className="col-2"
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            alignItems: 'center'
          }}
        >
          <span
            className="text-muted font-weight-bold"
          >{j + 1}.</span>
        </div>
        <div className="col-10">
          <div className="input-group">
            <input
              value={item}
              className="form-control"
              onChange={(e) => handleListItemChange(e, i, j)()}
            />
            <div className="input-group-append">
              <button
                className="btn btn-secondary btn-sm"
                type="button"
                onClick={(e) => handleListItemDelete(e, i, j)()}
              >
                <i className="fa fa-times"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </li>
  ))
  return (
    <div>
      <ul className="list-group">
        <h4 className="mt-3">
          {title}
        </h4>
        {listItems}
        <div className="input-group">
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
              <i className="fa fa-plus"></i>
            </button>
          </div>
        </div>
      </ul>
    </div>
  )
}
