import React, { Component } from 'react'
import { List } from './components/List'

export default class App extends Component {
  state = {
    lists: [{
      title: 'People',
      items: []
    }, {
      title: 'Starting Points',
      items: []
    }, {
      title: 'Keywords',
      items: []
    }]
  }
  render () {
    const { lists } = this.state
    const columns = lists.map((list) => (
      <div className="col" key={list.title}>
        <h4 className="text-center">
          {list.title}
        </h4>
        <List
          items={list.items}
        />
      </div>
    ))
    return (
      <div className="container">
        <div className="row">
          {columns}
        </div>
      </div>
    )
  }
}
