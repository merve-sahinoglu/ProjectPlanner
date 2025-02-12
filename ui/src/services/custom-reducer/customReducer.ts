import ReducerActions from "../../enum/reducer-action.enum";

interface MinEntity {
  id: string;
}
type Action<T> =
  | { type: ReducerActions.Add; payload: T }
  | { type: ReducerActions.Delete; payload: string }
  | { type: ReducerActions.Update; payload: T }
  | { type: ReducerActions.Replace; payload: T[] }
  | { type: ReducerActions.UpdateWithDifferentId; payload: T; id: string };

const customReducer = <T extends MinEntity>(state: T[], action: Action<T>) => {
  switch (action.type) {
    case ReducerActions.Add: {
      return [action.payload, ...state];
    }
    case ReducerActions.Delete: {
      return state.filter((entity: T) => entity.id !== action.payload);
    }

    case ReducerActions.Replace: {
      return action.payload as T[];
    }

    case ReducerActions.Update: {
      return state.map((entity: T) => {
        if (entity.id === action.payload.id) {
          return action.payload;
        }
        return entity;
      });
    }

    case ReducerActions.UpdateWithDifferentId: {
      return state.map((entity: T) => {
        if (entity.id === action.id) {
          return action.payload;
        }
        return entity;
      });
    }

    default: {
      return state;
    }
  }
};

export default customReducer;
