import React, { Component } from 'react'
import { List } from './components/List'

export default class App extends Component {
  state = {
    lists: [{
      title: 'People',
      items: [],
      value: '',
      placeholder: 'Phone',
      type: 'number',
      width: '2'
    }, {
      title: 'Addresses',
      items: [],
      value: '',
      placeholder: 'Address',
      type: 'text',
      width: '5'
    }, {
      title: 'Keywords',
      items: [],
      value: '',
      placeholder: 'Keyword',
      type: 'text',
      width: '2'
    }]
  }

  handleInputChange = (e, i) => {
    return () => {
      const { value } = e.target
      const nextState = this.state
      nextState.lists[i].value = value
      this.setState(nextState)
    }
  }

  handleAddClick = (i) => {
    return () => {
      const { value } = this.state.lists[i]
      const nextState = this.state
      nextState.lists[i].items.push(value)
      nextState.lists[i].value = ''
      this.setState(nextState)
    }
  }

  render () {
    const { lists } = this.state
    const columns = lists.map((list, i) => (
      <div className={`col-${list.width}`} key={list.title}>
        <List
          i={i}
          title={list.title}
          items={list.items}
          handleInputChange={this.handleInputChange}
          handleAddClick={this.handleAddClick}
          value={list.value}
          type={list.type}
          placeholder={list.placeholder}
        />
      </div>
    ))
    return (
      <div className="container mt-4">
        {
        // <div class="alert alert-warning alert-dismissible fade show" role="alert">
        //   <strong>Holy guacamole!</strong> You should check in on some of those fields below.
        //   <button type="button" class="close" data-dismiss="alert" aria-label="Close">
        //     <span aria-hidden="true">&times;</span>
        //   </button>
        // </div>
        }
        <div className="row">
          {columns}
          <div className="col-1 text-center">
            <h4>&nbsp;</h4>
            <button
              className="btn btn-primary"
              type="button"
            >
              Go
            </button>
          </div>
        </div>
      </div>
    )
  }
}
