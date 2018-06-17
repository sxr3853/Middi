import React from 'react'
import { List } from './List'

export const Column = ({
  i,
  list,
  handleAddClick,
  handleInputChange
}) => (
  <div className={`
    col-lg-${list.width}
    col-md-12
    col-sm-12
    col-xs-12
  `} key={list.title}>
    <List
      i={i}
      title={list.title}
      items={list.items}
      handleInputChange={handleInputChange}
      handleAddClick={handleAddClick}
      value={list.value}
      type={list.type}
      placeholder={list.placeholder}
    />
  </div>
)
