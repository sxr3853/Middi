import React, { Component } from 'react'
import axios from 'axios'
import { Column } from './components/Column'
import { MainMap } from './components/MainMap'

export default class App extends Component {
  state = {
    lists: [{
      title: 'Locations',
      items: [],
      value: '',
      placeholder: 'Location',
      type: 'text',
      width: '8'
    }, {
      title: 'Keywords',
      items: [],
      value: '',
      placeholder: 'Keyword',
      type: 'text',
      width: '4'
    }],
    isMarkerShown: true,
    coordinates: { lat: -34.397, lng: 150.644 },
    isMapLoading: false
  }

  handleInputChange = (e, i) => {
    return () => {
      const { value } = e.target
      const nextState = this.state
      nextState.lists[i].value = value
      this.setState(nextState)
    }
  }

  handleListItemChange = (e, i, j) => {
    return () => {
      const { value } = e.target
      const nextState = this.state
      nextState.lists[i].items[j] = value
      this.setState(nextState)
    }
  }

  handleListItemDelete = (e, i, j) => {
    return () => {
      const nextState = this.state
      const { items } = nextState.lists[i]
      if (j === 0) {
        nextState.lists[i].items = items.slice(1)
      } else if (j === items.length) {
        nextState.lists[i].items = items.slice(0, items.length)
      } else {
        nextState.lists[i].items = items
          .slice(0, j)
          .concat(items.slice(j + 1))
      }
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
    const locations = this.state.lists[0].items
    const keywords = this.state.lists[1].items
    await this.setState({
      isMapLoading: true
    })
    const res = await axios.post('/search', {
      locations,
      keywords
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
    const { location } = res.data
    console.log(res.data)
    this.setState({
      isMapLoading: false,
      coordinates: {
        lat: location[0],
        lng: location[1]
      }
    })
  }

  render () {
    const {
      lists,
      isMarkerShown,
      isMapLoading,
      coordinates
    } = this.state
    const columns = lists.map((list, i) => (
      <Column
        i={i}
        list={list}
        key={list.title}
        handleAddClick={this.handleAddClick}
        handleInputChange={this.handleInputChange}
        handleListItemChange={this.handleListItemChange}
        handleListItemDelete={this.handleListItemDelete}
      />
    ))
    return (
      <div className="container mt-4">
        <MainMap
          isMarkerShown={isMarkerShown}
          isMapLoading={isMapLoading}
          coordinates={coordinates}
          googleMapURL="https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=AIzaSyDnwtsI3aMyi8afWFzREXbvcDHW4yfCQ4M"
          loadingElement={<div style={{ height: `100%` }} />}
          containerElement={<div style={{ height: `400px` }} />}
          mapElement={<div style={{ height: `100%` }} />}
        />
        <div className="row">
          {columns}
          <div className={`
            col-lg-1
            col-md-3
            col-sm-12
            col-xs-12
            text-center
            mt-3
          `}>
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
