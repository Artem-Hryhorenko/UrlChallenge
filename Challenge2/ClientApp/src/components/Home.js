import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { actionCreators } from '../store/Entities';

class Home extends Component {

  state = {
      id: 0,
      link: "",
      url: ""
  };

  componentDidMount() {
    this.props.requestEntities();
  }

  componentDidUpdate(oldProps) {
    const newProps = this.props;
    if (!newProps.saving && newProps.saving !== oldProps.saving) {
      this.setState({
        id: 0,
        link: "",
        url: ""
      });
    }
  }

  handleChange = (e) => {
    const target = e.target;

    this.setState({
      [target.name]: target.value
    });
  }

  handleReset = () => {
    this.setState({
      id: 0,
      link: "",
      url: ""
    });
    this.props.entryViewMode();
  }

  editEntry(entry) {
    this.props.entryEditMode();
    this.setState({ ...entry });
  }

  handleSubmit = (e) => {
    console.log(this.state);

    this.props.sendEntries(this.state);
    e.preventDefault();
  }

  render() {
    return (
      <div>
        <h1>Challenge2 - Shortcuts</h1>

        {this.renderForm(this.state, this.props)}

        {!this.props.editMode ? this.renderTable(this.props) : []}

      </div>
    );
  }

  renderTable(props) {
    return (
      <div>
        <h3>List of shortcuts</h3>
        <table className='table table-striped'>
          <thead>
            <tr>
              <th>Shortcut</th>
              <th>Url</th>
              <th>Action</th>
            </tr>
          </thead>
          {props.isLoading
            ? <span>Loading...</span>
            : <tbody>
              {props.entries.map(entry =>
                <tr key={entry.id}>
                  <td>{entry.link}</td>
                  <td>{entry.url}</td>
                  <td>
                    <button className="btn btn-info" onClick={() => this.editEntry(entry)}>Edit</button>
                    <button className="btn btn-danger" onClick={() => this.props.deleteEntries(entry.id)}>Delete</button>
                  </td>
                </tr>
              )}
            </tbody>
          }

        </table>
      </div>
    );
  }

  renderForm(entry, props) {
    const { id, link, url } = entry;
    return (
      <form onSubmit={this.handleSubmit}
        noValidate>
        <div className="form-row">
          <div className="col">
            <input name="link"
              type="text"
              value={link}
              className={`form-control ${!props.validation.link ? "" : "is-invalid"}`}
              placeholder="Shortcut"
              onChange={this.handleChange}
              required />
            {props.validation.link
              ? <div className="invalid-feedback">
                {props.validation.link}
              </div>
              : []
            }
          </div>
          <div className="col">
            <input name="url"
              type="url"
              value={url}
              className={`form-control ${!props.validation.url ? "" : "is-invalid"}`}
              placeholder="Url"
              onChange={this.handleChange}
              required />
            {props.validation.url
              ? <div className="invalid-feedback">
                {props.validation.url}
              </div>
              : []
            }
          </div>
          <div className="col-xs-1">
            <button type="submit" className="btn btn-primary">{id ? "Edit" : "Add"}</button>
            {
              id
                ? <button type="reset" className="btn btn-warning" onClick={this.handleReset}>Reset</button>
                : []
            }
          </div>
        </div>

      </form>
    );
  }
}

export default connect(
  state => state.entries,
  dispatch => bindActionCreators(actionCreators, dispatch)
)(Home);
