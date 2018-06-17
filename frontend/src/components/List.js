import React from 'react'

export const List = ({ items }) => {
  const listItems = items.map((item) => (
    <li className="list-group-item" key={item}>
      {item}
    </li>
  ))
  return (
    <div>
      <ul className="list-group">
        {listItems}
        <div className="input-group mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Name"
            aria-label="Recipient's username"
            aria-describedby="basic-addon2"
          />
          <div className="input-group-append">
            <button
              className="btn btn-outline-secondary"
              type="button"
            >
              Add
            </button>
          </div>
        </div>
      </ul>
    </div>
  )
}
