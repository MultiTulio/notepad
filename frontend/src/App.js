import React from "react";
import "./App.css";
import Category from "./Category.js";
import Note from "./Note.js";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      categories: null
    };
    this.addNewNote = this.addNewNote.bind(this);
    this.addNewCat = this.addNewCat.bind(this);
    this.categoryOnClick = this.categoryOnClick.bind(this);
  }

  componentDidMount() {
    fetch("http://localhost:3001/listCategoriesWithNotes", {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(res => res.json())
      .then(res => {
        const categoriesWithNotes = [];
        res.categories.forEach((category, index) => {
          categoriesWithNotes.push({ ...category, isActive: index === 0 });
        });
        console.log("categories with notes to state", categoriesWithNotes)
        this.setState({
          categories: categoriesWithNotes
        });
      });
  }

  async addNewNote(e) {
    // console.log(this.state.selectedCategory.props.id);
    const categoryId = this.state.categories.find(category => category.isActive).id
    await fetch("http://localhost:3001/addNote", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        text: this.noteData.value,
        categoryId,
      })
    });
    fetch(
      "http://localhost:3001/listCategory/" + categoryId,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      }
    )
      .then(res => res.json())
      .then(res => {
        console.log(res);
        const newState = this.state.categories.map(category => 
          {
            if ( category.id === categoryId ){
              return {...category, notes: res.notes};
            } else {
              return category;
            }
          }
        );

        this.setState({
          categories: newState,
        });
      });
  }

  addNewCat(e) {
    console.log(this.catData.value);
    fetch("http://localhost:3001/addCat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ catData: this.catData.value })
    })
      .then(res => res.json())
      .then(newCategory => {
        const newState = [
          ...this.state.categories.map(c => {
            return { ...c, isActive: false };
          }),
          { ...newCategory, isActive: true, notes: [] }
        ];
        console.log(newState);
        this.setState({
          categories: newState
        });
      });
  }

  categoryOnClick(id) {
    const newState =
      this.state.categories.map(c => {
        return { ...c, isActive: c.id === id };
      });
    console.log(newState);
    this.setState({
      categories: newState
    });
    console.log("CategoryOnClickEvent: ", id);
  }

  render() {
    console.log("RENDER", this.state);
    return this.state.categories && (
      <div className="App">
        <div className="wrap">
          <div className="Categories items">
            {this.state.categories.map((category) => {
              return (
                <Category
                  isActive={category.isActive}
                  id={category.id}
                  name={category.name}
                  onClick={this.categoryOnClick}
                  key={`category-${category.id}`}
                />
              );
            })}
            <div className="inputs">
              <input
                className="catData"
                ref={c => (this.catData = c)}
                type="text"
                placeholder="New category"
              />
              <button onClick={this.addNewCat} name="addCat">
                Add
              </button>
            </div>
          </div>
          <div className="NewNotes items">
            {
              this.state.categories.length > 0 && this.state.categories.find(c => c.isActive).notes.map((note) => {
                return (
                  <Note 
                    key = {`note-${note.id}`}
                    time = {note.time}
                    text ={note.text}
                  />
                );
              })
            }

            {this.state.categories.find(c => c.isActive) 
              && (<div className="inputs noteInputs">
              <input
                className="noteData"
                ref={c => (this.noteData = c)}
                placeholder="New note"
              />
              <button onClick={this.addNewNote} name="addNot">
                Add
              </button>
            </div>)}
          </div>
        </div>
      </div>
    );
  }
}

export default App;
