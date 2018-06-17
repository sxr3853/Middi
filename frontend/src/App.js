import React, { Component } from 'react'
import axios from 'axios'
import { Column } from './components/Column'

export default class App extends Component {
  state = {
    lists: [{
      title: 'People',
      items: [],
      value: '',
      placeholder: 'Phone',
      type: 'number',
      width: '3'
    }, {
      title: 'Locations',
      items: [],
      value: '',
      placeholder: 'Location',
      type: 'text',
      width: '4'
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

  handleGoClick = async () => {
    const {
      locations,
      keywords
    } = this.state
    const res = await axios.post('/search', {
      locations,
      keywords
    })
    console.log(res.data)
  }

  render () {
    const { lists } = this.state
    const columns = lists.map((list, i) => (
      <Column
        i={i}
        list={list}
        key={list.title}
        handleAddClick={this.handleAddClick}
        handleInputChange={this.handleInputChange}
      />
    ))
    return (
      <div className="container mt-4">
        <div className="row">
          {columns}
          <div className={`
            col-lg-1
            col-md-3
            col-sm-12
            col-xs-12
            text-center
          `}>
            <h4 className={`
              mt-xs-0
              mt-sm-0
              mt-md-0
              mt-lg-3
            `}>&nbsp;</h4>
            <button
              className="btn btn-primary btn-block"
              type="button"
              onClick={this.handleGoClick}
            >
              Go
            </button>
          </div>
        </div>
      </div>
    )
  }
}
