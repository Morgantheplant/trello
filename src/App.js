import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

// todo: abstract to render prop pattern 
class EditableInput extends Component {
  constructor(props) {
    super(props)
    this.state = {
      editMode: false,
      value: props.value || '',
      emptyText: props.emptyText,
      id: props.id
    }
    this.handleClick = this.handleClick.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }
  handleClick() {
    this.setState(prevState => {
      const newState = {
        editMode: !prevState.editMode
      }
      if (prevState.editMode && this.props.handleSave) {
        this.props.handleSave(this.state)
        if (!this.props.persistState) {
          newState.value = ''
        }
      }
      return newState
    })
  }
  handleChange({ target }) {
    this.setState(() => ({
      value: target.value
    }))
  }
  render() {
    return (
      <div className={`wrap-list ${this.props.className}`}>
        {this.state.editMode ? (
          <div className={`input input-item ${this.props.className}`}>
            <input
              type="text"
              value={this.state.value}
              onChange={this.handleChange}
            />
            <button onClick={this.handleClick}>Save</button>
            {this.props.onRemove && <span class="pull-right" onClick={this.props.onRemove}>X</span>}
          </div>
        ) : (
          <div
            onClick={this.handleClick}
            className={`${this.state.value ? 'input-item ' : 'placeholder '}${
              this.props.className
            }`}>
            {this.state.value || this.state.emptyText}
              {this.props.onRemove && <span class="remove pull-right" onClick={this.props.onRemove}>X</span>}
            <div />
          </div>
        )}
        {this.props.children}
      </div>
    )
  }
}



class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      lists: []
    }
    this.addList = this.addList.bind(this);
    this.addCard = this.addCard.bind(this);
    this.removeCard = this.removeCard.bind(this);
    this.removeList = this.removeList.bind(this);
  }
  addList({ value }) {
    const newCard = { value, key: Date.now(), cards: [] }
    this.setState(prevState => ({
      lists: prevState.lists.concat(newCard)
    }))
  }
  addCard(list) {
    this.setState(prevState => {
      const newCard = {
        id: Date.now(),
        value: list.value
      }
      
      const newCards = prevState.lists.map(listItem => {
        if (listItem.key === list.id) {
          return {
            ...listItem,
            cards: [...listItem.cards, newCard]
          }
        } else {
          return listItem
        }
      })
      
      return {
        lists: newCards
      }
    })
  }
  removeCard(list, card){
    //todo: logic here ver similar can be DRYer
    return ()=>{
      this.setState(prevState=>{
        const newlists = prevState.lists.map(listItem=>{
          if(listItem.id === list.id){
            return {
              ...listItem,
              cards: listItem.cards.filter(cardItem=>cardItem.id !== card.id)
            }
          }
          return listItem;
        });

        return {
          lists: newlists
        }
      })
    }
  
  }
  removeList(list){
    return ()=>{
      this.setState(prevState=>({
        lists: prevState.lists.filter(({id})=>list.id !== list.id)
      }))
    }
  }
  render() {
    return (
      <div>
        <h1 class="title-main">Demo Board</h1>
        {this.state.lists &&
          this.state.lists.map(list => {
            return <EditableInput
              value={list.value}
              key={list.key}
              persistState={true}
              emptyText="Click to add a title..."
              className="card-list"
              onRemove={this.removeList(list)}
              >
              {list.cards &&
                list.cards.map(child => {
                  return (
                    <EditableInput
                      key={child.id}
                      value={child.value}
                      className="card"
                      emptyText="Add card title"
                      onRemove={this.removeCard(list, child)}
                    />
                  )
                })}
              <EditableInput
                id={list.key}
                handleSave={this.addCard}
                emptyText="+ Add AnotherCard"
                className="add-card"
              />
            </EditableInput>
          })}
        <EditableInput
          handleSave={this.addList}
          emptyText="+ Add Another List"
          className="add-list"
        />
      </div>
    )
  }
}

export default App;
