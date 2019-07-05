import * as Types from "../constants"

const validationDefault = { link: null, url: null };
const initialState = {
  entries: [],
  saving: false,
  isLoading: false,
  validation: validationDefault,
  validationResult: true,
  editMode: false
};

export const actionCreators = {
  requestEntities: () => async (dispatch, getState) => {
    dispatch({ type: Types.requestEntries });

    const url = "api/entries";
    const response = await fetch(url);
    const entries = await response.json();

    dispatch({ type: Types.receiveEntries, entries });
  },

  sendEntries: entry => async dispatch => {
    dispatch({ type: Types.entryPrepare });

    const url = `api/entries/${entry.id || ""}`;
    const method = entry.id ? "PUT" : "POST";
    const response = await fetch(url, {
      method: method,
      body: JSON.stringify(entry),
      headers: new Headers({
        "Content-Type": "application/json"
      })
    });

    if (!response.ok) {
      const data = await response.json();
      dispatch({ type: Types.entryError, data });
    } else if (response.status === 201) {
      const data = await response.json();
      dispatch({ type: Types.entryCreate, data });
    } else {
      dispatch({ type: Types.entryUpdate, entry });
    }
  },

  deleteEntries: id => async dispatch => {
    const url = `api/entries/${id}`;
    const response = await fetch(url, {
      method: "DELETE"
    });

    const data = await response.json();
    dispatch({ type: Types.entryDelete, data });
  },

  entryEditMode: () => dispatch => {
    dispatch({ type: Types.entryStartEdit });
  },

  entryViewMode: () => dispatch => {
    dispatch({ type: Types.entryFinishEdit });
  }
};

export const reducer = (state, action) => {
  state = state || initialState;

  if (action.type === Types.requestEntries) {
    return {
      ...state,
      isLoading: true
    };
  }

  if (action.type === Types.receiveEntries) {
    return {
      ...state,
      entries: action.entries,
      isLoading: false
    };
  }

  if (action.type === Types.entryPrepare) {
    return {
      ...state,
      saving: true
    }
  }

  if (action.type === Types.entryCreate) {
    return {
      ...state,
      entries: [...state.entries, action.data],
      validation: validationDefault,
      validationResult: true,
      isLoading: false,
      editMode: false,
      saving: false
    };
  }

  if (action.type === Types.entryUpdate) {
    return {
      ...state,
      entries: state.entries.map(entry => {
        if (entry.id === action.entry.id) {
          return Object.assign({}, entry, action.entry);
        }
        return entry;
      }),
      validation: validationDefault,
      validationResult: true,
      editMode: false,
      saving: false,
    }
  }

  if (action.type === Types.entryError) {
    return {
      ...state,
      validation: {
        link: action.data.errors.Link && action.data.errors.Link.shift() || null,
        url: action.data.errors.Url && action.data.errors.Url.shift() || null,
      },
      validationResult: false
    }
  }

  if (action.type === Types.entryDelete) {
    return {
      ...state,
      entries: state.entries.filter(entry => entry.id !== action.data.id)
    }
  }

  if (action.type === Types.entryStartEdit) {
    return {
      ...state,
      editMode: true
    }
  }

  if (action.type === Types.entryFinishEdit) {
    return {
      ...state,
      editMode: false
    }
  }

  return state;
};
